
var audioContext = new(window.AudioContext || window.webkitAudioContext)();

var gainNode = audioContext.createGain();
//can set volume level here

window.onload = function(){
    alert("Wanna be the Piano Man?");
    alert("Play this piano like you would any electric piano!");


    
   var piano = new Nexus.Piano('#target',{
  'size': [600,400],
  'mode': 'button',  // 'button', 'toggle', or 'impulse'
  'lowNote': 410,
  'highNote': 420
})
var radiobuttonv = document.getElementById('radiobuttonvalues').checked;
piano.on('change',function(v) {


oscillator = audioContext.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);


console.log(radiobuttonv)
        if (document.getElementById('sine').checked){
          oscillator.type = "sine";
        }else if (document.getElementById('square').checked){
          oscillator.type = "square";
        }else if (document.getElementById('triangle').checked){
          oscillator.type = "triangle";
        }else if (document.getElementById('sawtooth').checked){
          oscillator.type = "sawtooth";
        } 


        if(v.note === 410){
          oscillator.frequency.value = 220;
        }else if(v.note === 411){
          oscillator.frequency.value = 247.5
        }else if(v.note === 412){
          oscillator.frequency.value = 275
        }else if(v.note === 413){
          oscillator.frequency.value = 302.5
        }else if(v.note === 414){
          oscillator.frequency.value = 330
        }else if(v.note === 415){
          oscillator.frequency.value = 357.5
        }else if(v.note === 416){
          oscillator.frequency.value = 385
        }else if(v.note === 417){
          oscillator.frequency.value = 412.5
        }else if(v.note === 418){
          oscillator.frequency.value = 440
        }else if(v.note === 419){
          oscillator.frequency.value = 467.5
        }else if(v.note === 420){
          oscillator.frequency.value = 495
        }else{
        oscillator.frequency.value = v.note;
        }

        console.log(oscillator.frequency.value);
        oscillator.connect(audioContext.destination);
        oscillator.start();
oscillator.stop(audioContext.currentTime+.08);
        console.log(v, oscillator.type);
  })
  
}
