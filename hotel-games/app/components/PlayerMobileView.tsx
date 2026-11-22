"use client";

import React, { useState } from "react";
import { CaseData } from "../types/game";
import { sounds } from "../utils/audio";
import { ShieldAlert, Lock, Unlock, Eye, EyeOff, Clock, MapPin, Target, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface PlayerMobileViewProps {
  payload: {
    caseId: number;
    playerName: string;
    roleTitle: string;
    avatar: string;
    isCulprit: boolean;
    movements: { time: string; place: string; detail: string }[];
    knownInfo: string[];
    secretObjective: string;
    suspicionNotes?: string;
  };
  gameCase?: CaseData;
}

export default function PlayerMobileView({ payload, gameCase }: PlayerMobileViewProps) {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [showPublicTimeline, setShowPublicTimeline] = useState<boolean>(false);

  const handleToggle = () => {
    sounds.playClick();
    setIsRevealed(!isRevealed);
  };

  return (
    <div className="min-h-screen bg-[#080312] text-[#f3f0fa] p-4 sm:p-6 flex flex-col items-center">
      {/* Top Header */}
      <div className="w-full max-w-md text-center mb-6 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-950/80 border border-pink-500/50 text-pink-300 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          EXPEDIENTE CONFIDENCIAL
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Bienvenida, <span className="neon-text-pink">{payload.playerName}</span>
        </h1>
        <p className="text-xs text-purple-300/80 mt-1">
          Guarda este enlace en tu móvil. Esta pantalla es solo para ti.
        </p>
      </div>

      <div className="w-full max-w-md">
        {!isRevealed ? (
          /* Privacy curtain */
          <div className="glass-panel p-8 rounded-3xl border border-pink-500/60 neon-glow-pink text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-purple-900/40 border-2 border-pink-500/60 flex items-center justify-center neon-glow-pink animate-pulse">
              <Lock className="w-10 h-10 text-pink-400" />
            </div>

            <div>
              <h2 className="text-xl font-black text-white mb-1">
                Expediente Oculto por Seguridad
              </h2>
              <p className="text-xs text-purple-200/80">
                Asegúrate de que nadie esté mirando la pantalla de tu móvil antes de desbloquear.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 hover:scale-102 active:scale-98 text-white font-black text-sm border border-pink-300 shadow-xl neon-glow-pink transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Unlock className="w-4 h-4" />
              TOCA PARA VER MI EXPEDIENTE
            </button>
          </div>
        ) : (
          /* Unlocked confidential card */
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Quick Hide Button */}
            <button
              type="button"
              onClick={handleToggle}
              className="w-full py-2.5 rounded-xl bg-purple-950/80 text-purple-200 hover:text-white border border-purple-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <EyeOff className="w-4 h-4" />
              <span>Ocultar pantalla (si alguien se acerca)</span>
            </button>

            {/* Role & Innocence/Guilt */}
            <div
              className={`p-4 rounded-2xl border ${
                payload.isCulprit
                  ? "bg-red-950/60 border-red-500 neon-border-red"
                  : "bg-purple-950/40 border-purple-600/60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-purple-300">
                    Tu Personaje:
                  </span>
                  <h2 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                    <span>{payload.avatar}</span>
                    <span>{payload.roleTitle}</span>
                  </h2>
                </div>

                {payload.isCulprit ? (
                  <span className="px-2.5 py-1 rounded-full bg-red-600 text-white font-black text-xs border border-red-300 neon-glow-red shrink-0 animate-pulse">
                    ¡ERES LA CULPABLE!
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-green-950 text-green-300 font-bold text-xs border border-green-500/50 shrink-0">
                    INOCENTE
                  </span>
                )}
              </div>

              {payload.isCulprit ? (
                <div className="mt-3 p-3 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-100 font-medium leading-relaxed">
                  ⚠️ <strong>¡CUIDADO!</strong> Fuiste tú quien cometió el hecho. No puedes cambiar los horarios ni lugares de tu expediente, pero sí dar excusas creíbles o culpar a otra amiga con astucia. ¡Si ninguna te vota ganas 3 puntos extra!
                </div>
              ) : (
                <p className="mt-2 text-xs text-purple-200/80">
                  Eres completamente inocente. Defiende tu coartada y descubre qué amiga está ocultando cosas.
                </p>
              )}
            </div>

            {/* Secret Objective */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/50 to-purple-950/50 border border-pink-500/50 neon-glow-pink">
              <div className="flex items-center gap-1.5 mb-1.5 text-pink-300 font-bold text-xs uppercase tracking-wider">
                <Target className="w-4 h-4 text-pink-400" />
                Tu Objetivo Secreto
              </div>
              <p className="text-xs text-white font-semibold leading-relaxed">
                {payload.secretObjective}
              </p>
              {payload.suspicionNotes && (
                <div className="mt-2 pt-2 border-t border-purple-800/40 text-[11px] text-purple-300/80 italic">
                  💡 {payload.suspicionNotes}
                </div>
              )}
            </div>

            {/* Movements & Hours */}
            <div className="glass-panel p-4 rounded-2xl border border-purple-500/40">
              <div className="flex items-center gap-1.5 mb-3 text-purple-300 font-bold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 text-purple-400" />
                Tus Horarios y Movimientos Oficiales
              </div>

              <div className="space-y-2">
                {payload.movements.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-start gap-2.5"
                  >
                    <span className="font-mono text-[11px] font-black px-1.5 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-500/40 shrink-0">
                      {m.time}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-white">
                        <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                        <span>{m.place}</span>
                      </div>
                      <p className="text-[11px] text-purple-200/80 leading-snug mt-0.5">
                        {m.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Known Info / Secret Clues */}
            <div className="glass-panel p-4 rounded-2xl border border-pink-500/40">
              <div className="flex items-center gap-1.5 mb-2.5 text-pink-300 font-bold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-pink-400" />
                Información Que Conoces (Tus Pistas)
              </div>

              <ul className="space-y-2 text-xs text-purple-100">
                {payload.knownInfo.map((info, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-pink-950/20 border border-pink-900/40 flex items-start gap-2 leading-relaxed"
                  >
                    <span className="text-pink-400 font-bold">•</span>
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Collapsible Public Timeline if available */}
            {gameCase && (
              <div className="glass-panel p-4 rounded-2xl border border-purple-800/60">
                <button
                  type="button"
                  onClick={() => setShowPublicTimeline(!showPublicTimeline)}
                  className="w-full flex items-center justify-between text-xs font-bold text-purple-300 uppercase tracking-wider cursor-pointer"
                >
                  <span>📜 Ver Cronología Pública ({gameCase.title})</span>
                  {showPublicTimeline ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showPublicTimeline && (
                  <div className="mt-3 pt-3 border-t border-purple-800/60 space-y-2">
                    {gameCase.publicTimeline.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <span className="font-mono text-pink-400 font-bold shrink-0">{item.time}</span>
                        <span className="text-purple-200">{item.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
