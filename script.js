import * as THREE from './three.js' 
import * as dat   from './dat.gui.js'
  
const app = {
  init() {
    alert("Welcome! Here is a fun animation for you. You can change the X, Y, Z dimensions of the 3 spirals and the ball in the center. You can also change their axis of rotation using the rotate options. You can change the camera view using the Camera settings in the panel. If you need to refer to these instructions again, simply click on the HELP button. Enjoy!")
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera()
    this.camera.position.z = 100

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize( window.innerWidth, window.innerHeight )

    document.body.appendChild( this.renderer.domElement )
    
    this.createLights()
    this.knot = this.createKnot(110, 5, 0xFFC0CB)
    this.knot1 = this.createKnot(25, 15, 0xFF1493)
    this.knot2 = this.createKnot(250, 35, 0xC71585)
    

    this.ball = this.createBall()
 
        
    this.createGUI()

    this.render = this.render.bind( this )
    this.render()
  },
  
  createGUI() {
    this.gui = new dat.GUI()
    this.gui.add( this.ball.scale, 'x', .1,2 ).name("Center X");
    this.gui.add( this.ball.scale, 'y', .1,2 ).name("Center Y");
    this.gui.add( this.ball.scale, 'z', .1,2 ).name("Center Z");
    this.gui.add( this.knot.scale, 'x', .1,2 ).name("Small Knot X");
    this.gui.add( this.knot.scale, 'y', .1,2 ).name("Small Knot Y");
    this.gui.add( this.knot.scale, 'z', .1,2 ).name("Small Knot Z");
    this.gui.add( this.knot1.scale, 'x', .1,2 ).name("Middle Knot X");
    this.gui.add( this.knot1.scale, 'y', .1,2 ).name("Middle Knot Y");
    this.gui.add( this.knot1.scale, 'z', .1,2 ).name("Middle Knot Z");
    this.gui.add( this.knot2.scale, 'x', .1,2 ).name("Large Knot X");
    this.gui.add( this.knot2.scale, 'y', .1,2 ).name("Large Knot Y");
    this.gui.add( this.knot2.scale, 'z', .1,2 ).name("Large Knot Z");
    this.gui.add( this.knot.rotation, 'x', 0,180).name("Small Knot Rotate");
    this.gui.add( this.knot1.rotation, 'x', 0,180).name("Middle Knot Rotate");
    this.gui.add( this.knot2.rotation, 'x', 0,180).name("Large Knot Rotate");
    this.gui.add( this.camera.position, 'z', .1,200).name("Camera Z");
    this.gui.add( this.camera.position, 'y', -50,50).name("Camera Y");
    this.gui.add( this.camera.position, 'x', -50,50).name("Camera X");
  },

  createLights() {
    const pointLight = new THREE.PointLight( 0xffffff )
    pointLight.position.z = 100

    this.scene.add( pointLight )
  },

  createKnot(x,y,color) {
    const knotgeo = new THREE.TorusKnotGeometry( y, 1, x, 100, 3, 36 )
    const mat     = new THREE.MeshPhongMaterial({ color:color, shininess:50 }) 
    const knot    = new THREE.Mesh( knotgeo, mat )

    this.scene.add( knot )
    return knot
  },
  
  createBall() {
    const geometry = new THREE.DodecahedronBufferGeometry(2, 2);
    var material = new THREE.MeshBasicMaterial( {color: 0xFFFFFF} );
    var ball = new THREE.Mesh( geometry, material );
    this.scene.add(ball);
    return ball;
  },
  

  render(speed) {
    this.knot.rotation.y += .025
    this.ball.rotation.y += .025
    this.knot1.rotation.y += .025
    this.knot2.rotation.y += .025

    this.renderer.render( this.scene, this.camera )
    window.requestAnimationFrame( this.render )
  }
}

window.onload = ()=> app.init()