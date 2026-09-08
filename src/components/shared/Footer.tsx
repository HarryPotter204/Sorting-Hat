'use client';

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-background/70 border-t border-border py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-xs sm:text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} | ミズノナガルと秘宝の剣 | 307
        </p>
      </div>
    </footer>
  );
};


export default Footer;
