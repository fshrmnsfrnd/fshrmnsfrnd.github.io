"use strict";
// Box Stacker Game (TypeScript)
// Regeln (kurz): In Intervallen fällt eine Box (1x1 Zelle) von oben. Spieler kann links/rechts laufen, 1 Box hoch springen,
// eine einzelne Box schieben (aber keine Kette). Wird der Spieler von einer fallenden Box getroffen => Game Over.
// Punkte = Anzahl fest platzierter Boxen. Highscore via localStorage.
// --- Grundparameter ---
let cellSize = 32; // dynamische Skalierung zur Bildschirmhöhe
const COLS = 12; // Spielfeld Breite in Zellen
const ROWS = 20; // Spielfeld Höhe in Zellen (sichtbar)
const SPAWN_INTERVAL_START = 2500; // ms
const MIN_SPAWN_INTERVAL = 850; // ms
const SPAWN_ACCELERATION = 0.985; // Multiplikator nach jedem Spawn
const BOX_FALL_SPEED = 3.2; // Zellen pro Sekunde (terminal Geschwindigkeit)
const BOX_GRAVITY = 14; // Beschleunigung (Zellen/s^2)
const PLAYER_SPEED = 6; // Zellen pro Sekunde
const PLAYER_JUMP_VELOCITY = 10; // Anfangs-Jump (Zellen/s)
const PLAYER_GRAVITY_ASCEND = 14; // Aufstiegs-Gravity (geringer für längeren Aufstieg)
const PLAYER_GRAVITY_DESCEND = 26; // Abwärts-Gravity
const PLAYER_HANG_TIME = 0.16; // Sekunden "Schwebe" auf maximaler Höhe
const MAX_FALL_VY = 18; // Max Vertikalgeschwindigkeit Spieler
// Grid nur für ruhende Boxen (fallende sind nicht eingetragen bis sie landen)
const grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null));
let boxes = [];
let nextBoxId = 1;
// Spieler Start unten links mittig
let player = { x: Math.floor(COLS / 2), y: ROWS - 1, vx: 0, vy: 0, w: 1, h: 1, canJump: false, alive: true };
let jumpOriginY = player.y;
let hangTimer = 0; // wie lange bereits an Apex gehalten
// Steuerung (diskrete Schritte)
const keys = { jump: false };
let jumpQueued = false;
// Score
let score = 0;
let highScore = 0;
const HS_KEY = "boxStackerHighScore";
// Spawn Timing
let spawnInterval = SPAWN_INTERVAL_START;
let nextSpawnAt = 0;
// Zeit
let lastTime = performance.now();
// Canvas Setup + dynamisches Layout
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
function layout() {
    const hud = document.querySelector('.hud');
    const controls = document.getElementById('touchControls');
    const hudH = hud ? hud.offsetHeight : 0;
    const controlsVisible = controls && getComputedStyle(controls).display !== 'none';
    let controlsH = 0;
    if (controlsVisible) {
        // Höhe realistischer schätzen (inkl. safe-area) -> nicht überdecken
        controlsH = controls.offsetHeight;
    }
    const safeBottom = window.visualViewport ? window.visualViewport.height - window.innerHeight : 0;
    const avail = window.innerHeight - hudH - controlsH - safeBottom - 6; // kleiner Puffer
    cellSize = Math.max(12, Math.floor(avail / ROWS));
    canvas.width = COLS * cellSize;
    canvas.height = ROWS * cellSize;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;
    // Wenn Controls sichtbar und Canvas unten kollidiert -> nach oben schieben mit transform, statt Höhe zu verkleinern
    if (controlsVisible) {
        const overlap = (canvas.getBoundingClientRect().bottom) - (window.innerHeight - controlsH);
        if (overlap > 0) {
            canvas.style.transform = `translateY(-${Math.ceil(overlap)}px)`;
        }
        else {
            canvas.style.transform = '';
        }
    }
    else {
        canvas.style.transform = '';
    }
}
layout();
window.addEventListener('resize', layout);
// DOM Elemente
const scoreEl = document.getElementById('score');
const hsEl = document.getElementById('highscore');
const statusEl = document.getElementById('status');
const overlay = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');
const finalHighScoreEl = document.getElementById('finalHighscore');
const restartBtn = document.getElementById('restartBtn');
// Highscore laden
try {
    const stored = localStorage.getItem(HS_KEY);
    if (stored)
        highScore = parseInt(stored) || 0;
}
catch ( /* ignore */_a) { /* ignore */ }
hsEl.textContent = highScore.toString();
// Eingaben (Keyboard) – kein Halten für Horizontal
window.addEventListener('keydown', e => {
    if (e.repeat)
        return; // kein Dauerfeuer durch Halten
    switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            attemptMove(-1);
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            attemptMove(1);
            break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case ' ':
            queueJump();
            break;
    }
});
window.addEventListener('keyup', e => {
    if (['ArrowUp', 'w', 'W', ' '].includes(e.key))
        keys.jump = false;
});
// Touch Buttons (Einzelschritt)
function singleTap(id, action) {
    const el = document.getElementById(id);
    const handler = (ev) => { ev.preventDefault(); action(); };
    ['touchstart', 'pointerdown', 'mousedown'].forEach(t => el.addEventListener(t, handler));
}
singleTap('leftBtn', () => attemptMove(-1));
singleTap('rightBtn', () => attemptMove(1));
singleTap('jumpBtn', () => queueJump());
restartBtn.addEventListener('click', () => resetGame());
// Hilfsfunktionen
function cellBlocked(x, y) {
    if (x < 0 || x >= COLS || y >= ROWS)
        return true; // Wand / Boden blockiert
    if (y < 0)
        return false; // über dem Spielfeld
    return !!grid[y][x];
}
function landBox(b) {
    b.falling = false;
    b.vy = 0;
    const gy = Math.min(Math.max(Math.round(b.y), 0), ROWS - 1);
    grid[gy][b.x] = b;
    score++;
    scoreEl.textContent = score.toString();
    if (score > highScore) {
        highScore = score;
        hsEl.textContent = highScore.toString();
        try {
            localStorage.setItem(HS_KEY, highScore.toString());
        }
        catch ( /* ignore */_a) { /* ignore */ }
    }
    // Schwierigkeit steigern
    spawnInterval = Math.max(MIN_SPAWN_INTERVAL, spawnInterval * SPAWN_ACCELERATION);
}
function spawnBox() {
    const x = Math.floor(Math.random() * COLS);
    // Falls Startzelle blockiert => sofort Game Over (kein Platz)
    if (cellBlocked(x, 0)) {
        // Check ob oben noch Luft: wenn Box auf Spieler fallen würde sofort
        gameOver();
        return;
    }
    const box = { id: nextBoxId++, x, y: -1, vy: 0, falling: true };
    boxes.push(box);
}
function resetGame() {
    boxes = [];
    for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++)
            grid[y][x] = null;
    score = 0;
    scoreEl.textContent = '0';
    spawnInterval = SPAWN_INTERVAL_START;
    nextSpawnAt = performance.now() + 300;
    player = { x: Math.floor(COLS / 2), y: ROWS - 1, vx: 0, vy: 0, w: 1, h: 1, canJump: false, alive: true };
    overlay.classList.add('hidden');
    statusEl.textContent = '';
}
function gameOver() {
    if (!player.alive)
        return;
    player.alive = false;
    finalScoreEl.textContent = score.toString();
    finalHighScoreEl.textContent = highScore.toString();
    overlay.classList.remove('hidden');
    statusEl.textContent = '😵';
}
// --- Spielschleife ---
function loop(now) {
    const dtMs = now - lastTime;
    lastTime = now;
    const dt = dtMs / 1000; // Sekunden
    if (player.alive)
        update(dt, now);
    render();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
function update(dt, now) {
    // Spawn
    if (now >= nextSpawnAt) {
        spawnBox();
        nextSpawnAt = now + spawnInterval;
    }
    // (Horizontale Bewegung ereignisbasiert; hier keine Aktion)
    // Steht Spieler auf Boden oder Box?
    const onGround = (player.y >= ROWS - 1) || (player.y + 1 < ROWS && !!grid[player.y + 1][player.x]);
    if (onGround) {
        player.vy = 0;
        player.canJump = true;
        hangTimer = 0;
    }
    else {
        if (player.vy < 0) { // Aufstieg -> langsamer abbremsen
            player.vy = Math.min(player.vy + PLAYER_GRAVITY_ASCEND * dt, 0);
            // Wenn Apex erreicht (Geschwindigkeit ~0) beginne Hang
            if (player.vy >= -0.0001)
                player.vy = 0;
            if (player.vy === 0 && player.y === jumpOriginY - 1 && hangTimer < PLAYER_HANG_TIME) {
                hangTimer += dt;
            }
        }
        else { // Fallen
            if (player.y === jumpOriginY - 1 && hangTimer < PLAYER_HANG_TIME) {
                // Halte noch kurz
                hangTimer += dt;
                player.vy = 0;
            }
            else {
                player.vy = Math.min(player.vy + PLAYER_GRAVITY_DESCEND * dt, MAX_FALL_VY);
            }
        }
    }
    if (jumpQueued && player.canJump) {
        player.vy = -PLAYER_JUMP_VELOCITY;
        player.canJump = false;
        jumpOriginY = player.y; // Limit Sprunghöhe auf eine Box
        hangTimer = 0;
    }
    jumpQueued = false;
    // Vertikal Bewegung Spieler (max 1 Zelle pro Frame nötig bei dt ~16ms -> clamp)
    let newY = player.y + player.vy * dt;
    if (player.vy > 0) { // nach unten
        // push solange nicht kollidiert
        while (newY > player.y) {
            if (player.y + 1 >= ROWS || grid[player.y + 1][player.x]) {
                newY = player.y;
                break;
            }
            player.y += 1;
        }
    }
    else if (player.vy < 0) { // nach oben springen (max 1 Zelle hoch = h=1 erlaubt)
        if (newY < player.y) {
            // Check Kopf Kollision
            if (player.y - 1 >= 0 && grid[player.y - 1][player.x]) {
                player.vy = 0;
                newY = player.y;
            }
            else {
                let targetY = Math.floor(newY);
                const minY = Math.max(0, jumpOriginY - 1); // max eine Box hoch
                if (targetY < minY) {
                    targetY = minY;
                    player.vy = 0;
                }
                player.y = targetY;
            }
        }
    }
    // Korrigiere falls unter Boden
    if (player.y > ROWS - 1)
        player.y = ROWS - 1;
    // Boxen updaten
    for (const b of boxes) {
        if (!b.falling)
            continue;
        b.vy = Math.min(b.vy + BOX_GRAVITY * dt, BOX_FALL_SPEED);
        let newYBox = b.y + b.vy * dt;
        // Kollision prüfen: Boden oder andere Box
        let willLand = false;
        if (newYBox >= ROWS - 1) {
            newYBox = ROWS - 1;
            willLand = true;
        }
        else {
            const belowY = Math.floor(newYBox + 1); // Zelle unter der Box
            if (belowY >= 0 && belowY < ROWS && grid[belowY][b.x]) {
                // Landet auf Box
                newYBox = belowY - 1;
                willLand = true;
            }
        }
        b.y = newYBox;
        // Treffer Spieler? (nur wenn Box noch fällt)
        if (player.alive && b.falling && boxHitsPlayer(b)) {
            gameOver();
            return; // Stop update für Frame
        }
        if (willLand)
            landBox(b);
    }
}
function boxHitsPlayer(b) {
    // Spieler Zelle: (player.x, player.y)
    const top = b.y;
    const bottom = b.y + 1; // Box Höhe 1
    const playerTop = player.y;
    const playerBottom = player.y + 1;
    if (b.x !== player.x)
        return false;
    // Box überschneidet vertikal Spielerbereich
    return !(bottom <= playerTop || top >= playerBottom);
}
// --- Rendering ---
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawGridBoxes();
    drawFallingBoxes();
    drawPlayer();
    drawGround();
}
function drawBackground() {
    ctx.fillStyle = '#181818';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // dezentes Muster
    ctx.fillStyle = '#1f1f1f';
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if ((x + y) % 2 === 0)
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}
function drawGridBoxes() {
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const b = grid[y][x];
            if (b)
                drawBox(x, y, false);
        }
    }
}
function drawFallingBoxes() {
    for (const b of boxes)
        if (b.falling)
            drawBox(b.x, b.y, true);
}
function drawBox(x, y, falling) {
    const px = x * cellSize;
    const py = y * cellSize;
    ctx.save();
    ctx.translate(px, py);
    ctx.fillStyle = falling ? '#ffcc33' : '#d0a64d';
    ctx.fillRect(0, 0, cellSize, cellSize);
    ctx.fillStyle = '#00000033';
    ctx.fillRect(0, cellSize - 6, cellSize, 6);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, cellSize - 2, cellSize - 2);
    ctx.restore();
}
function drawPlayer() {
    const px = player.x * cellSize;
    const py = player.y * cellSize;
    ctx.save();
    ctx.translate(px, py);
    // Körper
    ctx.fillStyle = player.alive ? '#55ddff' : '#992222';
    ctx.fillRect(0, 0, cellSize, cellSize);
    // Augen
    ctx.fillStyle = '#000';
    const eyeOffsetX = Math.max(2, Math.floor(cellSize / 4));
    const eyeSize = Math.max(2, Math.floor(cellSize / 8));
    ctx.fillRect(eyeOffsetX, Math.floor(cellSize / 3), eyeSize, eyeSize);
    ctx.fillRect(cellSize - eyeOffsetX - eyeSize, Math.floor(cellSize / 3), eyeSize, eyeSize);
    ctx.restore();
}
function drawGround() {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, ROWS * cellSize - 4, COLS * cellSize, 4);
}
// Start erster Spawn etwas später
nextSpawnAt = performance.now() + 700;
// Tipp Status
//statusEl.textContent = 'Tippe / Pfeile: Einzelschritte ← →, ↑ springt, Boxen (auch fallend) seitlich schieben.';
// Expose reset for console (optional)
window.resetBoxStacker = resetGame;
// --- Diskrete Bewegungslogik ---
function queueJump() { keys.jump = true; jumpQueued = true; }
function attemptMove(dir) {
    if (!player.alive)
        return;
    const targetX = player.x + dir;
    if (targetX < 0 || targetX >= COLS)
        return;
    // Prüfe fallende Box im Ziel (seitlicher Kontakt / Überlappung Vertikalbereich)
    const falling = boxes.find(b => b.falling && b.x === targetX && rangesOverlap(b.y, b.y + 1, player.y, player.y + 1));
    if (falling) {
        const beyondX = falling.x + dir;
        if (beyondX < 0 || beyondX >= COLS)
            return;
        if (landedBoxAt(beyondX, Math.round(falling.y)))
            return;
        const blockFall = boxes.find(b => b !== falling && b.falling && b.x === beyondX && rangesOverlap(b.y, b.y + 1, falling.y, falling.y + 1));
        if (blockFall)
            return;
        // Schieben erlauben
        falling.x = beyondX;
        player.x = targetX;
        return;
    }
    // Prüfe gelandete Box im Ziel
    if (player.y >= 0 && player.y < ROWS) {
        const landed = grid[player.y][targetX];
        if (landed) {
            // Block nicht schieben, falls etwas darauf steht (gestapelt)
            if (boxAbove(targetX, player.y))
                return;
            const beyondX = landed.x + dir;
            if (beyondX >= 0 && beyondX < COLS && !grid[player.y][beyondX]) {
                grid[player.y][landed.x] = null;
                landed.x = beyondX;
                // Prüfen ob darunter noch Unterstützung
                if (!hasSupportBelow(landed.x, player.y)) {
                    // wieder fallend machen
                    landed.falling = true;
                    landed.vy = 0; // startet erneut
                    // nicht zurück ins Grid eintragen
                }
                else {
                    grid[player.y][landed.x] = landed;
                }
                player.x = targetX;
            }
            return;
        }
    }
    // frei -> bewegen
    if (!cellBlocked(targetX, player.y))
        player.x = targetX;
}
function rangesOverlap(a1, a2, b1, b2) { return !(a2 <= b1 || a1 >= b2); }
function landedBoxAt(x, y) { return y >= 0 && y < ROWS && !!grid[y][x]; }
function boxAbove(x, y) {
    // y = Ebene der zu schiebenden Box
    const aboveY = y - 1;
    if (aboveY < 0)
        return false;
    // Landed box directly above?
    if (grid[aboveY][x])
        return true;
    // Falling box overlapping vertical column above? (x match, y in range [aboveY, aboveY+1))
    return boxes.some(b => b.falling && b.x === x && b.y + 1 > aboveY && b.y < aboveY + 1);
}
function hasSupportBelow(x, y) {
    const belowY = y + 1;
    if (belowY >= ROWS)
        return true; // Boden
    return !!grid[belowY][x];
}
