import * as dat from "./dat.gui.js";

let audioctx = new AudioContext();
let audioElement = document.createElement("audio");
document.body.appendChild(audioElement);
let player = audioctx.createMediaElementSource(audioElement);
player.connect(audioctx.destination);

function start() {
  audioElement.src =
    "https://cdn.glitch.com/5eb06921-b9b4-4b01-9339-9f5a1746f7e4%2FHarry%20Styles%20-%20From%20the%20Dining%20Room%20Table%20(Official%20Instrumental).mp3?v=1602410558790";
  audioElement.play();
  audioElement.loop = true;
  audioElement.crossOrigin = "anonymous";
}

const createGUI = function() {
  const gui = new dat.GUI();
  gui.add(audioElement, "play");
  gui.add(audioElement, "pause");
  gui.add(audioElement, "volume", 0, 1);
  gui.add(audioElement, "muted", true, false);
  gui.close();
};

createGUI();
start();
