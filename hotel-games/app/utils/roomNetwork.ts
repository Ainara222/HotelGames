import { ActivePlayer, CaseData, PlayerVote, PlayerScore } from "../types/game";

export const PEER_CONFIG = {
  debug: 1,
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:19302" },
      { urls: "stun:stun.cloudflare.com:3478" },
      { urls: "stun:openrelay.metered.ca:80" },
      {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443?transport=tcp",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
    ],
    iceCandidatePoolSize: 10,
  },
};

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
  | { type: "PING" }
  | { type: "PONG" }
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
