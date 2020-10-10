import * as THREE from '/js/imports/three.module.js';
import {OrbitControls} from '/js/imports/OrbitControls.js';
import {GUI} from '/js/imports/dat.gui.module.js'; 
import {GLTFLoader} from '/js/imports/GLTFLoader.js';

let scene, camera, renderer, controls, container, gui;
let bishop, pawn, knight, rook, queen, king;
let parentpieces, board = {};
const squares = {'one': 43, 'two': 31.3, 'three': 18.5, 'four': 6, 'five': -6.5, 'six': -18.5, 'seven': -31.5, 'eight': -44};
const startingPos = {
	wr1: {x: squares.one, z: squares.one}, wn1: {x: squares.one, z: squares.two}, wb1: {x: squares.one, z: squares.three}, wq: {x: squares.one, z: squares.four}, wk: {x: squares.one, z: squares.five}, wb2: {x: squares.one, z: squares.six}, wn2: {x: squares.one, z: squares.seven}, wr2: {x: squares.one, z: squares.eight}, 

	w1: {x: squares.two, z: squares.one}, w2: {x: squares.two, z: squares.two}, w3: {x: squares.two, z: squares.three}, w4: {x: squares.two, z: squares.four}, w5: {x: squares.two, z: squares.five}, w6: {x: squares.two, z: squares.six}, w7: {x: squares.two, z: squares.seven}, w8: {x: squares.two, z: squares.eight},

	br1: {x: squares.eight, z: squares.one}, bn1: {x: squares.eight, z: squares.two}, bb1: {x: squares.eight, z: squares.three}, bq: {x: squares.eight, z: squares.five}, bk: {x: squares.eight, z: squares.four}, bb2: {x: squares.eight, z: squares.six}, bn2: {x: squares.eight, z: squares.seven}, br2: {x: squares.eight, z: squares.eight}, 

	b1: {x: squares.seven, z: squares.one}, b2: {x: squares.seven, z: squares.two}, b3: {x: squares.seven, z: squares.three}, b4: {x: squares.seven, z: squares.four}, b5: {x: squares.seven, z: squares.five}, b6: {x: squares.seven, z: squares.six}, b7: {x: squares.seven, z: squares.seven}, b8: {x: squares.seven, z: squares.eight}
};

window.onload = () => {
	init();
	load3dPieces();
	animate();
}

const load3dPieces = () => {
	let loader = new GLTFLoader();
	loader.load('../assets/scene.gltf', (gltf) => {

		gltf.scene.traverse((obj) => {
			// if (!(obj instanceof THREE.Mesh)) console.log(obj);
  			// let prevMaterial = obj.material;
			// THREE.MeshBasicMaterial.prototype.copy.call(obj.material, prevMaterial);
			// console.log(obj);
			switch(obj.name){
				case 'PrimaryWhiteBishop001':
					obj.material = new THREE.MeshBasicMaterial({color: 0x00ff00});
					bishop = obj;
					// bishop.material.color.set('skyblue');
					console.log(bishop);
					break;
				case 'WhiteKnight001':
					obj.material = new THREE.MeshBasicMaterial();
					knight = obj;
					break;
				case 'PrimaryWhitePawn007':
					obj.material = new THREE.MeshBasicMaterial();
					pawn = obj;
					break;
				case 'Rook001':
					obj.material = new THREE.MeshBasicMaterial();
					rook = obj;
					break;
				case 'WhiteQueen':
					obj.material = new THREE.MeshBasicMaterial();
					queen = obj;
					break;
				case 'WhiteKing':
					obj.material = new THREE.MeshBasicMaterial();
					king = obj;
					break;
				default:
			}
		});
		initBoard();
	});
}

const initBoard = () => {
	Object.entries(startingPos).forEach((val, ind) => {
		let piece = val[0][1];
		let clone;

		switch(piece){
			case 'r':
				clone = rook.clone();
				break;			
			case 'b':
				clone = bishop.clone();
				break;			
			case 'n':
				clone = knight.clone();
				break;			
			case 'q':
				clone = queen.clone();
				break;
			case 'k':
				clone = king.clone();
				break;
			default:
				clone = pawn.clone();
		}
		console.log
		// val[0][0] === 'b' ? clone.material.set('skyblue') : null;
		clone.rotation.x = - Math.PI / 2;
		clone.rotation.z = - Math.PI / 2;
		clone.position.x = val[1].x
		clone.position.z = val[1].z;
		scene.add(clone);

	});
	// let clone = bishop.clone();

}

const init = () => {

	//Init Scene and cameras
	scene = new THREE.Scene();
	scene.background = new THREE.Color('lavender');
	// scene.fog = new THREE.FogExp2(0xcccccc, 0.0002);

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.set(0, 80, 0);
	container = document.getElementById( 'ThreeJS' );

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	//Mouse Controls
	controls = new OrbitControls( camera, renderer.domElement )
	controls.enableDamping = true;
	controls.dampingFactor = .05;
	controls.update();

	//Bunch of random lights
	var light = new THREE.DirectionalLight(0xffffff	);
	light.position.set(1,1,6);
	scene.add(light);

	// var light = new THREE.DirectionalLight(0x002288);
	// light.position.set(-1,-1,-1);
	// scene.add(light);

	// var light = new THREE.AmbientLight(0x222222);
	// scene.add(light);

	//Floor
	var floorTexture = new THREE.ImageUtils.loadTexture('../assets/checkerboard.jpg');
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set(2, 2);
	// DoubleSide: render texture on both sides of mesh
	var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
	var floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);

	floor.rotation.x = Math.PI / 2;
	scene.add(floor);

	//Axes
	var axes = new THREE.AxesHelper(100);
	scene.add(axes);

	camera.position.z = 5;


	gui = new GUI({name: 'chessboard'});
	let white = gui.addFolder('White');
	// white.add()
	// gui.autoPlace(true);


	// THREEx.WindowResize(renderer, camera);
	// THREEx.FullScreen.bindKey({ charCode : 'f'.charCodeAt(0) });

	container.appendChild(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
}

const onWindowResize = () => {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

const animate = () => {
	requestAnimationFrame(animate);

	controls.update();
	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	renderer.render(scene, camera);
}

//Add stats box
(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
