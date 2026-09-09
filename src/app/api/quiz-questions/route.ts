import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-session";
import { getAdminDb, hasFirebaseAdminConfig } from "@/lib/firebase-admin";
import type { QuizQuestion } from "@/lib/types";

const COLLECTION_NAME = "quizQuestions";

function requireAdmin(request: NextRequest) {
  return isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

function toQuizQuestion(
  id: string,
  data: FirebaseFirestore.DocumentData,
): QuizQuestion | null {
  if (typeof data.text !== "string" || !Array.isArray(data.options)) {
    return null;
  }

  const options = data.options.filter(
    (option: unknown) =>
      option &&
      typeof option === "object" &&
      typeof (option as { id?: unknown }).id === "string" &&
      typeof (option as { text?: unknown }).text === "string" &&
      (option as { houseAffinity?: unknown }).houseAffinity &&
      typeof (option as { houseAffinity?: unknown }).houseAffinity === "object",
  );

  if (options.length !== data.options.length) {
    return null;
  }

  return {
    id,
    text: data.text,
    options,
    ...(typeof data.imageUrl === "string" ? { imageUrl: data.imageUrl } : {}),
    ...(typeof data.dataAiHint === "string"
      ? { dataAiHint: data.dataAiHint }
      : {}),
  } as QuizQuestion;
}

export async function GET() {
  if (!hasFirebaseAdminConfig()) {
    return NextResponse.json(
      { error: "Firestore is not configured" },
      { status: 503 },
    );
  }

  try {
    const snapshot = await getAdminDb().collection(COLLECTION_NAME).get();
    const questions = snapshot.docs
      .map((document) => toQuizQuestion(document.id, document.data()))
      .filter((question): question is QuizQuestion => question !== null)
      .sort((first, second) => {
        const firstNumber = Number(first.id.match(/^q(\d+)/)?.[1]);
        const secondNumber = Number(second.id.match(/^q(\d+)/)?.[1]);
        const firstHasNumber = Number.isFinite(firstNumber);
        const secondHasNumber = Number.isFinite(secondNumber);

        if (firstHasNumber && secondHasNumber)
          return firstNumber - secondNumber;
        if (firstHasNumber) return -1;
        if (secondHasNumber) return 1;
        return first.id.localeCompare(second.id);
      });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Failed to load quiz questions", error);
    return NextResponse.json(
      { error: "Failed to load quiz questions" },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasFirebaseAdminConfig()) {
    return NextResponse.json(
      { error: "Firestore is not configured" },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    if (
      !body ||
      typeof body !== "object" ||
      typeof body.id !== "string" ||
      !/^q[A-Za-z0-9_-]+$/.test(body.id)
    ) {
      return NextResponse.json({ error: "Invalid question" }, { status: 400 });
    }

    const question = toQuizQuestion(body.id, body);
    if (!question) {
      return NextResponse.json({ error: "Invalid question" }, { status: 400 });
    }

    await getAdminDb()
      .collection(COLLECTION_NAME)
      .doc(question.id)
      .set({
        ...question,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error("Failed to save quiz question", error);
    return NextResponse.json(
      { error: "Failed to save quiz question" },
      { status: 503 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasFirebaseAdminConfig()) {
    return NextResponse.json(
      { error: "Firestore is not configured" },
      { status: 503 },
    );
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id || !/^q[A-Za-z0-9_-]+$/.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await getAdminDb().collection(COLLECTION_NAME).doc(id).delete();
    return NextResponse.json({ ok: true, id });
  } catch (error) {
    console.error("Failed to delete quiz question", error);
    return NextResponse.json(
      { error: "Failed to delete quiz question" },
      { status: 503 },
    );
  }
}
