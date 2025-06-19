export type HouseName = 'Gryffindor' | 'Ravenclaw' | 'Hufflepuff' | 'Slytherin';

export interface House {
  name: HouseName;
  colors: {
    primaryHex: string;
    secondaryHex: string;
    primaryVar: string; // CSS variable name e.g. '--gryffindor-primary'
    secondaryVar: string; // CSS variable name
  };
  crest: string; // path to static image or placeholder component
  values: string[];
  founder: string;
  animal: string;
  element?: string;
  ghost?: string;
  commonRoom?: string;
  notableAlumni: string[];
  quote: string;
  IconComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  dataAiHint: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    // Scores how much this option contributes to each house
    houseAffinity: Partial<Record<HouseName, number>>;
  }[];
  imageUrl?: string; // Optional image for the question
  dataAiHint?: string; // AI hint for image if placeholder is used
}

export interface UserQuizResult {
  id: string;
  userId: string; // Assuming user authentication in a full app
  houseName: HouseName;
  date: string; // ISO date string
  scores: Partial<Record<HouseName, number>>;
}

// Represents the state of the quiz
export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, string>; // questionId: optionId
  scores: Partial<Record<HouseName, number>>;
  isCompleted: boolean;
  sortedHouse: HouseName | null;
}
