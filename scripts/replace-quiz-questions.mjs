// Replace the Firestore "quizQuestions" collection with the new 20-question set.
//
// Usage:
//   node --env-file=.env.local scripts/replace-quiz-questions.mjs
//
// SAFETY:
// - Refuses to run unless a backup file exists in backup/quiz-questions/.
// - Validates the new question set before touching Firestore.
// - Deletes the legacy documents only after validation succeeds, then writes
//   the new questions and re-reads the collection to verify.
// - The backup JSON allows a full restore of the previous questions.

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import fs from "node:fs";
import path from "node:path";

const COLLECTION_NAME = "quizQuestions";
const NEW_QUESTIONS_FILE = path.resolve("scripts", "new-quiz-questions.json");
const BACKUP_DIR = path.resolve("backup", "quiz-questions");
const HOUSES = ["Gryffindor", "Ravenclaw", "Hufflepuff", "Slytherin"];
const ID_PATTERN = /^q[A-Za-z0-9_-]+$/;

function fail(message) {
  console.error(`ABORT: ${message}`);
  process.exit(1);
}

function ensureBackupExists() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fail(`backup directory not found: ${BACKUP_DIR}`);
  }
  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((name) => name.endsWith(".json"))
    .sort();
  if (files.length === 0) {
    fail("no backup JSON found in backup/quiz-questions/. Run backup first.");
  }
  const latest = files.at(-1);
  const parsed = JSON.parse(
    fs.readFileSync(path.join(BACKUP_DIR, latest), "utf8"),
  );
  if (!parsed.count || !Array.isArray(parsed.questions)) {
    fail(`backup file ${latest} does not look like a valid backup`);
  }
  console.log(
    `Backup check OK: ${latest} (${parsed.count} questions) — restore is possible.`,
  );
  return latest;
}

function validateNewQuestions(raw) {
  const questions = raw.questions;
  if (!Array.isArray(questions) || questions.length !== 20) {
    fail(`expected exactly 20 questions, found ${questions?.length}`);
  }

  const problems = [];
  const seenIds = new Set();
  const seenOrders = new Set();
  const seenTexts = new Set();

  questions.forEach((question, index) => {
    const qid = question.id;
    if (!ID_PATTERN.test(qid)) problems.push(`${qid}: invalid id format`);
    if (seenIds.has(qid)) problems.push(`duplicate question id: ${qid}`);
    seenIds.add(qid);
    if (question.order !== index + 1) {
      problems.push(`${qid}: expected order ${index + 1}, got ${question.order}`);
    }
    if (seenOrders.has(question.order)) {
      problems.push(`duplicate order: ${question.order}`);
    }
    seenOrders.add(question.order);
    if (question.isActive !== true) {
      problems.push(`${qid}: isActive must be true`);
    }
    if (!question.text || typeof question.text !== "string") {
      problems.push(`${qid}: missing text`);
    } else if (seenTexts.has(question.text)) {
      problems.push(`duplicate question text: ${question.text}`);
    } else {
      seenTexts.add(question.text);
    }
    if (!Array.isArray(question.options) || question.options.length !== 4) {
      problems.push(`${qid}: options must be an array of 4`);
      return;
    }
    const seenOptionIds = new Set();
    const letters = new Set();
    question.options.forEach((option, optIndex) => {
      if (!option.id || !ID_PATTERN.test(option.id)) {
        problems.push(`${qid}: invalid option id ${option.id}`);
      }
      if (seenOptionIds.has(option.id)) {
        problems.push(`${qid}: duplicate option id ${option.id}`);
      }
      seenOptionIds.add(option.id);
      if (!option.text || typeof option.text !== "string") {
        problems.push(`${qid}: option ${optIndex + 1} has no text`);
      }
      if (!option.reason || typeof option.reason !== "string") {
        problems.push(`${qid}: option ${optIndex + 1} has no reason`);
      }
      const entries = Object.entries(option.houseAffinity || {}).filter(
        ([, value]) => Number(value) > 0,
      );
      if (entries.length !== 1) {
        problems.push(
          `${qid}: option ${optIndex + 1} must have exactly one positive house score`,
        );
        return;
      }
      const [house, value] = entries[0];
      if (!HOUSES.includes(house)) {
        problems.push(`${qid}: unknown house ${house}`);
      }
      if (letters.has(house)) {
        problems.push(`${qid}: house ${house} appears more than once`);
      }
      letters.add(house);
      if (value !== 2) {
        problems.push(`${qid}: house score must be 2, got ${value}`);
      }
    });
    if (letters.size !== 4) {
      problems.push(`${qid}: the 4 options must cover all 4 houses`);
    }
  });

  if (problems.length) {
    console.error("Validation problems:");
    problems.forEach((problem) => console.error(`  - ${problem}`));
    fail("new question set validation failed");
  }
  console.log(
    "New question set validation OK: 20 questions, order 1-20, 4 options each, one house per option, no duplicates.",
  );
}

async function main() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    fail("Firebase Admin environment variables are not configured (.env.local)");
  }

  const backupFile = ensureBackupExists();

  const raw = JSON.parse(fs.readFileSync(NEW_QUESTIONS_FILE, "utf8"));
  validateNewQuestions(raw);
  const questions = raw.questions;

  const app =
    getApps()[0] ??
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  const db = getFirestore(app);
  const collection = db.collection(COLLECTION_NAME);

  // 1. Snapshot the current state (pre-change sanity check).
  const before = await collection.get();
  const beforeIds = before.docs.map((doc) => doc.id);
  console.log(
    `Current Firestore state: ${beforeIds.length} questions [${beforeIds.join(", ")}]`,
  );

  // 2. Delete every legacy document (backup already secured).
  let batch = db.batch();
  let ops = 0;
  for (const doc of before.docs) {
    batch.delete(doc.ref);
    ops += 1;
    if (ops === 450) {
      await batch.commit();
      batch = db.batch();
      ops = 0;
    }
  }
  if (ops > 0) await batch.commit();
  console.log(`Deleted ${beforeIds.length} legacy documents.`);

  // 3. Write the new questions with server timestamps.
  batch = db.batch();
  ops = 0;
  for (const question of questions) {
    batch.set(collection.doc(question.id), {
      text: question.text,
      options: question.options,
      order: question.order,
      isActive: question.isActive,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    ops += 1;
    if (ops === 450) {
      await batch.commit();
      batch = db.batch();
      ops = 0;
    }
  }
  if (ops > 0) await batch.commit();
  console.log(`Wrote ${questions.length} new documents.`);

  // 4. Read back and verify.
  const after = await collection.get();
  const afterDocs = after.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
  const problems = [];
  if (afterDocs.length !== 20) {
    problems.push(`expected 20 documents after replace, found ${afterDocs.length}`);
  }
  const afterIds = new Set(afterDocs.map((d) => d.id));
  for (const question of questions) {
    if (!afterIds.has(question.id)) problems.push(`missing doc: ${question.id}`);
  }
  for (const doc of afterDocs) {
    if (typeof doc.data.order !== "number") problems.push(`${doc.id}: order missing`);
    if (doc.data.isActive !== true) problems.push(`${doc.id}: isActive not true`);
    if (!Array.isArray(doc.data.options) || doc.data.options.length !== 4) {
      problems.push(`${doc.id}: options length ${doc.data.options?.length}`);
    }
  }
  const orders = afterDocs
    .map((d) => d.data.order)
    .filter((value) => typeof value === "number")
    .sort((a, b) => a - b);
  if (orders.join(",") !== Array.from({ length: 20 }, (_, i) => i + 1).join(",")) {
    problems.push(`orders are not 1..20: ${orders.join(",")}`);
  }

  if (problems.length) {
    console.error("Verification problems after replace:");
    problems.forEach((problem) => console.error(`  - ${problem}`));
    process.exit(1);
  }

  console.log("=== REPLACE COMPLETE ===");
  console.log(`New questions: ${afterDocs.length}`);
  console.log(`Ids: ${questions.map((q) => q.id).join(", ")}`);
  console.log("Orders: 1..20 verified");
  console.log("All questions isActive: true");
  console.log(`Backup file for restore: backup/quiz-questions/${backupFile}`);
  process.exit(0);
}

main().catch((error) => {
  console.error("ERROR: replace failed:", error);
  process.exit(1);
});