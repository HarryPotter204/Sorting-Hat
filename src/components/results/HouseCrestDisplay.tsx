
"use client";

import Image from 'next/image';
import { House } from '@/lib/types';
import { cn } from '@/lib/utils';

interface HouseCrestDisplayProps {
  house: House;
  size?: number; // Approx size in pixels
  className?: string;
}

export const HouseCrestDisplay: React.FC<HouseCrestDisplayProps> = ({ house, size = 200, className }) => {
  const Icon = house.IconComponent;

  return (
    <div
      className={cn(
        "relative rounded-full p-4 shadow-2xl animate-wand-flourish",
        `bg-gradient-to-br from-[hsl(var(--house-primary)_/_0.7)] to-[hsl(var(--house-secondary)_/_0.7)]`,
        className
      )}
      style={{
        width: size,
        height: size,
        '--house-primary': `var(${house.colors.primaryVar})`,
        '--house-secondary': `var(${house.colors.secondaryVar})`,
       } as React.CSSProperties}
    >
      <div className="flex items-center justify-center w-full h-full bg-background/30 rounded-full backdrop-blur-sm">
         <Image
            src={house.crest}
            alt={`${house.name} Crest`}
            width={size > 40 ? size - 40 : 50} // Ensure width is positive
            height={size > 40 ? size - 40 : 50} // Ensure height is positive
            data-ai-hint={house.dataAiHint}
            className="object-contain"
          />
      </div>
       {/* Subtle glow effect */}
      <div
        className="absolute inset-0 rounded-full opacity-50 animate-glow"
        style={{boxShadow: `0 0 20px 5px hsl(var(--house-primary)), 0 0 30px 10px hsl(var(--house-secondary)_/_0.7)`}}
      />
    </div>
  );
};
