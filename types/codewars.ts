export type UserResponse = {
  username: string;
  name: string;
  honor: number;
  clan: string;
  leaderboardPosition: number;
  skills: string[];
  ranks: any;
  codeChallenges: { totalAuthored: number; totalCompleted: number };
};

export type CompletedKatasResponse = {
  totalPages: number;
  totalItems: number;
  data: CodewarsKata[];
};

export type CodewarsKata = {
  id: string;
  name: string;
  slug: string;
  completedLanguages: string[];
  completedAt: string;
};

export type KataDetails = {
  [key: string]: {
    rank: {
      name: string;
      color: string;
      score: number;
    };
  };
};
