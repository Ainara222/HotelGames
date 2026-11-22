"use client";

import React, { useState } from "react";
import { ActivePlayer, CaseData, PlayerVote } from "../types/game";
import { sounds } from "../utils/audio";
import { Vote, CheckCircle2, UserCheck, ShieldAlert, Clock, Smartphone, AlertCircle } from "lucide-react";

interface VotingModalProps {
  players: ActivePlayer[];
  gameCase: CaseData;
  isOnlineMode?: boolean;
  onlineVotes?: PlayerVote[];
  onFinishVoting: (votes: PlayerVote[]) => void;
  onBackToGame: () => void;
}

export default function VotingModal({
  players,
  gameCase,
  isOnlineMode = false,
  onlineVotes = [],
  onFinishVoting,
  onBackToGame,
}: VotingModalProps) {
  const [currentVoterIndex, setCurrentVoterIndex] = useState<number>(0);
  const [offlineVotes, setOfflineVotes] = useState<PlayerVote[]>([]);
  const [showManualFallback, setShowManualFallback] = useState<boolean>(false);

  // Current vote form fields for offline/manual mode
  const [selectedAccused, setSelectedAccused] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  const currentVoter = players[currentVoterIndex];
  const isLastVoter = currentVoterIndex === players.length - 1;

  // Time options generated based on public timeline
  const timeOptions = [
    gameCase.solution.crimeTime,
    ...gameCase.publicTimeline.slice(1, 4).map((t) => t.time),
  ].filter((v, i, a) => a.indexOf(v) === i);

  // Method / clue options
  const methodOptions = [
    gameCase.solution.keyMethod,
    gameCase.progressiveClues[0]?.impactQuestion || "Aprovechó el descuido en la terraza",
    gameCase.progressiveClues[1]?.impactQuestion || "Utilizó una llave oculta de repuesto",
  ];

  // ==========================================
  // ONLINE LIVE VOTING TRACKER (EACH FRIEND VOTES ON HER OWN PHONE)
  // ==========================================
  if (isOnlineMode && !showManualFallback) {
    const allHaveVoted = players.length > 0 && players.every((p) =>
      onlineVotes.some((v) => v.voterName === p.name)
    );

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-pink-500/60 neon-glow-pink space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-950/80 border border-pink-500/50 text-pink-300 text-xs font-bold uppercase tracking-wider mb-1 neon-glow-pink animate-pulse">
            <Smartphone className="w-4 h-4" />
            VOTACIÓN EN VIVO DESDE CADA MÓVIL
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Emitiendo Veredictos...
            </h1>
            <p className="text-sm text-purple-200/80 mt-1 max-w-lg mx-auto">
              Cada amiga está seleccionando en su propio dispositivo quién es la culpable, la hora y el método.
            </p>
          </div>

          {/* Real-time Voter Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto pt-2">
            {players.map((p) => {
              const hasVoted = onlineVotes.some((v) => v.voterName === p.name);

              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    hasVoted
                      ? "bg-green-950/40 border-green-500/80 shadow-lg scale-102"
                      : "bg-purple-950/40 border-purple-800/80 animate-pulse"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1 bg-black/40 rounded-xl">{p.dossier.avatar}</span>
                    <div className="text-left">
                      <div className="font-black text-white text-sm">{p.name}</div>
                      <div className="text-[10px] text-purple-300">
                        {hasVoted ? "Veredicto emitido" : "Eligiendo en su móvil..."}
                      </div>
                    </div>
                  </div>

                  {hasVoted ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-950 px-2.5 py-1 rounded-full border border-green-500/50">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Voto recibido
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/50">
                      <Clock className="w-3 h-3 animate-spin" />
                      Votando...
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Banner */}
          <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-800/80 text-xs text-purple-200 font-mono">
            <strong>{onlineVotes.length}</strong> de <strong>{players.length}</strong> jugadoras han votado.
          </div>

          {/* Big Reveal Solution Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onFinishVoting(onlineVotes);
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 hover:from-pink-500 hover:via-purple-500 hover:to-red-500 text-white font-black text-base uppercase tracking-wider border border-white/40 shadow-2xl neon-glow-pink cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {allHaveVoted
                ? "🎉 ¡TODOS LOS VOTOS RECIBIDOS! VER LA SOLUCIÓN FINAL"
                : "¡CERRAR VOTACIÓN Y REVELAR LA SOLUCIÓN!"}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-2">
            <button
              type="button"
              onClick={onBackToGame}
              className="text-purple-300 hover:text-white underline cursor-pointer"
            >
              ← Volver al debate y cronómetro
            </button>

            <button
              type="button"
              onClick={() => setShowManualFallback(true)}
              className="text-pink-300 hover:text-white underline cursor-pointer"
            >
              Votar en esta pantalla si alguna no tiene móvil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // OFFLINE PASS & PLAY / MANUAL VOTING MODE
  // ==========================================
  const handleNextOfflineVote = () => {
    if (!selectedAccused || !selectedTime || !selectedMethod) {
      alert("Por favor completa las 3 preguntas antes de registrar tu voto.");
      return;
    }

    sounds.playClick();

    const newVote: PlayerVote = {
      voterName: currentVoter.name,
      accusedPlayerName: selectedAccused,
      guessedTime: selectedTime,
      guessedMethod: selectedMethod,
    };

    const updatedVotes = [...offlineVotes, newVote];
    setOfflineVotes(updatedVotes);

    if (isLastVoter) {
      onFinishVoting(updatedVotes);
    } else {
      setSelectedAccused("");
      setSelectedTime("");
      setSelectedMethod("");
      setCurrentVoterIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/60 neon-glow-pink">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/80 border border-pink-500/40 text-pink-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Vote className="w-3.5 h-3.5" />
            VOTACIÓN CONFIDENCIAL ({currentVoterIndex + 1} de {players.length})
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Turno de Voto: <span className="neon-text-pink">{currentVoter?.name}</span>
          </h2>
          <p className="text-xs text-purple-200/80 mt-1">
            Pasa el dispositivo a <strong>{currentVoter?.name}</strong> para que emita su veredicto en privado.
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/60">
            <label className="block text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-pink-400" />
              1. ¿Quién crees que es la Culpable?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {players
                .filter((p) => p.name !== currentVoter?.name)
                .map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedAccused(p.name);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedAccused === p.name
                        ? "bg-pink-600 text-white border-pink-300 neon-glow-pink scale-102 font-bold"
                        : "bg-purple-950/60 text-purple-200 border-purple-800 hover:border-purple-600"
                    }`}
                  >
                    <div className="text-xl mb-0.5">{p.dossier.avatar}</div>
                    <div className="text-xs font-bold">{p.name}</div>
                  </button>
                ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/60">
            <label className="block text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              2. ¿A qué hora exacta cometió el hecho?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {timeOptions.map((time, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedTime(time);
                  }}
                  className={`py-2.5 px-3 rounded-xl border font-mono text-xs transition-all cursor-pointer text-center ${
                    selectedTime === time
                      ? "bg-purple-600 text-white border-purple-300 neon-glow-purple font-black scale-102"
                      : "bg-purple-950/60 text-purple-200 border-purple-800 hover:border-purple-600"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/60">
            <label className="block text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              3. ¿Cuál fue el método o pista determinante?
            </label>
            <div className="space-y-2">
              {methodOptions.map((method, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedMethod(method);
                  }}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer leading-relaxed ${
                    selectedMethod === method
                      ? "bg-red-950/80 text-white border-red-400 neon-glow-red font-bold"
                      : "bg-purple-950/60 text-purple-200 border-purple-800 hover:border-purple-600"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextOfflineVote}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 hover:from-pink-500 text-white font-black text-base uppercase tracking-wider border border-white/40 shadow-2xl neon-glow-pink cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 inline mr-2" />
            <span>
              {isLastVoter
                ? "¡REGISTRAR ÚLTIMO VOTO Y REVELAR LA SOLUCIÓN!"
                : `CONFIRMAR VOTO DE ${currentVoter?.name.toUpperCase()} Y PASAR`}
            </span>
          </button>
        </div>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onBackToGame}
            className="text-xs text-purple-300/80 hover:text-white underline cursor-pointer"
          >
            ← Volver al debate y cronómetro
          </button>
        </div>
      </div>
    </div>
  );
}
