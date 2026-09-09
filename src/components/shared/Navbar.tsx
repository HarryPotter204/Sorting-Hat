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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "大広間", icon: Home },
  { href: "/quiz", label: "組分け", icon: ShieldQuestion },
  { href: "/history", label: "記録", icon: ListChecks },
  { href: "/leaderboard", label: "寮統計", icon: BarChart3 },
  { href: "/admin", label: "教職員", icon: Settings },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-background/90 backdrop-blur-md sticky top-0 z-40 border-b border-border/80 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" className="flex min-w-0 shrink items-center gap-2 group">
          <span className="shrink-0 font-headline text-lg font-bold tracking-wide text-primary">
            307
          </span>
          <span className="min-w-0 truncate whitespace-nowrap font-headline text-[clamp(0.7rem,3.5vw,1.25rem)] font-bold text-primary">
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
        <div className="border-t border-border/80 bg-background/95 px-3 py-2 shadow-lg backdrop-blur-md">
          <div className="container mx-auto flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
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
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2"
                  >
                    {item.icon && <item.icon className="h-4.5 w-4.5" />}
                    <span>{item.label}</span>
                  </Link>
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
