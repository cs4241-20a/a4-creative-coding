// Add some Javascript code here, to run on the front end.
import * as THREE from "./modules/three/build/three.module.js";
import * as dat from "./modules/dat.gui/build/dat.gui.module.js";
var index = 0;
var frequencyData, analyser,audioSrc;
var cube, material, geometry;
var params = 0x91a26;
var playing = "false";
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x8ec4b5);
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 40;
camera.position.y = 0;
camera.position.x = 10;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//----------AUDIO-------------
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audio = document.querySelector("audio");
console.log(audio);

//---------INIT---------------

var x = 0;
var y = 0;
var z = 0;
for (var i = 1; i < 10; i++) {
  geometry = new THREE.BoxGeometry(1, 3, 1);
  material = new THREE.MeshStandardMaterial({
    color: params,
  });
  cube = new THREE.Mesh(geometry, material);
  cube.position.x = x;
  cube.position.y = y;
  x += 3;
  cube.position.z = z;
  scene.add(cube);
}
console.log(scene.children[index]);
controller();

function controller() {
  // ---------DAT GUI------------
  const gui = new dat.GUI();
  var light1 = new THREE.DirectionalLight(0xffffff);
  light1.position.set(1, 1, 1);
  scene.add(light1);
  var light2 = new THREE.DirectionalLight(0x123456);
  light2.position.set(-1, -1, -1);
  scene.add(light2);
  var light3 = new THREE.AmbientLight(0xaaaaaa);
  scene.add(light3);
  var lightCtrl = gui.addFolder("Light");
  lightCtrl.add(light1, "intensity", 0, 1).name("Intensity 1");
  lightCtrl.add(light2, "intensity", 0, 1).name("Intensity 2");
  lightCtrl.add(light3, "intensity", 0, 1).name("Intensity 3");
  lightCtrl.open();

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "x", 0, 10, 0.01);
  cameraFolder.add(camera.position, "y", 0, 10, 0.01);
  cameraFolder.add(camera.position, "z", 0, 10, 0.01);
  cameraFolder.open();
  var colorFolder = gui.addFolder("MATERIAL");
  var bartemp = { color: 0x6abff };
  colorFolder.addColor(bartemp, "color").onChange(function () {
    params = bartemp.color;
    for (var i = 0; i < 9; i++) {
      scene.children[i].material.color.set(params);
    }
  });
  var bgtemp = { color: 0x00000 };
  colorFolder.addColor(bgtemp, "color").onChange(function () {
    scene.background = new THREE.Color(bgtemp.color);
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
    var height = frequencyData[(index + 1) * 100] / 10;
    scene.children[index].scale.y = height;
    var color = frequencyData[(index + 1) * 100] * params;
    scene.children[index].material.color.set(color);
    index++;
    if (index == 9) {
      index = 0;
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

function openHelper(){
  document.getElementById("pophelper").style.display = "block";
}

function closeHelper(){
  document.getElementById("pophelper").style.display = "none";
}



createLights();
animate();

window.onload = function () {
  console.log(audioCtx);
  console.log(audio);
  document.getElementById("play").addEventListener("click", function () {
    audioSrc = audioCtx.createMediaElementSource(audio);
    audioSrc.connect(audioCtx.destination);
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

  document.getElementById("helper").addEventListener("click",function(){
    openHelper();
  })

  document.getElementById("close").addEventListener("click",function(){
    closeHelper();
  })
};
