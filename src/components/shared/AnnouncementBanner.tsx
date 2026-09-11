"use client";

import { useEffect, useState } from "react";
import { Megaphone, Lock, ShieldCheck, X, Bell } from "lucide-react";
import Link from "next/link";
import {
  getStoredAnnouncements,
  Announcement,
  isAdminAuthenticated,
} from "@/lib/storage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcements", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load announcements");
      const data = await response.json();
      setAnnouncements(
        Array.isArray(data.announcements) ? data.announcements : [],
      );
    } catch {
      // Keep the existing UI usable while Firestore is unavailable.
      setAnnouncements(getStoredAnnouncements());
    }
    setIsAdmin(isAdminAuthenticated());
  };

  useEffect(() => {
    void loadAnnouncements();

    const handleUpdate = () => {
      void loadAnnouncements();
    };

    window.addEventListener("hogwarts_announcements_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(
        "hogwarts_announcements_updated",
        handleUpdate,
      );
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  if (announcements.length === 0) return null;

  const latestAnnouncement = announcements[0];

  return (
    <>
      {/* Non-intrusive in-flow notification pill for mobile and desktop.
          Placed in-flow so it NEVER overlaps or blocks any buttons or text. */}
      <div className="w-full max-w-lg mx-auto mb-3 px-2 sm:px-0">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full p-2.5 px-3.5 rounded-full border border-primary/35 bg-primary/10 hover:bg-primary/20 backdrop-blur-md flex items-center justify-between text-left gap-2 shadow-sm transition-all duration-200 active:scale-[0.98] group"
          aria-label="魔法学校の掲示板を開く"
        >
          <div className="flex items-center gap-2 overflow-hidden min-w-0">
            <span className="wax-seal !w-6 !h-6 shrink-0" aria-hidden="true">
              <Megaphone className="h-3 w-3" />
            </span>
            <div className="truncate text-xs sm:text-sm">
              <span className="font-bold text-primary mr-1.5 shrink-0 font-headline">
                【魔法掲示板】
              </span>
              <span className="text-foreground/90 font-medium truncate">
                {latestAnnouncement.title}
              </span>
            </div>
          </div>

          <span className="text-[11px] sm:text-xs font-semibold text-primary/90 group-hover:text-primary shrink-0 whitespace-nowrap pl-1">
            読む &rarr;
          </span>
        </button>
      </div>

      {/* Hogwarts Notice Board Popup Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="enchanted-parchment-dark w-[94vw] max-w-md mx-auto p-4 sm:p-6 rounded-2xl border border-primary/40 text-foreground shadow-2xl z-50">
          <DialogHeader className="text-left pb-2">
            <div className="flex items-center gap-2 text-primary">
              <div className="wax-seal" aria-hidden="true">
                <Megaphone className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="font-headline text-lg sm:text-xl text-primary font-bold">
                  大広間の魔法掲示板
                </DialogTitle>
                <DialogDescription className="text-[11px] text-muted-foreground">
                  新入生組分け速報および全寮生・教職員への最新通知
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1 py-1">
            {announcements.map((item, idx) => {
              const isSorting =
                item.isSortingNotice ||
                item.id?.startsWith("anno_sorting_") ||
                item.title?.includes("組分け速報");
              return (
                <div
                  key={item.id || idx}
                  className={`parchment p-3.5 rounded-lg space-y-1.5 relative transition-all ${
                    isSorting
                      ? "ring-2 ring-[#8a6d2f]/60 shadow-[0_0_16px_hsl(43_60%_55%/0.35)]"
                      : "opacity-95"
                  }`}
                >
                  {/* Push pin */}
                  <span
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#7a1f1f] border border-[#5a1414] shadow"
                    aria-hidden="true"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-headline font-semibold text-[#43371f] text-sm sm:text-base leading-snug flex items-center gap-1.5">
                      {isSorting ? (
                        <span className="text-[#8a6d2f]">✦</span>
                      ) : null}
                      <span>{item.title}</span>
                    </h4>
                    <span className="text-[10px] text-[#43371f]/60 shrink-0">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#43371f] whitespace-pre-wrap leading-relaxed">
                    {item.message}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-primary/25 flex flex-col gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <Lock className="h-3.5 w-3.5 text-primary/70 shrink-0" />
              <span>掲示板への新規投稿は管理者（教職員）のみ行えます</span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground h-9"
              >
                閉じる
              </Button>

              <Button
                asChild
                size="sm"
                variant="outline"
                className="text-xs border-primary/40 text-primary h-9"
              >
                <Link
                  href="/admin/announcements"
                  onClick={() => setIsOpen(false)}
                >
                  {isAdmin ? (
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
                      掲示板を管理する
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5" />
                      教職員（管理者）投稿
                    </span>
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
