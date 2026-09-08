"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Home, ListChecks, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SortingHatIcon } from '@/components/icons/HouseIcons';

const navItems = [
  { href: '/', label: '大広間', icon: Home },
  { href: '/quiz', label: '組分け' },
  { href: '/history', label: '記録', icon: ListChecks },
  { href: '/leaderboard', label: '寮統計', icon: BarChart3 },
  { href: '/admin', label: '教職員', icon: Settings },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-background/90 backdrop-blur-md sticky top-0 z-40 border-b border-border/80 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <Image
            src="/images/hat.png"
            alt="組分け帽子"
            width={36}
            height={36}
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-headline text-lg sm:text-xl font-bold text-primary tracking-wide">
            307
          </span>
        </Link>

        <div className="flex items-center space-x-1 sm:space-x-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  "h-9 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm rounded-lg transition-all",
                  isActive 
                    ? 'text-primary font-bold bg-primary/15 border border-primary/30' 
                    : 'text-foreground/75 hover:text-primary hover:bg-primary/10'
                )}
              >
                <Link href={item.href} className="flex items-center space-x-1 sm:space-x-1.5">
                  {item.icon ? (
                    <item.icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  ) : null}
                  <span className="text-[11px] sm:text-xs md:text-sm">{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};


export default Navbar;

