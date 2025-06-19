import type { House, HouseName, QuizQuestion } from './types';
import { GryffindorIcon, RavenclawIcon, HufflepuffIcon, SlytherinIcon } from '@/components/icons/HouseIcons';

export const HOGWARTS_HOUSES: Record<HouseName, House> = {
  Gryffindor: {
    name: 'Gryffindor',
    colors: { primaryHex: '#7F0909', secondaryHex: '#FFD700', primaryVar: '--gryffindor-primary', secondaryVar: '--gryffindor-secondary' },
    crest: '/crests/gryffindor.png', // Placeholder, will use IconComponent or actual image later
    values: ['Courage', 'Bravery', 'Nerve', 'Chivalry'],
    founder: 'Godric Gryffindor',
    animal: 'Lion',
    element: 'Fire',
    ghost: 'Nearly Headless Nick',
    commonRoom: 'Gryffindor Tower',
    notableAlumni: ['Harry Potter', 'Hermione Granger', 'Ron Weasley', 'Albus Dumbledore'],
    quote: "You might belong in Gryffindor, Where dwell the brave at heart, Their daring, nerve, and chivalry Set Gryffindors apart.",
    IconComponent: GryffindorIcon,
    dataAiHint: 'lion shield'
  },
  Ravenclaw: {
    name: 'Ravenclaw',
    colors: { primaryHex: '#0E1A40', secondaryHex: '#946B2D', primaryVar: '--ravenclaw-primary', secondaryVar: '--ravenclaw-secondary' }, // Using a bronze-like hex for secondary
    crest: '/crests/ravenclaw.png',
    values: ['Intelligence', 'Learning', 'Wisdom', 'Wit'],
    founder: 'Rowena Ravenclaw',
    animal: 'Eagle',
    element: 'Air',
    ghost: 'The Grey Lady',
    commonRoom: 'Ravenclaw Tower',
    notableAlumni: ['Luna Lovegood', 'Filius Flitwick', 'Gilderoy Lockhart', 'Cho Chang'],
    quote: "Or yet in wise old Ravenclaw, If you've a ready mind, Where those of wit and learning, Will always find their kind.",
    IconComponent: RavenclawIcon,
    dataAiHint: 'eagle shield'
  },
  Hufflepuff: {
    name: 'Hufflepuff',
    colors: { primaryHex: '#EEE117', secondaryHex: '#000000', primaryVar: '--hufflepuff-primary', secondaryVar: '--hufflepuff-secondary' },
    crest: '/crests/hufflepuff.png',
    values: ['Hard Work', 'Patience', 'Justice', 'Loyalty'],
    founder: 'Helga Hufflepuff',
    animal: 'Badger',
    element: 'Earth',
    ghost: 'The Fat Friar',
    commonRoom: 'Hufflepuff Basement',
    notableAlumni: ['Newt Scamander', 'Cedric Diggory', 'Nymphadora Tonks', 'Pomona Sprout'],
    quote: "You might belong in Hufflepuff, Where they are just and loyal, Those patient Hufflepuffs are true And unafraid of toil.",
    IconComponent: HufflepuffIcon,
    dataAiHint: 'badger shield'
  },
  Slytherin: {
    name: 'Slytherin',
    colors: { primaryHex: '#2A623D', secondaryHex: '#AAAAAA', primaryVar: '--slytherin-primary', secondaryVar: '--slytherin-secondary' }, // Using a silver-like hex
    crest: '/crests/slytherin.png',
    values: ['Ambition', 'Cunning', 'Leadership', 'Resourcefulness'],
    founder: 'Salazar Slytherin',
    animal: 'Serpent',
    element: 'Water',
    ghost: 'The Bloody Baron',
    commonRoom: 'Slytherin Dungeon',
    notableAlumni: ['Severus Snape', 'Draco Malfoy', 'Lord Voldemort', 'Bellatrix Lestrange'],
    quote: "Or perhaps in Slytherin, You'll make your real friends, Those cunning folk use any means To achieve their ends.",
    IconComponent: SlytherinIcon,
    dataAiHint: 'serpent shield'
  },
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    text: 'Dawn or Dusk?',
    options: [
      { id: 'q1o1', text: 'Dawn', houseAffinity: { Gryffindor: 2, Ravenclaw: 1 } },
      { id: 'q1o2', text: 'Dusk', houseAffinity: { Slytherin: 2, Hufflepuff: 1 } },
    ],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'sunrise sunset'
  },
  {
    id: 'q2',
    text: 'Which path tempts you most?',
    options: [
      { id: 'q2o1', text: 'The wide, sunny, grassy path', houseAffinity: { Hufflepuff: 3 } },
      { id: 'q2o2', text: 'The narrow, dark, lantern-lit alley', houseAffinity: { Slytherin: 3 } },
      { id: 'q2o3', text: 'The twisting, leaf-strewn path through woods', houseAffinity: { Gryffindor: 3 } },
      { id: 'q2o4', text: 'The cobbled street lined with ancient buildings', houseAffinity: { Ravenclaw: 3 } },
    ],
  },
  {
    id: 'q3',
    text: 'What kind of instrument most pleases your ear?',
    options: [
      { id: 'q3o1', text: 'Violin', houseAffinity: { Slytherin: 2, Ravenclaw: 1 } },
      { id: 'q3o2', text: 'Trumpet', houseAffinity: { Gryffindor: 2 } },
      { id: 'q3o3', text: 'Piano', houseAffinity: { Ravenclaw: 2, Hufflepuff: 1 } },
      { id: 'q3o4', text: 'Drums', houseAffinity: { Hufflepuff: 1, Gryffindor: 1 } },
    ],
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'musical instruments'
  },
  {
    id: 'q4',
    text: 'You are walking through a magical garden. Which of these would you be most curious to investigate?',
    options: [
      { id: 'q4o1', text: 'The silver-leafed tree bearing golden apples', houseAffinity: { Gryffindor: 2, Slytherin: 1 } },
      { id: 'q4o2', text: 'The fat red toadstools that appear to be talking to each other', houseAffinity: { Hufflepuff: 2, Ravenclaw: 1 } },
      { id: 'q4o3', text: 'The bubbling pool whose depths are unusually dark', houseAffinity: { Slytherin: 2, Ravenclaw: 1 } },
      { id: 'q4o4', text: 'The statue of an old wizard with a strangely twinkling eye', houseAffinity: { Ravenclaw: 2, Gryffindor: 1 } },
    ],
  },
  {
    id: 'q5',
    text: 'One of your housemates has cheated in a Hogwarts exam by using a Self-Spelling Quill. Now he has come top of the class in Charms, beating you into second place. Professor Flitwick is suspicious of what happened. He draws you to one side after his lesson and asks you whether or not your classmate used a forbidden quill. What do you do?',
    options: [
      { id: 'q5o1', text: 'Tell Professor Flitwick the truth. If your classmate is prepared to win by cheating, he deserves to be found out.', houseAffinity: { Gryffindor: 2, Ravenclaw: 1 } },
      { id: 'q5o2', text: 'Lie and say you don’t know (but hope that somebody else tells Professor Flitwick the truth).', houseAffinity: { Hufflepuff: 2 } },
      { id: 'q5o3', text: 'Tell Professor Flitwick that he ought to ask your classmate (and resolve to tell your classmate that if he doesn’t tell the truth, you will).', houseAffinity: { Slytherin: 2, Gryffindor: 1 } },
      { id: 'q5o4', text: 'You would not wait to be asked to tell Professor Flitwick the truth. If you knew that somebody was using a forbidden quill, you would tell the Professor before the exam started.', houseAffinity: { Ravenclaw: 2, Slytherin: -1 } }, // Slytherin might see this as snitching without personal gain
    ],
  },
];

export const HOUSE_NAMES_ARRAY: HouseName[] = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'];
