// FUNCTIONS AND STUFF
const toPlayArray = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
const notes = {
    0: 784, //G5
    1: 740, //F#5
    2: 659, //E5
    3: 587, //D5
    4: 523, //C5
    5: 494, //B4
    6: 440, //A4
    7: 392 //G4
};
const context = new AudioContext();
var gain = .25;
var decayRate = .5; //speed in seconds

function makeChord(row, col, val) { 
    /*Adds/removes (depending on val) the corresponding note (gained from row) to the corresponding chord (gained from col)
    to the 'chord' array */
    var toPlay = toPlayArray[col];
    var freq = notes[row];
    //if we're adding a note to a chord
    if (val == 1) {
        if(!toPlay.includes(freq)) {
            toPlay.push(freq);
        }
    } else {
        if(toPlay.includes(freq)) {
            var index = toPlay.indexOf(freq);
            toPlay.splice(index, 1);
        }
    }
    //console.log(toPlay);
}

function playNote(frequency) {
    const oscillator = context.createOscillator();
    const envelop = context.createGain()
    //decayrate in seconds

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine'
    envelop.gain.value = gain;

    oscillator.connect(envelop);
    envelop.connect(context.destination);

    oscillator.start(context.currentTime);
    envelop.gain.exponentialRampToValueAtTime(0.001, context.currentTime + decayRate);
    setTimeout(() => oscillator.stop(context.currentTime), decayRate * 1000);
}

function playChord(col) {
    const toPlay = toPlayArray[col];
    toPlay.forEach(element => {
        playNote(element);
    })
}

// THINGS THAT RUN ON START
!function() {
    var a = new Interface.Panel({  background:"#000", container:document.querySelector("#notePanel") });            
    var multiButton = new Interface.MultiButton({ 
    rows:8,
    columns:16,
    bounds:[.05,.05,.9,.8],
    onvaluechange : function(row, col, value) {
        multiButtonLabel.setValue( 'row : ' + row + ' , col : ' + col + ' , val : ' + value);
        makeChord(row, col, value);
    },
    background: 'white',
    stroke: 'black',
    fill: 'yellow'
    });

    var multiButtonLabel = new Interface.Label({ 
    bounds:[.05,.9, .9, .1],
    hAlign:"left",
    value: "Note :",
    });

    a.background = 'white';

    for(var i = 0; i < multiButton._values.length; i++) {
    multiButton._values[i] = Math.random() > .5 ;
    }

    a.add(multiButton, multiButtonLabel);
}()

window.onload = function() {
    var play;
    var playing = false;
    const startButton = document.getElementById("startButton");
    startButton.onclick = function() {
        if(!playing) {
            playing = true;
            var count = 0;
            play = setInterval(function() {
                playChord(count);
                count++;
                if(count >= 16) {
                    count = 0;
                }
                //console.log(count);
            }, decayRate*1000)
        }
    }
        
    
    const stopButton = document.getElementById("stopButton");
    stopButton.onclick = function() {
        playing = false;
        clearInterval(play);
    }
}