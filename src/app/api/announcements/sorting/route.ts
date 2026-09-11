import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, hasFirebaseAdminConfig } from "@/lib/firebase-admin";
import type { HouseName } from "@/lib/types";

// Reuses the existing shared "announcements" collection so sorting notices
// appear in the regular Hogwarts bulletin board (AnnouncementBanner).
const collectionName = "announcements";

const VALID_HOUSE_NAMES: HouseName[] = [
  "Gryffindor",
  "Ravenclaw",
  "Hufflepuff",
  "Slytherin",
];

const HOUSE_NAMES_JP: Record<HouseName, string> = {
  Gryffindor: "グリフィンドール",
  Ravenclaw: "レイブンクロー",
  Hufflepuff: "ハッフルパフ",
  Slytherin: "スリザリン",
};

// Strips control characters and clamps user-provided text so it can never
// exceed the limits enforced by the shared announcements collection.
// (The bulletin board renders values as plain React text, so user input is
// never interpreted as HTML.)
function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

// Firestore raises ALREADY_EXISTS when create() hits an existing document.
function isAlreadyExists(error: unknown): boolean {
  const code = (error as { code?: number | string } | null)?.code;
  return code === 6 || code === "already-exists" || code === "ALREADY_EXISTS";
}

export async function POST(request: NextRequest) {
  if (!hasFirebaseAdminConfig()) {
    return NextResponse.json(
      { error: "Firestore is not configured" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const resultId = sanitizeText(data.resultId, 100);
  const nickname = sanitizeText(data.nickname, 40) || "新入生";
  const houseName = data.houseName;

  if (!resultId || !/^[A-Za-z0-9_-]+$/.test(resultId)) {
    return NextResponse.json({ error: "Invalid resultId" }, { status: 400 });
  }
  if (
    typeof houseName !== "string" ||
    !VALID_HOUSE_NAMES.includes(houseName as HouseName)
  ) {
    return NextResponse.json({ error: "Invalid houseName" }, { status: 400 });
  }

  const houseJp = HOUSE_NAMES_JP[houseName as HouseName];
  // Deterministic document id derived from the quiz result id: the same
  // quiz result can therefore only ever create one bulletin board notice.
  const docId = `anno_sorting_${resultId}`;
  const announcement = {
    id: docId,
    title: `✨ 【組分け速報】${nickname}さんが${houseJp}に組み分けされました！`,
    message: `本日、新入生「${nickname}」殿の組分けの儀式が完了しました。\n組分け帽子によって選ばれた寮は【${houseJp}（${houseName}）】です！\n寮生の皆様、盛大な拍手で新しい仲間を歓迎してください！🎉`,
    date: new Date().toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    houseName: houseName as HouseName,
    isSortingNotice: true,
    createdAt: FieldValue.serverTimestamp(),
  };

  try {
    // create() fails when the document already exists, guaranteeing
    // idempotency even if the client retries or the marker was cleared.
    await getAdminDb()
      .collection(collectionName)
      .doc(docId)
      .create(announcement);
    return NextResponse.json(
      { ok: true, duplicate: false, id: docId },
      { status: 201 },
    );
  } catch (error) {
    if (isAlreadyExists(error)) {
      // The notice for this quiz result already exists – treat as success.
      return NextResponse.json({ ok: true, duplicate: true, id: docId });
    }
    console.error("Failed to create sorting announcement", error);
    return NextResponse.json(
      { error: "Failed to create sorting announcement" },
      { status: 503 },
    );
  }
}