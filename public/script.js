import * as dat from "./dat.gui.js";

let i = 0;
let help = true;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cp = document.getElementById("color");
const overlay = document.getElementById("overlay");
const content = document.getElementById("content");
const play = document.getElementById("play");
const cc = document.getElementById("change-colors");
const songList = document.getElementById("songs");
const songs = document.getElementsByName("song");
let color = "moccasin";
const rex =
  "https://cdn.glitch.com/e6f8ae8c-36c3-48aa-b208-20b00427342c%2F2.mp3?v=1602402346286";
const post =
  "https://cdn.glitch.com/e6f8ae8c-36c3-48aa-b208-20b00427342c%2F1.mp3?v=1602381823448";
const harry =
  "https://cdn.glitch.com/e6f8ae8c-36c3-48aa-b208-20b00427342c%2F3.mp3?v=1602407357167";
const audioCtx = new AudioContext();
const audioElement = document.createElement("audio");
document.body.appendChild(audioElement);

const start = function() {
  songs[1].checked = true;
  
  // audio graph setup
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 1024; // 512 bins
  const player = audioCtx.createMediaElementSource(audioElement);
  player.connect(audioCtx.destination);
  player.connect(analyser);

  // audioElement.src = post
  audioElement.src = post;
  audioElement.play();
  audioElement.crossOrigin = "anonymous";

  const results = new Uint8Array(analyser.frequencyBinCount);

  const draw = function() {
    // temporal recursion, call tthe function in the future
    window.requestAnimationFrame(draw);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = color;
    analyser.getByteFrequencyData(results);

    for (let i = 0; i < analyser.frequencyBinCount; i++) {
      ctx.fillRect(i, canvas.height, 3, -results[i]);
    }
  };

  const createGUI = function() {
    const gui = new dat.GUI();
    gui.add(audioElement, "play");
    gui.add(audioElement, "pause");
    gui.add(audioElement, "volume", 0, 1);
    gui.add(audioElement, "loop", true, false);
    gui.add(audioElement, "muted", true, false);
    gui.close();
  };

  createGUI();
  draw();
};

play.addEventListener("click", function() {
  document.body.removeChild(overlay);
  cc.style.display = "flex";
  content.style.display = "block";
  help = false;
  if (i == 0) {
    audioCtx.resume();
    start();
    i++;
  }
});

document.onkeydown = function(event) {
  var key = event.keyCode;
  event.preventDefault();

  if (key == 72) {
    if (help) {
      document.body.removeChild(overlay);
      help = false;
    } else if (!help) {
      document.body.appendChild(overlay);
      help = true;
    }
  }
};

const defaultColor = document.getElementById("default");
const blue = document.getElementById("blue");
const red = document.getElementById("red");
const rainbow = document.getElementById("rainbow");
const purple = document.getElementById("purple");

defaultColor.addEventListener("click", function() {
  color = "moccasin";
});

purple.addEventListener("click", function() {
  color = "#dcd0ff";
});

blue.addEventListener("click", function() {
  let blueGradient = ctx.createLinearGradient(0, 0, 170, 0);
  blueGradient.addColorStop(0, "#003366");
  blueGradient.addColorStop(1, "lightblue");
  color = blueGradient;
});

red.addEventListener("click", function() {
  let redGradient = ctx.createLinearGradient(0, 0, 0, 400);
  redGradient.addColorStop(0.6, "lightyellow");
  redGradient.addColorStop(1, "darkred");
  color = redGradient;
});

red.addEventListener("click", function() {
  let redGradient = ctx.createLinearGradient(0, 0, 0, 400);
  redGradient.addColorStop(0.6, "yellow");
  redGradient.addColorStop(1, "red");
  color = redGradient;
});

rainbow.addEventListener("click", function() {
  let rainbowGradient = ctx.createLinearGradient(0, 0, 400, 0);
  rainbowGradient.addColorStop(0, "red");
  rainbowGradient.addColorStop(0.2, "yellow");
  rainbowGradient.addColorStop(0.4, "green");
  rainbowGradient.addColorStop(0.6, "blue");
  rainbowGradient.addColorStop(0.8, "purple");
  color = rainbowGradient;
});

songList.addEventListener("click", function() {
  for (var i = 0; i < songs.length; i++) {
    if (songs[i].checked) {
      audioElement.src = songs[i].value;
      audioElement.play();
    }
  }
});
