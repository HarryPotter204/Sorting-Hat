/**
 * Next.js instrumentation hook (server startup).
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * Starts the bulletin-board auto-posting scheduler exactly once per server
 * process. The scheduler is fail-safe: it never throws and never blocks
 * request handling, and it is skipped entirely when Firebase Admin is not
 * configured (e.g. local dev without .env.local).
 */
export async function register(): Promise<void> {
  // Dynamic import keeps the Firebase Admin SDK out of non-Node runtimes.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startAnnouncementAutomation } = await import(
      "@/lib/announcement-automation"
    );
    startAnnouncementAutomation();
  }
}