import "server-only";

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminDb, hasFirebaseAdminConfig } from "@/lib/firebase-admin";
import type { AnnouncementAutomationSettings } from "@/lib/types";

// ---------------------------------------------------------------------------
// Bulletin board auto-posting ("掲示板自動投稿")
//
// Design notes:
// - Reuses the EXISTING shared "announcements" collection. No new board.
// - The enabled/disabled switch lives in Firestore
//   (settings/announcementAutomation) so it survives browsers and devices.
// - Scheduling is "due-time" based: a tick (from the in-process scheduler or
//   an external cron such as Cloud Scheduler) runs at most once a minute and
//   posts only when now >= nextRunAt. nextRunAt is then advanced by a random
//   5-10 minutes, giving a human-like, non-fixed cadence.
// - Duplicate prevention (two layers):
//   1. A Firestore transaction on the settings doc claims the run by
//     conditionally advancing nextRunAt (optimistic lock).
//   2. The announcement document id is deterministically derived from the
//     current minute (anno_auto_<minuteBucket>) and created with create(),
//     which fails if the doc already exists. Even if two server instances
//     tick at the same moment, only one post can ever be created.
// - This is completely separate from the sorting notices
//   (anno_sorting_* / isSortingNotice), which are never touched here.
// ---------------------------------------------------------------------------

const SETTINGS_COLLECTION = "settings";
const SETTINGS_DOC = "announcementAutomation";
const ANNOUNCEMENTS_COLLECTION = "announcements";

// Random interval between 5 and 10 minutes (never shorter).
const MIN_INTERVAL_MS = 5 * 60 * 1000;
const MAX_INTERVAL_MS = 10 * 60 * 1000;

// Candidate messages. One is picked at random for every post so the board
// does not repeat the exact same text. Titles stay well under the 100-char
// limit enforced by the shared announcements collection, and none of them
// contain "組分け速報" so they are never mistaken for sorting notices.
const AUTO_POST_CANDIDATES: { title: string; message: string }[] = [
  {
    title: "📢 組み分け掲示板からのお知らせです！",
    message:
      "魔法界からの最新情報をお届けしています。組分けの儀はいつでも大広間で執り行われていますよ。",
  },
  {
    title: "🎩 今日も組み分けを楽しんでください！",
    message:
      "組分け帽子はいつでもあなたの話を聞く準備ができています。まだの方はぜひクイズに挑戦してみてください。",
  },
  {
    title: "✨ あなたの運命の寮を確かめてみよう！",
    message:
      "グリフィンドール？レイブンクロー？ハッフルパフ？スリザリン？さあ、帽子をかぶって運命を確かめてみましょう。",
  },
  {
    title: "🕯️ 大広間より：掲示板は常に更新中です",
    message:
      "蝋燭の灯りが揺れる大広間の掲示板に、新しい知らせが届いています。どうぞご覧ください。",
  },
  {
    title: "🦉 ふくろう便より：寮杯争いが白熱中！",
    message:
      "新入生の活躍で寮杯の順位が目まぐるしく入れ替わっています。あなたの組分けが寮の運命を変えるかも！？",
  },
  {
    title: "🪄 組分けの儀は休みなしで開催中です",
    message:
      "いつでもどこでも、組分け帽子は待っています。友達にもこの魔法の体験を教えてあげてください。",
  },
  {
    title: "🦁🦡🦅🐍 あなたはどの寮かな？",
    message:
      "勇気、忠誠、知恵、野心——あなたの心の中にある資質が、あなたの寮を導きます。",
  },
];

function randomIntervalMs(): number {
  return MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS);
}

function pickCandidate(): { title: string; message: string } {
  return AUTO_POST_CANDIDATES[
    Math.floor(Math.random() * AUTO_POST_CANDIDATES.length)
  ];
}

// Firestore values (Timestamp / ISO string / epoch millis) -> epoch millis.
function toMillis(value: unknown): number | null {
  if (value instanceof Timestamp) return value.toMillis();
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function toIso(value: unknown): string | null {
  const millis = toMillis(value);
  return millis === null ? null : new Date(millis).toISOString();
}

function getSettingsRef() {
  return getAdminDb().collection(SETTINGS_COLLECTION).doc(SETTINGS_DOC);
}

/**
 * Reads the automation settings. Returns defaults when the doc does not
 * exist yet (automation has never been toggled).
 */
export async function getAutomationSettings(): Promise<AnnouncementAutomationSettings> {
  const snap = await getSettingsRef().get();
  const data = snap.data() ?? {};
  return {
    enabled: data.enabled === true,
    updatedAt: toIso(data.updatedAt),
    updatedBy: typeof data.updatedBy === "string" ? data.updatedBy : null,
    lastRunAt: toIso(data.lastRunAt),
    nextRunAt: toIso(data.nextRunAt),
    lastPostId: typeof data.lastPostId === "string" ? data.lastPostId : null,
  };
}

/**
 * Toggles the automation on/off (called from the admin-only API).
 * When enabling, nextRunAt is set to "now" so the first notice goes out on
 * the next tick (within about a minute). When disabling, nextRunAt is
 * cleared while lastRunAt/lastPostId are kept for the admin display.
 */
export async function setAutomationEnabled(
  enabled: boolean,
  updatedBy: string,
): Promise<AnnouncementAutomationSettings> {
  const ref = getSettingsRef();
  await ref.set(
    {
      enabled,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy,
      ...(enabled
        ? { nextRunAt: FieldValue.serverTimestamp() }
        : { nextRunAt: FieldValue.delete() }),
    },
    { merge: true },
  );
  return getAutomationSettings();
}

export type AutomationTickResult = {
  posted: boolean;
  duplicate?: boolean;
  reason?: "disabled" | "not-due" | "already-posted" | "unconfigured";
  postId?: string;
  nextRunAt?: string | null;
};

/**
 * Runs one scheduler tick. Safe to call from any number of sources at any
 * frequency (in-process timer, Cloud Scheduler, manual admin trigger):
 * the transaction + deterministic post id guarantee at most one post per
 * due moment and never a burst of duplicates.
 */
export async function runAutomationTick(
  now: number = Date.now(),
): Promise<AutomationTickResult> {
  if (!hasFirebaseAdminConfig()) {
    return { posted: false, reason: "unconfigured" };
  }

  const db = getAdminDb();
  const settingsDocRef = getSettingsRef();

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(settingsDocRef);
    const data = snap.data() ?? {};

    // OFF (or never configured): do nothing, write nothing.
    if (data.enabled !== true) {
      return { posted: false, reason: "disabled" as const };
    }

    // Not due yet: do nothing, write nothing (keeps per-minute ticks cheap).
    const nextAt = toMillis(data.nextRunAt);
    if (nextAt !== null && now < nextAt) {
      return {
        posted: false,
        reason: "not-due" as const,
        nextRunAt: new Date(nextAt).toISOString(),
      };
    }

    // Deterministic post id from the current minute bucket: duplicate ticks
    // within the same minute map to the same document and cannot post twice.
    const minuteBucket = Math.floor(now / 60000);
    const postId = `anno_auto_${minuteBucket}`;
    const postRef = db.collection(ANNOUNCEMENTS_COLLECTION).doc(postId);
    const postSnap = await tx.get(postRef);

    const nextRun = new Date(now + randomIntervalMs());

    if (postSnap.exists) {
      // Another instance already posted for this due time. Just push the
      // schedule forward so we do not retry the same minute forever.
      tx.set(settingsDocRef, { nextRunAt: nextRun }, { merge: true });
      return {
        posted: false,
        duplicate: true,
        reason: "already-posted" as const,
        nextRunAt: nextRun.toISOString(),
      };
    }

    const candidate = pickCandidate();
    const announcement = {
      id: postId,
      title: candidate.title,
      message: candidate.message,
      date: new Date(now).toLocaleDateString("ja-JP"),
      // Regular bulletin notice: NOT a sorting notice (isSortingNotice stays
      // false so the existing 組分け速報 styling/logic is untouched).
      isSortingNotice: false,
      // Extra marker so admins can tell automated posts apart if needed.
      isAutoNotice: true,
      createdAt: FieldValue.serverTimestamp(),
    };

    // create() fails if the doc exists – belt-and-braces duplicate guard
    // alongside the deterministic id (mirrors /api/announcements/sorting).
    tx.create(postRef, announcement);
    tx.set(
      settingsDocRef,
      {
        enabled: true,
        lastRunAt: new Date(now),
        nextRunAt: nextRun,
        lastPostId: postId,
      },
      { merge: true },
    );

    return {
      posted: true,
      postId,
      nextRunAt: nextRun.toISOString(),
    };
  });
}

/**
 * Starts the in-process scheduler. Called once per server process from
 * src/instrumentation.ts. Every 60 seconds it runs a tick; the tick itself
 * decides (transactionally) whether a post is actually due, so this timer
 * alone never causes duplicates even with multiple instances.
 *
 * The timer only runs while the server process is alive. On Firebase App
 * Hosting (Cloud Run) instances can scale to zero when idle; for guaranteed
 * 24/7 cadence also configure Cloud Scheduler against the tick endpoint
 * (see docs/announcement-automation.md). Both mechanisms are safe to run
 * together thanks to the dedup logic above.
 *
 * Set ANNOUNCEMENT_AUTOMATION_INPROCESS=off to disable this timer (e.g. when
 * Cloud Scheduler is the sole driver).
 */
export function startAnnouncementAutomation(): void {
  const flag = (
    process.env.ANNOUNCEMENT_AUTOMATION_INPROCESS ?? ""
  ).toLowerCase();
  if (flag === "off" || flag === "0" || flag === "false") {
    console.log("[announcement-automation] in-process scheduler disabled by env");
    return;
  }
  if (!hasFirebaseAdminConfig()) {
    console.log(
      "[announcement-automation] Firebase Admin not configured; scheduler not started",
    );
    return;
  }

  const globalState = globalThis as {
    __announcementAutomationTimer?: NodeJS.Timeout;
  };
  if (globalState.__announcementAutomationTimer) return; // already started

  const tick = async () => {
    try {
      const result = await runAutomationTick();
      if (result.posted) {
        console.log(
          `[announcement-automation] posted ${result.postId}; next at ${result.nextRunAt}`,
        );
      }
    } catch (error) {
      // Never crash the server because of automation failures.
      console.error("[announcement-automation] tick failed", error);
    }
  };

  globalState.__announcementAutomationTimer = setInterval(() => {
    void tick();
  }, 60 * 1000);

  // First check shortly after boot so an already-due schedule fires soon.
  setTimeout(() => {
    void tick();
  }, 15 * 1000);

  console.log(
    "[announcement-automation] in-process scheduler started (checks every 60s)",
  );
}