// ==============================
// FRAME NAVIGATION
// ==============================
const frame1 = document.getElementById("frame1");
const frame2 = document.getElementById("frame2");
const startBtn = document.getElementById("startBtn");
const characterImg = document.getElementById("characterImg");
const rabbitWants = document.getElementById("rabbitWants"); // NEW
const menuAudio = document.getElementById("menuAudio");

let menuAudioPlayed = false;

// When strawberry dog is clicked
characterImg.addEventListener("click", () => {

  // Hide rabbit wants gif (NEW)
  if (rabbitWants) {
    rabbitWants.style.opacity = "0";
    setTimeout(() => {
      rabbitWants.style.display = "none";
    }, 300);
  }

  // Swap PNG → GIF
  characterImg.src = "assets/images/strawberry rabbit.gif";

  // Play menu music only once
  if (!menuAudioPlayed) {
    menuAudio.play().catch(err => {
      console.log("Tap again to start music");
    });
    menuAudioPlayed = true;
  }
});

// Hover effect for start button
startBtn.addEventListener("mouseover", () => {
  startBtn.src = "assets/images/ui/button-hover 2.png";
});
startBtn.addEventListener("mouseout", () => {
  startBtn.src = "assets/images/ui/button-hover 1.png";
});

// Start button opens frame 2 and stops menu music
startBtn.addEventListener("click", () => {
  frame1.style.display = "none";
  frame2.style.display = "flex";
  menuAudio.pause();
  loadSong(currentIndex);
});


// ==============================
// SONG DATA
// ==============================
const songs = [
  {
    title: "Panaginip",
    artist: "Nicole",
    file: "assets/music/panaginip.mp3",
    flower: "carnation"
  },
  {
    title: "Diary",
    artist: "Bread",
    file: "assets/music/diary.mp3",
    flower: "lotus"
  },
  {
    title: "Museo",
    artist: "Eliza Maturan",
    file: "assets/music/museo.mp3",
    flower: "camellia"
  }
];

let currentIndex = 0;

// ==============================
// AUDIO + CANVAS
// ==============================
const audio = document.getElementById("audioPlayer");
const canvas = document.getElementById("flowerCanvas");
const ctx = canvas.getContext("2d");
const playBtn = document.getElementById("playBtn");

// SONG TEXT ELEMENTS
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");

// PROGRESS BAR ELEMENTS
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ":" + (s < 10 ? "0" + s : s);
}

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
  if (progressBar) progressBar.value = 0;
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration || !isFinite(audio.duration)) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  if (progressBar) progressBar.value = percent;
  if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
});

if (progressBar) {
  progressBar.addEventListener("input", (e) => {
    if (!audio.duration || !isFinite(audio.duration)) return;
    const val = Number(e.target.value);
    audio.currentTime = (val / 100) * audio.duration;
    drawProgress = Math.min(audio.currentTime / (audio.duration * DRAW_DURATION_MULTIPLIER), 1);
    if (currentFlowerType && !isDrawing && !audio.paused) {
      isDrawing = true;
      animateFlower();
    }
  });
}

audio.addEventListener("ended", () => {
  nextSong();
});

// ==============================
// PLAYER CONTROLS
// ==============================
function loadSong(index) {
  const song = songs[index];
  audio.src = song.file;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  drawFlower(song.flower);
}

function playSong() {
  audio.play();
  playBtn.src = "assets/images/ui/pause.png";
  playBtn.onclick = pauseSong;

  if (currentFlowerType && !isDrawing) {
    isDrawing = true;
    animateFlower();
  }
}

function pauseSong() {
  audio.pause();
  playBtn.src = "assets/images/ui/play.png";
  playBtn.onclick = playSong;
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
}

// ==============================
// ANIMATION STATE
// ==============================
let currentFlowerType = null;
let drawProgress = 0;
let isDrawing = false;
let animationFrameId = null;
const DRAW_DURATION_MULTIPLIER = 2.5;

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
  ctx.moveTo(turtleX, turtleY);

  for (let i = 0; i < steps; i++) {
    turtleAngle += stepAngle;
    turtleX += Math.cos(turtleAngle) * stepLength;
    turtleY += Math.sin(turtleAngle) * stepLength;
    ctx.lineTo(turtleX, turtleY);
  }

  ctx.stroke();
}

// ==============================
// ANIMATION RENDERER
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

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);

  if (currentFlowerType === "lotus") drawLotusAnimated(drawProgress);
  if (currentFlowerType === "carnation") drawCarnationAnimated(drawProgress);
  if (currentFlowerType === "camellia") drawCameliaAnimated(drawProgress);

  ctx.restore();

  animationFrameId = requestAnimationFrame(animateFlower);
}

// ==============================
// FLOWER ROUTER
// ==============================
function drawFlower(type) {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  currentFlowerType = type;
  drawProgress = 0;
  isDrawing = false;
}

// ==============================
// FLOWER DRAWING FUNCTIONS
// ==============================
function drawLotusAnimated(progress) {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  resetTurtle();
  const petals = 8, layers = 260, radius = 220, scale = 0.6;
  const layersToDrawN = Math.ceil(layers * progress);
  for (let i = 0; i < layersToDrawN; i++) {
    let r = (radius - i * 0.7) * scale;
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
  const petals = 12, layers = 300, baseRadius = 160, scale = 0.7;
  const layersToDrawN = Math.ceil(layers * progress);
  for (let i = 0; i < layersToDrawN; i++) {
    let wobble = Math.random() * 4 - 2;
    let r = (baseRadius - i * 0.45 + wobble) * scale;
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
  const petals = 7, layers = 280, baseRadius = 210, scale = 0.6;
  const layersToDrawN = Math.ceil(layers * progress);
  for (let i = 0; i < layersToDrawN; i++) {
    let r = (baseRadius - i * 0.6) * scale;
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
