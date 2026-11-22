"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { ActivePlayer, CaseData, PlayerScore, PlayerVote } from "../types/game";
import { sounds } from "../utils/audio";
import { Trophy, Sparkles, ShieldAlert, Award, RotateCcw, Check, X, ArrowRight, HeartHandshake } from "lucide-react";

interface ResolutionModalProps {
  players: ActivePlayer[];
  gameCase: CaseData;
  votes: PlayerVote[];
  onPlayAgain: () => void;
  onNewCase: () => void;
}

export default function ResolutionModal({
  players,
  gameCase,
  votes,
  onPlayAgain,
  onNewCase,
}: ResolutionModalProps) {
  // Find culprit
  const culpritPlayer = players.find((p) => p.dossier.isCulprit) || players[0];

  // Calculate scores
  const scores: PlayerScore[] = players.map((player) => {
    const isCulprit = player.dossier.isCulprit;
    const vote = votes.find((v) => v.voterName === player.name);

    let totalPoints = 0;
    const breakdown: string[] = [];

    let accusedCorrectly = false;
    let timeCorrectly = false;
    let methodCorrectly = false;
    let culpritEscaped = false;

    if (!isCulprit && vote) {
      // 1. Accused culprit? (+2 pts)
      if (vote.accusedPlayerName === culpritPlayer.name) {
        accusedCorrectly = true;
        totalPoints += 2;
        breakdown.push("Descubrió a la culpable (+2 pts)");
      }

      // 2. Accused time? (+1 pt)
      if (vote.guessedTime === gameCase.solution.crimeTime) {
        timeCorrectly = true;
        totalPoints += 1;
        breakdown.push("Acertó la hora exacta (+1 pt)");
      }

      // 3. Accused method? (+1 pt)
      if (vote.guessedMethod === gameCase.solution.keyMethod) {
        methodCorrectly = true;
        totalPoints += 1;
        breakdown.push("Acertó el método clave (+1 pt)");
      }
    } else if (isCulprit) {
      // How many players accused the culprit?
      const votesAgainstCulprit = votes.filter((v) => v.accusedPlayerName === culpritPlayer.name).length;
      if (votesAgainstCulprit === 0) {
        culpritEscaped = true;
        totalPoints += 3;
        breakdown.push("¡Salió impune sin ningún voto en contra! (+3 pts extra)");
      } else {
        breakdown.push(`Recibió ${votesAgainstCulprit} votos en contra`);
      }
    }

    return {
      playerName: player.name,
      roleName: player.dossier.roleTitle,
      isCulprit,
      accusedCorrectly,
      timeCorrectly,
      methodCorrectly,
      culpritEscaped,
      totalPoints,
      breakdown,
    };
  });

  // Sort scores descending
  scores.sort((a, b) => b.totalPoints - a.totalPoints);

  // Trigger celebration on mount
  useEffect(() => {
    sounds.playRevealFanfare();

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#ec4899", "#a855f7", "#ef4444", "#ffd700"],
      });

      const timeout = setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#ec4899", "#a855f7", "#ef4444"],
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#ec4899", "#a855f7", "#ef4444"],
        });
      }, 500);

      return () => clearTimeout(timeout);
    } catch {}
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Big Culprit Reveal Header */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border-2 border-red-500 neon-glow-red text-center mb-8 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-950 text-red-300 font-black text-xs uppercase tracking-widest border border-red-500/60 mb-4 animate-pulse">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          RESOLUCIÓN OFICIAL DEL CASO
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white mb-3">
          ¡LA CULPABLE ERA{" "}
          <span className="neon-text-red uppercase">{culpritPlayer.name}</span>!
        </h1>

        <div className="inline-flex items-center gap-2 text-lg sm:text-xl font-bold text-purple-200 bg-purple-950/60 px-5 py-2 rounded-2xl border border-purple-800/80 mb-6">
          <span>{culpritPlayer.dossier.avatar}</span>
          <span>{culpritPlayer.dossier.roleTitle}</span>
        </div>

        {/* Narrative story of the solution */}
        <div className="text-left bg-black/60 p-5 sm:p-6 rounded-2xl border border-purple-800/60 max-w-2xl mx-auto space-y-4">
          <div>
            <h3 className="text-sm font-black text-pink-300 uppercase tracking-wider mb-1">
              📖 La Verdad de los Hechos
            </h3>
            <p className="text-sm text-purple-100 leading-relaxed font-medium">
              {gameCase.solution.fullStory}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-purple-900/60 text-xs">
            <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/40">
              <span className="text-purple-300 font-bold block mb-0.5">Hora Exacta:</span>
              <span className="font-mono text-white font-bold">{gameCase.solution.crimeTime}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/40">
              <span className="text-purple-300 font-bold block mb-0.5">Método Empleado:</span>
              <span className="text-white font-medium">{gameCase.solution.keyMethod}</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-red-300 block mb-1">
              🔍 Pistas Críticas que la Incriminaban:
            </span>
            <ul className="space-y-1 text-xs text-purple-200/90 list-disc list-inside">
              {gameCase.solution.criticalClues.map((clue, idx) => (
                <li key={idx}>{clue}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Leaderboard & Scores */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/60 neon-glow-pink mb-8">
        <div className="flex items-center justify-between mb-6 border-b border-purple-800/60 pb-3">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wider">
              Clasificación y Puntuaciones
            </h2>
          </div>
          <span className="text-xs text-pink-300 font-medium">
            Sistema de puntuación oficial
          </span>
        </div>

        <div className="space-y-3">
          {scores.map((sc, idx) => {
            const isWinner = idx === 0;
            const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}º`;

            return (
              <div
                key={sc.playerName}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isWinner
                    ? "bg-gradient-to-r from-yellow-950/50 via-purple-950/60 to-pink-950/50 border-yellow-500/60 shadow-lg scale-101"
                    : "bg-purple-950/30 border-purple-900/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black shrink-0 w-8 text-center">{medal}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-base">{sc.playerName}</span>
                      <span className="text-xs text-purple-300">({sc.roleName})</span>
                      {sc.isCulprit && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold border border-red-500/50">
                          CULPABLE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-purple-200/70 mt-0.5">
                      {sc.breakdown.join(" • ") || "Sin aciertos"}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-2xl font-black text-pink-400 font-mono">
                    {sc.totalPoints}
                  </span>
                  <span className="text-xs text-purple-300 ml-1">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accusations Summary Table */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/40 mb-8">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-pink-400" />
          ¿Quién votó a quién en la mesa?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {votes.map((v) => (
            <div
              key={v.voterName}
              className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 text-xs flex items-center justify-between"
            >
              <div className="font-bold text-white">{v.voterName}</div>
              <div className="text-purple-300">
                acusó a{" "}
                <strong
                  className={
                    v.accusedPlayerName === culpritPlayer.name ? "text-green-400 font-bold" : "text-red-400"
                  }
                >
                  {v.accusedPlayerName}
                </strong>
                {v.accusedPlayerName === culpritPlayer.name && " ✓"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onNewCase();
          }}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 hover:from-pink-500 hover:via-purple-500 hover:to-red-500 text-white font-black text-base uppercase tracking-wider border border-white/40 shadow-2xl neon-glow-pink hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-5 h-5" />
          <span>¡JUGAR OTRO CASO DE LOS 10!</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onPlayAgain();
          }}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 hover:text-white font-bold text-sm border border-purple-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Revancha con el mismo caso</span>
        </button>
      </div>
    </div>
  );
}
