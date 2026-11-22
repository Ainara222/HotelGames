"use client";

import React, { useState } from "react";
import { ActivePlayer, CaseData } from "../types/game";
import { sounds } from "../utils/audio";
import { Eye, EyeOff, ShieldAlert, Lock, Unlock, Clock, MapPin, Target, CheckCircle2, X } from "lucide-react";

interface DossierModalProps {
  player: ActivePlayer;
  gameCase: CaseData;
  onClose: () => void;
  onMarkReviewed?: () => void;
}

export default function DossierModal({ player, gameCase, onClose, onMarkReviewed }: DossierModalProps) {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const handleToggleReveal = () => {
    sounds.playClick();
    if (!isRevealed && onMarkReviewed) {
      onMarkReviewed();
    }
    setIsRevealed(!isRevealed);
  };

  const dossier = player.dossier;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="glass-panel max-w-2xl w-full rounded-3xl border border-purple-500/50 neon-glow-purple relative overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-purple-800/60 bg-gradient-to-r from-purple-950/80 via-black to-pink-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{dossier.avatar}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-pink-950 text-pink-300 font-bold border border-pink-500/40 uppercase">
                  CONFIDENCIAL
                </span>
                <span className="text-xs text-purple-300 font-mono">
                  Caso #{gameCase.id}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Expediente de <span className="neon-text-pink">{player.name}</span>
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-purple-950/60 hover:bg-purple-900 text-purple-300 hover:text-white border border-purple-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!isRevealed ? (
            /* Confidential Lock Screen */
            <div className="py-12 sm:py-16 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-purple-900/40 border-2 border-pink-500/60 flex items-center justify-center neon-glow-pink animate-pulse">
                <Lock className="w-10 h-10 text-pink-400" />
              </div>

              <div className="max-w-md">
                <h3 className="text-2xl font-extrabold text-white mb-2">
                  ¡ALTO AHÍ!
                </h3>
                <p className="text-sm text-purple-200/80">
                  Este expediente contiene información ultra secreta y tu rol en el caso.
                  <br />
                  <strong className="text-pink-300">Pásale el dispositivo a {player.name}</strong> y asegúrate de que nadie más esté mirando la pantalla.
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleReveal}
                className="mt-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 hover:scale-105 active:scale-95 text-white font-black text-base border border-pink-300 shadow-xl neon-glow-pink transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <Unlock className="w-5 h-5" />
                SOY {player.name.toUpperCase()} · VER EXPEDIENTE
              </button>
            </div>
          ) : (
            /* Unlocked Secret Dossier Details */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Role & Innocence/Guilt Banner */}
              <div
                className={`p-4 rounded-2xl border ${
                  dossier.isCulprit
                    ? "bg-red-950/60 border-red-500 neon-border-red"
                    : "bg-purple-950/40 border-purple-600/60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-purple-300">
                      Tu Rol en la Historia:
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-0.5">
                      <span>{dossier.avatar}</span>
                      <span>{dossier.roleTitle}</span>
                    </h3>
                  </div>

                  <div className="shrink-0">
                    {dossier.isCulprit ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-600 text-white font-black text-xs border border-red-300 neon-glow-red animate-pulse">
                        <ShieldAlert className="w-4 h-4" />
                        ¡ERES LA CULPABLE!
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-950/80 text-green-300 font-bold text-xs border border-green-500/50">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ERES INOCENTE
                      </span>
                    )}
                  </div>
                </div>

                {dossier.isCulprit ? (
                  <p className="text-xs text-red-200 mt-2 font-medium bg-red-950/80 p-2.5 rounded-xl border border-red-800/60">
                    ⚠️ <strong>TU MISIÓN:</strong> Fuiste tú quien cometió el hecho. No puedes cambiar los horarios ni ubicaciones oficiales de tu expediente si te preguntan directamente, pero SÍ puedes inventar interpretaciones, excusas creíbles o acusar sutilmente a otra amiga. ¡Si nadie te descubre ganas 3 puntos extra!
                  </p>
                ) : (
                  <p className="text-xs text-purple-200/80 mt-2">
                    Tu coartada y datos son reales. Coopera con tus amigas, compara horarios y descubre quién está mintiendo o contradiciendo los testimonios.
                  </p>
                )}
              </div>

              {/* Secret Objective */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/40 to-purple-950/40 border border-pink-500/40 neon-glow-pink">
                <div className="flex items-center gap-2 mb-2 text-pink-300 font-bold text-sm uppercase tracking-wider">
                  <Target className="w-4 h-4 text-pink-400" />
                  Tu Objetivo Secreto
                </div>
                <p className="text-sm text-white font-semibold leading-relaxed">
                  {dossier.secretObjective}
                </p>
                {dossier.suspicionNotes && (
                  <div className="mt-2 text-xs text-purple-300/80 italic border-t border-purple-800/40 pt-2">
                    💡 Consejo táctico: {dossier.suspicionNotes}
                  </div>
                )}
              </div>

              {/* Movements & Timetable */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-purple-300 font-bold text-sm uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-purple-400" />
                  Tu Ubicación y Movimientos (Horarios Exactos)
                </div>

                <div className="space-y-2.5">
                  {dossier.movements.map((mov, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/50 flex items-start gap-3"
                    >
                      <span className="font-mono text-xs font-black px-2 py-1 rounded bg-pink-950 text-pink-300 border border-pink-500/40 shrink-0">
                        {mov.time}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>{mov.place}</span>
                        </div>
                        <p className="text-xs text-purple-200/80 mt-0.5 leading-snug">
                          {mov.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Known Information / Clues */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-pink-300 font-bold text-sm uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-pink-400" />
                  Información Que Conoces (Pistas Secretas)
                </div>

                <ul className="space-y-2">
                  {dossier.knownInfo.map((info, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-xl bg-pink-950/20 border border-pink-900/40 text-xs text-purple-100 flex items-start gap-2.5"
                    >
                      <span className="text-pink-400 font-bold shrink-0">•</span>
                      <span className="leading-relaxed">{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-purple-800/60 bg-black/40 flex items-center justify-between shrink-0">
          {isRevealed ? (
            <button
              type="button"
              onClick={handleToggleReveal}
              className="w-full py-3 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-bold text-sm border border-purple-600 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <EyeOff className="w-4 h-4" />
              Ocultar mi expediente (Para pasar la tablet)
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-purple-950/50 hover:bg-purple-900/50 text-purple-300 font-medium text-sm border border-purple-800/60 cursor-pointer"
            >
              Cerrar y volver a la sala
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
