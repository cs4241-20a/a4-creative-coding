import * as THREE from './three.js'
import * as dat from './dat.gui.js'

const app = {
  init() {
    alert("Welcome! Here is a cool animation to play around with. With the interface on the right side, you can change the X, Y, Z dimensions of the 3 stars and the diamond in the center, as well as the axis of rotation, and camera view. If you need to refer to these instructions again, click the Help button in the top left corner.")
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera()
    this.camera.position.z = 100

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize( window.innerWidth, window.innerHeight )

    document.body.appendChild( this.renderer.domElement )
    
    this.createLights()
    this.smKnot = this.createKnot(10, 5, 0xF7C896)
    this.medKnot = this.createKnot(15, 10, 0xF6EBDF)

    this.diamond = this.createDiamond()
        
    this.createGUI()

    this.render = this.render.bind( this )
    this.render()
  },
  
  createGUI() {
    this.gui = new dat.GUI()
    const diamondFolder = this.gui.addFolder('diamond')
    diamondFolder.add( this.diamond.scale, 'x', .1,2 ).name("diamond X")
    diamondFolder.add( this.diamond.scale, 'y', .1,2 ).name("diamond Y")
    diamondFolder.add( this.diamond.scale, 'z', .1,2 ).name("diamond Z")
    
    const smKnotFolder = this.gui.addFolder('inner star')
    smKnotFolder.add( this.smKnot.scale, 'x', .1,2 ).name("inner star X")
    smKnotFolder.add( this.smKnot.scale, 'y', .1,2 ).name("inner star Y")
    smKnotFolder.add( this.smKnot.scale, 'z', .1,2 ).name("inner star Z")
    smKnotFolder.add( this.smKnot.rotation, 'x', 0,180).name("inner star rotate");

    const lrgKnotFolder = this.gui.addFolder('outer star')
    lrgKnotFolder.add( this.medKnot.scale, 'x', .1,2 ).name("outer star X")
    lrgKnotFolder.add( this.medKnot.scale, 'y', .1,2 ).name("outer star Y")
    lrgKnotFolder.add( this.medKnot.scale, 'z', .1,2 ).name("outer star Z")
    lrgKnotFolder.add( this.medKnot.rotation, 'x', 0,180).name("outer star rotate");
    
    const cameraFolder = this.gui.addFolder('camera')
    cameraFolder.add( this.camera.position, 'x', -50,50).name("Camera X");
    cameraFolder.add( this.camera.position, 'y', -50,50).name("Camera Y");
    cameraFolder.add( this.camera.position, 'z', .1,200).name("Camera Z");
  },

  createLights() {
    const pointLight = new THREE.PointLight( 0x00000 )
    pointLight.position.z = 100

    this.scene.add( pointLight )
  },

  createKnot(x,y,color) {
    const knotgeo = new THREE.TorusKnotGeometry( x, 0.2, y, 50, 3, 5 )
    const mat     = new THREE.MeshNormalMaterial({ color:color, shininess:10 }) 
    const knot    = new THREE.Mesh( knotgeo, mat )

    this.scene.add( knot )
    return knot
  },
  
  createDiamond() {
    const geometry = new THREE.OctahedronBufferGeometry(2);
    var material = new THREE.MeshNormalMaterial( {color: 0xC2B3A1} );
    var diamond = new THREE.Mesh( geometry, material );
    this.scene.add(diamond);
    return diamond;
  },
  

  render(speed) {
    this.smKnot.rotation.y += .01
    this.diamond.rotation.y += .01
    this.medKnot.rotation.y += .02

    this.renderer.render( this.scene, this.camera )
    window.requestAnimationFrame( this.render )
  }
}

window.onload = () => app.init()
