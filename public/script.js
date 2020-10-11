import * as THREE from './three.js'
import * as dat   from './dat.gui.js'

const constants = {
  gridSize: 750, unitSize: 50, cubeSize: 35,
  playerSpeed: 200,
  animationStatus: true,
  direction: "right",
  pointerCheckThreshold: 200,
  score: 0,
  player_head_color: 0x00f0ff,
  cherry_color: 0xde3163
}

let maxgrid = constants.gridSize / constants.unitSize * 2
let updateCounter = 0

let pointerDownX, pointerDownY
let pointerFlag
let lastPosLastUpdate = null
let addNewCube = false

let cubeGeometry = new THREE.BoxGeometry(constants.cubeSize, constants.cubeSize, constants.cubeSize);

const app = {

  init (){
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 )
    // this.camera.position.set(500, 600, 0);
    // this.camera.lookAt(new THREE.Vector3());

    this.grid = this.createGrid()

    this.player = this.createPlayer()

    this.cherry = this.createCherry()

    this.createLights()

    this.createGUI()
    
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( this.renderer.domElement )

    this.render = this.render.bind( this )
    this.render()
  },

  createGUI(){
    this.gui = new dat.GUI()

    this.gui.add (constants, "playerSpeed", 30, 200)
    this.gui.add (constants, "pointerCheckThreshold", 50, 1000)
    this.gui.add (this, "stopAnimation")
    this.gui.add (this, "startAnimation")

    let folder = this.gui.addFolder( 'Color' );
    
    folder.addColor( constants, 'player_head_color' )
          .onChange( () => this.updateHeadColor() );
    
    folder.addColor( constants, 'cherry_color' )
    .onChange( () => this.updateCherryColor() );

    folder.open();
  },

  updateHeadColor(){
    this.player[0]. cube.material.color.setHex(constants.player_head_color)
  },

  updateCherryColor(){
    this.cherry.cube.material.color.setHex(constants.cherry_color)
  },

  createLights() {
    this.light = new THREE.PointLight( 0xffffff, 2)
    this.light.position.set(constants.gridSize , 1000  , constants.gridSize)
    this.scene.add( this.light )
  },

  createPlayer() {
    let playerCubes = []

    let playerPos = { x: Math.floor(Math.random() * maxgrid) , y: Math.floor(Math.random() * maxgrid) }
    let playerHead = this.createCube( constants.player_head_color , playerPos)

    playerCubes.push(playerHead)

    playerHead.cube.add( this.camera )
    this.camera.position.set( 350, 400, 0)
    this.camera.lookAt( playerHead.cube.position )

    lastPosLastUpdate = playerHead.position

    return playerCubes
  },

  createCherry() {
    let cherryPos = { x: Math.floor(Math.random() * maxgrid) , y: Math.floor(Math.random() * maxgrid) }
    while ((cherryPos.x == this.player[0].position.x && cherryPos.y == this.player[0].position.y) || this.collidedWithBody(cherryPos)){
      cherryPos = { x: Math.floor(Math.random() * maxgrid) , y: Math.floor(Math.random() * maxgrid) }
    }
    let cherryCube = this.createCube ( constants.cherry_color , cherryPos)

    return cherryCube
  },
  
  createCube(color, position) {
    let cubeMaterial = new THREE.MeshLambertMaterial( { color: color } )
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial) 

    let worldPos = this.coordToPlane (position)
    let x = worldPos.x
    let y = worldPos.y
    cube.position.set(x, constants.cubeSize / 2 , y)

    return {cube, position, worldPos}
  },

  addCubeToSnake(color, position) {
    let tempCube = this.createCube(color, position)
    this.player.push(tempCube)
  },

  createGrid() {
    let gridGeometry = new THREE.Geometry(); 
    for ( let i = -constants.gridSize; i <= constants.gridSize; i += constants.unitSize ) {
      gridGeometry.vertices.push(new THREE.Vector3(-constants.gridSize, 0, i));
      gridGeometry.vertices.push(new THREE.Vector3(constants.gridSize, 0, i));
      gridGeometry.vertices.push(new THREE.Vector3(i, 0, -constants.gridSize));
      gridGeometry.vertices.push(new THREE.Vector3(i, 0, constants.gridSize));
    }
    
    let gridMaterial = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2, transparent: true });
    let line = new THREE.LineSegments( gridGeometry, gridMaterial );
    line.position.set(constants.gridSize - constants.unitSize / 2 , 0, -constants.gridSize + constants.unitSize / 2)
    this.scene.add(line);

    return line
  },

  render() {
    if (constants.animationStatus) {
      this.renderer.setClearColor(0xf0f0f0);
      this.renderer.render( this.scene, this.camera );
      
      
        this.updatePosition()
      
      this.renderCube()

      window.requestAnimationFrame( this.render )
    }
  },

  stopAnimation(){
    if (constants.animationStatus)
      constants.animationStatus = false
  },

  startAnimation(){
    if (!constants.animationStatus){
      constants.animationStatus = true
      this.render()
    }
  },

  updatePosition() {
    if (updateCounter < constants.playerSpeed) {
      updateCounter ++
      return
    }

    updateCounter = 0

    if (addNewCube) {
      let randRGB = this.getRandomRgb()
      this.addCubeToSnake(randRGB, lastPosLastUpdate)
      addNewCube = false
    }

    let head = this.player[0]
    let previousCubePosition = head.cube.position
    let previousPosition = {x:head.position.x, y:head.position.y}
    let px = previousCubePosition.x, py = previousCubePosition.y, pz=previousCubePosition.z
    let newWorldPos = null

    // update head
    
    console.log(constants.direction)
    switch (constants.direction) {
      case "right":
        head.position.y += 1
        newWorldPos = this.coordToPlane(head.position)
        break
      
      case "left":
        head.position.y -= 1
        newWorldPos = this.coordToPlane(head.position)
        break
      
      case "up":
        head.position.x -= 1
        newWorldPos = this.coordToPlane(head.position)
        break

      case "down":
        head.position.x += 1
        newWorldPos = this.coordToPlane(head.position)
        break
    }

    this.checkCollision(head.position)

    this.updateCubePosition(head, newWorldPos)

    lastPosLastUpdate = {
      x:this.player[this.player.length-1].position.x,
      y:this.player[this.player.length-1].position.y
    }

    for (let index = 1; index < this.player.length; index ++){
      let tempCubePosition = {
        x:this.player[index].cube.position.x,
        y:this.player[index].cube.position.y,
        z:this.player[index].cube.position.z
      }
      let tempPosition = this.player[index].position
      this.player[index].cube.position.set(px, py, pz)
      this.player[index].position = previousPosition
      previousPosition = tempPosition
      px = tempCubePosition.x, py = tempCubePosition.y, pz = tempCubePosition.z
    }
  },
  
  updateCubePosition(cubeObject, newWorldPos) {
    let x = newWorldPos.x
    let y = newWorldPos.y
    cubeObject.cube.position.set(x, constants.cubeSize / 2 , y)
  },

  checkCollision(position){
    if (position.x < 0  || position.x > maxgrid || position.y < 0 || position.y > maxgrid){
      window.alert (`"Game Over! You hit the wall! Will automatically refresh after close this messgae! You got a score of ${constants.score}"`)
      window.location.replace("/")
    } else if (position.x === this.cherry.position.x && position.y === this.cherry.position.y ){
      constants.score += 1
      this.scene.remove(this.cherry.cube)
      this.cherry = this.createCherry()
      addNewCube = true
      console.log(lastPosLastUpdate)
      console.log(this.player)
    } else if (this.collidedWithBody(position)){
      window.alert (`"Game Over! You hit your body! Will automatically refresh after close this messgae! You got a score of ${constants.score}"`)
      window.location.replace("/")
    }
  },

  collidedWithBody(hposition){
    let ans = false

    for (let index = 1; index < this.player.length; index ++){
      if (this.player[index].position.x == hposition.x && this.player[index].position.y == hposition.y ){
        ans = true 
        break
      }
    }

    return ans
  },

  getRandomRgb() {
    return Math.round(0xffffff * Math.random())
  },

  renderCube() {
    this.player.forEach( cube => this.scene.add(cube.cube))
    this.scene.add(this.cherry.cube)
  },

  coordToPlane({x , y}) {
    return {x: x * constants.unitSize , y : -y * constants.unitSize}
  },
}

window.onload = () => app.init()

window.onpointerdown = (event) => {
  pointerDownX = event.clientX
  pointerDownY = event.clientY
}

window.onpointermove = () => {
  pointerFlag = true
}

window.onpointerup = (event) => {
  if (pointerFlag) {
    let pointerUpX = event.clientX
    let pointerUpY = event.clientY
    
    // Threshold check
    let diff = Math.sqrt( Math.pow( (pointerUpX - pointerDownX) , 2 ) + Math.pow( (pointerUpY - pointerDownY) , 2 ) )
    if (diff > constants.pointerCheckThreshold) {
      
      if (Math.abs(pointerUpX - pointerDownX) > Math.abs(pointerUpY - pointerDownY)) { // if x move greater
        if (pointerUpX < pointerDownX)
          constants.direction = "left"
        else 
          constants.direction = "right"
      } else { // if y move greater
        if (pointerUpY < pointerDownY)
          constants.direction = "up"
        else 
          constants.direction = "down"
      }

    }
  
    
  }

  pointerFlag = false
}