const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioContext = new AudioContext();
const canvas = document.createElement("canvas");

const audioElement = document.querySelector("audio");
const track = audioContext.createMediaElementSource(audioElement);

track.connect(audioContext.destination);

const playButton = document.querySelector("button");

playButton.addEventListener(
  "click",
  function playBut() {
    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // play or pause track depending on state
    if (this.dataset.playing === "false") {
      audioElement.play();
      this.dataset.playing = "true";
    } else if (this.dataset.playing === "true") {
      audioElement.pause();
      this.dataset.playing = "false";
    }
  },
  false
);

audioElement.addEventListener(
  "ended",
  () => {
    playButton.dataset.playing = "false";
  },
  false
);

const gainNode = audioContext.createGain();

track.connect(gainNode).connect(audioContext.destination);

const volumeControl = document.querySelector("#volume");

volumeControl.addEventListener(
  "input",
  function() {
    gainNode.gain.value = this.value;
  },
  false
);

document.body.appendChild("canvas");
canvas.width = canvas.height = 500;

const particles = Array(100);
var pointSize = 3;

function getPosition(event) {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;

  drawCoordinates(x, y);
}

function drawCoordinates(x, y) {
  var ctx = document.getElementById("canvas").getContext("2d");
  ctx.fillStyle = "#ff2626"; // Red color
  ctx.beginPath();
  ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
  ctx.fill();
}
