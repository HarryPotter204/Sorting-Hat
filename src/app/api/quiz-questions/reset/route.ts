import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { QUIZ_QUESTIONS } from "@/lib/constants";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-session";
import { getAdminDb, hasFirebaseAdminConfig } from "@/lib/firebase-admin";

const COLLECTION_NAME = "quizQuestions";

export async function POST(request: NextRequest) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasFirebaseAdminConfig()) {
    return NextResponse.json(
      { error: "Firestore is not configured" },
      { status: 503 },
    );
  }

  try {
    const batch = getAdminDb().batch();
    const collection = getAdminDb().collection(COLLECTION_NAME);

    QUIZ_QUESTIONS.forEach((question) => {
      const document = collection.doc(question.id);
      batch.set(document, {
        ...question,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    return NextResponse.json({ count: QUIZ_QUESTIONS.length });
  } catch (error) {
    console.error("Failed to reset quiz questions", error);
    return NextResponse.json(
      { error: "Failed to reset quiz questions" },
      { status: 503 },
    );
  }
}
