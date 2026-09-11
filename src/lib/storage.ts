import { HouseName, QuizQuestion, UserQuizResult } from "./types";
import { QUIZ_QUESTIONS } from "./constants";

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  houseName?: HouseName;
  isSortingNotice?: boolean;
}

export interface FactItem {
  id: string;
  house: string;
  text: string;
  status: "pending" | "approved" | "rejected";
}

const STORAGE_KEYS = {
  QUIZ_HISTORY: "hogwarts_quiz_history",
  ANNOUNCEMENTS: "hogwarts_announcements",
  QUESTIONS: "hogwarts_quiz_questions",
  FACTS: "hogwarts_ai_facts",
  SAVED_NICKNAME: "hogwarts_saved_nickname",
  SORTING_NOTICE_MARKERS: "hogwarts_sorting_notice_markers",
};

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "anno1",
    title: "まもなく寮対抗カップのセレモニーが始まります！",
    message:
      "校長先生より、寮杯セレモニーが次の金曜日の夜、大広間（グレートホール）にて執り行われると告げられました。各寮の準備を整えて臨んでください！",
    date: "2026/9/8",
  },
  {
    id: "anno2",
    title: "クィディッチ選抜、開催延期のお知らせ",
    message:
      "暴走ブラッジャーが出現したとの報告により、悪天候の中でのトライアウトは延期となります。再開日程は追ってお知らせします。",
    date: "2026/9/7",
  },
];

const DEFAULT_FACTS: FactItem[] = [
  {
    id: "fact1",
    house: "グリフィンドール",
    text: "グリフィンドールの談話室は城の高い塔の上にあり、「太った婦人」の肖像画に合言葉を告げることで入れます。",
    status: "approved",
  },
  {
    id: "fact2",
    house: "スリザリン",
    text: "スリザリン寮の談話室は黒い湖の底深くにあり、緑がかった窓から大イカや水中生物の姿が見られます。",
    status: "approved",
  },
  {
    id: "fact3",
    house: "レイブンクロー",
    text: "レイブンクローの塔に入るには、合言葉ではなく、青銅の鷲のドアノッカーが出すなぞなぞを解く必要があります。",
    status: "pending",
  },
  {
    id: "fact4",
    house: "ハッフルパフ",
    text: "ハッフルパフ寮の談話室は厨房のすぐそばにあり、樽のフタを「ヘルガ・ハッフルパフ」のリズムで叩くと扉が開きます。",
    status: "approved",
  },
];

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// ---------------- Quiz History ----------------
export function getStoredQuizResults(): UserQuizResult[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load quiz history from localStorage", e);
    return [];
  }
}

export function saveQuizResult(
  data: Omit<UserQuizResult, "id" | "date">,
): UserQuizResult {
  const newResult: UserQuizResult = {
    id:
      "result_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    date: new Date().toISOString(),
    ...data,
  };

  if (!isBrowser()) return newResult;

  try {
    const existing = getStoredQuizResults();
    const updated = [newResult, ...existing];
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save quiz result", e);
  }

  return newResult;
}

export function deleteQuizResult(id: string): void {
  if (!isBrowser()) return;
  try {
    const existing = getStoredQuizResults();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to delete quiz result", e);
  }
}

export function getQuizResultById(
  id: string | null,
): UserQuizResult | undefined {
  if (!id || !isBrowser()) return undefined;
  const results = getStoredQuizResults();
  return results.find((r) => r.id === id);
}

export function getLatestQuizResult(): UserQuizResult | undefined {
  if (!isBrowser()) return undefined;
  const results = getStoredQuizResults();
  return results[0];
}

export function clearQuizResults(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
  } catch (e) {
    console.error("Failed to clear quiz results", e);
  }
}

// ---------------- Announcements ----------------
export function getStoredAnnouncements(): Announcement[] {
  if (!isBrowser()) return DEFAULT_ANNOUNCEMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    if (!raw) {
      localStorage.setItem(
        STORAGE_KEYS.ANNOUNCEMENTS,
        JSON.stringify(DEFAULT_ANNOUNCEMENTS),
      );
      return DEFAULT_ANNOUNCEMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load announcements", e);
    return DEFAULT_ANNOUNCEMENTS;
  }
}

export function saveAnnouncement(title: string, message: string): Announcement {
  const newAnnouncement: Announcement = {
    id: "anno_" + Date.now(),
    title,
    message,
    date: new Date().toLocaleDateString("ja-JP"),
  };

  if (!isBrowser()) return newAnnouncement;

  try {
    const existing = getStoredAnnouncements();
    const updated = [newAnnouncement, ...existing];
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save announcement", e);
  }

  return newAnnouncement;
}

export function deleteAnnouncement(id: string): void {
  if (!isBrowser()) return;
  try {
    const existing = getStoredAnnouncements();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to delete announcement", e);
  }
}

// ---------------- Questions ----------------
export function getStoredQuestions(): QuizQuestion[] {
  if (!isBrowser()) return QUIZ_QUESTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!raw) {
      localStorage.setItem(
        STORAGE_KEYS.QUESTIONS,
        JSON.stringify(QUIZ_QUESTIONS),
      );
      return QUIZ_QUESTIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return QUIZ_QUESTIONS;
    }
    return parsed;
  } catch (e) {
    console.error("Failed to load questions", e);
    return QUIZ_QUESTIONS;
  }
}

export function saveNewQuestion(question: QuizQuestion): QuizQuestion[] {
  if (!isBrowser()) return [question, ...QUIZ_QUESTIONS];
  try {
    const existing = getStoredQuestions();
    const updated = [...existing, question];
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save question", e);
    return QUIZ_QUESTIONS;
  }
}

export function deleteQuestion(id: string): QuizQuestion[] {
  if (!isBrowser()) return QUIZ_QUESTIONS;
  try {
    const existing = getStoredQuestions();
    const updated = existing.filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to delete question", e);
    return QUIZ_QUESTIONS;
  }
}

export function resetQuestionsToDefault(): QuizQuestion[] {
  if (!isBrowser()) return QUIZ_QUESTIONS;
  try {
    localStorage.setItem(
      STORAGE_KEYS.QUESTIONS,
      JSON.stringify(QUIZ_QUESTIONS),
    );
  } catch (e) {
    console.error("Failed to reset questions", e);
  }
  return QUIZ_QUESTIONS;
}

// ---------------- AI Facts ----------------
export function getStoredFacts(): FactItem[] {
  if (!isBrowser()) return DEFAULT_FACTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FACTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FACTS, JSON.stringify(DEFAULT_FACTS));
      return DEFAULT_FACTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load facts", e);
    return DEFAULT_FACTS;
  }
}

export function updateFactStatus(
  id: string,
  status: "approved" | "rejected" | "pending",
): FactItem[] {
  if (!isBrowser()) return DEFAULT_FACTS;
  try {
    const existing = getStoredFacts();
    const updated = existing.map((f) => (f.id === id ? { ...f, status } : f));
    localStorage.setItem(STORAGE_KEYS.FACTS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to update fact", e);
    return DEFAULT_FACTS;
  }
}

export function addStoredFact(house: string, text: string): FactItem[] {
  const newFact: FactItem = {
    id: "fact_" + Date.now(),
    house,
    text,
    status: "approved",
  };
  if (!isBrowser()) return [newFact, ...DEFAULT_FACTS];
  try {
    const existing = getStoredFacts();
    const updated = [newFact, ...existing];
    localStorage.setItem(STORAGE_KEYS.FACTS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to add fact", e);
    return DEFAULT_FACTS;
  }
}

// ---------------- Nickname Persistence ----------------
export function getSavedNickname(): string {
  if (!isBrowser()) return "";
  try {
    return localStorage.getItem(STORAGE_KEYS.SAVED_NICKNAME) || "";
  } catch {
    return "";
  }
}

export function saveNickname(nickname: string): void {
  if (!isBrowser()) return;
  try {
    const trimmed = nickname.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEYS.SAVED_NICKNAME, trimmed);
    }
  } catch (e) {
    console.error("Failed to save nickname", e);
  }
}

export function clearSavedNickname(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.SAVED_NICKNAME);
  } catch (e) {
    console.error("Failed to clear nickname", e);
  }
}

// ---------------- Sorting Bulletin Notice ----------------
export function addSortingAnnouncement(
  nickname: string,
  houseName: HouseName,
  resultId?: string,
): Announcement {
  const houseJp: Record<HouseName, string> = {
    Gryffindor: "グリフィンドール",
    Ravenclaw: "レイブンクロー",
    Hufflepuff: "ハッフルパフ",
    Slytherin: "スリザリン",
  };
  const jName = houseJp[houseName] || houseName;
  const newAnnouncement: Announcement = {
    // Deterministic id derived from the quiz result id. The same quiz result
    // therefore maps to exactly one bulletin board document on the server.
    id: resultId
      ? `anno_sorting_${resultId}`
      : "anno_sorting_" +
        Date.now() +
        "_" +
        Math.random().toString(36).substring(2, 6),
    title: `✨ 【組分け速報】${nickname}さんが${jName}に組み分けされました！`,
    message: `本日、新入生「${nickname}」殿の組分けの儀式が完了しました。\n組分け帽子によって選ばれた寮は【${jName}（${houseName}）】です！\n寮生の皆様、盛大な拍手で新しい仲間を歓迎してください！🎉`,
    date: new Date().toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    houseName,
    isSortingNotice: true,
  };

  // Posting to the shared bulletin board happens asynchronously via
  // publishSortingNoticeInBackground (server API), never inline here.
  return newAnnouncement;
}

function getSortingNoticeMarkers(): Record<string, true> {
  if (!isBrowser()) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SORTING_NOTICE_MARKERS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, true>)
      : {};
  } catch {
    return {};
  }
}

function markSortingNoticeSent(id: string, sent: boolean): void {
  if (!isBrowser()) return;
  try {
    const markers = getSortingNoticeMarkers();
    if (sent) {
      markers[id] = true;
    } else {
      delete markers[id];
    }
    localStorage.setItem(
      STORAGE_KEYS.SORTING_NOTICE_MARKERS,
      JSON.stringify(markers),
    );
  } catch (e) {
    console.error("Failed to update sorting notice marker", e);
  }
}

/**
 * Fire-and-forget background posting of a sorting notice to the shared
 * Hogwarts bulletin board ("/api/announcements/sorting" -> Firestore
 * "announcements" collection).
 *
 * - Never throws and never blocks the sorting-result flow.
 * - A localStorage marker prevents repeat attempts within the same browser.
 * - The server derives a deterministic document id from the quiz result id,
 *   so even retries can never create duplicate bulletin board posts.
 */
export function publishSortingNoticeInBackground(
  announcement: Announcement,
  nickname: string,
): void {
  if (!isBrowser()) return;
  if (!announcement.houseName) return;

  // Skip if this result's notice was already sent (or is being sent).
  if (getSortingNoticeMarkers()[announcement.id]) return;
  markSortingNoticeSent(announcement.id, true);

  const resultId = announcement.id.startsWith("anno_sorting_")
    ? announcement.id.slice("anno_sorting_".length)
    : announcement.id;

  void fetch("/api/announcements/sorting", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      resultId,
      nickname: nickname.trim(),
      houseName: announcement.houseName,
    }),
    keepalive: true,
  })
    .then((response) => {
      if (!response.ok)
        throw new Error(`Sorting notice request failed: ${response.status}`);
    })
    .catch((error) => {
      console.error("Failed to publish sorting notice", error);
      // Clear the marker so a later visit can retry. Server-side
      // idempotency (deterministic doc id + create) prevents duplicates.
      markSortingNoticeSent(announcement.id, false);
    });
}

// ---------------- Complete Sorting Workflow Helper ----------------
export function completeSortingProcess(data: {
  nickname: string;
  houseName: HouseName;
  scores: Partial<Record<HouseName, number>>;
}): {
  result: UserQuizResult;
  announcement: Announcement;
} {
  // 1. Persist nickname so subsequent sortings do not prompt again
  if (data.nickname) {
    saveNickname(data.nickname);
  }

  // 2. Save individual user quiz result to history
  const result = saveQuizResult({
    userId: "student_" + Math.random().toString(36).substring(2, 6),
    nickname: data.nickname,
    houseName: data.houseName,
    scores: data.scores,
  });

  // 3. Build the sorting notice for the Hogwarts notice board. Its id is
  //    deterministically derived from result.id so one result = one notice.
  const announcement = addSortingAnnouncement(
    data.nickname,
    data.houseName,
    result.id,
  );

  // 4. Publish the notice to the shared bulletin board in the background.
  //    Failures are logged and retried later; they never affect the
  //    sorting result that was just saved above.
  publishSortingNoticeInBackground(announcement, data.nickname);

  return { result, announcement };
}

// ---------------- Admin Authentication ----------------
const ADMIN_AUTH_KEY = "hogwarts_admin_authenticated";

export function isAdminAuthenticated(): boolean {
  if (!isBrowser()) return false;
  try {
    return localStorage.getItem(ADMIN_AUTH_KEY) === "true";
  } catch (e) {
    console.error("Failed to check admin auth", e);
    return false;
  }
}

export function setAdminAuthenticated(authenticated: boolean): void {
  if (!isBrowser()) return;
  try {
    if (authenticated) {
      localStorage.setItem(ADMIN_AUTH_KEY, "true");
    } else {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  } catch (e) {
    console.error("Failed to set admin auth", e);
  }
}

export function verifyAdminLogin(id: string, pass: string): boolean {
  const cleanId = id.trim().toLowerCase();
  const cleanPass = pass.trim().toLowerCase();

  const validIds = ["admin", "dumbledore", "hogwarts"];
  const validPasswords = [
    "alohomora",
    "hogwarts",
    "magic123",
    "magic",
    "password",
    "lemon",
  ];

  if (validIds.includes(cleanId) && validPasswords.includes(cleanPass)) {
    setAdminAuthenticated(true);
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  setAdminAuthenticated(false);
}
