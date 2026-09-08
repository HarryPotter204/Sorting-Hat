import { HouseName, QuizQuestion, UserQuizResult } from './types';
import { QUIZ_QUESTIONS } from './constants';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
}

export interface FactItem {
  id: string;
  house: string;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
}

const STORAGE_KEYS = {
  QUIZ_HISTORY: 'hogwarts_quiz_history',
  ANNOUNCEMENTS: 'hogwarts_announcements',
  QUESTIONS: 'hogwarts_quiz_questions',
  FACTS: 'hogwarts_ai_facts',
};

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anno1',
    title: 'まもなく寮対抗カップのセレモニーが始まります！',
    message: '校長先生より、寮杯セレモニーが次の金曜日の夜、大広間（グレートホール）にて執り行われると告げられました。各寮の準備を整えて臨んでください！',
    date: '2026/9/8',
  },
  {
    id: 'anno2',
    title: 'クィディッチ選抜、開催延期のお知らせ',
    message: '暴走ブラッジャーが出現したとの報告により、悪天候の中でのトライアウトは延期となります。再開日程は追ってお知らせします。',
    date: '2026/9/7',
  },
];

const DEFAULT_FACTS: FactItem[] = [
  { id: 'fact1', house: 'グリフィンドール', text: 'グリフィンドールの談話室は城の高い塔の上にあり、「太った婦人」の肖像画に合言葉を告げることで入れます。', status: 'approved' },
  { id: 'fact2', house: 'スリザリン', text: 'スリザリン寮の談話室は黒い湖の底深くにあり、緑がかった窓から大イカや水中生物の姿が見られます。', status: 'approved' },
  { id: 'fact3', house: 'レイブンクロー', text: 'レイブンクローの塔に入るには、合言葉ではなく、青銅の鷲のドアノッカーが出すなぞなぞを解く必要があります。', status: 'pending' },
  { id: 'fact4', house: 'ハッフルパフ', text: 'ハッフルパフ寮の談話室は厨房のすぐそばにあり、樽のフタを「ヘルガ・ハッフルパフ」のリズムで叩くと扉が開きます。', status: 'approved' },
];

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

// ---------------- Quiz History ----------------
export function getStoredQuizResults(): UserQuizResult[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load quiz history from localStorage', e);
    return [];
  }
}

export function saveQuizResult(
  data: Omit<UserQuizResult, 'id' | 'date'>
): UserQuizResult {
  const newResult: UserQuizResult = {
    id: 'result_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    date: new Date().toISOString(),
    ...data,
  };

  if (!isBrowser()) return newResult;

  try {
    const existing = getStoredQuizResults();
    const updated = [newResult, ...existing];
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save quiz result', e);
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
    console.error('Failed to delete quiz result', e);
  }
}

export function clearQuizResults(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
  } catch (e) {
    console.error('Failed to clear quiz results', e);
  }
}

// ---------------- Announcements ----------------
export function getStoredAnnouncements(): Announcement[] {
  if (!isBrowser()) return DEFAULT_ANNOUNCEMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(DEFAULT_ANNOUNCEMENTS));
      return DEFAULT_ANNOUNCEMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load announcements', e);
    return DEFAULT_ANNOUNCEMENTS;
  }
}

export function saveAnnouncement(title: string, message: string): Announcement {
  const newAnnouncement: Announcement = {
    id: 'anno_' + Date.now(),
    title,
    message,
    date: new Date().toLocaleDateString('ja-JP'),
  };

  if (!isBrowser()) return newAnnouncement;

  try {
    const existing = getStoredAnnouncements();
    const updated = [newAnnouncement, ...existing];
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save announcement', e);
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
    console.error('Failed to delete announcement', e);
  }
}

// ---------------- Questions ----------------
export function getStoredQuestions(): QuizQuestion[] {
  if (!isBrowser()) return QUIZ_QUESTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(QUIZ_QUESTIONS));
      return QUIZ_QUESTIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return QUIZ_QUESTIONS;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load questions', e);
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
    console.error('Failed to save question', e);
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
    console.error('Failed to delete question', e);
    return QUIZ_QUESTIONS;
  }
}

export function resetQuestionsToDefault(): QuizQuestion[] {
  if (!isBrowser()) return QUIZ_QUESTIONS;
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(QUIZ_QUESTIONS));
  } catch (e) {
    console.error('Failed to reset questions', e);
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
    console.error('Failed to load facts', e);
    return DEFAULT_FACTS;
  }
}

export function updateFactStatus(id: string, status: 'approved' | 'rejected' | 'pending'): FactItem[] {
  if (!isBrowser()) return DEFAULT_FACTS;
  try {
    const existing = getStoredFacts();
    const updated = existing.map((f) => (f.id === id ? { ...f, status } : f));
    localStorage.setItem(STORAGE_KEYS.FACTS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update fact', e);
    return DEFAULT_FACTS;
  }
}

export function addStoredFact(house: string, text: string): FactItem[] {
  const newFact: FactItem = {
    id: 'fact_' + Date.now(),
    house,
    text,
    status: 'approved',
  };
  if (!isBrowser()) return [newFact, ...DEFAULT_FACTS];
  try {
    const existing = getStoredFacts();
    const updated = [newFact, ...existing];
    localStorage.setItem(STORAGE_KEYS.FACTS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to add fact', e);
    return DEFAULT_FACTS;
  }
}

// ---------------- Aggregate Sorting Counts ----------------
export function getAggregatedHouseCounts(): Record<HouseName, number> {
  const baseCounts: Record<HouseName, number> = {
    Gryffindor: 1420,
    Ravenclaw: 1280,
    Hufflepuff: 1190,
    Slytherin: 1350,
  };

  const results = getStoredQuizResults();
  results.forEach((res) => {
    if (res.houseName && baseCounts[res.houseName] !== undefined) {
      baseCounts[res.houseName] += 1;
    }
  });

  return baseCounts;
}

// ---------------- Admin Authentication ----------------
const ADMIN_AUTH_KEY = 'hogwarts_admin_authenticated';

export function isAdminAuthenticated(): boolean {
  if (!isBrowser()) return false;
  try {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  } catch (e) {
    console.error('Failed to check admin auth', e);
    return false;
  }
}

export function setAdminAuthenticated(authenticated: boolean): void {
  if (!isBrowser()) return;
  try {
    if (authenticated) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  } catch (e) {
    console.error('Failed to set admin auth', e);
  }
}

export function verifyAdminLogin(id: string, pass: string): boolean {
  const cleanId = id.trim().toLowerCase();
  const cleanPass = pass.trim().toLowerCase();

  const validIds = ['admin', 'dumbledore', 'hogwarts'];
  const validPasswords = ['alohomora', 'hogwarts', 'magic123', 'magic', 'password', 'lemon'];

  if (validIds.includes(cleanId) && validPasswords.includes(cleanPass)) {
    setAdminAuthenticated(true);
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  setAdminAuthenticated(false);
}
