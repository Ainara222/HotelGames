"use client";

import React, { useState, useEffect } from "react";
import { ActivePlayer, CaseData } from "../types/game";
import { sounds } from "../utils/audio";
import { generateQRDataUrl, buildDossierPlainText } from "../utils/qr";
import QRModal from "./QRModal";
import DossierModal from "./DossierModal";
import { QrCode, Eye, CheckCircle2, ShieldAlert, Sparkles, ArrowRight, Maximize2, Smartphone } from "lucide-react";

interface RoleAssignmentProps {
  players: ActivePlayer[];
  gameCase: CaseData;
  timerDurationSeconds: number;
  onProceedToGame: () => void;
  onBackToLobby: () => void;
}

export default function RoleAssignment({
  players,
  gameCase,
  timerDurationSeconds,
  onProceedToGame,
  onBackToLobby,
}: RoleAssignmentProps) {
  const [selectedPlayerForQR, setSelectedPlayerForQR] = useState<ActivePlayer | null>(null);
  const [selectedPlayerForDossier, setSelectedPlayerForDossier] = useState<ActivePlayer | null>(null);
  const [reviewedPlayers, setReviewedPlayers] = useState<Set<string>>(new Set());
  const [playerQrs, setPlayerQrs] = useState<Record<string, string>>({});

  // Generate plain text QRs for all players on mount so they are shown directly
  useEffect(() => {
    let isMounted = true;
    async function loadAllQRs() {
      const qrs: Record<string, string> = {};
      for (const p of players) {
        const text = buildDossierPlainText(p, gameCase);
        const dataUrl = await generateQRDataUrl(text);
        qrs[p.id] = dataUrl;
      }
      if (isMounted) {
        setPlayerQrs(qrs);
      }
    }
    loadAllQRs();
    return () => {
      isMounted = false;
    };
  }, [players, gameCase]);

  const handleMarkReviewed = (playerName: string) => {
    setReviewedPlayers((prev) => new Set(prev).add(playerName));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Banner with Case Info */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/50 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
          <span>Caso #{gameCase.id}</span>
          <span>•</span>
          <span>{gameCase.category}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white flex items-center justify-center gap-3">
          <span>{gameCase.emoji}</span>
          <span className="neon-text-pink">{gameCase.title}</span>
        </h1>
        <p className="text-sm md:text-base text-purple-200/80 max-w-xl mx-auto mt-2 font-light">
          {gameCase.synopsis}
        </p>
      </div>

      {/* Instructions Card */}
      <div className="glass-panel p-5 rounded-2xl border border-pink-500/50 neon-glow-pink mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-950 border border-pink-500 text-pink-400 shrink-0">
            <QrCode className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-wide">
              ¡Códigos QR Listos! Cada Amiga Debe Escanear el Suyo
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/80 mt-0.5">
              Apunta la cámara de tu móvil directamente al QR con tu nombre. Se abrirá tu ficha secreta de texto (<strong>sin nada de JavaScript</strong>).
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Players with QR codes ALREADY VISIBLE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
        {players.map((player) => {
          const isReviewed = reviewedPlayers.has(player.name);
          const qrDataUrl = playerQrs[player.id];

          return (
            <div
              key={player.id}
              className={`glass-panel p-5 rounded-3xl border transition-all flex flex-col justify-between items-center text-center ${
                isReviewed
                  ? "border-green-500/60 bg-purple-950/40"
                  : "border-purple-600/50 hover:border-pink-500 hover:neon-glow-pink"
              }`}
            >
              <div className="w-full">
                {/* Header: Player Name & Avatar */}
                <div className="flex items-center justify-between mb-3 border-b border-purple-800/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-1 bg-black/40 rounded-xl">{player.dossier.avatar}</span>
                    <h3 className="text-lg font-black text-white truncate max-w-[140px]">
                      {player.name}
                    </h3>
                  </div>

                  {isReviewed ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-950/80 px-2 py-0.5 rounded-full border border-green-500/40">
                      <CheckCircle2 className="w-3 h-3" />
                      Leído
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-pink-300 bg-pink-950/60 px-2 py-0.5 rounded-full border border-pink-500/40">
                      Por escanear
                    </span>
                  )}
                </div>

                {/* Visible QR Code */}
                <div className="bg-white p-3 rounded-2xl shadow-xl border-2 border-pink-500/40 neon-glow-pink my-3 mx-auto w-48 h-48 flex items-center justify-center">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR de ${player.name}`}
                      className="w-44 h-44 rounded-lg object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-purple-900">
                      <QrCode className="w-8 h-8 animate-spin" />
                      <span className="text-xs font-bold">Generando QR...</span>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-purple-300/80 font-medium mb-3 flex items-center justify-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                  <span>Escanea con tu cámara móvil</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-1.5 pt-2 border-t border-purple-800/50">
                <button
                  type="button"
                  onClick={() => {
                    handleMarkReviewed(player.name);
                    setSelectedPlayerForQR(player);
                  }}
                  className="w-full py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 text-purple-200 hover:text-white font-bold text-xs border border-purple-700/80 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Agrandar QR / Copiar</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleMarkReviewed(player.name);
                    setSelectedPlayerForDossier(player);
                  }}
                  className="w-full py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900 text-purple-300 font-semibold text-[11px] border border-purple-800 flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <Eye className="w-3 h-3" />
                  <span>Ver en esta pantalla (Privado)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Start Game CTA */}
      <div className="glass-panel p-6 rounded-2xl neon-border-purple text-center flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base">
              ¿Han escaneado todas su expediente?
            </span>
            <span className="text-xs text-purple-300 font-mono">
              ({reviewedPlayers.size} de {players.length} revisados)
            </span>
          </div>
          <p className="text-xs text-purple-200/70 mt-0.5">
            Una vez iniciado el caso se activará el cronómetro, la cronología y las pistas públicas.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={onBackToLobby}
            className="px-4 py-3 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-800 cursor-pointer"
          >
            Volver
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onProceedToGame();
            }}
            className="flex-1 md:flex-initial px-8 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 hover:from-pink-500 hover:via-purple-500 hover:to-red-500 text-white font-black text-sm uppercase tracking-wider border border-pink-300 shadow-xl neon-glow-pink hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>¡EMPEZAR LA INVESTIGACIÓN!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* QR Modal when maximizing */}
      {selectedPlayerForQR && (
        <QRModal
          player={selectedPlayerForQR}
          gameCase={gameCase}
          onClose={() => setSelectedPlayerForQR(null)}
          onOpenDossier={() => {
            const p = selectedPlayerForQR;
            setSelectedPlayerForQR(null);
            setSelectedPlayerForDossier(p);
          }}
        />
      )}

      {/* Dossier Pass & Play Modal */}
      {selectedPlayerForDossier && (
        <DossierModal
          player={selectedPlayerForDossier}
          gameCase={gameCase}
          onClose={() => setSelectedPlayerForDossier(null)}
          onMarkReviewed={() => handleMarkReviewed(selectedPlayerForDossier.name)}
        />
      )}
    </div>
  );
}
