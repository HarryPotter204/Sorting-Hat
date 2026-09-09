import { FieldValue } from "firebase-admin/firestore";
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, hasFirebaseAdminConfig } from "@/lib/firebase-admin";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-session";
import type { HouseName } from "@/lib/types";

const collectionName = "announcements";

function requireAdmin(request: NextRequest) {
  return isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

function isValidAnnouncement(value: unknown): value is {
  id?: string;
  title: string;
  message: string;
  date?: string;
  houseName?: HouseName;
  isSortingNotice?: boolean;
  createdAt?: unknown;
} {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  const validHouseNames: HouseName[] = [
    "Gryffindor",
    "Ravenclaw",
    "Hufflepuff",
    "Slytherin",
  ];
  return (
    typeof item.title === "string" &&
    item.title.trim().length > 0 &&
    item.title.trim().length <= 100 &&
    typeof item.message === "string" &&
    item.message.trim().length > 0 &&
    item.message.trim().length <= 1000 &&
    (item.houseName === undefined ||
      validHouseNames.includes(item.houseName as HouseName)) &&
    (item.isSortingNotice === undefined ||
      typeof item.isSortingNotice === "boolean")
  );
}

function unavailable() {
  return NextResponse.json(
    { error: "Firestore is not configured" },
    { status: 503 },
  );
}

export async function GET() {
  if (!hasFirebaseAdminConfig()) return unavailable();
  try {
    const snapshot = await getAdminDb().collection(collectionName).get();
    const announcements = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item) => isValidAnnouncement(item))
      .sort((a, b) =>
        String(b.createdAt ?? b.date ?? "").localeCompare(
          String(a.createdAt ?? a.date ?? ""),
        ),
      );
    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("Failed to load announcements", error);
    return NextResponse.json(
      { error: "Failed to load announcements" },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasFirebaseAdminConfig()) return unavailable();
  try {
    const body = await request.json();
    if (!isValidAnnouncement(body))
      return NextResponse.json(
        { error: "Invalid announcement" },
        { status: 400 },
      );
    const id = `anno_${randomUUID()}`;
    const announcement = {
      id,
      title: body.title.trim(),
      message: body.message.trim(),
      date: new Date().toLocaleDateString("ja-JP"),
      ...(body.houseName ? { houseName: body.houseName } : {}),
      isSortingNotice: body.isSortingNotice === true,
      createdAt: FieldValue.serverTimestamp(),
    };
    await getAdminDb().collection(collectionName).doc(id).set(announcement);
    return NextResponse.json(
      {
        announcement: { ...announcement, createdAt: new Date().toISOString() },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create announcement", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 503 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!requireAdmin(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasFirebaseAdminConfig()) return unavailable();
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id || !/^[A-Za-z0-9_-]+$/.test(id))
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    await getAdminDb().collection(collectionName).doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete announcement", error);
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 503 },
    );
  }
}
