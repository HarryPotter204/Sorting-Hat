"use client";

import Link from 'next/link';
import { Home, ListChecks, BarChart3, Settings } from 'lucide-react';
import { SortingHatIcon } from '@/components/icons/HouseIcons';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'ホーム', icon: Home },
  { href: '/quiz', label: '組分け帽子', icon: SortingHatIcon },
  { href: '/history', label: '履歴', icon: ListChecks },
  { href: '/leaderboard', label: 'ランキング', icon: BarChart3 },
  { href: '/admin', label: '管理者', icon: Settings },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="p-1.5 rounded-lg bg-primary/15 border border-primary/40 group-hover:scale-105 transition-transform duration-300">
            <SortingHatIcon className="w-6 h-6 text-primary" />
          </div>
          <span className="font-headline text-xl sm:text-2xl font-bold text-primary transition-colors duration-300 group-hover:text-primary/80">
            組分け帽子
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
