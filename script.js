// ==============================
// AUDIO + CANVAS
// ==============================
const audio = document.getElementById("audioPlayer");
const canvas = document.getElementById("flowerCanvas");
const museoVideo = document.getElementById("museoVideo");
const ctx = canvas.getContext("2d");
const playBtn = document.getElementById("playBtn");

// Base size for flower drawing (logical coordinates)
const BASE_WIDTH = 344;
const BASE_HEIGHT = 498;

// Current scale and offsets
let scale = 1;
let offsetX = 0;
let offsetY = 0;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * devicePixelRatio;
  canvas.height = rect.height * devicePixelRatio;
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";

  // Scale to fit canvas but maintain aspect ratio
  const scaleX = canvas.width / BASE_WIDTH;
  const scaleY = canvas.height / BASE_HEIGHT;
  scale = Math.min(scaleX, scaleY);

  // Center the drawing
  offsetX = (canvas.width - BASE_WIDTH * scale) / 2;
  offsetY = (canvas.height - BASE_HEIGHT * scale) / 2;

  ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ==============================
// TURTLE SYSTEM
// ==============================
let turtleX = 0;
let turtleY = 0;
let turtleAngle = 0;

function resetTurtle() {
  turtleX = 0;
  turtleY = 0;
  turtleAngle = 0;
}

function left(deg) {
  turtleAngle += deg * Math.PI / 180;
}

function circle(radius, extent) {
  const steps = Math.max(12, Math.abs(extent));
  const stepAngle = (extent * Math.PI / 180) / steps;
  const stepLength = (2 * Math.PI * radius) / 360;

  ctx.beginPath();
  ctx.moveTo(offsetX + turtleX * scale, offsetY + turtleY * scale);

  for (let i = 0; i < steps; i++) {
    turtleAngle += stepAngle;
    turtleX += Math.cos(turtleAngle) * stepLength;
    turtleY += Math.sin(turtleAngle) * stepLength;
    ctx.lineTo(offsetX + turtleX * scale, offsetY + turtleY * scale);
  }

  ctx.stroke();
}

// ==============================
// FLOWER DRAWING (same as before)
// ==============================
function drawLotusAnimated(progress) {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  resetTurtle();
  const petals = 8, layers = 260, radius = 220, scaleFactor = 0.6;
  const layersToDrawN = Math.ceil(layers * progress);
  for (let i = 0; i < layersToDrawN; i++) {
    let r = (radius - i * 0.7) * scaleFactor;
    if (r <= 0) break;
    for (let p = 0; p < petals; p++) {
      circle(r, 60);
      left(120);
      circle(r, 60);
      left(360 / petals);
    }
  }
}

function drawCarnationAnimated(progress) {
  ctx.strokeStyle = "pink";
  ctx.lineWidth = 1;
  resetTurtle();
  const petals = 12, layers = 300, baseRadius = 160, scaleFactor = 0.7;
  const layersToDrawN = Math.ceil(layers * progress);
  for (let i = 0; i < layersToDrawN; i++) {
    let wobble = Math.random() * 4 - 2;
    let r = (baseRadius - i * 0.45 + wobble) * scaleFactor;
    if (r <= 0) break;
    for (let p = 0; p < petals; p++) {
      circle(r, 70);
      left(110);
      circle(r, 70);
      left(360 / petals);
    }
  }
}

function drawCameliaAnimated(progress) {
  ctx.strokeStyle = "pink";
  ctx.lineWidth = 1;
  resetTurtle();
  const petals = 7, layers = 280, baseRadius = 210, scaleFactor = 0.6;
  const layersToDrawN = Math.ceil(layers * progress);
  for (let i = 0; i < layersToDrawN; i++) {
    let r = (baseRadius - i * 0.6) * scaleFactor;
    if (r <= 0) break;
    left(i * 0.6);
    for (let p = 0; p < petals; p++) {
      circle(r, 80);
      left(100);
      circle(r, 80);
      left(360 / petals);
    }
  }
}

// ==============================
// ANIMATION RENDERER
// ==============================
function animateFlower() {
  if (audio.paused) return;
  if (!audio.duration || audio.duration === Infinity) {
    requestAnimationFrame(animateFlower);
    return;
  }

  const totalDrawTime = audio.duration * 2.5; // DRAW_DURATION_MULTIPLIER
  drawProgress = Math.min(audio.currentTime / totalDrawTime, 1);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!currentFlowerType) return;

  if (currentFlowerType === "lotus") drawLotusAnimated(drawProgress);
  if (currentFlowerType === "carnation") drawCarnationAnimated(drawProgress);
  if (currentFlowerType === "camellia") drawCameliaAnimated(drawProgress);

  requestAnimationFrame(animateFlower);
}
