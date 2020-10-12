// client-side js
// run by the browser each time your view template is loaded

// Extract globals, otherwise linting gets angry
const { THREE } = window;

// CONSTANT VARIABLES
let groundLevel = 0;
let arenaSize = 60;
let borderHeight = 8;
let charSize = 2;
let collisionSpeedFactor = 0.5;
let coinRadius = 3;
let coinHeight = 5;
let coinElevation = 2;

let pressedKeys = {};
// Create a scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(-(arenaSize*4)/4, arenaSize, (arenaSize*3)/4);
camera.lookAt(new THREE.Vector3(27,0,0));
const renderer = new THREE.WebGLRenderer({alpha:true, antialias: true});

renderer.shadowMap.enabled = true;//enable shadow
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



const sun = new THREE.DirectionalLight( 0xffffff, .2);
sun.position.set( -2*arenaSize,arenaSize,0 );
sun.castShadow = true;
scene.add(sun);
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.update();

// CREATE ARENA
var groundGeom = new THREE.PlaneGeometry( arenaSize, arenaSize, 32 );
rotateObject(groundGeom, 90, 0, 0);

var groundMat = new THREE.MeshBasicMaterial( {color: 0x444444, side: THREE.DoubleSide} );
var ground = new THREE.Mesh( groundGeom, groundMat );
//rotateObject(ground, 90, 0, 0);
printBoundData(ground);
scene.add( ground );

createArenaBorders();
// Add a cube to the scene

const charGeom = new THREE.SphereGeometry( charSize, 32, 32);
const charMat = new THREE.MeshBasicMaterial( {color: 0x39ff14} );
const character = new THREE.Mesh( charGeom, charMat );
character.translateY(charSize);
//placeProper(character);
scene.add( character );

// Position our camera so we can see the cube


// Add a directional light to the scene
var helper = new THREE.CameraHelper( sun.shadow.camera );
//scene.add( helper );

// add skyBox
var skyBoxGeometry = new THREE.CubeGeometry( arenaSize*5, arenaSize*5, arenaSize*5 );

	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x25AEFF, side: THREE.BackSide, transparent:true, opacity: 0.9 } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	scene.add(skyBox);

// Add an ambient light to the scene
scene.add( new THREE.AmbientLight( 0x111122 ) );
//scene.add(ambientLight);

let zAcc = 0.01;
let xAcc = Math.PI/64;
let zDecel = zAcc/8;
let zSpeed = 0;
let xRotate = 0;
let zLim = 0.5;
let xLim = 2*Math.PI;
let charMotion = new THREE.Vector3(0,0,0);

let boundCollisionFlag = false;

createCoin();

// Start the render loop 
function render() {
  onDocumentKeyDown();
  requestAnimationFrame(render);
  controls.update();
  // Rotate our cube
  applyMotion();
  //character.position.x += xRotate;
  //character.position.z += zSpeed;
  renderer.render(scene, camera);
}
render();

function rotateObject(object, degreeX=0, degreeY=0, degreeZ=0) {
   object.rotateX(THREE.Math.degToRad(degreeX));
   object.rotateY(THREE.Math.degToRad(degreeY));
   object.rotateZ(THREE.Math.degToRad(degreeZ));
}

function placeProper(object) {
  var box = new THREE.Box3().setFromObject( object );
  var low = box.min.z;
   // object.translateZ(groundLevel - low);
  //console.log( box.min, box.max, box.getSize() );
  printBoundData(object);
}

function printBoundData(obj) {
  var box = new THREE.Box3().setFromObject( obj );
    //console.log( box.min, box.max, box.getSize() );
}


window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }

//document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown() {
    //var keyCode = event.which;
  var vector = new THREE.Vector3( 1, 0, 0 );

var axis = new THREE.Vector3( 0, 1, 0 );
var angle = Math.PI / 2;

vector.applyAxisAngle( axis, angle );
  //console.log(charMotion);
    if (pressedKeys[87]) { //w
      zSpeed = changeSpeed(zSpeed, zAcc, zLim);
    } else if (pressedKeys[83]) { //s
      zSpeed = changeSpeed(zSpeed, -zAcc, zLim);

    } else {
      if(zSpeed > 0) zSpeed -= zDecel;
      else if(zSpeed < 0) zSpeed += zDecel;
    }
    if (pressedKeys[68]) {
      xRotate = changeAngularDisplacement(xRotate, -xAcc);

    } else if (pressedKeys[65]) {
      xRotate = changeAngularDisplacement(xRotate, xAcc);
    } 
    if (pressedKeys[32]) {
        character.position.set(0, charSize, 0);
        xRotate = 0;
        zSpeed = 0;
    }
};
function changeSpeed(speed, inter, limit) {
  speed += inter;
  if(speed > limit) speed = limit;
  if(speed < -limit) speed = -limit;
  return speed;
}
function changeVectorSpeed(vector, increase) {
  let vec2 = vector.clone();
  vec2.clampLength(xLim, xLim);
  if(increase){
    vector.add(vec2);
  } else {
    vector.sub(vec2);
  }
  
}
function rotateVector(vector, val) {
  var axis = new THREE.Vector3( 0, 1, 0 );

  vector.applyAxisAngle( axis, val );
}
function changeAngularDisplacement(ang, inter) {
  if(ang >= 2*Math.PI) {
    ang -= 2*Math.PI;
  } else if(ang <= -2*Math.PI) {
    ang += 2*Math.PI;
  }
  ang += inter;
  return ang;
}
function applyMotion() {
  var motion = new THREE.Vector3(0, 0, zSpeed);
  charMotion.clampLength(-zSpeed, zSpeed);
  var rotAxis = new THREE.Vector3(0, 1, 0);
  motion.applyAxisAngle(rotAxis, xRotate);
  let prevPos = character.position;
  character.position = character.position.add(motion);
  let negMotion = outOfBoundsCheck(motion);
  
  if(boundCollisionFlag) {
    let newDir = Math.atan2(negMotion.x, negMotion.z);
    xRotate = newDir;
    character.position = prevPos;
    character.position = character.position.add(negMotion);
    adjustCollisionSpeed();
    boundCollisionFlag = false;
  }
}

function createArenaBorders() {
  var borderGeom = new THREE.PlaneGeometry( arenaSize, borderHeight, 32 );
  
  var borderMat = new THREE.MeshBasicMaterial( {color: 0x800000 , side: THREE.DoubleSide, transparent: true, opacity: 0.5} );
  var borderL = new THREE.Mesh( borderGeom, borderMat );
  var borderR = new THREE.Mesh( borderGeom, borderMat );
  var borderF = new THREE.Mesh( borderGeom, borderMat );
  var borderB = new THREE.Mesh( borderGeom, borderMat );
  borderL.position.y += borderHeight/2;
  borderL.position.z -= arenaSize/2;
  borderR.position.y += borderHeight/2;
  borderR.position.z += arenaSize/2;
  borderF.position.y += borderHeight/2;
  borderF.position.x -= arenaSize/2;
  borderB.position.y += borderHeight/2;
  borderB.position.x += arenaSize/2;
  rotateObject(borderB, 0, 90, 0);
  rotateObject(borderF, 0, 90, 0);

  scene.add(borderL);
  scene.add(borderR);
  scene.add(borderF);
  scene.add(borderB);
}
function createCoin() {

  const radialSegments = 16;  

  const coinGeom = new THREE.ConeBufferGeometry(coinRadius, coinHeight, radialSegments);
  var coinMat = new THREE.MeshBasicMaterial( {color: 0xFFFFFF, side: THREE.DoubleSide} );
  var coin = new THREE.Mesh( coinGeom, coinMat );
  coin.translateY(coinHeight/2 + coinElevation);
  scene.add(coin);
}

function collision(a, b) {
  for (var vertexIndex = 0; vertexIndex < a.geometry.vertices.length; vertexIndex++)
{       
    var localVertex = a.geometry.vertices[vertexIndex].clone();
    var globalVertex = a.matrix.multiplyVector3(localVertex);
    var directionVector = globalVertex.subSelf( a.position );

    var ray = new THREE.Ray( a.position, directionVector.clone().normalize() );
    var collisionResults = ray.intersectObjects( collidableMeshList );
    if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
    {
        // a collision occurred... do something...
    }
}
}
function outOfBoundsCheck(vec) {

  if(outOfBoundsHelper(Math.abs(character.position.x)+charSize, arenaSize/2)) {
    vec.x = -vec.x;
    
    boundCollisionFlag = true;
  } else if(outOfBoundsHelper(Math.abs(character.position.z)+charSize, arenaSize/2)) {
    vec.z = -vec.z;
    boundCollisionFlag = true;

  }
  return vec;
  
}
function outOfBounds() {
  return outOfBoundsHelper(character.position.x+charSize, arenaSize/2) || 
    outOfBoundsHelper(character.position.z+charSize/2, arenaSize/2);
}
function outOfBoundsHelper(val, lim) {
  if(val < -lim) {
    
    return true;
  }
  if(val > lim) {
    
    return true;
  }
  return false;
}
//}

function adjustCollisionSpeed() {
  zSpeed *= collisionSpeedFactor;
  //xRotate = 
  //xRotate = changeAngularDisplacement(xRotate, Math.PI);
}