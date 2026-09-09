import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { getAdminDb, hasFirebaseAdminConfig } from "@/lib/firebase-admin";

const HOUSE_STATS_COLLECTION = "houseStats";
const HOUSE_STATS_DOCUMENT = "global";

const DEFAULT_HOUSE_STATS = {
  Gryffindor: 12,
  Ravenclaw: 2,
  Hufflepuff: 2,
  Slytherin: 0,
};

type HouseStats = typeof DEFAULT_HOUSE_STATS;
const HOUSE_NAMES = Object.keys(DEFAULT_HOUSE_STATS) as Array<keyof HouseStats>;

function getNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : fallback;
}

function toHouseStats(data: FirebaseFirestore.DocumentData): HouseStats {
  return {
    Gryffindor: getNumber(data.Gryffindor, DEFAULT_HOUSE_STATS.Gryffindor),
    Ravenclaw: getNumber(data.Ravenclaw, DEFAULT_HOUSE_STATS.Ravenclaw),
    Hufflepuff: getNumber(data.Hufflepuff, DEFAULT_HOUSE_STATS.Hufflepuff),
    Slytherin: getNumber(data.Slytherin, DEFAULT_HOUSE_STATS.Slytherin),
  };
}

export async function GET() {
  if (!hasFirebaseAdminConfig()) {
    return NextResponse.json(
      { error: "Firestore is not configured" },
      { status: 503 },
    );
  }

  try {
    const document = getAdminDb()
      .collection(HOUSE_STATS_COLLECTION)
      .doc(HOUSE_STATS_DOCUMENT);
    const snapshot = await document.get();

    if (!snapshot.exists) {
      await document.set({
        ...DEFAULT_HOUSE_STATS,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return NextResponse.json(DEFAULT_HOUSE_STATS, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    return NextResponse.json(toHouseStats(snapshot.data() ?? {}), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to load house stats", error);
    return NextResponse.json(
      { error: "Failed to load house stats" },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
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

  const houseName =
    body && typeof body === "object" && "houseName" in body
      ? body.houseName
      : undefined;
  if (typeof houseName !== "string" || !HOUSE_NAMES.includes(houseName as keyof HouseStats)) {
    return NextResponse.json({ error: "Invalid houseName" }, { status: 400 });
  }

  try {
    await getAdminDb()
      .collection(HOUSE_STATS_COLLECTION)
      .doc(HOUSE_STATS_DOCUMENT)
      .update({
        [houseName]: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      });
    return NextResponse.json({ ok: true, houseName });
  } catch (error) {
    console.error("Failed to update house stats", error);
    return NextResponse.json(
      { error: "Failed to update house stats" },
      { status: 503 },
    );
  }
}
