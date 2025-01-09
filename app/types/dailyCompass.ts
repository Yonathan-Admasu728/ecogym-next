export interface DailyPrompt {
  id: number;
  title: string;
  body: string;
  explanation: string;
  tips: string[];
  category: string;
  userEngagement?: {
    completed: boolean;
    completedAt?: string;
    reflection?: string;
    rating?: number;
    viewedAt: string;
    expanded: boolean;
  };
}

export interface PromptCollection {
  prompts: DailyPrompt[];
  totalCount: number;
  categories: string[];
  currentPage: number;
  totalPages: number;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;
  streakHistory: {
    date: string;
    promptId: number;
    completed: boolean;
  }[];
}

export interface LoadingState {
  prompt: boolean;
  streak: boolean;
}

export interface DailyCompassState {
  currentPrompt: DailyPrompt | null;
  userStreak: UserStreak | null;
  isLoading: LoadingState;
  error: string | null;
  isInitialized: boolean;
}

export interface PromptEngagement {
  promptId: number;
  completed: boolean;
  reflection?: string;
  rating?: number;
}

export interface PromptFilters {
  category?: string;
  search?: string;
  sortBy?: 'date' | 'popularity';
}
