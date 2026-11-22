"use client";

import React, { useEffect, useState } from "react";
import { generateQRDataUrl, buildDossierPlainText, buildDossierStaticHtmlDataUri } from "../utils/qr";
import { ActivePlayer, CaseData } from "../types/game";
import { sounds } from "../utils/audio";
import { X, QrCode, Copy, Check, Eye, Smartphone, ShieldAlert, FileText, Globe } from "lucide-react";

interface QRModalProps {
  player: ActivePlayer;
  gameCase: CaseData;
  onClose: () => void;
  onOpenDossier: () => void;
}

export default function QRModal({ player, gameCase, onClose, onOpenDossier }: QRModalProps) {
  const [qrMode, setQrMode] = useState<"text" | "html">("text");
  const [qrUrl, setQrUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const plainTextDossier = buildDossierPlainText(player, gameCase);
  const staticHtmlDataUri = buildDossierStaticHtmlDataUri(player, gameCase);

  useEffect(() => {
    sounds.playClick();
    const contentToEncode = qrMode === "text" ? plainTextDossier : staticHtmlDataUri;

    generateQRDataUrl(contentToEncode).then((url) => {
      setQrUrl(url);
    });
  }, [player, gameCase, qrMode, plainTextDossier, staticHtmlDataUri]);

  const handleCopyText = () => {
    sounds.playClick();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(plainTextDossier);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="glass-panel max-w-lg w-full rounded-3xl p-5 sm:p-6 border border-pink-500/60 neon-glow-pink relative my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-purple-950/80 text-purple-300 hover:text-white border border-purple-800 hover:border-pink-500 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/50 text-pink-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            CÓDIGO QR · SOLO FICHA DE INFORMACIÓN
          </div>
          <h2 className="text-2xl font-black text-white">
            Expediente de <span className="neon-text-pink">{player.name}</span>
          </h2>
          <p className="text-xs text-purple-200/80 mt-1">
            Al escanearlo mostrará directamente la ficha de información de {player.name} (<strong>sin nada de JavaScript</strong>).
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setQrMode("text");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              qrMode === "text"
                ? "bg-pink-600 border-pink-400 text-white neon-glow-pink"
                : "bg-purple-950/60 border-purple-800 text-purple-300"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ficha en Texto (Cámara nativa)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setQrMode("html");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              qrMode === "html"
                ? "bg-purple-600 border-purple-400 text-white neon-glow-purple"
                : "bg-purple-950/60 border-purple-800 text-purple-300"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Ficha HTML Estática (Sin JS)</span>
          </button>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-3 rounded-2xl shadow-2xl flex flex-col items-center justify-center mx-auto w-64 h-64 border-4 border-pink-500/40 neon-glow-pink">
          {qrUrl ? (
            <img src={qrUrl} alt={`QR de ${player.name}`} className="w-56 h-56 rounded-lg object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-purple-900">
              <QrCode className="w-8 h-8 animate-spin" />
              <span className="text-xs font-bold">Generando ficha...</span>
            </div>
          )}
        </div>

        {/* Scan instruction */}
        <div className="mt-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-purple-200">
            <Smartphone className="w-4 h-4 text-pink-400" />
            <span>Apunta con la cámara de tu móvil o iPad</span>
          </div>
          <p className="text-[11px] text-purple-300/60">
            {qrMode === "text"
              ? "Tu cámara mostrará directamente la ficha con tus horarios, coartada y objetivo secreto."
              : "Abrirá una tarjeta HTML estática estilizada en tu navegador sin ejecutar ningún script."}
          </p>
        </div>

        {/* Text Preview Toggle */}
        <div className="mt-4 border-t border-purple-800/60 pt-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-pink-300 hover:text-white font-bold underline cursor-pointer"
            >
              {showPreview ? "Ocultar previsualización" : "Previsualizar texto del QR"}
            </button>
            <button
              type="button"
              onClick={handleCopyText}
              className="text-purple-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 font-bold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar texto</span>
                </>
              )}
            </button>
          </div>

          {showPreview && (
            <div className="p-3 rounded-xl bg-black/60 border border-purple-800/80 text-[11px] font-mono text-purple-200 max-h-40 overflow-y-auto whitespace-pre-line leading-relaxed mb-3">
              {plainTextDossier}
            </div>
          )}
        </div>

        {/* Alternative Button */}
        <div className="mt-3">
          <button
            type="button"
            onClick={onOpenDossier}
            className="w-full py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 hover:text-white font-bold text-xs border border-purple-700 flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>O ver en esta pantalla (Modo Pase y Juegue)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
