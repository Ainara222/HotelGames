"use client";

import React, { useState, useEffect, useRef } from "react";
import { CaseData, PlayerCount, ActivePlayer } from "../types/game";
import { CASES } from "../data/cases";
import { sounds } from "../utils/audio";
import { generateRoomCode } from "../utils/roomNetwork";
import { generateQRDataUrl } from "../utils/qr";
import {
  Users,
  QrCode,
  Copy,
  Check,
  Play,
  Sparkles,
  Smartphone,
  X,
  Plus,
  Beaker,
} from "lucide-react";

interface RoomHostProps {
  onStartOnlineGame: (
    roomCode: string,
    players: ActivePlayer[],
    chosenCase: CaseData,
    timerSeconds: number,
    connections: Map<string, any>,
  ) => void;
  onBack: () => void;
}

export default function RoomHost({ onStartOnlineGame, onBack }: RoomHostProps) {
  const [roomCode] = useState<string>(() => generateRoomCode());
  const joinUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}?room=${roomCode}`
      : "";
  const [roomQrUrl, setRoomQrUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Jugadoras conectadas
  const [connectedPlayers, setConnectedPlayers] = useState<string[]>([]);
  const [manualNameInput, setManualNameInput] = useState<string>("");

  // Configuración de la partida
  const [selectedCaseId, setSelectedCaseId] = useState<number>(CASES[0].id);
  const [isRandomCase, setIsRandomCase] = useState<boolean>(false);
  const [timerMinutes, setTimerMinutes] = useState<number>(15);

  const peerRef = useRef<any>(null);
  const connectionsMap = useRef<Map<string, any>>(new Map());

  // Evitar perder la sesión al navegar hacia atrás
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const onPopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", onPopState);

    const beforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, []);

  // Inicializar sala y conexión PeerJS
  useEffect(() => {
    let peerInstance: any = null;
    let isCancelled = false;

    if (typeof window !== "undefined") {

      generateQRDataUrl(joinUrl).then((qr) => {
        if (!isCancelled) {
          setRoomQrUrl(qr);
        }
      });

      import("peerjs").then(({ Peer }) => {
        if (isCancelled) return;

        const peerId = `chivatazo-room-${roomCode.toLowerCase()}`;

        peerInstance = new Peer(peerId, {
          debug: 1,
        });

        peerRef.current = peerInstance;

        peerInstance.on("open", (id: string) => {
          console.log("Host Peer opened with ID:", id);
        });

        peerInstance.on("connection", (conn: any) => {
          conn.on("data", (data: any) => {
            if (data && data.type === "JOIN" && data.playerName) {
              const name = data.playerName.trim();

              if (!name) return;

              connectionsMap.current.set(name, conn);

              setConnectedPlayers((prev) => {
                if (prev.includes(name)) return prev;

                sounds.playClick();
                return [...prev, name];
              });

              conn.send({
                type: "JOIN_ACCEPTED",
                roomCode,
                playerName: name,
              });
            }
          });

          conn.on("close", () => {
            // Aquí se puede gestionar la desconexión de jugadoras.
          });
        });

        peerInstance.on("error", (err: any) => {
          console.warn("PeerJS host warning/error:", err);
        });
      });
    }

    return () => {
      isCancelled = true;

      if (peerInstance) {
        peerInstance.destroy();
      }

      peerRef.current = null;
    };
  }, [roomCode]);

  // Copiar enlace de la sala
  const handleCopy = () => {
    sounds.playClick();

    if (navigator?.clipboard && joinUrl) {
      navigator.clipboard.writeText(joinUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  // Añadir jugadora manualmente
  const handleAddManualPlayer = () => {
    const trimmed = manualNameInput.trim();

    if (trimmed && !connectedPlayers.includes(trimmed)) {
      sounds.playClick();
      setConnectedPlayers((prev) => [...prev, trimmed]);
      setManualNameInput("");
    }
  };

  // Eliminar jugadora
  const handleRemovePlayer = (name: string) => {
    sounds.playClick();

    setConnectedPlayers((prev) => prev.filter((p) => p !== name));
    connectionsMap.current.delete(name);
  };

  // Iniciar partida
  const handleStartGame = (players: string[] = connectedPlayers) => {
    if (players.length < 4) {
      alert("Hacen falta al menos 4 jugadoras para iniciar la partida.");
      return;
    }

    sounds.playClick();

    // Seleccionar caso
    let chosenCase: CaseData;

    if (isRandomCase) {
      chosenCase = CASES[Math.floor(Math.random() * CASES.length)];
    } else {
      chosenCase = CASES.find((c) => c.id === selectedCaseId) || CASES[0];
    }

    // Limitar número de jugadoras entre 4 y 7
    const count = Math.min(Math.max(players.length, 4), 7) as PlayerCount;
    const activeNames = players.slice(0, count);

    // Obtener configuración de roles
    const roleConfig = chosenCase.dossiersByPlayerCount[count];
    const shuffledRoles = [...roleConfig.roles].sort(() => Math.random() - 0.5);

    // Asignar roles a las jugadoras
    const assignedPlayers: ActivePlayer[] = activeNames.map((name, idx) => {
      const roleObj = shuffledRoles[idx % shuffledRoles.length];

      return {
        id: `p_${idx + 1}`,
        name,
        roleId: roleObj.roleId,
        roleName: roleObj.roleName,
        dossier: { ...roleObj.dossier },
      };
    });

    // Enviar fichas secretas a los móviles conectados
    assignedPlayers.forEach((player) => {
      const conn = connectionsMap.current.get(player.name);

      if (conn && conn.open) {
        conn.send({
          type: "GAME_STARTED",
          playerName: player.name,
          dossier: player.dossier,
          gameCase: {
            id: chosenCase.id,
            title: chosenCase.title,
            location: chosenCase.location,
            incidentTime: chosenCase.incidentTime,
            synopsis: chosenCase.synopsis,
            publicTimeline: chosenCase.publicTimeline,
          },
        });
      }
    });

    // Iniciar partida en el anfitrión
    onStartOnlineGame(
      roomCode,
      assignedPlayers,
      chosenCase,
      timerMinutes * 60,
      connectionsMap.current,
    );
  };

  // Iniciar partida de prueba
  const handleTestGame = () => {
    const testPlayers = ["Ana", "Berta", "Clara", "Diana"];

    setConnectedPlayers(testPlayers);
    handleStartGame(testPlayers);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Banner superior */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-950/80 border border-pink-500/50 text-pink-300 text-xs font-bold uppercase tracking-wider mb-2 neon-glow-pink">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          SALA MULTIJUGADOR EN VIVO (GITHUB PAGES)
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-white">
          SALA DE JUEGO:{" "}
          <span className="neon-text-pink font-mono tracking-widest">
            {roomCode}
          </span>
        </h1>

        <p className="text-sm md:text-base text-purple-200/80 mt-1 max-w-lg mx-auto">
          Tus amigas solo tienen que escanear el QR o escribir el código de sala
          en su móvil para unirse.
        </p>
      </div>

      {/* Botón Tester */}
      <button
        type="button"
        onClick={handleTestGame}
        className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/50 text-pink-300 text-xs font-bold uppercase tracking-wider hover:bg-purple-900"
      >
        <Beaker className="w-4 h-4" />
        Tester
      </button>

      {/* QR de la sala */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-panel p-6 rounded-3xl border border-pink-500/60 neon-glow-pink text-center">
          <h2 className="text-sm font-black text-white uppercase tracking-wider mb-1">
            📱 Código QR de la Sala
          </h2>

          <p className="text-xs text-purple-200/70 mb-4">
            Apunta la cámara de tu móvil para unirte automáticamente
          </p>

          <div className="bg-white p-4 rounded-2xl shadow-2xl border-4 border-pink-500/40 neon-glow-pink mx-auto w-64 h-64 flex items-center justify-center">
            {roomQrUrl ? (
              <img
                src={roomQrUrl}
                alt="QR Sala"
                className="w-56 h-56 rounded-lg object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-purple-900">
                <QrCode className="w-8 h-8 animate-spin" />
                <span className="text-xs font-bold">Generando código...</span>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-purple-950/60 border border-purple-800">
            <div className="text-[11px] text-purple-300 font-bold uppercase">
              Código para escribir:
            </div>

            <div className="text-3xl font-black font-mono text-white tracking-widest neon-text-pink my-1">
              {roomCode}
            </div>

            <div className="text-[10px] text-purple-300/70">
              <p>O visita la web y pulsa Unirme a Sala </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="mt-3 w-full py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 hover:text-white font-bold text-xs border border-purple-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">¡Enlace de sala copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar enlace para WhatsApp</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Jugadoras y configuración */}
      <div className="lg:col-span-7 space-y-6">
        {/* Jugadoras conectadas */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/50 neon-border-purple">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />

              <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
                Jugadoras Conectadas ({connectedPlayers.length}/7)
              </h2>
            </div>

            <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-950 text-green-300 font-bold border border-green-500/50">
              En vivo 🟢
            </span>
          </div>

          {connectedPlayers.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-purple-900/60 rounded-2xl">
              <Smartphone className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-bounce" />

              <p className="text-sm font-bold text-white">
                Esperando a que tus amigas se unan...
              </p>

              <p className="text-xs text-purple-300/70 mt-1 max-w-sm mx-auto">
                Escanead el código QR de la izquierda o escribid el código{" "}
                <strong className="text-pink-400">{roomCode}</strong> en vuestro
                móvil.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              {connectedPlayers.map((name, idx) => (
                <div
                  key={name}
                  className="p-3 rounded-xl bg-purple-950/60 border border-green-500/50 flex items-center justify-between shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </div>

                    <span className="font-bold text-sm text-white">{name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-green-400 font-bold">
                      Móvil conectado ✓
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemovePlayer(name)}
                      className="text-purple-400 hover:text-red-400 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Añadir jugadora manualmente */}
          <div className="mt-4 pt-3 border-t border-purple-800/50 flex gap-2">
            <input
              type="text"
              value={manualNameInput}
              onChange={(e) => setManualNameInput(e.target.value)}
              placeholder="Añadir jugadora manual (sin móvil)..."
              maxLength={20}
              className="flex-1 bg-purple-950/40 border border-purple-800/80 rounded-xl px-3 py-2 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-pink-500"
            />

            <button
              type="button"
              onClick={handleAddManualPlayer}
              className="px-3 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-bold border border-purple-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir</span>
            </button>
          </div>
        </div>

        {/* Configuración del caso y temporizador */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/50 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Configuración del Caso
            </h2>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsRandomCase(!isRandomCase);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-bold border cursor-pointer ${
                isRandomCase
                  ? "bg-pink-600 border-pink-400 text-white neon-glow-pink"
                  : "bg-purple-950/60 border-purple-800 text-purple-300"
              }`}
            >
              🎲 {isRandomCase ? "¡Caso Sorpresa!" : "Aleatorio"}
            </button>
          </div>

          {!isRandomCase && (
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(Number(e.target.value))}
              className="w-full bg-purple-950/80 border border-purple-800 rounded-xl p-3 text-white text-xs font-bold focus:outline-none focus:border-pink-500 cursor-pointer"
            >
              {CASES.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                  className="bg-purple-950 text-white"
                >
                  {c.id}. {c.emoji} {c.title} ({c.category})
                </option>
              ))}
            </select>
          )}

          {/* Temporizador */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {[10, 15, 20, 0].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setTimerMinutes(mins)}
                className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  timerMinutes === mins
                    ? "bg-pink-600 border-pink-400 text-white neon-glow-pink font-black"
                    : "bg-purple-950/40 border-purple-800 text-purple-300"
                }`}
              >
                {mins === 0 ? "Libre" : `${mins} min`}
              </button>
            ))}
          </div>
        </div>

        {/* Botones de inicio y vuelta */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-4 rounded-2xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-800 cursor-pointer"
          >
            Volver
          </button>

          <button
            type="button"
            onClick={() => handleStartGame()}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 hover:from-pink-500 hover:via-purple-500 hover:to-red-500 text-white font-black text-sm sm:text-base uppercase tracking-wider border border-white/40 shadow-2xl neon-glow-pink cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>¡EMPEZAR PARTIDA Y ENVIAR FICHAS A LOS MÓVILES!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
