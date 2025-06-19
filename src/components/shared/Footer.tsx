import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-background/70 border-t border-border py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Hogwarts House Sorting. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Inspired by the Wizarding World of J.K. Rowling.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
