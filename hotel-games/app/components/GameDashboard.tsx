"use client";

import React, { useState, useEffect } from "react";
import { ActivePlayer, CaseData } from "../types/game";
import { sounds } from "../utils/audio";
import DossierModal from "./DossierModal";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  ShieldAlert,
  HelpCircle,
  FileText,
  Lock,
  Unlock,
  AlertTriangle,
  Eye,
  Vote,
  Sparkles,
  MapPin,
  ChevronRight
} from "lucide-react";

interface GameDashboardProps {
  players: ActivePlayer[];
  gameCase: CaseData;
  timerDurationSeconds: number;
  onGoToVoting: () => void;
}

export default function GameDashboard({
  players,
  gameCase,
  timerDurationSeconds,
  onGoToVoting,
}: GameDashboardProps) {
  // Timer state
  const isFreeTime = timerDurationSeconds === 0;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    isFreeTime ? 900 : timerDurationSeconds
  );
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(!isFreeTime);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Progressive Clues state (unlocked by time or manual click)
  const [clue1Unlocked, setClue1Unlocked] = useState<boolean>(false);
  const [clue2Unlocked, setClue2Unlocked] = useState<boolean>(false);
  const [newClueAlert, setNewClueAlert] = useState<string | null>(null);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"timeline" | "clues" | "questions" | "dossiers">("timeline");

  // Private dossier inspection during debate
  const [inspectingPlayer, setInspectingPlayer] = useState<ActivePlayer | null>(null);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const nextElapsed = prev + 1;

          // Check for progressive clue triggers (Minuto 3 = 180s, Minuto 6 = 360s)
          if (nextElapsed === 180 && !clue1Unlocked) {
            setClue1Unlocked(true);
            setNewClueAlert(gameCase.progressiveClues[0]?.title || "Nueva Prueba Revelada");
            sounds.playClueAlert();
          }
          if (nextElapsed === 360 && !clue2Unlocked) {
            setClue2Unlocked(true);
            setNewClueAlert(gameCase.progressiveClues[1]?.title || "Segunda Prueba Revelada");
            sounds.playClueAlert();
          }

          return nextElapsed;
        });

        if (!isFreeTime) {
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              sounds.playTick(true);
              setIsTimerRunning(false);
              return 0;
            }
            if (prev <= 10) {
              sounds.playTick(false);
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, isFreeTime, clue1Unlocked, clue2Unlocked, gameCase]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleToggleTimer = () => {
    sounds.playClick();
    setIsTimerRunning(!isTimerRunning);
  };

  const handleAddMinutes = (mins: number) => {
    sounds.playClick();
    setSecondsRemaining((prev) => prev + mins * 60);
  };

  const clue1 = gameCase.progressiveClues[0];
  const clue2 = gameCase.progressiveClues[1];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Alert Banner when new clue unlocks */}
      {newClueAlert && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 border-2 border-white text-white flex items-center justify-between shadow-2xl neon-glow-pink animate-bounce">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-300 animate-pulse" />
            <div>
              <div className="text-xs uppercase font-black tracking-wider text-yellow-200">
                ¡NUEVA PRUEBA DE INVESTIGACIÓN DESBLOQUEADA!
              </div>
              <div className="text-base font-extrabold">{newClueAlert}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab("clues");
              setNewClueAlert(null);
            }}
            className="px-4 py-2 rounded-xl bg-white text-purple-950 font-black text-xs hover:bg-yellow-200 transition-all cursor-pointer shadow-md"
          >
            Ver Prueba Ahora
          </button>
        </div>
      )}

      {/* Case Header & Glowing Neon Timer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Case Info (7 cols) */}
        <div className="md:col-span-7 glass-panel p-5 rounded-3xl border border-purple-500/50 neon-glow-purple flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-950 text-pink-300 font-bold border border-pink-500/40 uppercase tracking-wider">
                Caso Activo
              </span>
              <span className="text-xs text-purple-300/80">
                {gameCase.location}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <span>{gameCase.emoji}</span>
              <span className="neon-text-pink">{gameCase.title}</span>
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/80 mt-1 font-light leading-snug">
              {gameCase.synopsis}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-800/60 flex items-center justify-between text-xs text-purple-300">
            <div>
              <strong>Hora del delito:</strong> {gameCase.incidentTime}
            </div>
            <div>
              <strong>Jugadoras:</strong> {players.length}
            </div>
          </div>
        </div>

        {/* Neon Countdown Timer (5 cols) */}
        <div className="md:col-span-5 glass-panel p-5 rounded-3xl border border-pink-500/60 neon-glow-pink flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 text-pink-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4 animate-spin text-pink-400" />
            <span>Cronómetro de Juego</span>
          </div>

          {/* Time digits */}
          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight neon-text-pink my-1">
            {isFreeTime ? formatTime(elapsedSeconds) : formatTime(secondsRemaining)}
          </div>

          <div className="text-[11px] text-purple-300/70 font-mono mb-3">
            {isFreeTime ? "Tiempo transcurrido (Libre)" : "Tiempo de debate restante"}
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleTimer}
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs border border-pink-400 flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Reanudar</span>
                </>
              )}
            </button>

            {!isFreeTime && (
              <button
                type="button"
                onClick={() => handleAddMinutes(2)}
                className="p-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 hover:text-white font-bold text-xs border border-purple-800 flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+2 min</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {[
          { id: "timeline", label: "📜 Cronología Oficial", icon: Clock },
          { id: "clues", label: `🔍 Pruebas (${(clue1Unlocked ? 1 : 0) + (clue2Unlocked ? 1 : 0)}/2)`, icon: ShieldAlert },
          { id: "questions", label: "❓ Interrogatorio", icon: HelpCircle },
          { id: "dossiers", label: "🗂️ Mi Expediente", icon: Eye },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab(tab.id as any);
            }}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all border cursor-pointer ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-400 neon-glow-pink scale-102"
                : "bg-purple-950/50 text-purple-300 border-purple-900/60 hover:border-purple-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Cronología */}
      {activeTab === "timeline" && (
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/40 neon-border-purple space-y-4">
          <div className="flex items-center justify-between border-b border-purple-800/60 pb-3">
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">
                Acontecimientos Conocidos por Todas
              </h2>
              <p className="text-xs text-purple-200/70">
                Esta cronología es oficial y objetiva: nadie puede contradecir estos hechos.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {gameCase.publicTimeline.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/60 flex items-start gap-4 hover:border-pink-500/50 transition-all"
              >
                <div className="px-3 py-1.5 rounded-xl bg-pink-950 text-pink-300 font-mono font-black text-sm border border-pink-500/40 shrink-0">
                  {item.time}
                </div>
                <div className="flex-1 min-w-0">
                  {item.location && (
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-300 mb-0.5">
                      <MapPin className="w-3 h-3 text-pink-400 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Nuevas Pruebas Progresivas */}
      {activeTab === "clues" && (
        <div className="space-y-6">
          {/* Progressive Clue 1 */}
          <div
            className={`glass-panel p-6 rounded-3xl border transition-all ${
              clue1Unlocked
                ? "border-pink-500/80 neon-glow-pink bg-purple-950/40"
                : "border-purple-900/60 opacity-80"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-950 text-pink-300 font-bold border border-pink-500/40 uppercase">
                  {clue1?.badge || "PRUEBA 1 · MINUTO 3"}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {clue1Unlocked ? clue1?.title : "🔒 Prueba Bloqueada (Minuto 3)"}
                </h3>
              </div>

              {!clue1Unlocked && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClueAlert();
                    setClue1Unlocked(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs border border-pink-400 cursor-pointer"
                >
                  Revelar ya
                </button>
              )}
            </div>

            {clue1Unlocked ? (
              <div className="space-y-3">
                <p className="text-sm text-purple-100 leading-relaxed font-medium">
                  {clue1?.description}
                </p>
                <div className="p-3.5 rounded-2xl bg-pink-950/60 border border-pink-500/40 text-xs text-pink-200">
                  <strong>Pregunta clave para el grupo:</strong> {clue1?.impactQuestion}
                </div>
              </div>
            ) : (
              <p className="text-xs text-purple-300/70 italic">
                Esta prueba se revelará automáticamente a los 3 minutos de juego o si pulsáis "Revelar ya".
              </p>
            )}
          </div>

          {/* Progressive Clue 2 */}
          <div
            className={`glass-panel p-6 rounded-3xl border transition-all ${
              clue2Unlocked
                ? "border-red-500/80 neon-glow-red bg-purple-950/40"
                : "border-purple-900/60 opacity-80"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 font-bold border border-red-500/40 uppercase">
                  {clue2?.badge || "PRUEBA 2 · MINUTO 6"}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {clue2Unlocked ? clue2?.title : "🔒 Prueba Bloqueada (Minuto 6)"}
                </h3>
              </div>

              {!clue2Unlocked && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClueAlert();
                    setClue2Unlocked(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs border border-red-400 cursor-pointer"
                >
                  Revelar ya
                </button>
              )}
            </div>

            {clue2Unlocked ? (
              <div className="space-y-3">
                <p className="text-sm text-purple-100 leading-relaxed font-medium">
                  {clue2?.description}
                </p>
                <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 text-xs text-red-200">
                  <strong>Pregunta clave para el grupo:</strong> {clue2?.impactQuestion}
                </div>
              </div>
            ) : (
              <p className="text-xs text-purple-300/70 italic">
                Esta prueba se revelará automáticamente a los 6 minutos de juego o si pulsáis "Revelar ya".
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Interrogatorio Dinamizador */}
      {activeTab === "questions" && (
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/40 space-y-4">
          <div className="border-b border-purple-800/60 pb-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-pink-400" />
              Guía de Interrogatorio y Dinamización
            </h2>
            <p className="text-xs text-purple-200/70">
              Lanzad estas preguntas en voz alta al grupo para buscar contradicciones entre testimonios:
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {gameCase.interrogationQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 to-pink-950/40 border border-purple-800/70 flex items-start gap-3 hover:border-pink-500/60 transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 text-xs font-black flex items-center justify-center shrink-0 border border-pink-500/40">
                  {idx + 1}
                </span>
                <p className="text-sm text-white font-semibold leading-snug">
                  {q}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-800/50 text-xs text-purple-200/80 space-y-1.5 mt-4">
            <div className="font-bold text-pink-300 uppercase tracking-wider">
              ⚖️ REGLAS BÁSICAS DE LA INVESTIGACIÓN:
            </div>
            <div>• Nadie puede cambiar los horarios ni ubicaciones escritos en su expediente oficial.</div>
            <div>• Sí podéis mentir sobre motivos, opiniones o acusar a otras para defenderos.</div>
            <div>• Comparad quién estuvo con quién y a qué horas hay huecos sin testigos.</div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Consulta Rápida de Expedientes Privados */}
      {activeTab === "dossiers" && (
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/40 space-y-4">
          <div className="border-b border-purple-800/60 pb-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">
              Consultar Mi Expediente en Privado
            </h2>
            <p className="text-xs text-purple-200/70">
              Si necesitas recordar tus horarios u objetivo secreto durante el debate, selecciona tu nombre:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {players.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setInspectingPlayer(p);
                }}
                className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/70 hover:border-pink-500 hover:neon-glow-pink text-left transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{p.dossier.avatar}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{p.name}</div>
                    <div className="text-[10px] text-purple-300/70">Toca para abrir</div>
                  </div>
                </div>
                <Eye className="w-4 h-4 text-purple-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Floating Bar: Go to Voting CTA */}
      <div className="mt-8 pt-4 border-t border-purple-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-white">¿Tenéis ya una sospechosa clara?</div>
          <p className="text-xs text-purple-300/70">
            Cuando terminéis de interrogaros, pasad a la votación secreta.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onGoToVoting();
          }}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:from-red-500 hover:via-pink-500 hover:to-purple-500 text-white font-black text-base uppercase tracking-wider border border-white/40 shadow-2xl neon-glow-red hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Vote className="w-5 h-5 text-white" />
          <span>¡IR A LA VOTACIÓN FINAL!</span>
        </button>
      </div>

      {/* Dossier Modal when inspecting */}
      {inspectingPlayer && (
        <DossierModal
          player={inspectingPlayer}
          gameCase={gameCase}
          onClose={() => setInspectingPlayer(null)}
        />
      )}
    </div>
  );
}
