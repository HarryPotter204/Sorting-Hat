'use client';

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[hsl(231_40%_5%/0.7)] border-t border-primary/20 py-6 text-center backdrop-blur-sm">
      <div className="container mx-auto px-4 space-y-1">
        <div className="ornament-rule opacity-60" aria-hidden="true">
          <span className="text-[9px]">✦</span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} | ミズノナガルと秘宝の剣 | 307
        </p>
      </div>
    </footer>
  );
};


export default Footer;
