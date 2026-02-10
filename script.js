// FRAME ELEMENTS
const frame1 = document.getElementById("frame1");
const frame2 = document.getElementById("frame2");
const startBtn = document.getElementById("startBtn");

// AUDIO
const audio = document.getElementById("audioPlayer");
const menuAudio = document.getElementById("menuAudio");

// CANVAS
const canvas = document.getElementById("flowerCanvas");
const ctx = canvas.getContext("2d");

// UI
const playBtn = document.getElementById("playBtn");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

// SONG DATA
const songs = [
  { title: "Panaginip", artist: "Nicole", file: "assets/music/panaginip.mp3", flower: "carnation" },
  { title: "Diary", artist: "Bread", file: "assets/music/diary.mp3", flower: "lotus" },
  { title: "Museo", artist: "Eliza Maturan", file: "assets/music/museo.mp3", flower: "camellia" }
];

let currentIndex = 0;

// FRAME 1 BUTTON
startBtn.onclick = () => {
  menuAudio.pause();
  menuAudio.currentTime = 0;

  frame1.style.display = "none";
  frame2.style.display = "flex";

  loadSong(currentIndex);
};

// MENU MUSIC — FRAME 1 ONLY
document.addEventListener("pointerdown", () => {
  if (frame1.style.display !== "none") {
    menuAudio.play().catch(() => {});
  }
}, { once: true });

// PLAYER
function loadSong(index) {
  const song = songs[index];
  audio.src = song.file;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
}

function playSong() {
  audio.play();
  playBtn.src = "assets/images/ui/pause.png";
  playBtn.onclick = pauseSong;
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

// PROGRESS BAR
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  progressBar.value = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

progressBar.oninput = e => {
  audio.currentTime = (e.target.value / 100) * audio.duration;
};

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
