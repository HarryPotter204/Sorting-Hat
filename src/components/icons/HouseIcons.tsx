import React from 'react';

// Placeholder Lion Icon for Gryffindor
export const GryffindorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <title>Gryffindor Lion</title>
    <path d="M12 2l2.1 6.4H20l-5.3 4.7 1.9 7.4-6.7-4.4-6.7 4.4 1.9-7.4L4 8.4h5.9L12 2zM7 12c0 2.8 2.2 5 5 5s5-2.2 5-5-2.2-5-5-5-5 2.2-5 5z" />
    <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4 3h8" />
  </svg>
);

// Placeholder Eagle Icon for Ravenclaw
export const RavenclawIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <title>Ravenclaw Eagle</title>
    <path d="M12 3c-4.2 0-8 3.2-8 7 0 2.5 1.3 4.7 3.2 6L4 21l6.2-3.5c.5.1 1.1.2 1.8.2s1.2-.1 1.8-.2L20 21l-3.2-4.9c2-1.4 3.2-3.6 3.2-6.1 0-3.8-3.8-7-8-7zm0 4c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z" />
  </svg>
);

// Placeholder Badger Icon for Hufflepuff
export const HufflepuffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <title>Hufflepuff Badger</title>
    <path d="M4 9h16M4 15h16M9 4l3 3 3-3M9 20l3-3 3 3" />
    <rect x="2" y="7" width="20" height="10" rx="2" ry="2" />
  </svg>
);

// Placeholder Serpent Icon for Slytherin
export const SlytherinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <title>Slytherin Serpent</title>
    <path d="M15 5s-2-2-5-2-5 2-5 2v4s2 2 5 2 5-2 5-2V5zM8 11s-1 .5-1 2.5S8 16 8 16h8s1-.5 1-2.5S16 11 16 11H8zm0 5s-1 .5-1 2.5S8 21 8 21h8s1-.5 1-2.5S16 16 16 16H8z" />
  </svg>
);
