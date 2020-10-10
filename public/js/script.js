import * as THREE from './modules/three.module.js';
import * as dat from './modules/dat.gui.module.js';
import { OrbitControls } from './modules/OrbitControls.js';

// import { cube, cap, floor } from "./modules/geometry.js"
// import { scene, camera, renderer, controls, light } from "./modules/scene.js"

// import {controls} from "./modules/scene.js"


var settings = {
    appName: '3D Audio Visualizer using Three.js',
    defaultMusic: 'music/test.mp3',
    width: 3,
    height: 2,
    depth: 3,
    gap: 2,
    capHeight: 0.5,
    barColor: 0xffffff,
    groundColor: 0x111111,
    barCount: 40,
    resetCam: () => {
        camera.position.set(-300, 100, 0);
        camera.clearViewOffset();
    },
    autoRotate: false
}

var camera, controls, scene, renderer, analyzeResults, analyser, started;

init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();

// Initialize
function init() {
    started = false;
    // ----------- Three.js -----------
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    scene.fog = new THREE.FogExp2(0xcccccc, 0.001);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("visualizer").appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-300, 100, 0);
    // controls
    controls = new OrbitControls(camera, renderer.domElement);
    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI * (160 / 360);
    // controls.autoRotate = true;

    // group
    var group = new THREE.Group();

    // world
    var geometry = new THREE.CylinderBufferGeometry(settings.width, settings.width, settings.height, 100, 10);
    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x444444,
        shininess: 5,
        reflectivity: 2,
        flatShading: true,
        side: THREE.DoubleSide
    });
    var offset = (settings.width * 2 + settings.gap) * settings.barCount / 2;
    var step = (settings.width * 2 + settings.gap)
    for (var i = 0; i < settings.barCount; i++) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = i * step - offset;
        mesh.name = 'bar' + i;
        group.add(mesh);
    }
    scene.add(group);

    geometry = new THREE.PlaneGeometry(1000, 1000);
    geometry.rotateX(Math.PI / 2)
    material = new THREE.MeshPhongMaterial({
        color: 0x111111,
        specular: 0xdddddd,
        shininess: 5,
        reflectivity: 2,
        side: THREE.DoubleSide
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'ground';
    scene.add(mesh)

    /* Helper coordinates */
    // var axesHelper = new THREE.AxesHelper(500);
    // scene.add(axesHelper);

    // lights
    var light1 = new THREE.DirectionalLight(0xffffff);
    light1.position.set(1, 1, 1);
    scene.add(light1);
    var light2 = new THREE.DirectionalLight(0x002266);
    light2.position.set(- 1, - 1, - 1);
    scene.add(light2);
    var light3 = new THREE.AmbientLight(0xaaaaaa);
    scene.add(light3);
    //
    window.addEventListener('resize', onWindowResize, false);

    // ----------- dat GUI -----------
    var gui = new dat.GUI();

    var lightCtrl = gui.addFolder('Light')
    lightCtrl.add(light1, 'intensity', 0, 1).name('Intensity 1')
    lightCtrl.add(light2, 'intensity', 0, 1).name('Intensity 2')
    lightCtrl.add(light3, 'intensity', 0, 1).name('Intensity 3')
    lightCtrl.open()

    var color = gui.addFolder('Color');
    color.addColor(settings, 'barColor').onChange(function (e) {
        var mesh = scene.getObjectByName('bar0');
        mesh.material.color.setHex(e);
    });
    color.addColor(settings, 'groundColor').onChange(function (e) {
        var mesh = scene.getObjectByName('ground');
        mesh.material.color.setHex(e);
    });
    color.open();

    var box = gui.addFolder('Bars');
    box.add(group.scale, 'z', 0.5, 2).name('Width').listen()
    box.add(group.scale, 'y', 0.5, 2).name('Height').listen()
    box.add(group.scale, 'x', 0.5, 2).name('Depth').listen()
    box.open();

    gui.add(settings, 'resetCam').name("Reset Camera");
    gui.add(controls, 'autoRotate').name("Auto Rotate").onChange(function (e) {
        controls.autoRotate = e;
    });

    helpMsg();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ===============  RENDERING  ===================

function animate() {
    requestAnimationFrame(animate);

    if (analyser) {
        analyser.getByteFrequencyData(analyzeResults)

        var step = Math.round(analyzeResults.length / settings.barCount);
        for (var i = 0; i < settings.barCount; i++) {
            var value = analyzeResults[i * step] / 4;
            value = value < 1 ? 1 : value; //NOTE: if the scale value is less than 1 there will be warnings in the console! so lets make sure its above 1
            var mesh = scene.getObjectByName('bar' + i);
            mesh.scale.y = value;
        }
    }

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();
}

function render() {
    renderer.render(scene, camera);
}

// ====================  AUDIO  ==========================

var musicInput = document.getElementById("audio-file")
var sound = document.getElementById('music');

musicInput.onchange = function () {
    if (this.files !== undefined) {
        sound.src = URL.createObjectURL(this.files[0]);
        sound.play();
        analyzeAudio();
        sound.onend = function () {
            URL.revokeObjectURL(this.src);
        }
    }
}

document.getElementById("play").onclick = () => {
    sound.play()
    analyzeAudio()
}

document.getElementById("pause").onclick = () => sound.pause()

document.getElementById("stop").onclick = () => {
    sound.pause()
    sound.currentTime = 0;
}

document.getElementById("help").onclick = helpMsg

function helpMsg() {
    let msg =
        `
    Welcome to my audio visualization page!

    *** Instructions ***
    # General # 
    Play: play the music (default music if no file uploaded)
    Pause: pause the music
    Stop: start music over and pause it
    
    You can upload a local music to here!

    # Dat.GUI #
    Intensity: control the intensity of the lights 
    Color: adjust the color of bars and ground
    Bars: chagne the dimension of the bar set
    Reset Camera: reset the camera to the original position
    Auto Rotate: let the camera rotate automatically (You can also drag the app to rotate)

    *You can always click help button right corner at button to show the help message!
    `
    // eslint-disable-next-line no-undef
    swal("Help", msg);
}

function analyzeAudio() {
    if (started) return;
    started = true;
    // audio init
    let audioCtx = new AudioContext()

    // audio graph setup
    analyser = audioCtx.createAnalyser()
    analyser.fftSize = 1024 // 512 bins
    let player = audioCtx.createMediaElementSource(sound)
    player.connect(audioCtx.destination)
    player.connect(analyser)

    analyzeResults = new Uint8Array(analyser.frequencyBinCount)
}