// client-side js, loaded by index.html
// run by the browser each time the page is loaded
import * as dat from './dat.gui.js';

const gui = new dat.GUI();

// audio + visual context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let audctx = null;
const playButton = document.getElementById("play")
let audioElement = null;
let coll = document.getElementsByClassName("collapsible");

// object to hold customizable parameters
let params = {
  ballRadius : 3.0,
  gravity: 2.0,
  ballSpaceMultiplier : 5.0,
  lowR : 46, medR : 59, highR : 59, 
  lowG : 30, medG : 193, highG : 248,
  lowB : 217, medB : 255, highB : 255,
}

// see dat.gui for making a HUD
// use module.js

window.onload = function(){
  canvas.width = 1600;
  canvas.height = 512
  createGUI();

  ctx.fillStyle = 'rgba(10,10,10,1)'
  ctx.fillRect( 0,0,canvas.width,canvas.height )
}


playButton.onclick = function(){
  if(!audioElement){
    console.log("initializing audio...")
    initAudio()
  }
  console.log(audioElement.paused)
  if(audioElement.paused)
    audioElement.play()
  else
    audioElement.pause()
};

function initAudio() {
  audctx = new AudioContext();
  audioElement = document.createElement("audio");
  document.body.appendChild(audioElement);
  
  const analyser = audctx.createAnalyser();
  analyser.fftSize = 512 // 1024 bins
  
  const player = audctx.createMediaElementSource(audioElement)
  player.connect(audctx.destination);
  player.connect(analyser)
  
  audioElement.crossOrigin = "anonymous" // get this file through CORS
  // link to file from assets
  // toby fox - waterfall (undertale ost)
  audioElement.src = 'https://cdn.glitch.com/e986a1d5-113b-4a8f-8f90-c221dcd2a059%2FUndertale%20OST%20031%20-%20Waterfall.mp3?v=1602267439147'
  // mick gordon - bfg division (doom ost)
  //audioElement.src = 'https://cdn.glitch.com/e986a1d5-113b-4a8f-8f90-c221dcd2a059%2FMick%20Gordon%20-%2011.%20BFG%20Division%20(128%20kbps).mp3?v=1602431236626'
  audioElement.volume= "0.3"
  const results = new Uint8Array(analyser.frequencyBinCount)
  
  // animation code
  let draw = function(){
    // temporal recursion, call tthe function in the future
      window.requestAnimationFrame( draw )
      
      ctx.fillStyle = 'rgba(10,10,10,1)'
      ctx.fillRect( 0,0,canvas.width,canvas.height )
      
      analyser.getByteFrequencyData( results )
      
      for( let i = 0; i < analyser.frequencyBinCount; i++ ) {
        let space = 0; // space between balls
        if(i === 0){space = 4;}
        else{space = params.ballSpaceMultiplier * i;}
        
        // determine color based on amplitude of this bin
        if(results[i] <= 50){
          ctx.fillStyle = `rgba(${params.lowR},${params.lowG},${params.lowB})`
        }
        else if(results[i] <= 100){
          ctx.fillStyle = `rgba(${params.medR},${params.medG},${params.medB})`
        }
        else{
          ctx.fillStyle = `rgba(${params.highR},${params.highG},${params.highB})`
        }

          
        //draw ball based on frequency bin
        ctx.beginPath(); ctx.arc ( i+space, canvas.height-50-results[i] * params.gravity, params.ballRadius, 0, 2 * Math.PI, false); ctx.fill();
        //ctx.fillRect( i, canvas.height, 1, -results[i] ) // upside down
      }
   }
  draw();
  
}



function createGUI() {
  gui.add(params, "ballRadius", 1, 10)
  gui.add(params, "gravity", 1, 10)
  gui.add(params, "ballSpaceMultiplier", 1, 10)
  
  // colors
  // level 1
  gui.add(params, "lowR", 1, 255)
  gui.add(params, "lowG", 1, 255)
  gui.add(params, "lowB", 1, 255)
  
  // level 2
  gui.add(params, "medR", 1, 255)
  gui.add(params, "medG", 1, 255)
  gui.add(params, "medB", 1, 255)
  
  // level 3
  gui.add(params, "highR", 1, 255)
  gui.add(params, "highG", 1, 255)
  gui.add(params, "highB", 1, 255)
}

let i;
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}