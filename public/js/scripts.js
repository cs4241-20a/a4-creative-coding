import * as THREE from '/js/imports/three.module.js';
import {OrbitControls} from '/js/imports/OrbitControls.js';
import {GUI} from '/js/imports/dat.gui.module.js'; 
import {GLTFLoader} from '/js/imports/GLTFLoader.js';

let scene, camera, renderer, controls, container;

let pawn, rook, knight, bishop, queen, king;



window.onload = () => {
	init();
	load3dPieces();
	animate();
}

const load3dPieces = () => {
	let loader = new GLTFLoader();
	loader.load('../assets/scene.gltf', (gltf) => {
		// scene.add(pieces = gltf.scene);
		console.log('opaisdhfa');
		gltf.scene.traverse((obj) => {
			if (obj.name === 'PrimaryWhiteBishop001'){
				bishop = obj;
			} else if (obj.name === 'PrimaryWhitePawn007'){
				pawn = obj;
			} else if (obj.name === 'WhiteKnight001'){
				knight = obj;
			} else if (obj.name === 'Rook001'){
				rook = obj;
			} else if (obj.name === 'WhiteQueen0'){
				queen = obj;
			} else if (obj.name === 'WhiteKing0'){
				king = obj;
			}
		});


	});
}

const init = () => {

	//Init Scene and cameras
	scene = new THREE.Scene();
	scene.background = new THREE.Color('lavender');
	// scene.fog = new THREE.FogExp2(0xcccccc, 0.0002);

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.set(40, 20, 0);
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

	//Pyramids
	// let geometry = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1);
	// let material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });

	// for (var i = 0; i < 500; i ++) {
	// 	var mesh = new THREE.Mesh( geometry, material );
	// 	mesh.position.x = Math.random() * 1600 - 800;
	// 	mesh.position.y = 0;
	// 	mesh.position.z = Math.random() * 1600 - 800;
	// 	mesh.updateMatrix();
	// 	mesh.matrixAutoUpdate = false;
	// 	scene.add( mesh );
	// }
	

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


	let gui = new GUI({name: 'chessboard'});
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
