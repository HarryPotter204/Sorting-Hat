export type HouseName = 'Gryffindor' | 'Ravenclaw' | 'Hufflepuff' | 'Slytherin';

export interface House {
  name: string; // Japanese display name (e.g. 'グリフィンドール')
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

export interface QuizOption {
  id: string;
  text: string;
  // Scores how much this option contributes to each house
  houseAffinity: Partial<Record<HouseName, number>>;
  // Reason text shown on the result page for why this option was chosen
  reason: string;
  // Branch: when this option is selected, go to this question next
  nextQuestionId?: string;
  // Whether this option is enabled (for future management screen)
  isActive?: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  imageUrl?: string; // Optional image for the question
  dataAiHint?: string; // AI hint for image if placeholder is used
  // Category for management/filtering (e.g. 'personality', 'friendship')
  category?: string;
  // Display order when using fixed order (for future management screen)
  order?: number;
  // Whether this question is enabled (for future management screen)
  isActive?: boolean;
  // Version of the question for content refresh management
  version?: number;
  // ISO date string when created (for future management screen)
  createdAt?: string;
  // ISO date string when last updated (for future management screen)
  updatedAt?: string;
}

// Order of houses used in the admin management screen
export const HOUSE_NAMES: HouseName[] = [
  "Gryffindor",
  "Ravenclaw",
  "Hufflepuff",
  "Slytherin",
];

// Draft type for the admin edit form (not persisted directly)
export type QuizOptionDraft = {
  id: string;
  text: string;
  houseAffinity: Record<HouseName, number>;
  reason: string;
};

export type QuizQuestionDraft = {
  text: string;
  isActive: boolean;
  options: QuizOptionDraft[];
};

export interface UserQuizResult {
  id: string;
  userId: string; // Assuming user authentication in a full app
  nickname?: string;
  houseName: HouseName;
  date: string; // ISO date string
  scores: Partial<Record<HouseName, number>>;
}

// Bulletin board auto-posting settings stored server-side in Firestore
// (settings/announcementAutomation). Timestamps are ISO strings when
// returned through the admin API.
export interface AnnouncementAutomationSettings {
  enabled: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
  lastRunAt: string | null;
  nextRunAt: string | null;
  lastPostId: string | null;
}

// Represents the state of the quiz
export interface QuizState {
  nickname?: string;
  currentQuestionIndex: number;
  answers: Record<string, string>; // questionId: optionId
  scores: Partial<Record<HouseName, number>>;
  isCompleted: boolean;
  sortedHouse: HouseName | null;
}

