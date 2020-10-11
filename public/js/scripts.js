console.log("Assignment 4 launched")

NUM_SPOKES = 250
SPOKE_WIDTH = 2

window.onload = function() {
  // Get canvas and let it expand
  const visCanvas = document.querySelector("#visualizer")
  visCanvas.height = window.innerHeight
  visCanvas.width  = window.innerWidth
  
  // Set up audio and get frequency array
  let analyzer = init_Audio()
  
  // Recursively draw the visualizer
  redrawVisualizer(visCanvas, analyzer, drawCircle)
}



function init_Audio() {
  // Get HTML elements
  const audioElement = document.querySelector('audio');
  const volumeSlider = document.querySelector('#volume');
  const playButton   = document.querySelector('button');
  
  // Set up Web Audio API stuff
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  const analyzer = audioContext.createAnalyser();
  const track = audioContext.createMediaElementSource(audioElement);
  const gainNode = audioContext.createGain();
  
  // Set audio gain start value
  gainNode.gain.value = volumeSlider.value;
  
  // Connect stuff together
  track.connect(analyzer);
  analyzer.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Hook up volume slider
  volumeSlider.addEventListener('input', function() {
    gainNode.gain.value = this.value;
  }, false);
  
  // Hook up pause/play button
  playButton.addEventListener('click', function() {
    // Check if suspended (likely from autoplay policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    // Otherwise this button plays or pauses
    if (this.dataset.playing === 'false') {
        audioElement.play();
        this.dataset.playing = 'true';
    } else if (this.dataset.playing === 'true') {
        audioElement.pause();
        this.dataset.playing = 'false';
    }
  }, false);
  
  // Set aside frequency array (global) and return analyzer
  frequencies = new Uint8Array(analyzer.frequencyBinCount);
  return analyzer
}

function redrawVisualizer(canvas, analyzer, shapeFunc) {
  //Update frequency data
  analyzer.getByteFrequencyData(frequencies);
  
  //Clear and redraw canvas
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
  shapeFunc(canvas, frequencies)
  
  // Schedule loop (using lambda because reqAnimFrame takes a function without parameter)
  window.requestAnimationFrame(() => {redrawVisualizer(canvas, analyzer, shapeFunc)});
}



function drawCircle(canvas, frequencies) {
  let context = canvas.getContext("2d")
  
  let shortAxis = Math.min(canvas.width, canvas.height)
  let x_mid = canvas.width  / 2
  let y_mid = canvas.height / 2
  
  let radius = shortAxis / 4
  let maxSpokeLen = shortAxis / 4
  
  // Draw the circle
  context.beginPath()
  context.arc(x_mid, y_mid, radius, 0, 2*Math.PI)
  context.stroke()
  
  // Draw the spokes
  for (pos = 0; pos < NUM_SPOKES; pos++) {
    let angle = (2 * Math.PI / NUM_SPOKES) * pos - (Math.PI / 2)
    
    let x = x_mid + radius * Math.cos(angle)
    let y = y_mid + radius * Math.sin(angle)
    
    let freqStep = frequencies.length / NUM_SPOKES
    let freq = frequencies[Math.floor(pos * freqStep)]
    
    drawSpoke(context, x, y, angle, maxSpokeLen, freq)
  }
}



function drawTriangle(canvas, frequencies) {
  let context = canvas.getContext("2d")
  
  let shortAxisLen = Math.min(canvas.width, canvas.height)
  let x_mid = canvas.width  / 2
  let y_mid = canvas.height / 2
  
  let radius = shortAxisLen / 3
  let maxSpokeLen = shortAxisLen / 4
  
  // Top vertex
  let tx1 = x_mid
  let ty1 = y_mid - radius
  //Bottom right vertex
  let tx2 = x_mid + radius * Math.sin(Math.PI / 3)
  let ty2 = y_mid + radius * Math.cos(Math.PI / 3)
  //Bottom left vertex
  let tx3 = x_mid - radius * Math.sin(Math.PI / 3)
  let ty3 = ty2
  
  // Draw the triangle (not actually spokes)
  let sideLen = 2 * radius * Math.cos(Math.PI / 6)
  drawSpoke(context, tx1, ty1,  Math.PI/3, sideLen)
  drawSpoke(context, tx2, ty2,  Math.PI,   sideLen)
  drawSpoke(context, tx3, ty3, -Math.PI/3, sideLen)
  
  // Draw the spokes
  for (pos = 0; pos < NUM_SPOKES; pos++) {
    third = NUM_SPOKES / 3
    let x1, y1
    
    if (pos < third) {
      //First third goes along top right of triangle
      let xdist = tx2 - tx1
      let ydist = ty2 - ty1
    
      x1 = getTrianglePos(pos, third, tx1, xdist)
      y1 = getTrianglePos(pos, third, ty1, ydist)
      angle = -Math.PI / 6
    } else if (pos < 2 * third) {
      //Second third goes along bottom of triangle
      let xdist = tx2 - tx3
      let ydist = ty2 - ty3
      
      x1 = getTrianglePos(pos, third, tx3, xdist)
      y1 = getTrianglePos(pos, third, ty3, ydist)
      angle = Math.PI / 2
    } else {
      //Final third goes along top left of triangle
      let xdist = tx1 - tx3
      let ydist = ty1 - ty3
      
      x1 = getTrianglePos(pos, third, tx3, xdist)
      y1 = getTrianglePos(pos, third, ty3, ydist)
      angle = -5 * Math.PI / 6
    }
    drawSpoke(context, x1, y1, angle, maxSpokeLen, frequencies[pos])
  }
}



function drawSpoke(context, x1, y1, angle, maxSpokeLen, freq=255){
  //var lineColor = #000000
  //ctx.strokeStyle = lineColor;
  let spokeLen = maxSpokeLen * (freq / 255)
  
  let x2 = x1 + spokeLen * Math.cos(angle)
  let y2 = y1 + spokeLen * Math.sin(angle)
  
  context.lineWidth = SPOKE_WIDTH;
  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke()
}



function getTrianglePos(index, third, startVertex, edgeLen) {
    return startVertex + edgeLen * (index % third) / third
}