import { NextRequest, NextResponse } from "next/server";
import { runAutomationTick } from "@/lib/announcement-automation";

// Protected scheduler tick endpoint.
//
// Purpose: lets an external scheduler (e.g. Google Cloud Scheduler) drive the
// bulletin-board auto-posting even when no server instance happens to be
// running (Cloud Run instances can scale to zero). The in-process scheduler
// (src/instrumentation.ts) and this endpoint share the same dedup logic, so
// both can safely run at the same time.
//
// Security: the caller MUST present the shared secret in the
// "x-automation-key" header (or ?key= query param). The secret is compared
// with a timing-safe check against the ANNOUNCEMENT_AUTOMATION_TICK_SECRET
// environment variable. Without the secret the endpoint always returns 401,
// so it can never be invoked by anonymous third parties.
//
// Recommended Cloud Scheduler setup (1 per minute, HTTP target):
//   URL:    https://<your-backend>/api/announcements/automation/tick
//   Method: GET
//   Header: x-automation-key: <ANNOUNCEMENT_AUTOMATION_TICK_SECRET value>
// See docs/announcement-automation.md for the gcloud commands.

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.ANNOUNCEMENT_AUTOMATION_TICK_SECRET;
  if (!secret) return false; // endpoint disabled unless a secret is set

  const provided =
    request.headers.get("x-automation-key") ??
    new URL(request.url).searchParams.get("key") ??
    "";

  if (provided.length !== secret.length) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  return a.equals(b);
}

function hasFirebaseAdminConfigSafe(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasFirebaseAdminConfigSafe()) {
    return NextResponse.json(
      { error: "Firestore is not configured" },
      { status: 503 },
    );
  }

  try {
    const result = await runAutomationTick();
    // Always 200 so scheduler retries are not triggered by normal
    // "disabled / not-due" outcomes; failures throw and become 500.
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Automation tick failed", error);
    return NextResponse.json(
      { ok: false, error: "Automation tick failed" },
      { status: 500 },
    );
  }
}