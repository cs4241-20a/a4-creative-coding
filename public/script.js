import * as THREE from "/three.js";
import * as dat from "/dat.gui.js";

var objects = [];
var times = [];
var selected = [];
var camera, scene, raycaster, renderer;
var mouse;
var uniforms;

//vertex shader
const vShader = `
			uniform float amplitude;

			attribute vec3 customColor;
			attribute vec3 displacement;

			varying vec3 vNormal;
			varying vec3 vColor;

			void main() {

				vNormal = normal;
				vColor = customColor;

				vec3 newPosition = position + normal * amplitude;// * displacement;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

			}
`;
//fragment shader
const fShader = `
			varying vec3 vNormal;
			varying vec3 vColor;

			void main() {

				const float ambient = 0.4;

				vec3 light = vec3( 1.0 );
				light = normalize( light );

				float directional = max( dot( vNormal, light ), 0.0 );

				gl_FragColor = vec4( ( directional + ambient ) * vColor, 1.0 );

			}
`;

const app = {

  init() {
    
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 200 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    this.createLights(); //create lights otherwise wont show
    
    //load previous cubes
    var prevObjects = []
    fetch("/getall").then(response =>response.json()
    ).then( objs => {
      prevObjects = objs
      console.log("got all" + prevObjects.length)
      for(var b =0; b< prevObjects.length; b++){
        console.log("obj:"+prevObjects[b])
        this.boxAtPos(prevObjects[b].x, prevObjects[b].y, prevObjects[b].z)
      }
    });

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    window.addEventListener("click", onDocumentMouseClick, false);

    this.createGUI();

    this.render = this.render.bind(this);
    this.render();
  },
  
  createGUI() {
    this.gui = new dat.GUI();
    this.gui.add(camera.position, "y", -50, 50);
    this.gui.add(camera.position, "z", -50, 50);
    this.gui.add(camera.position, "x", -500,500).step(5);
    this.gui.add(this, "boxRand");
    this.gui.add(this, "clear");
    this.gui.add(this, "help");
  },
  //change visibility of help section
  help(){
    console.log("help")
    var div = document.getElementById("help")
    if(    div.style.visibility== "hidden"){
          div.style.visibility= "visible"
    }
    else{
    div.style.visibility= "hidden"
    }
  },
  
  //clear list of cubes
  clear(){
    objects = []
    times = []
    selected = []
    console.log("clear")
    for( var i = scene.children.length - 1; i >= 0; i--) { 
     var obj = scene.children[i];
     scene.remove(obj); 
    }
    //clear server list
    fetch("/clear")(response =>response.json()
    ).then(resp => {
      console.log(resp)
    })
    this.render
  },

  createLights() {
    //create white light and add to scene
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.z = 100;
    pointLight.position.y = -100;

    scene.add(pointLight);
  },
  
  //create a box at a specific position
  boxAtPos(x,y,z){
    var box = this.createObj()
    box.position.x = x
    box.position.y = y
    box.position.z = z
    
    scene.add(box);
    objects.push(box)

  },
  //create a box at a random position
  boxRand(){
    var box = this.createObj()
    box.position.x = Math.floor(Math.random() * 8 - 4) * 20;
    box.position.y = Math.floor(Math.random() * 8 - 4) * 15;
    box.position.z = Math.floor(Math.random() * 5 - 10) * 20;
    
  fetch("/add", { //add new box to server list
      method: "POST",
      body: JSON.stringify({
        x: box.position.x,
        y: box.position.y,
        z: box.position.z
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json()).then(json => {
      console.log("got a response"+ json)
    }
    )
    
    scene.add(box);
    objects.push(box)
  },

  createObj() {
    var boxGeometry = new THREE.BoxBufferGeometry(20, 20, 20);

    var numFaces = boxGeometry.attributes.position.count / 3;
    var colors = new Float32Array(numFaces * 3 * 3);
    var color = new THREE.Color();

    for (var f = 0; f < numFaces; f++) {
      var index = 9 * f;
      color.setHSL(
        Math.random() * 0.3 + 0.5,
        0.75,
        Math.random() * 0.25 + 0.75
      );

      for (var i = 0; i < 3; i++) {
        colors[index + 3 * i] = color.r;
        colors[index + 3 * i + 1] = color.g;
        colors[index + 3 * i + 2] = color.b;
      }
    }

    boxGeometry.setAttribute(
      "customColor",
      new THREE.BufferAttribute(colors, 3)
    );


    uniforms = {
      amplitude: { value: 0.0 }
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: vShader,
      fragmentShader: fShader,
      uniforms
    });
    var boxMaterial = material;

    var box = new THREE.Mesh(boxGeometry, boxMaterial);
    return box;
  },

  render() {
    var time = (Date.now() * 0.001) ;
    
    for(var i =0; i< selected.length; i++){
      var currAmp = selected[i].material.uniforms.amplitude.value 
      selected[i].material.uniforms.amplitude.value = Math.abs(5.0 * Math.sin((time+times[i]) * 0.5)); // change amplitude
      if ( currAmp >0 && currAmp <0.02){ //stop expanding 
        selected[i].material.uniforms.amplitude.value= 0
        times.splice(i,1);
        selected.splice(i, 1);
        console.log("remove")
      }

    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(this.render);
  }
};

function animate() {
  //console.log("animating")
  requestAnimationFrame(animate);
  app.render();
}

function onDocumentMouseClick(event) {
  event.preventDefault();
  console.log("onclick");
  console.log(mouse);
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    console.log("intersected something");
    var object = intersects[0].object;
    selected.push(object)
    var time = Date.now() * 0.001;
    times.push(time)
    
  }
}

window.onload = () => {
  app.init();
  animate();
  
  
  var hideBtn = document.getElementById("help")
  hideBtn.onclick = app.help
};
