import * as THREE from '/js/imports/three.module.js';
import {OrbitControls} from '/js/imports/OrbitControls.js';
import {GUI} from '/js/imports/dat.gui.module.js'; 
import {GLTFLoader} from '/js/imports/GLTFLoader.js';

let scene, camera, renderer, controls, container, gui, raycaster;
let bishop, pawn, knight, rook, queen, king;
let selected, ogcolor, curPlayer = 'w', isInGui = false;
let mats = [];
let board = {};

const translate = {'1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', 'a': 'one', 'b': 'two', 'c': 'three', 'd': 'four', 'e': 'five', 'f': 'six', 'g': 'seven', 'h': 'eight'}

// hard coded magic values for square offsets onto board
const squares = {'one': 43, 'two': 31.3, 'three': 18.5, 'four': 6, 'five': -6.5, 'six': -18.5, 'seven': -31.5, 'eight': -44};

// starting position for each piece
const startingPos = {
	wr1: {x: 'one', z: 'one'}, wn1: {x: 'one', z: 'two'}, wb1: {x: 'one', z: 'three'}, wq: {x: 'one', z: 'four'}, wk: {x: 'one', z: 'five'}, wb2: {x: 'one', z: 'six'}, wn2: {x: 'one', z: 'seven'}, wr2: {x: 'one', z: 'eight'}, 

	w1: {x: 'two', z: 'one'}, w2: {x: 'two', z: 'two'}, w3: {x: 'two', z: 'three'}, w4: {x: 'two', z: 'four'}, w5: {x: 'two', z: 'five'}, w6: {x: 'two', z: 'six'}, w7: {x: 'two', z: 'seven'}, w8: {x: 'two', z: 'eight'},

	br1: {x: 'eight', z: 'one'}, bn1: {x: 'eight', z: 'two'}, bb1: {x: 'eight', z: 'three'}, bk: {x: 'eight', z: 'five'}, bq: {x: 'eight', z: 'four'}, bb2: {x: 'eight', z: 'six'}, bn2: {x: 'eight', z: 'seven'}, br2: {x: 'eight', z: 'eight'}, 

	b1: {x: 'seven', z: 'one'}, b2: {x: 'seven', z: 'two'}, b3: {x: 'seven', z: 'three'}, b4: {x: 'seven', z: 'four'}, b5: {x: 'seven', z: 'five'}, b6: {x: 'seven', z: 'six'}, b7: {x: 'seven', z: 'seven'}, b8: {x: 'seven', z: 'eight'}
};

// loading everything
window.onload = () => {
	init();
	load3dPieces();
	animate();
}

// importing the 3d pieces and saving them into diff objects
const load3dPieces = () => {
	let loader = new GLTFLoader();
	loader.load('../assets/scene.gltf', (gltf) => {

		gltf.scene.traverse((obj) => {
			switch(obj.name){
				case 'PrimaryWhiteBishop001':
					bishop = obj;
					break;
				case 'WhiteKnight001':
					knight = obj;
					break;
				case 'PrimaryWhitePawn007':
					pawn = obj;
					break;
				case 'Rook001':
					rook = obj;
					break;
				case 'WhiteQueen':
					queen = obj;
					break;
				case 'WhiteKing':
					king = obj;
					break;
				default:
			}
		});
		initBoard();
	});
}

// places the different pieces according to their starting positions, and makes board object
const initBoard = () => {
	let blackMat = new THREE.MeshStandardMaterial({color: 0x000000});

	Object.entries(startingPos).forEach(val => {
		let name = val[0];
		let piece = val[1];
		let clone;

		switch(name[1]){
			case 'r':
				clone = rook.clone();
				break;			
			case 'b':
				clone = bishop.clone();
				break;			
			case 'n':
				clone = knight.clone();
				clone.rotation.z = name[0] === 'b' ? (- Math.PI / 2) : (Math.PI / 2); 
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

		// name[0] === 'b' ? clone.children[0].material = blackMat : null;
		clone.children[0].material = new THREE.MeshStandardMaterial({color: name[0] === 'b' ? 0x808080 : 0xffffff});
		clone.rotation.x = - Math.PI / 2;
		clone.position.x = squares[piece.x];
		clone.position.z = squares[piece.z];
		clone.boardX = piece.x;
		clone.boardZ = piece.z;
		clone.onBoard = true;
		clone.moved = false;
		clone.color = name[0];
		clone.name = name;
		board[name] = clone;
		scene.add(clone);
		mats.push(clone.children[0]);
	});
	initBoardLets();
}

const initBoardLets = () => {
	let loader = new THREE.FontLoader();
	loader.load('../assets/droid_sans_regular.typeface.json', (font) => {
		const mesh = new THREE.MeshBasicMaterial( { color: 'mediumslateblue' } );

		const letters = {'a': {'x': squares.eight - 7, 'z': squares.one + 2}, 'b': {'x': squares.eight - 7, 'z': squares.two + 2}, 'c': {'x': squares.eight - 7, 'z': squares.three + 2}, 'd': {'x': squares.eight - 7, 'z': squares.four + 2}, 'e': {'x': squares.eight - 7, 'z': squares.five + 2}, 'f': {'x': squares.eight - 7, 'z': squares.six + 2}, 'g': {'x': squares.eight - 7, 'z': squares.seven + 2}, 'h': {'x': squares.eight - 7, 'z': squares.eight + 2} };

		const nums = {'1': {'x': squares.eight - 7, 'z': squares.one + 2}, '2': {'x': squares.eight - 7, 'z': squares.two + 2}, '3': {'x': squares.eight - 7, 'z': squares.three + 2}, '4': {'x': squares.eight - 7, 'z': squares.four + 2}, '5': {'x': squares.eight - 7, 'z': squares.five + 2}, '6': {'x': squares.eight - 7, 'z': squares.six + 2}, '7': {'x': squares.eight - 7, 'z': squares.seven + 2}, '8': {'x': squares.eight - 7, 'z': squares.eight + 2} };

		Object.entries(letters).forEach((val, ind) => {
			let geometry = new THREE.TextGeometry(val[0], {
				font,
				size: 5,
				height: 2,
				curveSegments: 12,
			} );
			let letter = new THREE.Mesh(geometry, mesh)
			scene.add(letter);
			letter.position.y = 10;
			letter.position.x = val[1].x;
			letter.position.z = val[1].z;
			letter.rotation.y = (Math.PI / 2);
		});		

		Object.entries(nums).forEach((val, ind) => {
			let geometry = new THREE.TextGeometry(val[0], {
				font,
				size: 5,
				height: 2,
				curveSegments: 12,
			} );
			let letter = new THREE.Mesh(geometry, mesh)
			scene.add(letter);
			letter.position.y = 10;
			letter.position.x = val[1].z;
			letter.position.z = val[1].x;
		});
	});
}


// rerenders board and moves/deletes pieces to their spots
const reRenderBoard = () => {
	Object.entries(board).forEach(val => {
		let name = val[0];
		let piece = val[1];

		if (!piece.onBoard) {
			if (name[1] === 'k'){
				setTimeout(() => {Swal.fire({title: 'Congrats ' + (name[0] === 'w' ? 'black' : 'white') + '!',
						   icon: 'success',
						   text: 'You played yourself!',
						   confirmButtonText: 'Try Again!',
						   showConfirmButton: true
				}).then(result => window.location.reload(true))}, 50);
			}
			scene.remove(piece);
			delete board[name];
			return;
		}

		if (piece.moved) {
			piece.moved = false;
			piece.position.x = squares[piece.boardX];
			piece.position.z = squares[piece.boardZ];
		}
	});
}

// makes all the basic scene stuff
const init = () => {

	//Init Scene and cameras
	scene = new THREE.Scene();
	scene.background = new THREE.Color('lavender');
	// scene.fog = new THREE.FogExp2(0xcccccc, 0.0002);

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
	// camera = new THREE.PerspectiveCamera(60, 2, .1, 200);
	camera.position.set(70, 17, 55);
	raycaster = new THREE.Raycaster();
	container = document.getElementById( 'ThreeJS' );

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	//Mouse Controls
	controls = new OrbitControls( camera, renderer.domElement )
	controls.enableDamping = true;
	controls.dampingFactor = .05;
	controls.update();

	// Bunch of random lights
	var light = new THREE.DirectionalLight(0xffffff	);
	light.position.set(1,1,6);
	scene.add(light);

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

	// gui stuff
	gui = new GUI({name: 'chessboard'});
	gui.add({textField: 'a3'}, 'textField')
	   .name('Move Selected')
	   .onFinishChange((val) => moveFunc(val));

	let colorParams = {whitecolor: [255, 255, 255], blackcolor: [128, 128, 128]};
	gui.addColor(colorParams, 'whitecolor')
	   .onChange(colorval => changeColors('w', colorval));
	gui.addColor(colorParams, 'blackcolor')
	   .onChange(colorval => changeColors('b', colorval));
	gui.add({Help: () => { 
		Swal.fire({title: 'Help Me!',
				  icon: 'info',
				  html: 'Don\'t worry! Once you get the basics down for this game it\'s not too hard.' + 
				  		'<a href="https://www.chess.com/learn-how-to-play-chess"> Here\'s</a> a link to ' + 
				  		'help you out! Once you figure the basics out all you have to do is click on piece ' + 
				  		'and type the square you want to move it to!'}); 
	}}, 'Help').name('Help Me!');

	container.appendChild(renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('click', selectObject, false);

	// keep selection even when you click dat gui
	document.querySelector('.dg').addEventListener('mouseover', e => isInGui = true);
	document.querySelector('.dg').addEventListener('mouseout', e => isInGui = false);
}


const changeColors = (og, newCol) => {
	Object.entries(board).forEach(val => {
		if (val[0][0] === og) 
			val[1].children[0].material.color.setRGB(newCol[0] / 255, newCol[1] / 255, newCol[2] / 255);
		console.log(val[1].children[0].floorMaterial);
	});
}

// function for moving the piece from dat gui
const moveFunc = (val) => {
	let pattern = /[a-h][1-8]/

	if (!selected) {
		alert('No pieces are selected! ಥ_ಥ');	
		return false;	
	}

	if (val === 'castle') {
		alert('Sorry, I\'m not smart enough to put that in ¯\\_(ツ)_/¯');
		return false;
	}

	val = val.toLowerCase().match(pattern);

	if (val !== null){
		let row = translate[val[0][0]]; // 1 2 3
		let col = translate[val[0][1]]; // a b c

		if (row === selected.boardZ && col === selected.boardX) {
			alert('You\'re already there silly •ᴗ•')
		} else if (canMoveThere(row, col)){
			selected.boardZ = row;
			selected.boardX = col;
			selected.moved = true;
			reRenderBoard();
		} else {
			alert('You can\'t move there ヽ(ಠ_ಠ)ノ');
		}
	} else {
		alert('invalid input, must be between [a - h] and [1 - 8] and format: \'a3\' or \'b8\'')
	}
}

// checks if the selected piece is allowed to move to that new position
const canMoveThere = (row, col) => {
	let pieceType = selected.name[1];
	let currow = selected.boardZ;
	let curcol = selected.boardX;

	switch(pieceType){
		case 'r':
			return moveRook(row, col, currow, curcol);
			break;			
		case 'b':
			return moveBishop(row, col, currow, curcol);
			break;			
		case 'n':
			return moveKnight(row, col, currow, curcol);
			break;			
		case 'q':
			return moveQueen(row, col, currow, curcol);
			break;
		case 'k':
			return moveKing(row, col, currow, curcol);
			break;
		default:
		return movePawn(row, col, currow, curcol);
	}
	return true;
}

const promoteSelected = () => {
	selected.children[0].geometry = queen.children[0].geometry.clone();
	selected.scale.x = selected.scale.y = selected.scale.z = queen.scale.x;
	selected.name += ('promoted' + Math.floor(Math.random() * 1000));
}

const movePawn = (row, col, currow, curcol) => {
	curcol = parseInt(getKeyByVal(translate, curcol));
	col = parseInt(getKeyByVal(translate, col));
	currow = parseInt(getKeyByVal(translate, currow));
	row = parseInt(getKeyByVal(translate, row));
	if (col === (curcol + 1)){
		if ((currow === (row - 1) || currow === (row + 1)) && isOcc(translate[row], translate[col])) {
			if (col === 8 && deletePiece(translate[row], translate[col])){
				promoteSelected();
				return true;
			}
		}
		else if (row === currow) {
			if (col === 8 && !isOcc(translate[row], translate[col])) {
				promoteSelected();
				return true;
			}
			return !isOcc(translate[row], translate[col]);
		}
	} 

	return false;
}

const moveKing = (row, col, currow, curcol) => {
	curcol = parseInt(getKeyByVal(translate, curcol));
	col = parseInt(getKeyByVal(translate, col));
	currow = parseInt(getKeyByVal(translate, currow));
	row = parseInt(getKeyByVal(translate, row));
	if (Math.abs(curcol - col) !== 1 && Math.abs(currow - row) !== 1){
		return false;
	}

	return deletePiece(translate[row], translate[col]);
}

const moveQueen = (row, col, currow, curcol) => {
	if (moveBishop(row, col, currow, curcol) || moveRook(row, col, currow, curcol))
		return deletePiece(row, col);
	return false;
}

const moveKnight = (row, col, currow, curcol) => {
    const x = [2, 1, -1, -2, -2, -1, 1, 2]; // all the possible x moves of a knight
    const y = [1, 2, 2, 1, -1, -2, -2, -1]; // all the possible y moves of a knight

	curcol = parseInt(getKeyByVal(translate, curcol));
	col = parseInt(getKeyByVal(translate, col));
	currow = parseInt(getKeyByVal(translate, currow));
	row = parseInt(getKeyByVal(translate, row));

	let colDiff = col - curcol;
	let rowDiff = row - currow;

	for (let i = 0; i < x.length; i++){
		if (x[i] === colDiff && y[i] === rowDiff)
			return deletePiece(translate[row], translate[col]);
	}

	return false;

}

const moveBishop = (row, col, currow, curcol) => {	
	curcol = parseInt(getKeyByVal(translate, curcol));
	col = parseInt(getKeyByVal(translate, col));
	currow = parseInt(getKeyByVal(translate, currow));
	row = parseInt(getKeyByVal(translate, row));

	if (Math.abs(currow - row) !== Math.abs(curcol - col)){
		return false;
	}

	let highCol = curcol > col ? curcol : col;
	let lowCol = curcol > col ? col : curcol;

	let highRow = currow > row ? currow : row;
	let lowRow = currow > row ? row : currow;

	for (let i = lowCol + 1, j = lowRow; i < highCol || j < highRow; i++, j++){
		if (isOcc(row, translate[i]))
			return false;
	}
	
	return deletePiece(translate[row], translate[col]);
}

const moveRook = (row, col, currow, curcol) => {
	if (currow !== row && curcol !== col){
		return false;
	} 

	if (currow === row) {
		let indOne = parseInt(getKeyByVal(translate, curcol));
		let indTwo = parseInt(getKeyByVal(translate, col));
		let high = indTwo > indOne ? indTwo : indOne;
		let low = indTwo > indOne ? indOne : indTwo;
		for (let i = low + 1; i < high; i++) {
			if (isOcc(row, translate[i]))
				return false;
		}

	} else {
		let indOne = parseInt(getKeyByVal(translate, currow));
		let indTwo = parseInt(getKeyByVal(translate, row));
		let high = indTwo > indOne ? indTwo : indOne;
		let low = indTwo > indOne ? indOne : indTwo;
		for (let i = low + 1; i < high; i++) {
			if (isOcc(translate[i], col))
				return false;
		}
	}
	
	return deletePiece(row, col);;	
}

// checks is if a piece is already on that square (probably couldve made this better by refactoring board)
const isOcc = (row, col) => {
	let ret = false;

	Object.entries(board).some(piece => {
		if (piece[1].boardZ === row && piece[1].boardX === col){
			ret = true;
			return true;
		}
	});
	return ret;
}

const deletePiece = (row, col) => {
	let ret = true;

	Object.entries(board).some(piece => {
		piece = piece[1]
		if (piece.boardZ === row && piece.boardX === col){
			if (piece.color === selected.color) {
				ret = false
			} else {
				piece.onBoard = false;
			}
			return true;
		}
	});

	return ret;
}

const getKeyByVal = (obj, val) => {
	return Object.keys(obj).find(key => obj[key] === val);
}

const selectObject = (event) => {
	event.preventDefault();

  	if (!isInGui) {
      // Mouse is inside element.
		let mouse2d = new THREE.Vector2();
		mouse2d.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse2d.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		
		raycaster.setFromCamera(mouse2d, camera);

		let intersects = raycaster.intersectObjects(mats);

		if (intersects.length !== 0) {
			if (selected !== undefined) {
				selected.children[0].material.color.setHex(ogcolor);
			}
			ogcolor = intersects[0].object.material.color.getHex();
			intersects[0].object.material.color.set('skyblue');
			selected = intersects[0].object.parent;
		} else {
			selected ? selected.children[0].material.color.setHex(ogcolor) : null;
			selected = undefined;
		}
    }
}

// resizes
const onWindowResize = () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

// animates
const animate = () => {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}

// Add stats box
(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
