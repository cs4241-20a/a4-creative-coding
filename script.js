import * as THREE from './three.js' 
import * as dat   from './dat.gui.js'
  
const app = {
  init() {
    alert("Welcome to my spinning shape simulator! Use the controls panel on the side to adjust the orientation of each shape; there are also options to rotate each shape between 0 and 180 degrees. Click Close Controls to minimize the Control Bar. Click the Help Button if you need to see this message again. Most importantly, Have Fun!")
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera()
    this.camera.position.z = 100

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize( window.innerWidth, window.innerHeight )

    document.body.appendChild( this.renderer.domElement )
    
    this.createLights()
    this.knot = this.createKnot(200, 200, 0xFFC0CB)
    this.cylinder = this.createCylinder()
    this.cube = this.createCube()
    // this.knot.position.x = 30
    // this.cylinder.position.y = 30
     this.cube.position.y = -10
    
    this.createGUI()

    // ...the rare and elusive hard binding appears! but why?
    this.render = this.render.bind( this )
    this.render()
  },
  
  createGUI() {
    this.gui = new dat.GUI()
    this.gui.add( this.knot.scale, 'x', .1,2 ).name("Knot X");
    this.gui.add( this.knot.scale, 'y', .1,2 ).name("Knot Y");
    this.gui.add( this.knot.scale, 'z', .1,2 ).name("Knot Z");
    this.gui.add( this.cylinder.scale, 'x', .1,2 ).name("Cylinder X");
    this.gui.add( this.cylinder.scale, 'y', .1,2 ).name("Cylinder Y");
    this.gui.add( this.cylinder.scale, 'z', .1,2 ).name("Cylinder Z");
    this.gui.add( this.knot.rotation, 'x', 0,180).name("Knot Rotation");
    this.gui.add( this.cylinder.rotation, 'x', 0,180).name("Cylinder Rotation");
    this.gui.add( this.cube.rotation, 'z', 0,180).name("Cube Rotation");
    this.gui.add( this.camera.position, 'z', .1,200).name("Camera Z");
    this.gui.add( this.camera.position, 'y', -50,50).name("Camera Y");
    this.gui.add( this.camera.position, 'x', -50,50).name("Camera X");
    
  },

  createLights() {
    const pointLight = new THREE.PointLight( 0xffffff )
    pointLight.position.z = 100

    this.scene.add( pointLight )
  },

  createKnot(x, y, color) {
    const knotgeo = new THREE.TorusKnotGeometry( 30, .1, 128, 16, 5, 21 )
    const mat     = new THREE.MeshPhongMaterial({ color:0xff0000, shininess:2000 }) 
    const knot    = new THREE.Mesh( knotgeo, mat )

    this.scene.add( knot )
    return knot
  },
  
  createCylinder(){
    var geometry = new THREE.CylinderGeometry( 10, 5, 20, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var cylinder = new THREE.Mesh( geometry, material );
    this.scene.add(cylinder);
    return cylinder;
  },
  
  createCube(){
    var geometry = new THREE.BoxGeometry( 60, 10, 10 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var cube = new THREE.Mesh( geometry, material );
    this.scene.add(cube);
    return cube;
  },

  render() {
    this.knot.rotation.x += .025
    this.cylinder.rotation.x += .025
    this.cube.rotation.y += .025
    this.renderer.render( this.scene, this.camera )
    window.requestAnimationFrame( this.render )
  }
}

window.onload = ()=> app.init()