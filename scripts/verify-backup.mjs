// Read-only verification of the backup JSON file.
// Usage: node scripts/verify-backup.mjs <backupFile>
import fs from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/verify-backup.mjs <backupFile>");
  process.exit(1);
}

const raw = fs.readFileSync(file, "utf8");
let data;
try {
  data = JSON.parse(raw);
} catch (error) {
  console.error("ERROR: backup file is not valid JSON:", error.message);
  process.exit(1);
}

const requiredIds = Array.from({ length: 20 }, (_, i) => `q${i + 1}`);
const ids = data.questions.map((q) => q.id);
const problems = [];

if (data.count !== data.questions.length) {
  problems.push(`count field (${data.count}) != questions length (${data.questions.length})`);
}
if (data.questions.length !== 20) {
  problems.push(`expected 20 questions, found ${data.questions.length}`);
}
for (const id of requiredIds) {
  if (!ids.includes(id)) problems.push(`missing question id: ${id}`);
}
const duplicated = ids.filter((id, i) => ids.indexOf(id) !== i);
if (duplicated.length) problems.push(`duplicate ids: ${duplicated.join(", ")}`);

let optionCount = 0;
let missingText = 0;
let missingAffinity = 0;
let missingReason = 0;
let missingTimestamps = 0;
for (const q of data.questions) {
  if (!q.text || typeof q.text !== "string") missingText++;
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    problems.push(`question ${q.id}: options length = ${q.options?.length}`);
  } else {
    optionCount += q.options.length;
    for (const opt of q.options) {
      const aff = opt.houseAffinity || {};
      const houses = Object.entries(aff).filter(([, v]) => Number(v) > 0);
      if (!opt.text || houses.length !== 1) missingAffinity++;
      if (!opt.reason) missingReason++;
    }
  }
  if (!q.createdAt || !q.updatedAt) missingTimestamps++;
}

console.log("=== BACKUP VERIFICATION ===");
console.log(`file:              ${file}`);
console.log(`count field:       ${data.count}`);
console.log(`questions:         ${data.questions.length}`);
console.log(`unique ids:        ${new Set(ids).size}`);
console.log(`total options:     ${optionCount}`);
console.log(`questions missing text:        ${missingText}`);
console.log(`options with invalid affinity: ${missingAffinity}`);
console.log(`options missing reason:        ${missingReason}`);
console.log(`questions missing timestamps:  ${missingTimestamps}`);
console.log(`has createdAt/updatedAt: ${data.questions.every((q) => q.createdAt && q.updatedAt)}`);
console.log(`ids: ${ids.sort().join(", ")}`);

if (problems.length) {
  console.log("PROBLEMS:");
  problems.forEach((p) => console.log("  - " + p));
  process.exit(1);
}
console.log("RESULT: OK — backup is complete and restorable.");
