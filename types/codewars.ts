export type UserResponse = {
  username: string;
  name: string;
  honor: number;
  clan: string;
  leaderboardPosition: number;
  skills: string[];
  ranks: unknown;
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
