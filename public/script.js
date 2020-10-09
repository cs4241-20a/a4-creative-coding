import * as THREE from "/three.module.js"
import * as dat from "/dat.gui.module.js"

let cameraPosZ = 0;
let cameraPosY = 0;

let cameraRotZ = 0;
let cameraRotY = 0;
let cameraRotX = 0;

function start()
{
  document.body.innerHTML = "";
  let result = visualizeAudio("https://cdn.glitch.com/e538f1dc-4c5a-4525-90d1-af598d342c93%2FMonsters%20Inc%20theme%20(full).mp3?v=1602016888004");
  let gui = new dat.GUI({name: 'Sound Controls'});
  let folder1 = gui.addFolder('Camera Position Controls ');
  
  cameraRotZ = {Rotation_Z: 0};
  folder1.add(cameraRotZ, 'Rotation_Z', -180, 180);
  cameraRotY = {Rotation_Y: 45};
  folder1.add(cameraRotY, 'Rotation_Y', -180, 180);
  cameraRotX = {Rotation_X: 0};
  folder1.add(cameraRotX, 'Rotation_X', -180, 180);
  cameraPosZ = {Z: 180};
  folder1.add(cameraPosZ, 'Z', 0, 360);
  cameraPosY = {Y: 0};
  folder1.add(cameraPosY, 'Y', -180, 180);
  
  let folder2 = gui.addFolder('Waveform Controls');
  
  folder2.addColor(palette, 'Left_Color');
  folder2.addColor(palette, 'Right_Color');
}

let palette = {
    Left_Color: '#0000ff', // CSS string
    Right_Color: '#ff0000'
};

function combine(array1, array2)
{
    var i, out = [];//new array
    for(i=0;i<array1.length;i++)
    {
        out.push([array1[i],array2[i]]);
    }
    return out;
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;
  let buffer = null;
  const ac = new AudioContext();
  
  const visualizeAudio = url => {
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => ac.decodeAudioData(arrayBuffer))
      .then(audioBuffer => process(audioBuffer));
  };
  
  const process = buff => {
  const samples = 100000; // For a 45 sec song did 45 * 60 * 30, change 45 to amount of seconds. also frame updates were at 30 for 30fps
  const songLength = 129; //In seconds
  const leftData = buff.getChannelData(0); //channel left
  const rightData = buff.getChannelData(1); //right channel
  const size = Math.floor(leftData.length / samples); 
  let filteredDataLeft = [];
  let filteredDataRight = [];
  for (let i = 0; i < samples; i++) {
    let blockStart = size * i; 
    let sumLeft = 0;
    let sumRight = 0;
    for (let j = 0; j < size; j++) { //loop though and add using absolute value
      sumLeft = sumLeft + Math.abs(leftData[blockStart + j]);
      sumRight = sumRight + Math.abs(rightData[blockStart + j]); 
    }
    filteredDataLeft.push(sumLeft / size); 
    filteredDataRight.push(sumRight / size);
  }
    const multiplierLeft = Math.pow(Math.max(...filteredDataLeft), -1);
    const multiplierRight = Math.pow(Math.max(...filteredDataRight), -1);
    filteredDataLeft = filteredDataLeft.map(n => n * multiplierLeft);
    filteredDataRight = filteredDataRight.map(n => n * multiplierRight);
    let resultant = combine(filteredDataLeft,filteredDataRight);
    onProcessComplete(resultant); //a 2d array 
  };

function onProcessComplete(result){
  var scene = new THREE.Scene();
			var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			var renderer = new THREE.WebGLRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );
  
      var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
      var points = [];
      points.push( new THREE.Vector3( 0, 0, 0 ) );

      var geometry = new THREE.BufferGeometry().setFromPoints( points );
      var line = new THREE.Line( geometry, material );
      scene.add( line );
  
      var materialRight = new THREE.LineBasicMaterial( { color: 0xff0000 } );
      var pointsRight = [];
      pointsRight.push( new THREE.Vector3( 0, -30, 0 ) );

      var geometryRight = new THREE.BufferGeometry().setFromPoints( pointsRight );
      var lineRight = new THREE.Line( geometryRight, materialRight );
      scene.add( lineRight );
  
      var listener = new THREE.AudioListener();
      camera.add( listener );

      var sound = new THREE.Audio( listener );

      let now = null;
      let initSecondsSinceEpoch = 0;
      var audioLoader = new THREE.AudioLoader();
      audioLoader.load( 'https://cdn.glitch.com/e538f1dc-4c5a-4525-90d1-af598d342c93%2FMonsters%20Inc%20theme%20(full).mp3?v=1602016888004', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( false );
        sound.setVolume( 0.5 );
        sound.play();
        now = new Date() 
        initSecondsSinceEpoch = Math.round(now.getTime())  
      });

			camera.position.set( 50, 0, 100 );
      camera.lookAt( 0, 0, 0 );
      
      let temp = 0
			var animate = function () {
				requestAnimationFrame( animate );
        const now2 = new Date();
        const calculatedSecond = Math.round(now2.getTime()) - initSecondsSinceEpoch; //position in seconds
        let pos = Math.round((calculatedSecond/1000) * (100000/129));
        if(pos > 1241992706558)
        {
          pos = 0;
        }
        if(pos > 99900)
        {
          window.location.replace("https://a4-kyle-mikolajczyk.glitch.me/") //window reload
          return; //dont continue
        }
        
        points.push( new THREE.Vector3( temp+=0.5, 200*result[pos][0], 0 ) );
        pointsRight.push( new THREE.Vector3( temp+=0.5, 200*result[pos][1] - 100, 0 ) );
        
        var geometry = new THREE.BufferGeometry().setFromPoints( points );
        material = new THREE.LineBasicMaterial( { color: palette.Left_Color } ); 
        var line = new THREE.Line( geometry, material );
        scene.add( line );
        
        var geometryRight = new THREE.BufferGeometry().setFromPoints( pointsRight );
        materialRight = new THREE.LineBasicMaterial( { color: palette.Right_Color } ); 
        var lineRight = new THREE.Line( geometryRight, materialRight );
        scene.add( lineRight );
				camera.position.x += 1
        camera.position.z = Math.round(cameraPosZ.Z) //frame we on
        camera.position.y = Math.round(cameraPosY.Y) //frame we on
        
        camera.rotation.z = (cameraRotZ.Rotation_Z * Math.PI) / 180 //frame we on
        camera.rotation.y = (cameraRotY.Rotation_Y * Math.PI) / 180 //frame we on
        camera.rotation.x = (cameraRotX.Rotation_X * Math.PI) / 180 //frame we on
        
				renderer.render( scene, camera );
			};

			animate();
}

window.onload = function() {
  
  let bttn = document.getElementById("start-button");
  bttn.addEventListener("click", start, false);
};