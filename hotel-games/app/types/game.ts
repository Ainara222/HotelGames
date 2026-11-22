export type PlayerCount = 4 | 5 | 6 | 7;

export interface TimelineItem {
  time: string;
  description: string;
  location?: string;
}

export interface PlayerDossier {
  roleTitle: string; // e.g. "La Anfitriona", "La Hermana de la Novia", "La Influencer"
  avatar: string; // emoji
  isCulprit: boolean;
  movements: {
    time: string;
    place: string;
    detail: string;
  }[];
  knownInfo: string[]; // Clues, contradictions, observations
  secretObjective: string; // Mission: prove innocence, divert attention, discover X
  suspicionNotes?: string; // Guidance on what to hide or reveal
}

export interface ProgressiveClue {
  minute: number; // e.g. 3 or 6
  title: string;
  badge: string;
  description: string;
  impactQuestion: string;
}

export interface OfficialSolution {
  culpritNameRole: string;
  crimeTime: string;
  keyMethod: string;
  fullStory: string;
  criticalClues: string[];
}

export interface CaseData {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  emoji: string;
  location: string;
  incidentTime: string;
  synopsis: string;
  publicTimeline: TimelineItem[];
  // Role templates for 4, 5, 6, and 7 players
  dossiersByPlayerCount: {
    [key in PlayerCount]: {
      roles: {
        roleId: string;
        roleName: string;
        isCulprit: boolean;
        dossier: PlayerDossier;
      }[];
    };
  };
  progressiveClues: ProgressiveClue[];
  interrogationQuestions: string[];
  solution: OfficialSolution;
}

export interface ActivePlayer {
  id: string;
  name: string;
  roleId: string;
  roleName: string;
  dossier: PlayerDossier;
}

export interface PlayerVote {
  voterName: string;
  accusedPlayerName: string;
  guessedTime: string;
  guessedMethod: string;
}

export interface PlayerScore {
  playerName: string;
  roleName: string;
  isCulprit: boolean;
  accusedCorrectly: boolean;
  timeCorrectly: boolean;
  methodCorrectly: boolean;
  culpritEscaped: boolean;
  totalPoints: number;
  breakdown: string[];
}
