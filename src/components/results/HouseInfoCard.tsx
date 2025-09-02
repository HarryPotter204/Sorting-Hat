"use client";

import { House } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShieldCheck, Star, Gem } from 'lucide-react'; // Gemは創設者用
import { cn } from '@/lib/utils';

interface HouseInfoCardProps {
  house: House;
}

export const HouseInfoCard: React.FC<HouseInfoCardProps> = ({ house }) => {
  return (
    <Card className={cn("w-full max-w-md enchanted-parchment-dark shadow-xl", `theme-${house.name.toLowerCase()}`)}>
      <CardHeader className="text-center pb-4 bg-[hsl(var(--house-primary)_/_0.2)]">
        <CardTitle className="font-headline text-3xl text-[hsl(var(--house-primary))]">{house.name}</CardTitle>
        <CardDescription className="text-[hsl(var(--house-secondary))] font-medium">"{house.quote}"</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="h-6 w-6 text-[hsl(var(--house-primary))]" />
          <div>
            <h4 className="font-semibold text-foreground">価値観</h4>
            <p className="text-sm text-muted-foreground">{house.values.join(', ')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <house.IconComponent className="h-6 w-6 text-[hsl(var(--house-primary))]" />
          <div>
            <h4 className="font-semibold text-foreground">象徴 & 元素</h4>
            <p className="text-sm text-muted-foreground">{house.animal} ({house.element || '神秘的'})</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Gem className="h-6 w-6 text-[hsl(var(--house-primary))]" />
          <div>
            <h4 className="font-semibold text-foreground">創設者 & 幽霊</h4>
            <p className="text-sm text-muted-foreground">{house.founder} / {house.ghost}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-[hsl(var(--house-primary))]" />
          <div>
            <h4 className="font-semibold text-foreground">著名な卒業生</h4>
            <p className="text-sm text-muted-foreground">{house.notableAlumni.slice(0, 3).join(', ')}{house.notableAlumni.length > 3 ? '、他' : ''}。</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Star className="h-6 w-6 text-[hsl(var(--house-primary))]" />
          <div>
            <h4 className="font-semibold text-foreground">談話室</h4>
            <p className="text-sm text-muted-foreground">{house.commonRoom}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
