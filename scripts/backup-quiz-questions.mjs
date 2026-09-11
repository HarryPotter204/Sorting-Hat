// Backup script for the Firestore "quizQuestions" collection.
//
// Usage:
//   node --env-file=.env.local scripts/backup-quiz-questions.mjs
//
// Writes every document (all fields preserved, Firestore Timestamps
// converted to ISO strings) to:
//   backup/quiz-questions/quiz-questions-YYYY-MM-DD-HH-mm-ss.json
//
// This script NEVER writes to Firestore. Read-only.

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "node:fs";
import path from "node:path";

const COLLECTION_NAME = "quizQuestions";
const BACKUP_DIR = path.resolve("backup", "quiz-questions");

function pad(value) {
  return String(value).padStart(2, "0");
}

function timestampSuffix() {
  const now = new Date();
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
  ].join("-") + "-" + [
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("-");
}

/** Convert Firestore values (Timestamp / null sentinels) to JSON-safe values. */
function toPlainValue(value) {
  if (value === null || value === undefined) return value;
  if (typeof value === "object" && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  return value;
}

function serializeDocument(id, data) {
  const plain = {};
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      plain[key] = value.map((item) =>
        item && typeof item === "object" && !Array.isArray(item)
          ? Object.fromEntries(
              Object.entries(item).map(([k, v]) => [k, toPlainValue(v)]),
            )
          : toPlainValue(item),
      );
    } else {
      plain[key] = toPlainValue(value);
    }
  }
  return { id, ...plain };
}

function main() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.error(
      "ERROR: Firebase Admin environment variables are not configured (.env.local).",
    );
    process.exit(1);
  }

  const app =
    getApps()[0] ??
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  const db = getFirestore(app);

  db.collection(COLLECTION_NAME)
    .get()
    .then((snapshot) => {
      const questions = snapshot.docs.map((doc) =>
        serializeDocument(doc.id, doc.data()),
      );

      fs.mkdirSync(BACKUP_DIR, { recursive: true });
      const file = path.join(
        BACKUP_DIR,
        `quiz-questions-${timestampSuffix()}.json`,
      );

      const payload = {
        description:
          "Backup of the Firestore quizQuestions collection taken before replacing the quiz with a new question set.",
        collection: COLLECTION_NAME,
        projectId,
        backupDate: new Date().toISOString(),
        count: questions.length,
        questions,
      };

      fs.writeFileSync(file, JSON.stringify(payload, null, 2), "utf8");

      console.log(`Backup written: ${file}`);
      console.log(`Backed up questions: ${questions.length}`);
      console.log(`Question ids: ${questions.map((q) => q.id).join(", ")}`);

      if (questions.length === 0) {
        console.warn(
          "WARNING: The collection is empty. Nothing to replace — aborting before any change.",
        );
        process.exit(2);
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error("ERROR: Backup failed:", error);
      process.exit(1);
    });
}

main();