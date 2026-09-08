"use client";

import { useEffect, useState } from "react";
import { Megaphone, Lock, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { getStoredAnnouncements, Announcement, isAdminAuthenticated } from "@/lib/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const list = getStoredAnnouncements();
    setAnnouncements(list);
    setIsAdmin(isAdminAuthenticated());
  }, []);

  if (announcements.length === 0) return null;

  const latestAnnouncement = announcements[0];

  return (
    <>
      <div className="w-full max-w-4xl mx-auto mb-2 px-4">
        <div 
          onClick={() => setIsOpen(true)}
          className="p-3 px-4 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/15 backdrop-blur-sm flex items-center justify-between text-left gap-3 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Megaphone className="h-4 w-4 text-primary shrink-0 animate-bounce" />
            <div className="truncate text-xs sm:text-sm">
              <span className="font-semibold text-primary mr-2">【ホグワーツ掲示板】</span>
              <span className="text-foreground/90">{latestAnnouncement.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              掲示板を読む &rarr;
            </span>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="enchanted-parchment-dark max-w-lg border border-primary/40 text-foreground">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <Megaphone className="h-5 w-5" />
              <DialogTitle className="font-headline text-xl text-primary">
                ホグワーツ大広間 魔法掲示板
              </DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground text-xs">
              全寮生および教職員に向けた最新の公式通知です。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {announcements.map((item, idx) => (
              <div 
                key={item.id || idx}
                className="p-3.5 rounded-lg bg-background/50 border border-primary/20 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-headline font-semibold text-primary text-base">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-muted-foreground">
                    {item.date}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {item.message}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <Lock className="h-3.5 w-3.5 text-yellow-500/80 shrink-0" />
              <span>掲示板への新規投稿は管理者（教職員）のみ行えます</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button asChild size="sm" variant="outline" className="text-xs border-primary/40 text-primary">
                <Link href="/admin/announcements" onClick={() => setIsOpen(false)}>
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

