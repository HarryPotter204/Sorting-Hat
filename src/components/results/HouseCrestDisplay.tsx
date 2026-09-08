"use client";

import Image from 'next/image';
import { House } from '@/lib/types';
import { cn } from '@/lib/utils';

interface HouseCrestDisplayProps {
  house: House;
  size?: number; // ピクセルでの概算サイズ
  className?: string;
}

export const HouseCrestDisplay: React.FC<HouseCrestDisplayProps> = ({ house, size = 200, className }) => {
  const Icon = house.IconComponent;

  return (
    <div
      className={cn(
        "relative rounded-full p-3 sm:p-4 shadow-2xl animate-wand-flourish max-w-[85vw] mx-auto",
        `bg-gradient-to-br from-[hsl(var(--house-primary)_/_0.7)] to-[hsl(var(--house-secondary)_/_0.7)]`,
        className
      )}
      style={{
        maxWidth: size,
        maxHeight: size,
        width: '100%',
        aspectRatio: '1/1',
        '--house-primary': `var(${house.colors.primaryVar})`,
        '--house-secondary': `var(${house.colors.secondaryVar})`,
       } as React.CSSProperties}
    >
      <div className="flex items-center justify-center w-full h-full bg-background/30 rounded-full backdrop-blur-sm p-2">
         <Image
            src={house.crest}
            alt={`${house.name}の紋章`}
            width={size > 40 ? size - 40 : 50}
            height={size > 40 ? size - 40 : 50}
            data-ai-hint={house.dataAiHint}
            className="object-contain w-full h-full max-w-[85%] max-h-[85%]"
          />
      </div>
       {/* 微妙な光の効果 */}
      <div
        className="absolute inset-0 rounded-full opacity-50 animate-glow pointer-events-none"
        style={{boxShadow: `0 0 20px 5px hsl(var(--house-primary)), 0 0 30px 10px hsl(var(--house-secondary)_/_0.7)`}}
      />
    </div>
  );
};

