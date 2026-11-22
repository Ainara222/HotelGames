# 🍸 EL CHIVATAZO: Expedientes Secretos (GitHub Pages)

Juego interactivo multijugador de deducción social para fiestas y amigas (de 4 a 7 jugadoras).

---

## 🌟 Sistema de Sala Multijugador (Ideal para GitHub Pages)

Ahora el juego cuenta con un **sistema de salas en tiempo real** que funciona directamente en **GitHub Pages** (100% estático, sin necesidad de configurar servidores de backend):

1. **Pantalla Principal (Tablet o Portátil de la Anfitriona)**:
   - Pulsa en **"Crear Sala Multijugador"**.
   - Se genera automáticamente un **código de sala de 4 letras** (ej: `IBIZ`, `ROMA`, `CHIV`) y un **único Código QR de la Sala**.
   - En la pantalla se van iluminando en tiempo real las amigas que se van uniendo (*"Ainara conectada ✓"*, *"Saray conectada ✓"*...).
   - Elige el caso (entre los 10 disponibles) y el tiempo del cronómetro.
   - Pulsa **"🚀 ¡Empezar Partida y Enviar Fichas a los Móviles!"**.

2. **En el Móvil de cada Amiga**:
   - Cada amiga puede:
     - **Escanear el QR de la sala** con la cámara de su móvil (se le abre el enlace con el código ya puesto).
     - O entrar a la web y pulsar **"Unirme a una Sala"** escribiendo el código de 4 letras y su nombre.
   - Entra en una pantalla de espera: *"¡Conectada a la sala! Esperando a que empiece la partida..."*.
   - **¡La Magia!**: En cuanto la anfitriona pulsa *"Empezar Partida"* en la tablet, **la pantalla del móvil de cada amiga cambia automáticamente y muestra su propio expediente confidencial**:
     - Su personaje y avatar.
     - Si es culpable o inocente.
     - Sus horarios y movimientos oficiales.
     - Pistas secretas que conoce.
     - Su objetivo secreto y consejos tácticos.
     - Cortina de privacidad (*"Toca para desbloquear / Ocultar pantalla"*).

3. **Votación y Resolución Sincronizada**:
   - Cuando la anfitriona pulsa *"Ir a Votación"*, en el móvil de cada amiga aparece su tarjeta de votación para emitir su voto en secreto.
   - Al pulsar *"Revelar Solución"*, todas las pantallas celebran con confeti y se desvela la culpable y las puntuaciones.

---

## 🚀 Cómo Desplegarlo en GitHub Pages

### Método 1: Despliegue con Next.js (Carpeta `out/`)
El proyecto está configurado con `output: "export"` en `next.config.ts`.
1. Ejecuta:
   ```bash
   npm run build
   ```
2. La carpeta generada `out/` contiene todo el sitio web estático (`index.html`, scripts, estilos y manifest).
3. Sube la carpeta `out/` a la rama `gh-pages` de tu repositorio de GitHub, o configura GitHub Actions con el flujo estándar de Next.js / Static HTML.
4. En tu repositorio ve a **Settings → Pages** y selecciona la rama de despliegue.

### Método 2: Despliegue Ultrarrápido con el Archivo HTML Único
En la raíz del proyecto tienes el archivo monolítico:
- [`chivatazo-juego.html`](file:///Users/ainara/Documents/HotelGames/hotel-games/chivatazo-juego.html) (también en `public/chivatazo-juego.html`)
1. Sube este archivo renombrado como `index.html` a la rama principal de tu repositorio de GitHub.
2. Ve a **Settings → Pages** en GitHub y activa GitHub Pages desde la rama `main`.
3. ¡Tu juego estará en línea en `https://tu-usuario.github.io/tu-repo/` en menos de 1 minuto!

---

## 🎲 Los 10 Casos Disponibles

- 🍸 **Caso 01: La Noche de Ibiza** (El robo de 2.000 € en la villa).
- 💍 **Caso 02: El Anillo de Roma** (El anillo de diamantes antes de la boda).
- 🎪 **Caso 03: Backstage VIP en el Festival** (El pase clonado y los 3.000 € del camerino).
- 🛥️ **Caso 04: Drama en el Yate de Formentera** (El bolso arrojado al mar con los pasaportes).
- 👗 **Caso 05: Alta Costura en París** (El sabotaje del vestido de novia de seda).
- ❄️ **Caso 06: Cabaña en Andorra** (El audio íntimo filtrado al grupo de ex y el apagón).
- 🧖‍♀️ **Caso 07: Retiro Glamour en Marbella** (La fórmula cosmética millonaria sustraída del spa).
- 🛍️ **Caso 08: Fin de Semana en Londres** (El cargo de 3.500 € en Harrods con la tarjeta común).
- 🇬🇷 **Caso 09: Despedida en Mykonos** (El beso prohibido con el barman y la Polaroid).
- 🏰 **Caso 10: La Mansión de Pedralbes** (El pendrive con los contratos secretos).
