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

import { QuizQuestion, HouseName } from './types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    text: "Which trait defines you best?",
    options: [
      { id: 'q1o1', text: "Bravery", houseAffinity: { Gryffindor: 2 } },
      { id: 'q1o2', text: "Ambition", houseAffinity: { Slytherin: 2 } },
      { id: 'q1o3', text: "Intelligence", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q1o4', text: "Loyalty", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q2',
    text: "How do you handle challenges?",
    options: [
      { id: 'q2o1', text: "Face them head-on", houseAffinity: { Gryffindor: 2 } },
      { id: 'q2o2', text: "Find clever shortcuts", houseAffinity: { Slytherin: 2 } },
      { id: 'q2o3', text: "Research solutions", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q2o4', text: "Ask for help", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q3',
    text: "Your ideal weekend involves:",
    options: [
      { id: 'q3o1', text: "Adventure sports", houseAffinity: { Gryffindor: 2 } },
      { id: 'q3o2', text: "Strategic games", houseAffinity: { Slytherin: 2 } },
      { id: 'q3o3', text: "Reading/learning", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q3o4', text: "Helping others", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q4',
    text: "What's your leadership style?",
    options: [
      { id: 'q4o1', text: "Bold and decisive", houseAffinity: { Gryffindor: 2 } },
      { id: 'q4o2', text: "Calculated and goal-oriented", houseAffinity: { Slytherin: 2 } },
      { id: 'q4o3', text: "Analytical and fair", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q4o4', text: "Supportive and inclusive", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q5',
    text: "Choose a superpower:",
    options: [
      { id: 'q5o1', text: "Super strength", houseAffinity: { Gryffindor: 2 } },
      { id: 'q5o2', text: "Invisibility", houseAffinity: { Slytherin: 2 } },
      { id: 'q5o3', text: "Teleportation", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q5o4', text: "Healing", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q6',
    text: "Your friends would describe you as:",
    options: [
      { id: 'q6o1', text: "Fearless", houseAffinity: { Gryffindor: 2 } },
      { id: 'q6o2', text: "Resourceful", houseAffinity: { Slytherin: 2 } },
      { id: 'q6o3', text: "Wise", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q6o4', text: "Kind", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q7',
    text: "When working in a team, you:",
    options: [
      { id: 'q7o1', text: "Take charge", houseAffinity: { Gryffindor: 2 } },
      { id: 'q7o2', text: "Find the most efficient path", houseAffinity: { Slytherin: 2 } },
      { id: 'q7o3', text: "Ensure logical solutions", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q7o4', text: "Keep everyone united", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q8',
    text: "Your approach to rules is:",
    options: [
      { id: 'q8o1', text: "Break them if justified", houseAffinity: { Gryffindor: 2 } },
      { id: 'q8o2', text: "Bend them to your advantage", houseAffinity: { Slytherin: 2 } },
      { id: 'q8o3', text: "Understand their purpose", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q8o4', text: "Follow them diligently", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q9',
    text: "Your greatest strength is:",
    options: [
      { id: 'q9o1', text: "Courage", houseAffinity: { Gryffindor: 2 } },
      { id: 'q9o2', text: "Determination", houseAffinity: { Slytherin: 2 } },
      { id: 'q9o3', text: "Creativity", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q9o4', text: "Empathy", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q10',
    text: "What motivates you most?",
    options: [
      { id: 'q10o1', text: "Overcoming obstacles", houseAffinity: { Gryffindor: 2 } },
      { id: 'q10o2', text: "Achieving success", houseAffinity: { Slytherin: 2 } },
      { id: 'q10o3', text: "Gaining knowledge", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q10o4', text: "Building relationships", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q11',
    text: "Your dream vacation is:",
    options: [
      { id: 'q11o1', text: "Mountain climbing", houseAffinity: { Gryffindor: 2 } },
      { id: 'q11o2', text: "Luxury resort", houseAffinity: { Slytherin: 2 } },
      { id: 'q11o3', text: "Cultural exploration", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q11o4', text: "Volunteer trip", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q12',
    text: "In a crisis, you:",
    options: [
      { id: 'q12o1', text: "Act immediately", houseAffinity: { Gryffindor: 2 } },
      { id: 'q12o2', text: "Assess the best outcome for yourself", houseAffinity: { Slytherin: 2 } },
      { id: 'q12o3', text: "Analyze the situation", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q12o4', text: "Ensure everyone's safe", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q13',
    text: "Your favorite subject would be:",
    options: [
      { id: 'q13o1', text: "Physical Education", houseAffinity: { Gryffindor: 2 } },
      { id: 'q13o2', text: "Economics", houseAffinity: { Slytherin: 2 } },
      { id: 'q13o3', text: "Science", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q13o4', text: "Psychology", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q14',
    text: "How do you make decisions?",
    options: [
      { id: 'q14o1', text: "Go with your gut", houseAffinity: { Gryffindor: 2 } },
      { id: 'q14o2', text: "Weigh pros and cons", houseAffinity: { Slytherin: 2 } },
      { id: 'q14o3', text: "Research thoroughly", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q14o4', text: "Consult friends/family", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q15',
    text: "Your ideal pet is:",
    options: [
      { id: 'q15o1', text: "Large dog", houseAffinity: { Gryffindor: 1 } },
      { id: 'q15o2', text: "Exotic reptile", houseAffinity: { Slytherin: 1 } },
      { id: 'q15o3', text: "Parrot", houseAffinity: { Ravenclaw: 1 } },
      { id: 'q15o4', text: "Golden retriever", houseAffinity: { Hufflepuff: 1 } }
    ]
  },
  {
    id: 'q16',
    text: "Your communication style is:",
    options: [
      { id: 'q16o1', text: "Direct and bold", houseAffinity: { Gryffindor: 2 } },
      { id: 'q16o2', text: "Persuasive", houseAffinity: { Slytherin: 2 } },
      { id: 'q16o3', text: "Precise", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q16o4', text: "Warm and friendly", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q17',
    text: "Your greatest fear is:",
    options: [
      { id: 'q17o1', text: "Being powerless", houseAffinity: { Gryffindor: 2 } },
      { id: 'q17o2', text: "Being ordinary", houseAffinity: { Slytherin: 2 } },
      { id: 'q17o3', text: "Being ignorant", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q17o4', text: "Being alone", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q18',
    text: "Your role in a friend group is:",
    options: [
      { id: 'q18o1', text: "The protector", houseAffinity: { Gryffindor: 2 } },
      { id: 'q18o2', text: "The strategist", houseAffinity: { Slytherin: 2 } },
      { id: 'q18o3', text: "The advisor", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q18o4', text: "The peacemaker", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q19',
    text: "What's your learning style?",
    options: [
      { id: 'q19o1', text: "Hands-on experience", houseAffinity: { Gryffindor: 2 } },
      { id: 'q19o2', text: "Competitive environments", houseAffinity: { Slytherin: 2 } },
      { id: 'q19o3', text: "Independent study", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q19o4', text: "Group collaboration", houseAffinity: { Hufflepuff: 2 } }
    ]
  },
  {
    id: 'q20',
    text: "Your life motto would be:",
    options: [
      { id: 'q20o1', text: "Fortune favors the bold", houseAffinity: { Gryffindor: 2 } },
      { id: 'q20o2', text: "The ends justify the means", houseAffinity: { Slytherin: 2 } },
      { id: 'q20o3', text: "Knowledge is power", houseAffinity: { Ravenclaw: 2 } },
      { id: 'q20o4', text: "Kindness changes everything", houseAffinity: { Hufflepuff: 2 } }
    ]
  }
];

export const HOUSE_NAMES_ARRAY: HouseName[] = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'];
