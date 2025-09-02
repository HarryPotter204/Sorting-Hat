import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-background/70 border-t border-border py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} | Soundar Balaji J | ホグワーツ組分け診断。全著作権所有。
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          J.K.ローリングの魔法の世界に着想を得ています。
        </p>
        <div className="flex justify-center items-center gap-4 mt-3">
            <FaGithub size={20} />
          </a>
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
