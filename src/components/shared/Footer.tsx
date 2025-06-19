import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-background/70 border-t border-border py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} | Soundar Balaji J | Hogwarts House Sorting. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Inspired by the Wizarding World of J.K. Rowling.
        </p>
        <div className="flex justify-center items-center gap-4 mt-3">
          <a
            href="https://github.com/devspidr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="GitHub Profile"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/soundar-balaji-j-133b691b9/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
