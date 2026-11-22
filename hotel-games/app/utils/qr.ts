import QRCode from "qrcode";
import { ActivePlayer, CaseData } from "../types/game";

export async function generateQRDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 340,
      margin: 2,
      color: {
        dark: "#080312",
        light: "#ffffff",
      },
      errorCorrectionLevel: "L", // L allows maximum data capacity for text
    });
  } catch (err) {
    console.error("Error generating QR code", err);
    return "";
  }
}

// Generates pure plain-text confidential dossier:
// Scannable by any smartphone camera (iPhone / Android) directly displaying the card
// with ZERO JAVASCRIPT, zero browser needed, zero internet!
export function buildDossierPlainText(player: ActivePlayer, gameCase: CaseData): string {
  const d = player.dossier;
  const isCulprit = d.isCulprit;

  let text = `🍸 EL CHIVATAZO · FICHA SECRETA\n`;
  text += `====================================\n`;
  text += `CASO #${gameCase.id}: ${gameCase.title}\n`;
  text += `LUGAR: ${gameCase.location}\n`;
  text += `HORA DEL SUCESO: ${gameCase.incidentTime}\n`;
  text += `====================================\n`;
  text += `👤 JUGADORA: ${player.name}\n`;
  text += `🎭 PERSONAJE: ${d.avatar} ${d.roleTitle}\n`;
  text += isCulprit
    ? `🚨 ESTADO: ¡ERES LA CULPABLE! (Nadie debe votarte)\n`
    : `⚖️ ESTADO: INOCENTE (¡Tú no lo hiciste!)\n`;
  text += `====================================\n\n`;

  text += `🎯 TU OBJETIVO SECRETO:\n`;
  text += `${d.secretObjective}\n\n`;

  text += `⏱️ TUS HORARIOS Y MOVIMIENTOS:\n`;
  d.movements.forEach((m) => {
    text += `• ${m.time} [${m.place}]: ${m.detail}\n`;
  });
  text += `\n`;

  text += `🔍 PISTAS QUE CONOCES:\n`;
  d.knownInfo.forEach((info) => {
    text += `• ${info}\n`;
  });

  if (d.suspicionNotes) {
    text += `\n💡 CONSEJO TÁCTICO:\n${d.suspicionNotes}\n`;
  }

  if (isCulprit) {
    text += `\n⚠️ ATENCIÓN: Di la verdad sobre tus horas para no contradecirte, pero inventa excusas o acusa a otra amiga para desviar sospechas.\n`;
  }

  text += `\n====================================\n`;
  text += `🔒 CONFIDENCIAL · GUARDA ESTA PANTALLA`;

  return text;
}

// Encode player payload into compact base64 URL safe string
export function encodePayload(data: any): string {
  try {
    const json = JSON.stringify(data);
    return encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
  } catch {
    return "";
  }
}

export function decodePayload(encoded: string): any {
  try {
    const json = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function buildDossierStaticHtmlDataUri(player: ActivePlayer, gameCase: CaseData): string {
  const d = player.dossier;
  const isCulprit = d.isCulprit;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Expediente de ${player.name}</title>
<style>
body{margin:0;padding:16px;background:#080312;color:#f3f0fa;font-family:-apple-system,BlinkMacSystemFont,sans-serif;}
.card{max-width:440px;margin:0 auto;background:#140a24;border:2px solid ${isCulprit ? '#ef4444' : '#a855f7'};border-radius:20px;padding:20px;box-shadow:0 0 25px ${isCulprit ? 'rgba(239,68,68,0.4)' : 'rgba(168,85,247,0.4)'};}
.badge{display:inline-block;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:bold;text-transform:uppercase;margin-bottom:8px;}
.badge-culprit{background:#7f1d1d;color:#fca5a5;border:1px solid #ef4444;}
.badge-innocent{background:#064e3b;color:#6ee7b7;border:1px solid #10b981;}
h1{margin:0 0 4px 0;font-size:24px;color:#fff;}
.role{font-size:18px;color:#f472b6;font-weight:bold;margin-bottom:16px;}
.sec{margin-top:16px;padding:12px;background:#1c0d33;border-radius:12px;border:1px solid rgba(255,255,255,0.08);}
.sec-title{font-size:12px;font-weight:bold;text-transform:uppercase;color:#c084fc;margin-bottom:8px;}
.time-row{display:flex;margin-bottom:6px;font-size:13px;line-height:1.4;}
.time-badge{font-weight:bold;color:#f472b6;margin-right:8px;font-family:monospace;white-space:nowrap;}
ul{margin:0;padding-left:18px;font-size:13px;line-height:1.45;}
li{margin-bottom:6px;}
.footer{text-align:center;margin-top:16px;font-size:11px;color:#a855f7;font-weight:bold;}
</style>
</head>
<body>
<div class="card">
  <div class="badge ${isCulprit ? 'badge-culprit' : 'badge-innocent'}">${isCulprit ? '¡ERES LA CULPABLE!' : 'ERES INOCENTE'}</div>
  <h1>${player.name}</h1>
  <div class="role">${d.avatar} ${d.roleTitle}</div>
  <div class="sec">
    <div class="sec-title">🎯 Objetivo Secreto</div>
    <div style="font-size:13px;font-weight:600;">${d.secretObjective}</div>
  </div>
  <div class="sec">
    <div class="sec-title">⏱️ Tus Horarios</div>
    ${d.movements.map((m) => `<div class="time-row"><span class="time-badge">${m.time}</span><span><strong>${m.place}:</strong> ${m.detail}</span></div>`).join('')}
  </div>
  <div class="sec">
    <div class="sec-title">🔍 Pistas Que Conoces</div>
    <ul>${d.knownInfo.map((k) => `<li>${k}</li>`).join('')}</ul>
  </div>
  ${d.suspicionNotes ? `<div class="sec"><div class="sec-title">💡 Consejo</div><div style="font-size:12px;font-style:italic;">${d.suspicionNotes}</div></div>` : ''}
  <div class="footer">🔒 CONFIDENCIAL · EL CHIVATAZO</div>
</div>
</body>
</html>`;

  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}
