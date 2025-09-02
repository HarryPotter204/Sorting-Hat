"use client";

import Link from 'next/link';
import { Home, ListChecks, BarChart3, Users, ShieldQuestion, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'ホーム', icon: Home },
  { href: '/quiz', label: 'クイズ', icon: ShieldQuestion },
  { href: '/history', label: '履歴', icon: ListChecks },
  { href: '/leaderboard', label: 'ランキング', icon: BarChart3 },
  { href: '/admin', label: '管理者', icon: Settings },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          {/* ロゴ用のプレースホルダー */}
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform transition-transform duration-300 group-hover:rotate-12">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="font-headline text-2xl font-bold text-primary transition-colors duration-300 group-hover:text-primary/80">
            204へようこそ!
          </span>
        </Link>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                "text-sm sm:text-base px-2 sm:px-3 py-1 sm:py-2",
                pathname === item.href ? 'text-primary font-semibold border-b-2 border-primary rounded-none' : 'text-foreground/80 hover:text-primary',
                "transition-all duration-200 ease-in-out"
              )}
            >
              <Link href={item.href} className="flex items-center space-x-1.5">
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
