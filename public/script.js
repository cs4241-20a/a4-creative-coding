// client-side js, loaded by index.html
// run by the browser each time the page is loaded

import * as dat from "./dat.gui.js";
let controls = {
  sensitivity: 2,
  weight: 2,
  zoom: 6.4,
  r: 100,
  g: 255,
  b: 255,
  guide: true
};

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");


//window.addEventListener("keydown", showGuide, false);
//window.addEventListener("keyup", hideGuide, false);

const start = function() {
  document.body.innerHTML = "";
  document.body.appendChild(canvas);
  const vw = Math.min(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const vh = Math.min(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
  canvas.width = vw;
  canvas.height = vh;

  // audio init
  const audioCtx = new AudioContext();
  const audioElement = document.createElement("audio");
  document.body.appendChild(audioElement);

  // audio graph setup
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512; // 512 bins
  const player = audioCtx.createMediaElementSource(audioElement);
  player.connect(audioCtx.destination);
  player.connect(analyser);

  audioElement.src =
    "https://cdn.glitch.com/3076699f-391c-4374-b5c3-478aa549cff2%2FJustice_-_D.A.N.C.E._-.mp3?v=1602428174937";
  audioElement.play();

  const results = new Uint8Array(analyser.frequencyBinCount);

  const draw = function() {
    // temporal recursion, call tthe function in the future
    window.requestAnimationFrame(draw);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";

    // find the center of the window

    //draw a circle

    analyser.getByteFrequencyData(results);

    for (let i = 0; i < analyser.frequencyBinCount; i++) {
      let prevMin = Math.max(results[i] - results[i - 3], 0);
      ctx.fillStyle =
        "rgb(" + controls.r + "," + controls.g + ", " + controls.b + ")";
      ctx.fillRect(
        i * controls.zoom,
        results[i] +
          0.25 * controls.sensitivity * (results[i] - results[i - 1]) +
          50,
        controls.weight,
        (3 * controls.sensitivity * results[i] +
          controls.sensitivity * prevMin) /
          (2 * controls.sensitivity)
      ); // upside down
    }

    if (controls.guide){
    ctx.font = "15px Arial";
    ctx.fillText("Sensitivity creates more extreme waveforms", 1175, 500);
    ctx.fillText("Weight changes the thickness of the lines", 1175, 530);
    ctx.fillText("Zoom can shrink or zoom in on the waveform", 1175, 560);
    ctx.fillText("R,G,B control color", 1175, 590);
    } 
  };

  draw();
  
  let gui = new dat.GUI();

  gui
    .add(controls, "sensitivity")
    .min(0.1)
    .max(5)
    .step(0.1);
  gui
    .add(controls, "weight")
    .min(0.5)
    .max(5)
    .step(0.1);
  gui
    .add(controls, "zoom")
    .min(0.1)
    .max(20)
    .step(0.1);
  gui
    .add(controls, "r")
    .min(0)
    .max(255)
    .step(1);
  gui
    .add(controls, "g")
    .min(0)
    .max(255)
    .step(1);
  gui
    .add(controls, "b")
    .min(0)
    .max(255)
    .step(1);
  gui.add(controls, "guide");
};



let showGuide = function() {
  ctx.fillStyle =
    "rgb(" + controls.r + "," + controls.g + ", " + controls.b + ")";
  ctx.font = "15px Arial";
  ctx.fillText("Sensitivity creates more extreme waveforms", 1175, 500);
  ctx.fillText("Weight changes the thickness of the lines", 1175, 530);
  ctx.fillText("Zoom can shrink or zoom in on the waveform", 1175, 560);
  ctx.fillText("R,G,B control color", 1175, 590);
};

window.onload = () => (document.querySelector("button").onclick = start);
