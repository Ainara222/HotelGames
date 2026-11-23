"use client";

import React, { useState, useEffect, useRef } from "react";
import { sounds } from "../utils/audio";
import { PEER_CONFIG } from "../utils/roomNetwork";
import {
  Smartphone,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  MapPin,
  Target,
  ShieldAlert,
  Vote,
  Trophy,
  EyeOff,
  Eye,
  AlertCircle
} from "lucide-react";

interface RoomJoinProps {
  initialRoomCode?: string;
  onBackToMenu?: () => void;
}

export default function RoomJoin({ initialRoomCode = "", onBackToMenu }: RoomJoinProps) {
  const [roomCode, setRoomCode] = useState<string>(initialRoomCode.toUpperCase());
  const [playerName, setPlayerName] = useState<string>("");

  // Connection state: "input", "connecting", "waiting", "in_game", "voting", "resolution"
  const [clientState, setClientState] = useState<
    "input" | "connecting" | "waiting" | "in_game" | "voting" | "resolution"
  >("input");
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Game data received from Host
  const [myDossier, setMyDossier] = useState<any>(null);
  const [gameCase, setGameCase] = useState<any>(null);
  const [isDossierRevealed, setIsDossierRevealed] = useState<boolean>(false);

  // Voting state
  const [votingData, setVotingData] = useState<{
    players: string[];
    timeOptions: string[];
    methodOptions: string[];
  } | null>(null);
  const [selectedAccused, setSelectedAccused] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  // Resolution state
  const [resolutionData, setResolutionData] = useState<any>(null);

  const connRef = useRef<any>(null);
  const peerRef = useRef<any>(null);

  const handleJoin = () => {
    const code = roomCode.trim().toUpperCase();
    const name = playerName.trim();

    if (!code || code.length < 3) {
      alert("Por favor escribe un código de sala válido.");
      return;
    }
    if (!name) {
      alert("Por favor escribe tu nombre.");
      return;
    }

    sounds.playClick();
    setClientState("connecting");
    setConnectionError(null);

    import("peerjs").then(({ Peer }) => {
      const randomSuffix = Math.floor(Math.random() * 9000 + 1000);
      const myPeerId = `chivatazo-player-${code.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]/g, "")}-${randomSuffix}`;

      if (peerRef.current) {
        try { peerRef.current.destroy(); } catch {}
      }

      const peer = new Peer(myPeerId, PEER_CONFIG);
      peerRef.current = peer;

      let hasConnected = false;
      let pingInterval: ReturnType<typeof setInterval> | null = null;

      const timeoutId = setTimeout(() => {
        if (!hasConnected) {
          setConnectionError(`Tiempo de espera agotado conectando con la sala ${code}. Comprueba que la sala esté abierta en la tablet/pantalla de la anfitriona.`);
          setClientState("input");
          try { peer.destroy(); } catch {}
        }
      }, 15000);

      peer.on("disconnected", () => {
        console.warn("Cliente desconectado del broker de señalización, reconectando...");
        try { peer.reconnect(); } catch {}
      });

      peer.on("open", () => {
        const hostPeerId = `chivatazo-room-${code.toLowerCase()}`;
        const conn = peer.connect(hostPeerId, { reliable: true });
        connRef.current = conn;

        conn.on("open", () => {
          hasConnected = true;
          clearTimeout(timeoutId);
          conn.send({
            type: "JOIN",
            playerName: name,
          });
          setClientState("waiting");

          // Keep-alive heartbeat cada 5s para evitar desconexiones en redes móviles (4G/5G)
          pingInterval = setInterval(() => {
            if (conn && conn.open) {
              try { conn.send({ type: "PING" }); } catch {}
            }
          }, 5000);
        });

        conn.on("data", (data: any) => {
          if (!data) return;

          if (data.type === "PING") {
            try { conn.send({ type: "PONG" }); } catch {}
            return;
          }
          if (data.type === "PONG") {
            return;
          }

          if (data.type === "JOIN_ACCEPTED") {
            setClientState("waiting");
          } else if (data.type === "GAME_STARTED") {
            sounds.playClueAlert();
            setMyDossier(data.dossier);
            setGameCase(data.gameCase);
            setClientState("in_game");
          } else if (data.type === "VOTING_STARTED") {
            sounds.playClick();
            setVotingData({
              players: data.players || [],
              timeOptions: data.timeOptions || [],
              methodOptions: data.methodOptions || [],
            });
            setClientState("voting");
          } else if (data.type === "GAME_RESOLUTION") {
            sounds.playRevealFanfare();
            setResolutionData(data);
            setClientState("resolution");
          }
        });

        conn.on("error", (err: any) => {
          console.error("Connection error:", err);
          clearTimeout(timeoutId);
          if (pingInterval) clearInterval(pingInterval);
          setConnectionError("Error de conexión P2P con la sala. Revisa tu conexión a internet o el código.");
          setClientState("input");
        });

        conn.on("close", () => {
          if (pingInterval) clearInterval(pingInterval);
        });
      });

      peer.on("error", (err: any) => {
        console.error("Peer error:", err);
        clearTimeout(timeoutId);
        if (pingInterval) clearInterval(pingInterval);
        setConnectionError(`No se pudo conectar a la sala ${code}. Verifica que el código sea correcto.`);
        setClientState("input");
      });
    });
  };

  const handleSendVote = () => {
    if (!selectedAccused || !selectedTime || !selectedMethod) {
      alert("Por favor completa las 3 preguntas antes de votar.");
      return;
    }
    sounds.playClick();
    if (connRef.current && connRef.current.open) {
      connRef.current.send({
        type: "SUBMIT_VOTE",
        vote: {
          voterName: playerName,
          accusedPlayerName: selectedAccused,
          guessedTime: selectedTime,
          guessedMethod: selectedMethod,
        },
      });
    }
    setHasVoted(true);
  };

  // 1. INPUT FORM
  if (clientState === "input") {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/80 border border-pink-500/50 text-pink-300 text-xs font-bold uppercase mb-2 neon-glow-pink">
            <Smartphone className="w-3.5 h-3.5" />
            UNIRSE A LA PARTIDA
          </div>
          <h1 className="text-3xl font-black text-white">
            EL <span className="neon-text-pink">CHIVATAZO</span>
          </h1>
          <p className="text-xs text-purple-200/80 mt-1">
            Conecta tu móvil con la pantalla principal para recibir tu ficha automáticamente.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-pink-500/60 neon-glow-pink space-y-4">
          {connectionError && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{connectionError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-purple-300 uppercase mb-1">
              Código de la Sala (4 letras)
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Ej: IBIZ"
              maxLength={6}
              className="w-full bg-purple-950/60 border border-purple-800 rounded-xl px-4 py-3 text-2xl font-black font-mono text-center tracking-widest text-white uppercase focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-300 uppercase mb-1">
              Tu Nombre
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Ej: Ainara, Saray, Marta..."
              maxLength={20}
              className="w-full bg-purple-950/60 border border-purple-800 rounded-xl px-4 py-3 text-base font-bold text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <button
            type="button"
            onClick={handleJoin}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 hover:from-pink-500 text-white font-black text-base uppercase tracking-wider border border-pink-300 shadow-xl neon-glow-pink cursor-pointer transition-all"
          >
            ¡UNIRME A LA SALA!
          </button>

          {onBackToMenu && (
            <button
              type="button"
              onClick={onBackToMenu}
              className="w-full py-2 text-center text-xs text-purple-300 hover:text-white underline cursor-pointer"
            >
              ← Volver al Menú Principal
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. CONNECTING / WAITING ROOM
  if (clientState === "connecting" || clientState === "waiting") {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="glass-panel p-8 rounded-3xl border border-pink-500/60 neon-glow-pink space-y-4">
          <div className="w-20 h-20 rounded-full bg-purple-950 border-2 border-pink-500 flex items-center justify-center mx-auto neon-glow-pink animate-pulse text-3xl">
            {clientState === "connecting" ? "🔄" : "🟢"}
          </div>

          <div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-950 text-green-300 font-bold border border-green-500/50 uppercase tracking-wider">
              {clientState === "connecting" ? "Conectando..." : "SALA CONECTADA"}
            </span>
            <h2 className="text-2xl font-black text-white mt-2">
              ¡Bienvenida, <span className="neon-text-pink">{playerName}</span>!
            </h2>
            <p className="text-xs text-purple-300 mt-1">
              Estás en la sala: <strong className="text-white font-mono">{roomCode}</strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-800 text-xs text-purple-200 leading-relaxed">
            ⏳ Ponte cómoda. En cuanto la anfitriona pulse <strong>&quot;¡Empezar Partida!&quot;</strong> en la tablet, aparecerá automáticamente aquí en tu móvil tu <strong>expediente secreto</strong>.
          </div>
        </div>
      </div>
    );
  }

  // 3. IN GAME: DOSSIER VIEW ON MOBILE
  if (clientState === "in_game" && myDossier) {
    const isCulprit = myDossier.isCulprit;

    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/80 border border-pink-500/50 text-pink-300 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            EXPEDIENTE SECRETO · {playerName.toUpperCase()}
          </div>
          <h1 className="text-xl font-black text-white">
            {gameCase?.title || "Caso Activo"}
          </h1>
        </div>

        {!isDossierRevealed ? (
          <div className="glass-panel p-8 rounded-3xl border border-pink-500/60 neon-glow-pink text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-purple-950 border-2 border-pink-500 flex items-center justify-center mx-auto neon-glow-pink animate-pulse text-3xl">
              🔒
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Ficha Protegida</h2>
              <p className="text-xs text-purple-200/80 mt-1">
                Asegúrate de que nadie a tu lado esté mirando tu pantalla.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsDossierRevealed(true);
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-sm uppercase tracking-wider border border-pink-300 shadow-xl neon-glow-pink cursor-pointer"
            >
              <Unlock className="w-4 h-4 inline mr-2" />
              TOCA PARA VER MI FICHA
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsDossierRevealed(false);
              }}
              className="w-full py-2 rounded-xl bg-purple-950 text-purple-200 text-xs font-bold border border-purple-800 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Ocultar pantalla por si miran</span>
            </button>

            {/* Role Card */}
            <div
              className={`p-4 rounded-2xl border ${
                isCulprit
                  ? "bg-red-950/70 border-red-500 neon-border-red"
                  : "bg-purple-950/40 border-purple-600/60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-300">Tu Personaje:</span>
                  <h2 className="text-xl font-black text-white mt-0.5">
                    {myDossier.avatar} {myDossier.roleTitle}
                  </h2>
                </div>
                {isCulprit ? (
                  <span className="px-2.5 py-1 rounded-full bg-red-600 text-white font-black text-xs border border-red-300 neon-glow-red animate-pulse">
                    ¡CULPABLE!
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-green-950 text-green-300 font-bold text-xs border border-green-500/50">
                    INOCENTE
                  </span>
                )}
              </div>

              {isCulprit ? (
                <div className="mt-3 p-3 rounded-xl bg-red-950 border border-red-800 text-xs text-red-200">
                  ⚠️ Fuiste tú quien lo hizo. Mantén tus horarios reales para no contradecirte, pero da excusas o acusa a otra para no levantar sospechas.
                </div>
              ) : (
                <p className="mt-2 text-xs text-purple-200/80">
                  Eres inocente. Defiende tu coartada y descubre qué amiga está ocultando cosas.
                </p>
              )}
            </div>

            {/* Secret Objective */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/50 to-purple-950/50 border border-pink-500/50 neon-glow-pink">
              <div className="text-pink-300 font-bold text-xs uppercase mb-1">🎯 Objetivo Secreto</div>
              <p className="text-xs text-white font-semibold leading-relaxed">
                {myDossier.secretObjective}
              </p>
            </div>

            {/* Timetable */}
            <div className="glass-panel p-4 rounded-2xl border border-purple-500/40">
              <div className="text-purple-300 font-bold text-xs uppercase mb-2">⏱️ Tus Horarios</div>
              <div className="space-y-2">
                {myDossier.movements.map((m: any, idx: number) => (
                  <div key={idx} className="p-2 rounded-xl bg-purple-950/50 flex items-start gap-2 text-xs">
                    <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-pink-950 text-pink-300 shrink-0">
                      {m.time}
                    </span>
                    <div>
                      <strong className="text-white">{m.place}:</strong>{" "}
                      <span className="text-purple-200">{m.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Known Clues */}
            <div className="glass-panel p-4 rounded-2xl border border-pink-500/40">
              <div className="text-pink-300 font-bold text-xs uppercase mb-2">🔍 Pistas Que Conoces</div>
              <ul className="space-y-1.5 text-xs text-purple-100">
                {myDossier.knownInfo.map((info: string, idx: number) => (
                  <li key={idx} className="p-2 rounded-xl bg-pink-950/20">• {info}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. VOTING FROM MOBILE
  if (clientState === "voting" && votingData) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="glass-panel p-6 rounded-3xl border border-pink-500/60 neon-glow-pink space-y-5">
          <div className="text-center">
            <span className="text-xs font-bold text-pink-300 uppercase">Votación Secreta</span>
            <h2 className="text-xl font-black text-white mt-1">¿Cuál es tu Veredicto?</h2>
          </div>

          {!hasVoted ? (
            <>
              <div>
                <label className="block text-xs font-bold text-purple-300 uppercase mb-2">
                  1. ¿Quién es la culpable?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {votingData.players
                    .filter((p) => p !== playerName)
                    .map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSelectedAccused(p)}
                        className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                          selectedAccused === p
                            ? "bg-pink-600 text-white border-pink-300 neon-glow-pink"
                            : "bg-purple-950/60 text-purple-200 border-purple-800"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-300 uppercase mb-2">
                  2. ¿A qué hora ocurrió?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {votingData.timeOptions.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={`p-2 rounded-xl border font-mono text-xs cursor-pointer ${
                        selectedTime === t
                          ? "bg-purple-600 text-white border-purple-300 neon-glow-purple font-bold"
                          : "bg-purple-950/60 text-purple-200 border-purple-800"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-300 uppercase mb-2">
                  3. Método o pista clave
                </label>
                <div className="space-y-1.5">
                  {votingData.methodOptions.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMethod(m)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs cursor-pointer ${
                        selectedMethod === m
                          ? "bg-red-950/80 text-white border-red-400 neon-glow-red font-bold"
                          : "bg-purple-950/60 text-purple-200 border-purple-800"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendVote}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-sm uppercase tracking-wider border border-pink-300 shadow-xl neon-glow-pink cursor-pointer"
              >
                ENVIAR MI VOTO A LA SALA
              </button>
            </>
          ) : (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-black text-white">¡Voto Registrado con Éxito!</h3>
              <p className="text-xs text-purple-300">
                Mira la pantalla principal para ver la gran revelación.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 5. RESOLUTION
  if (clientState === "resolution" && resolutionData) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <div className="glass-panel p-6 rounded-3xl border-2 border-red-500 neon-glow-red space-y-4">
          <span className="text-xs font-black text-red-300 uppercase tracking-wider">
            ¡FIN DE LA PARTIDA!
          </span>
          <h2 className="text-2xl font-black text-white">
            La culpable era: <span className="neon-text-red">{resolutionData.culpritName}</span>
          </h2>
          <div className="text-sm font-bold text-purple-200">
            ({resolutionData.culpritRole})
          </div>
          <p className="text-xs text-purple-200/90 text-left bg-black/60 p-4 rounded-xl border border-purple-800">
            {resolutionData.solutionStory}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
