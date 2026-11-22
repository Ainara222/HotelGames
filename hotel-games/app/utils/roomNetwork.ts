import { ActivePlayer, CaseData, PlayerVote, PlayerScore } from "../types/game";

// Generate a random 4-character room code (e.g. "IBZ4", "CHIV", "ROMA")
export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export type NetworkMessage =
  | { type: "JOIN"; playerName: string }
  | { type: "JOIN_ACCEPTED"; roomCode: string; playersCount: number }
  | {
      type: "GAME_STARTED";
      playerName: string;
      dossier: any;
      gameCase: {
        id: number;
        title: string;
        location: string;
        incidentTime: string;
        synopsis: string;
        publicTimeline: any[];
      };
    }
  | { type: "CLUE_UNLOCKED"; clue: any }
  | {
      type: "VOTING_STARTED";
      players: string[];
      timeOptions: string[];
      methodOptions: string[];
    }
  | { type: "SUBMIT_VOTE"; vote: PlayerVote }
  | {
      type: "GAME_RESOLUTION";
      culpritName: string;
      culpritRole: string;
      solutionStory: string;
      criticalClues: string[];
      scores: PlayerScore[];
    };
