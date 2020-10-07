// Add some Javascript code here, to run on the front end.
import * as THREE from "./modules/three/build/three.module.js";
import * as dat from "./modules/dat.gui/build/dat.gui.module.js";
var frequencyData, analyser;
var cube, material, geometry, params;
var playing = "false";
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x30b17b);
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 50;
camera.position.y = 20;
camera.position.x = 0;

var x = 0;
var y = 0;
var z = 0;
for (var i = 1; i < 10; i++) {
  geometry = new THREE.BoxGeometry(1, 3, 1);
  material = new THREE.MeshStandardMaterial({
    color: 0xf12345,
  });
  cube = new THREE.Mesh(geometry, material);
  cube.position.x = x;
  cube.position.y = y;
  x += 3;
  cube.position.z = z;
  scene.add(cube);
}
console.log(scene.children[0].material.color);
controller();

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//----------AUDIO-------------
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audio = document.querySelector("audio");
var audioSrc = audioCtx.createMediaElementSource(audio);
audioSrc.connect(audioCtx.destination);

function controller() {
  // ---------DAT GUI------------
  const gui = new dat.GUI();
  const cubeFolder = gui.addFolder("Cube");
  cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01);
  cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01);
  cubeFolder.add(cube.rotation, "z", 0, Math.PI * 2, 0.01);
  cubeFolder.open();
  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", 0, 10, 0.01);
  cameraFolder.add(camera.position, "y", 0, 10, 0.01);
  cameraFolder.add(camera.position, "z", 0, 10, 0.01);
  cameraFolder.open();
  var colorFolder = gui.addFolder("MATERIAL");
  params = { color: 0x4e9cbe };
  colorFolder.addColor(params, "color").onChange(function () {
    for (var i = 0; i < 9; i++) {
      scene.children[i].material.color.set(params.color);
    }
  });
  colorFolder.open();
}

function createLights() {
  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 9);
  var mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
  scene.add(ambientLight);
  mainLight.position.set(10, 10, 10);
  scene.add(ambientLight, mainLight);
}

function animate() {
  renderer.render(scene, camera);
  if (analyser) {
    analyser.getByteFrequencyData(frequencyData);
    for (var i = 0; i < 9; i++) {
      console.log(scene.children[i].color)
      scene.children[i].color.set(frequencyData[(i + 1) * 100] * params);
    }
  }
  requestAnimationFrame(animate);
}

function audioAnalyser() {
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  audioSrc.connect(analyser);
  frequencyData = new Uint8Array(analyser.frequencyBinCount);
}

createLights();
animate();

window.onload = function () {
  console.log(audioCtx);
  console.log(audio);
  document.getElementById("play").addEventListener("click", function () {
    console.log(audioCtx.state);
    if (audioCtx.state == "suspended") {
      audioCtx.resume();
    }
    if (playing == "false") {
      console.log(playing);
      audio.play();
      audioAnalyser();
      playing = "true";
    }
  });

  document.getElementById("pause").addEventListener("click", function () {
    if (playing == "true") {
      audio.pause();
      playing = "false";
    } else if (playing == "false") {
      audio.play();
      audioAnalyser();
      playing = "true";
    }
  });
};
