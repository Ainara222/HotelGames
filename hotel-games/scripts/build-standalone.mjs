import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CASES } from "../app/data/cases.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const qrcodeJs = fs.readFileSync(
  path.join(rootDir, "node_modules", "qrcode-generator", "dist", "qrcode.js"),
  "utf-8"
);
const confettiJs = fs.readFileSync(
  path.join(rootDir, "node_modules", "canvas-confetti", "dist", "confetti.browser.js"),
  "utf-8"
);
const peerjsJs = fs.readFileSync(
  path.join(rootDir, "node_modules", "peerjs", "dist", "peerjs.min.js"),
  "utf-8"
);

const casesJson = JSON.stringify(CASES);

const standaloneHtml = `<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>EL CHIVATAZO · Expedientes Secretos (GitHub Pages)</title>
  <meta name="description" content="Juego interactivo multijugador para fiestas y amigas. Códigos de sala, QR de unión, fichas confidenciales automáticas en el móvil y estética neón.">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="theme-color" content="#080312">
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style>
    :root {
      --background: #080312;
      --foreground: #f3f0fa;
    }
    body {
      background-color: #080312;
      color: #f3f0fa;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(168, 85, 247, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 85% 20%, rgba(236, 72, 153, 0.15) 0%, transparent 45%),
        radial-gradient(circle at 50% 85%, rgba(239, 68, 68, 0.12) 0%, transparent 50%);
      background-attachment: fixed;
    }
    .neon-glow-pink {
      box-shadow: 0 0 15px rgba(236, 72, 153, 0.45), 0 0 30px rgba(236, 72, 153, 0.2);
    }
    .neon-glow-purple {
      box-shadow: 0 0 15px rgba(168, 85, 247, 0.45), 0 0 30px rgba(168, 85, 247, 0.2);
    }
    .neon-glow-red {
      box-shadow: 0 0 15px rgba(239, 68, 68, 0.45), 0 0 30px rgba(239, 68, 68, 0.2);
    }
    .neon-border-pink {
      border: 1px solid rgba(236, 72, 153, 0.6);
      box-shadow: inset 0 0 10px rgba(236, 72, 153, 0.2), 0 0 15px rgba(236, 72, 153, 0.3);
    }
    .neon-border-purple {
      border: 1px solid rgba(168, 85, 247, 0.6);
      box-shadow: inset 0 0 10px rgba(168, 85, 247, 0.2), 0 0 15px rgba(168, 85, 247, 0.3);
    }
    .neon-border-red {
      border: 1px solid rgba(239, 68, 68, 0.6);
      box-shadow: inset 0 0 10px rgba(239, 68, 68, 0.2), 0 0 15px rgba(239, 68, 68, 0.3);
    }
    .neon-text-pink {
      color: #ff3399;
      text-shadow: 0 0 10px rgba(255, 51, 153, 0.7), 0 0 20px rgba(255, 51, 153, 0.4);
    }
    .neon-text-purple {
      color: #c084fc;
      text-shadow: 0 0 10px rgba(192, 132, 252, 0.7), 0 0 20px rgba(192, 132, 252, 0.4);
    }
    .neon-text-red {
      color: #ff3366;
      text-shadow: 0 0 10px rgba(255, 51, 102, 0.7), 0 0 20px rgba(255, 51, 102, 0.4);
    }
    .glass-panel {
      background: rgba(18, 10, 28, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #0f071d;
    }
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #ec4899, #a855f7);
      border-radius: 4px;
    }
  </style>
  <script>
    ${qrcodeJs}
  </script>
  <script>
    ${confettiJs}
  </script>
  <script>
    ${peerjsJs}
  </script>
</head>
<body class="selection:bg-pink-500 selection:text-white">
  <div id="app" class="min-h-screen flex flex-col justify-between py-6"></div>

  <script>
    const CASES = ${casesJson};

    class SoundEffects {
      constructor() {
        this.ctx = null;
      }
      getContext() {
        if (!this.ctx && window.AudioContext) {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx && this.ctx.state === "suspended") {
          this.ctx.resume();
        }
        return this.ctx;
      }
      playClick() {
        try {
          const ctx = this.getContext();
          if (!ctx) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(600, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.08);
        } catch {}
      }
      playClueAlert() {
        try {
          const ctx = this.getContext();
          if (!ctx) return;
          const now = ctx.currentTime;
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = "sawtooth";
          osc2.type = "triangle";
          osc1.frequency.setValueAtTime(350, now);
          osc1.frequency.exponentialRampToValueAtTime(700, now + 0.15);
          osc1.frequency.exponentialRampToValueAtTime(450, now + 0.35);
          osc2.frequency.setValueAtTime(175, now);
          osc2.frequency.exponentialRampToValueAtTime(350, now + 0.15);
          osc2.frequency.exponentialRampToValueAtTime(225, now + 0.35);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.45);
          osc2.stop(now + 0.45);
        } catch {}
      }
      playTick(high = false) {
        try {
          const ctx = this.getContext();
          if (!ctx) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(high ? 880 : 440, ctx.currentTime);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.06);
        } catch {}
      }
      playRevealFanfare() {
        try {
          const ctx = this.getContext();
          if (!ctx) return;
          const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
          notes.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const start = ctx.currentTime + index * 0.09;
            osc.type = "square";
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.12, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 0.3);
          });
        } catch {}
      }
    }
    const sounds = new SoundEffects();

    function generateQR(text) {
      try {
        const qr = qrcode(0, 'M');
        qr.addData(text);
        qr.make();
        return qr.createDataURL(6, 4);
      } catch (e) {
        console.error("QR Error", e);
        return "";
      }
    }

    function generateRoomCode() {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let code = "";
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }

    const state = {
      view: "home_select", // home_select, room_host, room_join, offline_lobby, assignment, game, voting, resolution
      // Room Host state
      roomCode: generateRoomCode(),
      connectedPlayers: [],
      peerConnections: {}, // playerName -> DataConnection
      hostPeer: null,
      selectedCaseId: 1,
      isRandomCase: false,
      timerMinutes: 15,
      activeCase: null,
      activePlayers: [],
      // Player Client state
      joinRoomCodeInput: "",
      playerNameInput: "",
      clientPeer: null,
      clientConn: null,
      clientPhase: "input", // input, waiting, in_game, voting, resolution
      myDossier: null,
      myCaseInfo: null,
      isDossierRevealed: false,
      // Voting
      votes: [],
      selectedAccused: "",
      selectedTime: "",
      selectedMethod: "",
      hasVoted: false,
      // Timer
      secondsRemaining: 900,
      elapsedSeconds: 0,
      isTimerRunning: false,
      timerInterval: null,
      clue1Unlocked: false,
      clue2Unlocked: false,
      newClueAlert: null,
      activeTab: "timeline",
      // Offline fallback names
      offlineNames: ["Ainara", "Saray", "Marta", "Paula", "Elena", "Claudia", "Lucía"],
      offlineCount: 7
    };

    function checkUrlParams() {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get("room");
      if (roomParam) {
        state.joinRoomCodeInput = roomParam.toUpperCase();
        state.view = "room_join";
      }
    }

    function initHostPeer() {
      if (state.hostPeer) return;
      const peerId = "chivatazo-room-" + state.roomCode.toLowerCase();
      try {
        state.hostPeer = new Peer(peerId, { debug: 1 });
        state.hostPeer.on("open", id => {
          console.log("Host room peer ready:", id);
        });
        state.hostPeer.on("connection", conn => {
          conn.on("data", data => {
            if (data && data.type === "JOIN" && data.playerName) {
              const name = data.playerName.trim();
              state.peerConnections[name] = conn;
              if (!state.connectedPlayers.includes(name)) {
                sounds.playClick();
                state.connectedPlayers.push(name);
                render();
              }
              conn.send({ type: "JOIN_ACCEPTED", roomCode: state.roomCode });
            } else if (data && data.type === "SUBMIT_VOTE" && data.vote) {
              state.votes.push(data.vote);
              render();
            }
          });
        });
        state.hostPeer.on("error", err => {
          console.warn("Host peer warning:", err);
        });
      } catch (e) {
        console.error("PeerJS init error", e);
      }
    }

    function joinRoomClient() {
      const code = state.joinRoomCodeInput.trim().toUpperCase();
      const name = state.playerNameInput.trim();
      if (!code || code.length < 3) { alert("Escribe un código de sala válido."); return; }
      if (!name) { alert("Escribe tu nombre."); return; }

      sounds.playClick();
      state.clientPhase = "waiting";
      render();

      const randSuffix = Math.floor(Math.random() * 9000 + 1000);
      const clientPeerId = "chivatazo-player-" + code.toLowerCase() + "-" + name.toLowerCase().replace(/[^a-z0-9]/g, "") + "-" + randSuffix;
      const hostPeerId = "chivatazo-room-" + code.toLowerCase();

      state.clientPeer = new Peer(clientPeerId, { debug: 1 });
      state.clientPeer.on("open", () => {
        state.clientConn = state.clientPeer.connect(hostPeerId, { reliable: true });
        state.clientConn.on("open", () => {
          state.clientConn.send({ type: "JOIN", playerName: name });
        });
        state.clientConn.on("data", data => {
          if (!data) return;
          if (data.type === "GAME_STARTED") {
            sounds.playClueAlert();
            state.myDossier = data.dossier;
            state.myCaseInfo = data.gameCase;
            state.clientPhase = "in_game";
            render();
          } else if (data.type === "VOTING_STARTED") {
            sounds.playClick();
            state.clientPhase = "voting";
            state.hasVoted = false;
            render();
          } else if (data.type === "GAME_RESOLUTION") {
            sounds.playRevealFanfare();
            state.clientPhase = "resolution";
            state.resolutionInfo = data;
            try { confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } }); } catch {}
            render();
          }
        });
      });
      state.clientPeer.on("error", err => {
        alert("No se pudo conectar a la sala. Comprueba el código.");
        state.clientPhase = "input";
        render();
      });
    }

    function startOnlineHostGame() {
      if (state.connectedPlayers.length < 4) {
        alert("Hacen falta al menos 4 jugadoras para empezar.");
        return;
      }
      sounds.playClick();

      let chosenCase = state.isRandomCase
        ? CASES[Math.floor(Math.random() * CASES.length)]
        : (CASES.find(c => c.id === state.selectedCaseId) || CASES[0]);

      state.activeCase = chosenCase;
      const count = Math.min(Math.max(state.connectedPlayers.length, 4), 7);
      const activeNames = state.connectedPlayers.slice(0, count);

      const roleConfig = chosenCase.dossiersByPlayerCount[count];
      const shuffledRoles = [...roleConfig.roles].sort(() => Math.random() - 0.5);

      state.activePlayers = activeNames.map((name, idx) => {
        const r = shuffledRoles[idx % shuffledRoles.length];
        return {
          id: "p_" + (idx + 1),
          name: name,
          roleId: r.roleId,
          roleName: r.roleName,
          dossier: { ...r.dossier }
        };
      });

      // Broadcast secret dossier to each friend's mobile phone!
      state.activePlayers.forEach(player => {
        const conn = state.peerConnections[player.name];
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
              publicTimeline: chosenCase.publicTimeline
            }
          });
        }
      });

      state.view = "game";
      state.secondsRemaining = state.timerMinutes * 60;
      state.elapsedSeconds = 0;
      state.clue1Unlocked = false;
      state.clue2Unlocked = false;
      state.isTimerRunning = state.timerMinutes > 0;
      state.votes = [];

      if (state.timerInterval) clearInterval(state.timerInterval);
      state.timerInterval = setInterval(() => {
        if (!state.isTimerRunning) return;
        state.elapsedSeconds++;

        if (state.elapsedSeconds === 180 && !state.clue1Unlocked) {
          state.clue1Unlocked = true;
          state.newClueAlert = state.activeCase.progressiveClues[0]?.title || "Nueva Prueba";
          sounds.playClueAlert();
          render();
        }
        if (state.elapsedSeconds === 360 && !state.clue2Unlocked) {
          state.clue2Unlocked = true;
          state.newClueAlert = state.activeCase.progressiveClues[1]?.title || "Segunda Prueba";
          sounds.playClueAlert();
          render();
        }
        if (state.timerMinutes > 0) {
          if (state.secondsRemaining > 0) {
            state.secondsRemaining--;
            if (state.secondsRemaining <= 10 && state.secondsRemaining > 0) sounds.playTick(false);
            if (state.secondsRemaining === 0) { sounds.playTick(true); state.isTimerRunning = false; }
          }
        }
        render();
      }, 1000);

      render();
    }

    function render() {
      const app = document.getElementById("app");
      if (!app) return;

      let html = "";
      if (state.view === "home_select") {
        html = renderHomeSelect();
      } else if (state.view === "room_host") {
        html = renderRoomHost();
      } else if (state.view === "room_join") {
        html = renderRoomJoin();
      } else if (state.view === "game") {
        html = renderGame();
      } else if (state.view === "voting") {
        html = renderVoting();
      } else if (state.view === "resolution") {
        html = renderResolution();
      }

      app.innerHTML = html + \`
        <footer class="text-center py-4 text-xs text-purple-400/50">
          🍸 EL CHIVATAZO: Expedientes Secretos • Partida interactiva para amigas
        </footer>
      \`;
    }

    function renderHomeSelect() {
      return \`
        <div class="max-w-4xl mx-auto px-4 py-8 text-center">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/40 bg-pink-950/30 text-pink-400 text-xs font-semibold tracking-wider uppercase mb-3 neon-glow-pink">
            ✨ Despliegue en GitHub Pages & Móvil
          </div>
          <h1 class="text-4xl sm:text-6xl font-black text-white mb-3">
            EL <span class="neon-text-pink">CHIVATAZO</span>
          </h1>
          <p class="text-sm sm:text-base text-purple-200/80 max-w-xl mx-auto mb-10 font-light">
            Expedientes confidenciales, coartadas, horas exactas y traición.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div onclick="state.view = 'room_host'; initHostPeer(); render();" class="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-500/60 hover:border-pink-400 neon-glow-pink hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between text-left">
              <div>
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center text-white text-3xl shadow-lg mb-4">📱</div>
                <div class="inline-block px-2.5 py-0.5 rounded-full bg-pink-950 text-pink-300 text-[10px] font-bold uppercase mb-1">Para la Anfitriona / Tablet</div>
                <h2 class="text-xl sm:text-2xl font-black text-white">Crear Sala con Código QR</h2>
                <p class="text-xs text-purple-200/80 mt-2 leading-relaxed">
                  Genera un <strong>QR de sala</strong> y código de 4 letras. Tus amigas lo escanean con su móvil y en cuanto empiece el juego <strong>reciben su ficha en su pantalla</strong>.
                </p>
              </div>
              <div class="mt-6 text-pink-400 font-bold text-xs uppercase">Crear Sala →</div>
            </div>

            <div onclick="state.view = 'room_join'; render();" class="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/60 hover:border-purple-400 neon-glow-purple hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between text-left">
              <div>
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-700 flex items-center justify-center text-white text-3xl shadow-lg mb-4">💬</div>
                <div class="inline-block px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-bold uppercase mb-1">Para las amigas</div>
                <h2 class="text-xl sm:text-2xl font-black text-white">Unirme a una Sala</h2>
                <p class="text-xs text-purple-200/80 mt-2 leading-relaxed">
                  ¿Tu amiga ya ha creado la sala? Escribe aquí el <strong>código de 4 letras</strong> para entrar y recibir tu expediente.
                </p>
              </div>
              <div class="mt-6 text-purple-400 font-bold text-xs uppercase">Escribir Código →</div>
            </div>
          </div>
        </div>
      \`;
    }

    function renderRoomHost() {
      const origin = window.location.origin || "";
      const pathname = window.location.pathname || "";
      const roomUrl = origin + pathname + "?room=" + state.roomCode;
      const roomQr = generateQR(roomUrl);

      return \`
        <div class="max-w-5xl mx-auto px-4 py-8">
          <div class="text-center mb-8">
            <span class="inline-flex px-3 py-1 rounded-full bg-pink-950 text-pink-300 text-xs font-bold uppercase mb-2">SALA MULTIJUGADOR EN VIVO</span>
            <h1 class="text-3xl sm:text-5xl font-black text-white">SALA: <span class="neon-text-pink font-mono tracking-widest">\${state.roomCode}</span></h1>
            <p class="text-xs text-purple-200/80 mt-1">Escanead el QR con el móvil o entrad en la web y escribid el código.</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div class="lg:col-span-5 glass-panel p-6 rounded-3xl border border-pink-500/60 neon-glow-pink text-center space-y-3">
              <h2 class="text-sm font-black text-white uppercase">QR de la Sala</h2>
              <div class="bg-white p-3 rounded-2xl mx-auto w-64 h-64 flex items-center justify-center border-4 border-pink-500/40">
                <img src="\${roomQr}" alt="QR Sala" class="w-56 h-56 rounded-lg object-contain">
              </div>
              <div class="p-3 rounded-2xl bg-purple-950/60 border border-purple-800">
                <div class="text-[11px] text-purple-300 font-bold uppercase">Código para escribir:</div>
                <div class="text-3xl font-black font-mono text-white tracking-widest neon-text-pink">\${state.roomCode}</div>
              </div>
            </div>

            <div class="lg:col-span-7 space-y-6">
              <div class="glass-panel p-6 rounded-3xl border border-purple-500/50">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-base font-extrabold text-white uppercase">Jugadoras Conectadas (\${state.connectedPlayers.length}/7)</h2>
                  <span class="text-xs text-green-400 font-bold">En vivo 🟢</span>
                </div>
                \${state.connectedPlayers.length === 0 ? \`
                  <div class="py-8 text-center border-2 border-dashed border-purple-900/60 rounded-2xl">
                    <p class="text-sm font-bold text-white">Esperando a que tus amigas se unan...</p>
                    <p class="text-xs text-purple-300/70 mt-1">Apunta con la cámara al código QR de la izquierda.</p>
                  </div>
                \` : \`
                  <div class="grid grid-cols-2 gap-2 mb-4">
                    \${state.connectedPlayers.map((name, i) => \`
                      <div class="p-2.5 rounded-xl bg-purple-950/60 border border-green-500/50 flex items-center justify-between text-xs">
                        <span class="font-bold text-white">\${i + 1}. \${name}</span>
                        <span class="text-[10px] text-green-400 font-bold">Conectada ✓</span>
                      </div>
                    \`).join('')}
                  </div>
                \`}
              </div>

              <div class="glass-panel p-6 rounded-3xl border border-purple-500/50 space-y-3">
                <h2 class="text-xs font-bold text-purple-300 uppercase">Caso y Tiempo:</h2>
                <select onchange="state.selectedCaseId = Number(this.value);" class="w-full bg-purple-950 border border-purple-800 rounded-xl p-3 text-white text-xs font-bold cursor-pointer">
                  \${CASES.map(c => \`<option value="\${c.id}">\${c.id}. \${c.emoji} \${c.title}</option>\`).join('')}
                </select>
              </div>

              <div class="flex items-center gap-3">
                <button type="button" onclick="state.view = 'home_select'; render();" class="px-4 py-4 rounded-2xl bg-purple-950 text-purple-300 text-xs font-bold border border-purple-800 cursor-pointer">Volver</button>
                <button type="button" onclick="startOnlineHostGame()" class="flex-1 py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 text-white font-black text-sm uppercase border border-white/40 shadow-2xl neon-glow-pink cursor-pointer">
                  🚀 ¡EMPEZAR PARTIDA Y ENVIAR FICHAS A LOS MÓVILES!
                </button>
              </div>
            </div>
          </div>
        </div>
      \`;
    }

    function renderRoomJoin() {
      if (state.clientPhase === "input") {
        return \`
          <div class="max-w-md mx-auto px-4 py-8">
            <div class="text-center mb-6">
              <h1 class="text-3xl font-black text-white">Unirse a la Sala</h1>
              <p class="text-xs text-purple-200 mt-1">Escribe el código de sala y tu nombre</p>
            </div>
            <div class="glass-panel p-6 rounded-3xl border border-pink-500/60 neon-glow-pink space-y-4">
              <div>
                <label class="block text-xs font-bold text-purple-300 uppercase mb-1">Código de Sala (4 letras)</label>
                <input type="text" value="\${state.joinRoomCodeInput}" oninput="state.joinRoomCodeInput = this.value.toUpperCase();" placeholder="Ej: IBIZ" maxlength="6" class="w-full bg-purple-950/60 border border-purple-800 rounded-xl p-3 text-2xl font-mono text-center font-black text-white uppercase focus:border-pink-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-purple-300 uppercase mb-1">Tu Nombre</label>
                <input type="text" value="\${state.playerNameInput}" oninput="state.playerNameInput = this.value;" placeholder="Ej: Ainara, Saray..." class="w-full bg-purple-950/60 border border-purple-800 rounded-xl p-3 text-base font-bold text-white focus:border-pink-500">
              </div>
              <button type="button" onclick="joinRoomClient()" class="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-sm uppercase tracking-wider border border-pink-300 shadow-xl neon-glow-pink cursor-pointer">
                ¡UNIRME A LA SALA!
              </button>
              <button type="button" onclick="state.view = 'home_select'; render();" class="w-full py-2 text-center text-xs text-purple-300 hover:text-white underline cursor-pointer">
                ← Volver al Menú
              </button>
            </div>
          </div>
        \`;
      }

      if (state.clientPhase === "waiting") {
        return \`
          <div class="max-w-md mx-auto px-4 py-12 text-center">
            <div class="glass-panel p-8 rounded-3xl border border-pink-500/60 neon-glow-pink space-y-4">
              <div class="w-20 h-20 rounded-full bg-purple-950 border-2 border-pink-500 flex items-center justify-center mx-auto text-3xl animate-pulse">🟢</div>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-green-950 text-green-300 font-bold border border-green-500/50 uppercase">SALA CONECTADA</span>
              <h2 class="text-2xl font-black text-white">¡Bienvenida, <span class="neon-text-pink">\${state.playerNameInput}</span>!</h2>
              <div class="p-4 rounded-2xl bg-purple-950/60 border border-purple-800 text-xs text-purple-200">
                ⏳ Ponte cómoda. En cuanto la anfitriona pulse <strong>"¡Empezar Partida!"</strong> en la tablet, aparecerá automáticamente aquí tu <strong>expediente secreto</strong>.
              </div>
            </div>
          </div>
        \`;
      }

      if (state.clientPhase === "in_game" && state.myDossier) {
        const d = state.myDossier;
        return \`
          <div class="max-w-md mx-auto px-4 py-6">
            <div class="text-center mb-4">
              <span class="text-xs font-bold text-pink-300 uppercase">EXPEDIENTE SECRETO</span>
              <h1 class="text-xl font-black text-white">\${state.myCaseInfo?.title || 'Caso Activo'}</h1>
            </div>

            \${!state.isDossierRevealed ? \`
              <div class="glass-panel p-8 rounded-3xl border border-pink-500/60 neon-glow-pink text-center space-y-4">
                <div class="w-20 h-20 rounded-full bg-purple-950 border-2 border-pink-500 flex items-center justify-center mx-auto text-3xl">🔒</div>
                <h2 class="text-xl font-black text-white">Ficha Protegida</h2>
                <button type="button" onclick="state.isDossierRevealed = true; sounds.playClick(); render();" class="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-sm uppercase tracking-wider border border-pink-300 shadow-xl neon-glow-pink cursor-pointer">
                  TOCA PARA VER MI FICHA
                </button>
              </div>
            \` : \`
              <div class="space-y-4">
                <button type="button" onclick="state.isDossierRevealed = false; sounds.playClick(); render();" class="w-full py-2 rounded-xl bg-purple-950 text-purple-200 text-xs font-bold border border-purple-800 cursor-pointer">
                  Ocultar pantalla por si miran
                </button>
                <div class="p-4 rounded-2xl border \${d.isCulprit ? 'bg-red-950/70 border-red-500 neon-border-red' : 'bg-purple-950/40 border-purple-600/60'}">
                  <div class="flex items-start justify-between">
                    <div>
                      <span class="text-[10px] font-bold text-purple-300 uppercase">Tu Personaje:</span>
                      <h2 class="text-xl font-black text-white">\${d.avatar} \${d.roleTitle}</h2>
                    </div>
                    \${d.isCulprit ? \`<span class="px-2.5 py-1 rounded-full bg-red-600 text-white font-black text-xs">¡CULPABLE!</span>\` : \`<span class="px-2.5 py-1 rounded-full bg-green-950 text-green-300 font-bold text-xs">INOCENTE</span>\`}
                  </div>
                  \${d.isCulprit ? \`<div class="mt-2 text-xs text-red-200">⚠️ Fuiste tú quien cometió el hecho. No cambies tus horas pero engaña a las demás.</div>\` : \`<p class="mt-2 text-xs text-purple-200">Eres inocente. Defiende tu coartada.</p>\`}
                </div>

                <div class="p-4 rounded-2xl bg-gradient-to-r from-pink-950/50 to-purple-950/50 border border-pink-500/50">
                  <div class="text-pink-300 font-bold text-xs uppercase mb-1">🎯 Objetivo Secreto</div>
                  <p class="text-xs text-white font-semibold">\${d.secretObjective}</p>
                </div>

                <div class="glass-panel p-4 rounded-2xl border border-purple-500/40">
                  <div class="text-purple-300 font-bold text-xs uppercase mb-2">⏱️ Tus Horarios</div>
                  <div class="space-y-1.5">
                    \${d.movements.map(m => \`
                      <div class="text-xs"><span class="font-mono text-pink-400 font-bold">\${m.time}</span> <strong class="text-white">\${m.place}:</strong> \${m.detail}</div>
                    \`).join('')}
                  </div>
                </div>

                <div class="glass-panel p-4 rounded-2xl border border-pink-500/40">
                  <div class="text-pink-300 font-bold text-xs uppercase mb-2">🔍 Pistas Que Conoces</div>
                  <ul class="space-y-1 text-xs text-purple-100">
                    \${d.knownInfo.map(k => \`<li>• \${k}</li>\`).join('')}
                  </ul>
                </div>
              </div>
            \`}
          </div>
        \`;
      }

      if (state.clientPhase === "voting") {
        return \`
          <div class="max-w-md mx-auto px-4 py-6">
            <div class="glass-panel p-6 rounded-3xl border border-pink-500/60 neon-glow-pink space-y-4">
              <div class="text-center">
                <span class="text-xs font-bold text-pink-300 uppercase">Votación Secreta en tu Móvil</span>
                <h2 class="text-xl font-black text-white mt-1">¿Cuál es tu Veredicto?</h2>
              </div>

              \${!state.hasVoted ? \`
                <div>
                  <label class="block text-xs font-bold text-purple-300 uppercase mb-1">1. ¿Quién crees que es la culpable?</label>
                  <input type="text" id="accusedInput" placeholder="Escribe el nombre de la sospechosa..." class="w-full bg-purple-950/60 border border-purple-800 rounded-xl p-2.5 text-xs text-white">
                </div>

                <div>
                  <label class="block text-xs font-bold text-purple-300 uppercase mb-1">2. ¿A qué hora ocurrió?</label>
                  <input type="text" id="timeInput" placeholder="Ej: 02:40, 18:35..." class="w-full bg-purple-950/60 border border-purple-800 rounded-xl p-2.5 text-xs text-white">
                </div>

                <div>
                  <label class="block text-xs font-bold text-purple-300 uppercase mb-1">3. ¿Qué método o pista clave?</label>
                  <input type="text" id="methodInput" placeholder="Ej: Usó la chaqueta blanca, la llave oculta..." class="w-full bg-purple-950/60 border border-purple-800 rounded-xl p-2.5 text-xs text-white">
                </div>

                <button type="button" onclick="
                  const acc = document.getElementById('accusedInput').value.trim();
                  const tm = document.getElementById('timeInput').value.trim();
                  const mth = document.getElementById('methodInput').value.trim();
                  if (!acc) { alert('Indica a quién acusas.'); return; }
                  state.hasVoted = true;
                  if (state.clientConn) {
                    state.clientConn.send({
                      type: 'SUBMIT_VOTE',
                      vote: {
                        voterName: state.playerNameInput,
                        accusedPlayerName: acc,
                        guessedTime: tm || 'Hora aproximada',
                        guessedMethod: mth || 'Pista determinante'
                      }
                    });
                  }
                  sounds.playClick();
                  render();
                " class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-xs uppercase tracking-wider border border-pink-300 shadow-xl neon-glow-pink cursor-pointer">
                  ENVIAR MI VOTO A LA PANTALLA
                </button>
              \` : \`
                <div class="py-8 text-center space-y-2">
                  <div class="text-3xl">✓</div>
                  <h3 class="text-base font-bold text-green-400">¡Voto Enviado con Éxito!</h3>
                  <p class="text-xs text-purple-300">Mira la pantalla de la sala para la gran revelación.</p>
                </div>
              \`}
            </div>
          </div>
        \`;
      }

      if (state.clientPhase === "resolution") {
        return \`
          <div class="max-w-md mx-auto px-4 py-8 text-center">
            <div class="glass-panel p-6 rounded-3xl border-2 border-red-500 neon-glow-red space-y-3">
              <h2 class="text-2xl font-black text-white">¡Fin del Caso!</h2>
              <p class="text-xs text-purple-200">Mira la pantalla de la sala para ver quién acertó y la solución completa.</p>
            </div>
          </div>
        \`;
      }

      return "";
    }

    // Reuse existing Game, Voting, and Resolution screens from previous setup
    function renderGame() {
      const c = state.activeCase;
      const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
      };
      const clue1 = c.progressiveClues[0];
      const clue2 = c.progressiveClues[1];

      return \`
        <div class="max-w-5xl mx-auto px-4 py-6">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
            <div class="md:col-span-7 glass-panel p-5 rounded-3xl border border-purple-500/50 neon-glow-purple">
              <h1 class="text-2xl font-black text-white">\${c.emoji} <span class="neon-text-pink">\${c.title}</span></h1>
              <p class="text-xs text-purple-200 mt-1">\${c.synopsis}</p>
            </div>
            <div class="md:col-span-5 glass-panel p-5 rounded-3xl border border-pink-500/60 neon-glow-pink text-center">
              <div class="text-5xl font-black font-mono neon-text-pink">\${formatTime(state.secondsRemaining)}</div>
              <div class="text-[11px] text-purple-300 mt-1">Tiempo de debate</div>
            </div>
          </div>

          <div class="glass-panel p-6 rounded-3xl border border-purple-500/40 space-y-3 mb-6">
            <h2 class="text-lg font-black text-white uppercase tracking-wider mb-2">Acontecimientos Oficiales</h2>
            \${c.publicTimeline.map(item => \`
              <div class="p-3 rounded-xl bg-purple-950/40 flex items-start gap-3 text-xs">
                <span class="font-mono font-bold text-pink-400 shrink-0">\${item.time}</span>
                <span class="text-white">\${item.description}</span>
              </div>
            \`).join('')}
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-purple-800">
            <div class="text-xs text-purple-300">Todas las jugadoras tienen ya su ficha en sus móviles.</div>
            <button type="button" onclick="state.view = 'voting'; if(state.peerConnections) Object.values(state.peerConnections).forEach(cn => cn.send({type:'VOTING_STARTED'})); sounds.playClick(); render();" class="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white font-black text-base uppercase border border-white/40 shadow-2xl cursor-pointer">
              🗳️ ¡IR A LA VOTACIÓN FINAL!
            </button>
          </div>
        </div>
      \`;
    }

    function renderVoting() {
      return \`
        <div class="max-w-2xl mx-auto px-4 py-8 text-center">
          <div class="glass-panel p-8 rounded-3xl border border-pink-500/60 neon-glow-pink space-y-4">
            <span class="inline-block px-3 py-1 rounded-full bg-pink-950 text-pink-300 text-xs font-bold uppercase">VOTACIÓN EN VIVO DESDE CADA MÓVIL</span>
            <h2 class="text-2xl font-black text-white">Emitiendo Veredictos...</h2>
            <p class="text-xs text-purple-200">Cada amiga está seleccionando en su propio móvil quién es la culpable.</p>

            <div class="grid grid-cols-2 gap-2 max-w-md mx-auto my-4">
              \${state.activePlayers.map(p => {
                const hasVoted = state.votes.some(v => v.voterName === p.name);
                return \`
                  <div class="p-3 rounded-xl border flex items-center justify-between text-xs \${hasVoted ? 'bg-green-950/60 border-green-500 text-green-300 font-bold' : 'bg-purple-950/40 border-purple-800 text-purple-300 animate-pulse'}">
                    <span>\${p.name}</span>
                    <span>\${hasVoted ? 'Voto recibido ✓' : 'Votando... ⏳'}</span>
                  </div>
                \`;
              }).join('')}
            </div>

            <div class="text-xs font-mono text-purple-300">\${state.votes.length} de \${state.activePlayers.length} votos recibidos</div>

            <button type="button" onclick="state.view = 'resolution'; sounds.playRevealFanfare(); if(state.peerConnections) Object.values(state.peerConnections).forEach(cn => cn.send({type:'GAME_RESOLUTION', culpritName: (state.activePlayers.find(p=>p.dossier.isCulprit)||state.activePlayers[0]).name, solutionStory: state.activeCase.solution.fullStory})); try{confetti({particleCount:120,spread:90,origin:{y:0.6}});}catch{} render();" class="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 text-white font-black text-sm uppercase cursor-pointer">
              🎉 ¡VER LA SOLUCIÓN FINAL Y PUNTUACIONES!
            </button>
          </div>
        </div>
      \`;
    }

    function renderResolution() {
      const c = state.activeCase;
      const culprit = state.activePlayers.find(p => p.dossier.isCulprit) || state.activePlayers[0];

      return \`
        <div class="max-w-4xl mx-auto px-4 py-8">
          <div class="glass-panel p-8 rounded-3xl border-2 border-red-500 neon-glow-red text-center mb-8">
            <h1 class="text-4xl font-black text-white mb-2">¡LA CULPABLE ERA <span class="neon-text-red uppercase">\${culprit.name}</span>!</h1>
            <div class="text-lg font-bold text-purple-200 mb-4">\${culprit.dossier.avatar} \${culprit.dossier.roleTitle}</div>
            <p class="text-xs text-purple-100 max-w-xl mx-auto leading-relaxed bg-black/60 p-4 rounded-xl border border-purple-800 text-left">\${c.solution.fullStory}</p>
          </div>

          <div class="text-center">
            <button type="button" onclick="state.view = 'home_select'; render();" class="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-base uppercase border border-white/40 cursor-pointer">
              ✨ ¡JUGAR OTRO CASO!
            </button>
          </div>
        </div>
      \`;
    }

    checkUrlParams();
    render();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(rootDir, "chivatazo-juego.html"), standaloneHtml, "utf-8");
fs.writeFileSync(path.join(rootDir, "public", "chivatazo-juego.html"), standaloneHtml, "utf-8");

console.log("Successfully generated chivatazo-juego.html and public/chivatazo-juego.html with WebRTC Multiplayer!");
