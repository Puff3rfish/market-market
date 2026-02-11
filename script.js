// ==============================
// BASE SIZE FOR FLOWERS
// ==============================
const BASE_WIDTH = 344;
const BASE_HEIGHT = 498;

// ==============================
// CANVAS RESIZE (NO DISTORTION)
// ==============================
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * devicePixelRatio;
  canvas.height = rect.height * devicePixelRatio;

  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(canvas.width / BASE_WIDTH, canvas.height / BASE_HEIGHT);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ==============================
// ANIMATION RENDERER (NON-DISTORTED)
// ==============================
function animateFlower() {
  if (audio.paused) return;

  if (!audio.duration || audio.duration === Infinity) {
    animationFrameId = requestAnimationFrame(animateFlower);
    return;
  }

  const totalDrawTime = audio.duration * DRAW_DURATION_MULTIPLIER;
  const elapsedDrawTime = audio.currentTime;
  drawProgress = Math.min(elapsedDrawTime / totalDrawTime, 1);

  // Clear the canvas in base coordinates
  ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

  ctx.save();
  // Move origin to center in base coordinates
  ctx.translate(BASE_WIDTH / 2, BASE_HEIGHT / 2);

  if (currentFlowerType === "lotus") drawLotusAnimated(drawProgress);
  if (currentFlowerType === "carnation") drawCarnationAnimated(drawProgress);
  if (currentFlowerType === "camellia") drawCameliaAnimated(drawProgress);

  ctx.restore();

  animationFrameId = requestAnimationFrame(animateFlower);
}

// ==============================
// FLOWER DRAWING FUNCTIONS (UNCHANGED BUT USE BASE COORDS)
// ==============================
function drawLotusAnimated(progress) {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  resetTurtle();
  const petals = 8, layers = 260, radius = 220;
  const layersToDrawN = Math.ceil(layers * progress);
  for (let i = 0; i < layersToDrawN; i++) {
    let r = radius - i * 0.7;
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
  const petals = 12, layers = 300, baseRadius = 160;
  const layersToDrawN = Math.ceil(layers * progress);
  for (let i = 0; i < layersToDrawN; i++) {
    let wobble = Math.random() * 4 - 2;
    let r = baseRadius - i * 0.45 + wobble;
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
  const petals = 7, layers = 280, baseRadius = 210;
  const layersToDrawN = Math.ceil(layers * progress);
  for (let i = 0; i < layersToDrawN; i++) {
    let r = baseRadius - i * 0.6;
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
