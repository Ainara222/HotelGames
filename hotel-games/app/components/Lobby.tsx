"use client";

import React, { useState, useEffect } from "react";
import { CaseData, PlayerCount } from "../types/game";
import { CASES } from "../data/cases";
import { sounds } from "../utils/audio";
import { Users, Clock, Sparkles, Shuffle, ShieldAlert, CheckCircle2 } from "lucide-react";

interface LobbyProps {
  onStartGame: (
    playerCount: PlayerCount,
    playerNames: string[],
    selectedCase: CaseData,
    timerDurationSeconds: number
  ) => void;
}

const DEFAULT_NAMES = ["Ainara", "Saray", "Marta", "Paula", "Elena", "Claudia", "Lucía"];

export default function Lobby({ onStartGame }: LobbyProps) {
  const [playerCount, setPlayerCount] = useState<PlayerCount>(7);
  const [playerNames, setPlayerNames] = useState<string[]>(DEFAULT_NAMES);
  const [selectedCaseId, setSelectedCaseId] = useState<number>(1);
  const [isRandomCase, setIsRandomCase] = useState<boolean>(false);
  const [timerMinutes, setTimerMinutes] = useState<number>(15); // 15 mins default

  // Load saved names from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("chivatazo_player_names");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 7) {
          setPlayerNames(parsed);
        }
      }
    } catch {}
  }, []);

  const handleNameChange = (index: number, val: string) => {
    const updated = [...playerNames];
    updated[index] = val;
    setPlayerNames(updated);
  };

  const handlePlayerCountChange = (count: PlayerCount) => {
    sounds.playClick();
    setPlayerCount(count);
  };

  const handleStart = () => {
    sounds.playClick();
    // Save names
    try {
      localStorage.setItem("chivatazo_player_names", JSON.stringify(playerNames));
    } catch {}

    let chosenCase: CaseData;
    if (isRandomCase) {
      const randomIdx = Math.floor(Math.random() * CASES.length);
      chosenCase = CASES[randomIdx];
    } else {
      chosenCase = CASES.find((c) => c.id === selectedCaseId) || CASES[0];
    }

    const trimmedNames = playerNames
      .slice(0, playerCount)
      .map((name, i) => (name.trim() ? name.trim() : `Jugadora ${i + 1}`));

    onStartGame(playerCount, trimmedNames, chosenCase, timerMinutes * 60);
  };

  const currentCase = CASES.find((c) => c.id === selectedCaseId) || CASES[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header Title with Neon Glow */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/40 bg-pink-950/30 text-pink-400 text-sm font-semibold tracking-wider uppercase mb-3 neon-glow-pink">
          <Sparkles className="w-4 h-4 animate-spin text-pink-400" />
          Juego Interactivo de Deducción Social
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-3">
          <span className="text-white">EL </span>
          <span className="neon-text-pink">CHIVATAZO</span>
        </h1>
        <p className="text-lg md:text-xl text-purple-200/80 max-w-2xl mx-auto font-light">
          Expedientes secretos, coartadas, horas exactas y traiciones entre amigas. ¿Quién fue la culpable?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Players Registration & Time (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Number of players */}
          <div className="glass-panel p-6 rounded-2xl neon-border-purple">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                  1. Número de Jugadoras
                </h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-purple-900/50 text-purple-300 font-mono">
                {playerCount} AMIGAS
              </span>
            </div>

            <p className="text-xs text-purple-200/70 mb-4">
              El juego adapta automáticamente todas las pistas y roles al número de participantes:
            </p>

            <div className="grid grid-cols-4 gap-3">
              {([4, 5, 6, 7] as PlayerCount[]).map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => handlePlayerCountChange(count)}
                  className={`py-3 rounded-xl font-bold transition-all text-center border ${
                    playerCount === count
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-400 neon-glow-pink scale-105"
                      : "bg-purple-950/40 text-purple-300 border-purple-800/60 hover:border-purple-600"
                  }`}
                >
                  <div className="text-2xl font-black">{count}</div>
                  <div className="text-xs font-medium">Jugadoras</div>
                </button>
              ))}
            </div>
          </div>

          {/* Card: Register Player Names */}
          <div className="glass-panel p-6 rounded-2xl neon-border-pink">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-pink-400" />
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                  2. Registro de Amigas
                </h2>
              </div>
              <span className="text-xs text-pink-300">
                Se generará un QR personal para cada una
              </span>
            </div>

            <div className="space-y-3">
              {Array.from({ length: playerCount }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={playerNames[idx] || ""}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    placeholder={`Nombre de la amiga #${idx + 1}`}
                    maxLength={20}
                    className="flex-1 bg-purple-950/40 border border-purple-800/80 rounded-xl px-4 py-2.5 text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-medium"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Card: Timer Config */}
          <div className="glass-panel p-6 rounded-2xl border border-red-500/40 neon-glow-red">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-400" />
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                  3. Cronómetro de la Partida
                </h2>
              </div>
              <span className="text-xs text-red-300 font-mono">
                {timerMinutes === 0 ? "Tiempo libre" : `${timerMinutes} MINUTOS`}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {[
                { label: "10 min", val: 10, desc: "Flash" },
                { label: "15 min", val: 15, desc: "Recomendado" },
                { label: "20 min", val: 20, desc: "Intenso" },
                { label: "Libre", val: 0, desc: "Sin prisa" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setTimerMinutes(opt.val);
                  }}
                  className={`p-2.5 rounded-xl text-center border transition-all ${
                    timerMinutes === opt.val
                      ? "bg-gradient-to-r from-red-600 to-pink-600 text-white border-red-400 shadow-lg scale-105"
                      : "bg-red-950/20 text-red-200 border-red-900/40 hover:border-red-700"
                  }`}
                >
                  <div className="font-bold text-sm">{opt.label}</div>
                  <div className="text-[10px] opacity-75">{opt.desc}</div>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-red-300/70 mt-3">
              ⚡ Se revelarán dos pistas sorpresa automáticamente a los minutos 3 y 6 con alerta sonora.
            </p>
          </div>
        </div>

        {/* Right Column: Case Selection (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl neon-border-purple h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                  4. Selecciona el Caso
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setIsRandomCase(!isRandomCase);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                    isRandomCase
                      ? "bg-pink-600 border-pink-400 text-white neon-glow-pink"
                      : "bg-purple-950/50 border-purple-800 text-purple-300 hover:border-purple-600"
                  }`}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  {isRandomCase ? "¡Caso Sorpresa Activo!" : "Aleatorio"}
                </button>
              </div>

              {/* Case Carousel / List */}
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {CASES.map((c) => {
                  const isSelected = !isRandomCase && selectedCaseId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        sounds.playClick();
                        setIsRandomCase(false);
                        setSelectedCaseId(c.id);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? "bg-purple-900/60 border-pink-400 neon-glow-pink translate-x-1"
                          : "bg-purple-950/20 border-purple-900/50 hover:bg-purple-900/30 hover:border-purple-700"
                      }`}
                    >
                      <span className="text-2xl shrink-0 p-1 bg-black/40 rounded-lg">{c.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-bold text-sm text-white truncate">
                            {c.id}. {c.title}
                          </h3>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-950/60 text-pink-300 shrink-0 font-medium border border-pink-900/40">
                            {c.category}
                          </span>
                        </div>
                        <p className="text-xs text-purple-200/70 line-clamp-2 mt-1">
                          {c.subtitle}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0 self-center" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected case preview summary */}
            <div className="mt-6 pt-4 border-t border-purple-800/50">
              <div className="text-xs text-purple-300/80 mb-1">
                {isRandomCase ? "🎲 Caso aleatorio oculto (se revelará al empezar)" : "Caso seleccionado:"}
              </div>
              <div className="font-bold text-white text-base">
                {isRandomCase ? "Misterio Sorpresa" : `${currentCase.emoji} ${currentCase.title}`}
              </div>
              {!isRandomCase && (
                <div className="text-xs text-purple-300/70 mt-1 line-clamp-2">
                  {currentCase.synopsis}
                </div>
              )}
            </div>

            {/* Big Launch Button */}
            <button
              type="button"
              onClick={handleStart}
              className="mt-6 w-full py-4 rounded-xl font-black text-lg text-white bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 hover:from-pink-500 hover:via-purple-500 hover:to-red-500 border border-pink-300 shadow-2xl neon-glow-pink hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Sparkles className="w-5 h-5 animate-pulse text-white" />
              ¡GENERAR EXPEDIENTES Y CÓDIGOS QR!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
