let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let geometry = new THREE.BoxGeometry(2, 1, 4);
let material = new THREE.MeshBasicMaterial({
  color: 0xff8c69
});

let mat = new THREE.LineBasicMaterial( { color: 0x00cc99 } );

var points = [];
points.push( new THREE.Vector3( 100, 10, 25 ) );
points.push( new THREE.Vector3( 50, 10, 5 ) );
points.push( new THREE.Vector3( -50, 5, 0 ) );

var geo = new THREE.BufferGeometry().setFromPoints( points );

var line = new THREE.Line( geo, mat );
scene.add(line);

var points = [];
points.push( new THREE.Vector3( -100, 10, 25 ) );
points.push( new THREE.Vector3( -50, 10, 5 ) );
points.push( new THREE.Vector3( 50, 5, 0 ) );

var geoTwo = new THREE.BufferGeometry().setFromPoints( points );

var lineTwo = new THREE.Line( geoTwo, mat );
scene.add(lineTwo);

let cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 20;

let light = new THREE.DirectionalLight('white', 1);
light.position.set(0,-400,400).normalize();
scene.add(light);

let listener = new THREE.AudioListener();
camera.add(listener);

let sound = new THREE.Audio(listener);
scene.add(sound);

var audioLoader = new THREE.AudioLoader();

audioLoader.load( 'sound.wav', function( buffer ) {
	sound.setBuffer( buffer );
    sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});

let animate = function() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.02;
  cube.rotation.y += 0.05;
  line.rotation.x += 0.02;
  line.rotation.y += 0.05;
  lineTwo.rotation.x += 0.02;
  lineTwo.rotation.y += 0.05;
  renderer.render(scene, camera);
};

let onClick = function(){
    animate();
}

