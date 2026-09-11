import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-session";
import {
  getAutomationSettings,
  setAutomationEnabled,
} from "@/lib/announcement-automation";

// Admin-only settings API for the bulletin-board auto-posting switch.
// GET  -> current settings (also used by the admin UI to show status).
// POST -> toggle enabled on/off (requires a valid admin session cookie).

function requireAdmin(request: NextRequest) {
  return isValidAdminSession(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
  );
}

function unavailable() {
  return NextResponse.json(
    { error: "Firestore is not configured" },
    { status: 503 },
  );
}

export async function GET(request: NextRequest) {
  if (!requireAdmin(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasFirebaseAdminConfigSafe()) return unavailable();
  try {
    const settings = await getAutomationSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Failed to load automation settings", error);
    return NextResponse.json(
      { error: "Failed to load automation settings" },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasFirebaseAdminConfigSafe()) return unavailable();
  try {
    const body = (await request.json()) as { enabled?: unknown };
    if (typeof body?.enabled !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request: 'enabled' must be a boolean" },
        { status: 400 },
      );
    }
    const settings = await setAutomationEnabled(
      body.enabled,
      "admin", // admin id is not exposed in the session token; keep it simple
    );
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Failed to update automation settings", error);
    return NextResponse.json(
      { error: "Failed to update automation settings" },
      { status: 503 },
    );
  }
}

// Local wrapper so the route module never imports the Admin SDK at module
// scope (keeps the route importable even without env configuration).
function hasFirebaseAdminConfigSafe(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}