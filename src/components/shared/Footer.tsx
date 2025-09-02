'use client';

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-background/70 border-t border-border py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} | Soundar Balaji J | ホグワーツ組分け診断。
        </p>
      </div>
    </footer>
  );
};

export default Footer;
