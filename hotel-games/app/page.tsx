"use client";

import React, { useState, useEffect, useRef } from "react";
import { CaseData, PlayerCount, ActivePlayer, PlayerVote } from "./types/game";
import { CASES } from "./data/cases";
import Lobby from "./components/Lobby";
import RoleAssignment from "./components/RoleAssignment";
import GameDashboard from "./components/GameDashboard";
import VotingModal from "./components/VotingModal";
import ResolutionModal from "./components/ResolutionModal";
import RoomHost from "./components/RoomHost";
import RoomJoin from "./components/RoomJoin";
import { sounds } from "./utils/audio";
// import { useRouter } from "next/navigation"; // unused
import { Globe, Smartphone, Sparkles } from "lucide-react";

type GamePhase =
  | "home_select" // Choose between Create Room, Join Room, or Offline Mode
  | "room_host" // Creating room with QR code and code
  | "room_join" // Joining room on mobile
  | "offline_lobby" // Classic offline pass & play lobby
  | "assignment" // Showing individual QRs (offline mode)
  | "game" // In-game dashboard
  | "voting" // Final voting
  | "resolution"; // Case solution and leaderboard

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>("home_select");
  const [initialRoomCode, setInitialRoomCode] = useState<string>("");

  // Game data
  const [playerCount, setPlayerCount] = useState<PlayerCount>(7);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseData>(CASES[0]);
  const [timerDurationSeconds, setTimerDurationSeconds] = useState<number>(15 * 60);

  const [activePlayers, setActivePlayers] = useState<ActivePlayer[]>([]);
  const [votes, setVotes] = useState<PlayerVote[]>([]);

  // Room host connections ref for broadcasting events
  const peerConnectionsRef = useRef<Map<string, any>>(new Map());

  // Detect URL parameter for room auto-join (e.g. ?room=IBIZ)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const roomParam = searchParams.get("room");
      if (roomParam) {
        setInitialRoomCode(roomParam.toUpperCase());
        setPhase("room_join");
      }
    }
  }, []);

  // Host starts game from online room
  const handleStartOnlineGame = (
    roomCode: string,
    players: ActivePlayer[],
    chosenCase: CaseData,
    timerSeconds: number,
    connections: Map<string, any>
  ) => {
    peerConnectionsRef.current = connections;

    // Attach real-time listeners to each mobile connection to receive their votes
    connections.forEach((conn) => {
      conn.on("data", (data: any) => {
        if (data && data.type === "SUBMIT_VOTE" && data.vote) {
          sounds.playClick();
          setVotes((prev) => {
            const filtered = prev.filter((v) => v.voterName !== data.vote.voterName);
            return [...filtered, data.vote];
          });
        }
      });
    });

    setActivePlayers(players);
    setSelectedCase(chosenCase);
    setTimerDurationSeconds(timerSeconds);
    setVotes([]);
    setPhase("game");
  };

  // Host starts game from offline lobby
  const handleStartOfflineGame = (
    count: PlayerCount,
    names: string[],
    chosenCase: CaseData,
    timerSeconds: number
  ) => {
    setPlayerCount(count);
    setPlayerNames(names);
    setSelectedCase(chosenCase);
    setTimerDurationSeconds(timerSeconds);

    const roleConfig = chosenCase.dossiersByPlayerCount[count];
    const availableRoles = [...roleConfig.roles];
    const shuffledRoles = availableRoles.sort(() => Math.random() - 0.5);

    const assigned: ActivePlayer[] = names.map((name, idx) => {
      const roleObj = shuffledRoles[idx % shuffledRoles.length];
      return {
        id: `p_${idx + 1}`,
        name,
        roleId: roleObj.roleId,
        roleName: roleObj.roleName,
        dossier: { ...roleObj.dossier },
      };
    });

    setActivePlayers(assigned);
    setVotes([]);
    setPhase("assignment");
  };

  // Transition to voting
  const handleGoToVoting = () => {
    // If online, broadcast VOTING_STARTED to all phones
    if (peerConnectionsRef.current.size > 0) {
      const timeOptions = [
        selectedCase.solution.crimeTime,
        ...selectedCase.publicTimeline.slice(1, 4).map((t) => t.time),
      ].filter((v, i, a) => a.indexOf(v) === i);

      const methodOptions = [
        selectedCase.solution.keyMethod,
        selectedCase.progressiveClues[0]?.impactQuestion || "Aprovechó el descuido de las demás",
        selectedCase.progressiveClues[1]?.impactQuestion || "Utilizó la llave oculta de repuesto",
      ];

      peerConnectionsRef.current.forEach((conn) => {
        if (conn && conn.open) {
          conn.send({
            type: "VOTING_STARTED",
            players: activePlayers.map((p) => p.name),
            timeOptions,
            methodOptions,
          });
        }
      });
    }

    setPhase("voting");
  };

  // Finish voting and show resolution
  const handleFinishVoting = (finalVotes: PlayerVote[]) => {
    setVotes(finalVotes);

    // If online, broadcast RESOLUTION to all phones
    if (peerConnectionsRef.current.size > 0) {
      const culpritPlayer = activePlayers.find((p) => p.dossier.isCulprit) || activePlayers[0];
      peerConnectionsRef.current.forEach((conn) => {
        if (conn && conn.open) {
          conn.send({
            type: "GAME_RESOLUTION",
            culpritName: culpritPlayer.name,
            culpritRole: culpritPlayer.dossier.roleTitle,
            solutionStory: selectedCase.solution.fullStory,
            criticalClues: selectedCase.solution.criticalClues,
          });
        }
      });
    }

    setPhase("resolution");
  };

  return (
    <main className="min-h-screen flex flex-col justify-between py-4 sm:py-6 relative">

      {/* 1. Main Home Selector */}
      {phase === "home_select" && (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/40 bg-pink-950/30 text-pink-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3 neon-glow-pink">
            <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
            Juego Interactivo para Fiestas y Amigas
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white mb-3">
            EL <span className="neon-text-pink">CHIVATAZO</span>
          </h1>
          <p className="text-base sm:text-lg text-purple-200/80 max-w-xl mx-auto mb-10 font-light">
            Expedientes confidenciales, coartadas, horas exactas y traiciones. ¿Cómo queréis jugar hoy?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Mode A: Create Room (Host screen for iPad / Laptop) */}
            <div
              onClick={() => setPhase("room_host")}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/60 hover:border-pink-400 neon-glow-pink hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between text-left group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg mb-4">
                  <Globe className="w-7 h-7" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-pink-950 text-pink-300 text-[10px] font-bold uppercase mb-1">
                  Recomendado para GitHub Pages
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:neon-text-pink transition-all">
                  Crear Sala Multijugador
                </h2>
                <p className="text-xs text-purple-200/80 mt-2 leading-relaxed">
                  Muestra un <strong>código QR de sala</strong> en la tablet. Cada amiga lo escanea o escribe el código en su móvil y recibe su ficha en cuanto comience la partida.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-wider">
                <span>Crear Sala con QR</span>
                <span>→</span>
              </div>
            </div>

            {/* Mode B: Join Room (Mobile phone of player) */}
            <div
              onClick={() => setPhase("room_join")}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/60 hover:border-purple-400 neon-glow-purple hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between text-left group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-700 flex items-center justify-center text-white text-2xl shadow-lg mb-4">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-bold uppercase mb-1">
                  Para las amigas
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:neon-text-purple transition-all">
                  Unirme a una Sala
                </h2>
                <p className="text-xs text-purple-200/80 mt-2 leading-relaxed">
                  ¿Una amiga ya ha creado una sala en su tablet o pantalla? Escribe aquí el <strong>código de 4 letras</strong> para recibir tu expediente confidencial.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <span>Escribir Código de Sala</span>
                <span>→</span>
              </div>
            </div>
          </div>

          {/* Mode C: Offline Pass & Play */}
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setPhase("offline_lobby")}
              className="text-xs text-purple-300/80 hover:text-white underline cursor-pointer"
            >
              O jugar en una sola pantalla compartida (Modo Offline / Pase y Juegue)
            </button>
          </div>
        </div>
      )}

      {/* 2. Room Host (Tablet / GitHub Pages Host) */}
      {phase === "room_host" && (
        <RoomHost
          onStartOnlineGame={handleStartOnlineGame}
          onBack={() => setPhase("home_select")}
        />
      )}

      {/* 3. Room Join (Mobile Phone) */}
      {phase === "room_join" && (
        <RoomJoin
          initialRoomCode={initialRoomCode}
          onBackToMenu={() => setPhase("home_select")}
        />
      )}

      {/* 4. Offline Lobby */}
      {phase === "offline_lobby" && (
        <Lobby onStartGame={handleStartOfflineGame} />
      )}

      {/* 5. Offline Role Assignment */}
      {phase === "assignment" && (
        <RoleAssignment
          players={activePlayers}
          gameCase={selectedCase}
          timerDurationSeconds={timerDurationSeconds}
          onProceedToGame={() => setPhase("game")}
          onBackToLobby={() => setPhase("offline_lobby")}
        />
      )}

      {/* 6. Active Game Dashboard */}
      {phase === "game" && (
        <GameDashboard
          players={activePlayers}
          gameCase={selectedCase}
          timerDurationSeconds={timerDurationSeconds}
          onGoToVoting={handleGoToVoting}
        />
      )}

      {/* 7. Voting Phase */}
      {phase === "voting" && (
        <VotingModal
          players={activePlayers}
          gameCase={selectedCase}
          isOnlineMode={peerConnectionsRef.current.size > 0}
          onlineVotes={votes}
          onFinishVoting={handleFinishVoting}
          onBackToGame={() => setPhase("game")}
        />
      )}

      {/* 8. Resolution Phase */}
      {phase === "resolution" && (
        <ResolutionModal
          players={activePlayers}
          gameCase={selectedCase}
          votes={votes}
          onPlayAgain={() => {
            if (peerConnectionsRef.current.size > 0) {
              setPhase("room_host");
            } else {
              handleStartOfflineGame(playerCount, playerNames, selectedCase, timerDurationSeconds);
            }
          }}
          onNewCase={() => setPhase("home_select")}
        />
      )}

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-purple-400/50">
        🍸 EL CHIVATAZO: Expedientes Secretos • Partida interactiva para amigas
      </footer>
    </main>
  );
}
