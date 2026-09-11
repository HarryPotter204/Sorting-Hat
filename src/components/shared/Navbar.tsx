"use client";

import Link from "next/link";
import {
  Home,
  ListChecks,
  BarChart3,
  Settings,
  Menu,
  X,
  ShieldQuestion,
  Gamepad2,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const MINIGAME_URL = "https://harrypotter307-game.vercel.app/";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  external?: boolean;
};

const navItems: NavItem[] = [
  { href: "/", label: "大広間", icon: Home },
  { href: "/quiz", label: "組分け", icon: ShieldQuestion },
  { href: "/history", label: "記録", icon: ListChecks },
  { href: "/leaderboard", label: "寮統計", icon: BarChart3 },
  { href: MINIGAME_URL, label: "ミニゲーム", icon: Gamepad2, external: true },
  { href: "/admin", label: "教職員", icon: Settings },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-[hsl(231_40%_6%/0.78)] backdrop-blur-md sticky top-0 z-40 border-b border-primary/25 shadow-[0_4px_20px_hsl(230_45%_3%/0.5)]">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" className="flex min-w-0 shrink items-center gap-2 group">
          {/* Magical school crest emblem */}
          <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-primary/50 bg-primary/10 text-primary transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_10px_hsl(var(--primary)/0.4)]">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              aria-hidden="true"
            >
              {/* Shield crest with star */}
              <path d="M12 2.5l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10v-6l8-3z" />
              <path d="M12 7.5l1.2 2.5 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4L12 7.5z" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="min-w-0 truncate whitespace-nowrap font-headline text-[clamp(0.7rem,3.5vw,1.25rem)] font-bold text-primary tracking-wide transition-colors group-hover:text-primary/90">
            ミズノナガルと秘宝の剣
          </span>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="h-10 w-10 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-primary/25 bg-[hsl(231_40%_6%/0.92)] px-3 py-2 shadow-lg backdrop-blur-md">
          <div className="container mx-auto flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                !item.external &&
                (pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href)));
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    "h-10 justify-start rounded-lg px-3 text-sm transition-all",
                    isActive
                      ? "text-primary font-bold bg-primary/15 border border-primary/30"
                      : "text-foreground/75 hover:text-primary hover:bg-primary/10",
                  )}
                >
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2"
                      aria-label={`${item.label}（外部サイト・新しいタブで開きます）`}
                    >
                      <item.icon className="h-4.5 w-4.5" />
                      <span>{item.label}</span>
                      <ExternalLink
                        className="ml-auto h-3.5 w-3.5 opacity-50"
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2"
                    >
                      {item.icon && <item.icon className="h-4.5 w-4.5" />}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
