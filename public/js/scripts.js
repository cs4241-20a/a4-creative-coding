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
const keys = {
    0: "G5",
    1: "F#5",
    2: "E5",
    3: "D5",
    4: "C5",
    5: "B4",
    6: "A4",
    7: "G4"
}
const context = new AudioContext();
var gain = .25;
var decayRate = .5; //speed in seconds
var multiButton;
var trackerPanel;
var play;
var playing;
var oscType = 'sine';
var count = 0;
var prevCount = 16;

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
    oscillator.type = oscType;
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

function stopPlaying() {
    playing = false;
    clearInterval(play);
}

function startPlaying() {
    trackerPanel.setValue(0, count, 1);
                trackerPanel.setValue(0, prevCount, 0);
                playChord(count);
                prevCount = count;
                count++;
                if(count >= 16) {
                    count = 0;
                }
}

// THINGS THAT RUN ON START
!function() {
    var a = new Interface.Panel({  background:"#000", container:document.querySelector("#notePanel") });            
    multiButton = new Interface.MultiButton({ 
    rows:8,
    columns:16,
    bounds:[.05,.05,.9,.75],
    onvaluechange : function(row, col, value) {
        if(value == 1) {
            multiButtonLabel.setValue( "Note : " + keys[row]);
        } else {
            multiButtonLabel.setValue( "Note : ");
        }
        makeChord(row, col, value);
    },
    background: 'white',
    stroke: 'black',
    fill: 'yellow'
    });

    trackerPanel = new Interface.MultiButton({
        rows:1,
        columns:16,
        bounds:[.05,.90,.9,.05],
        onvaluechange : function(row, col, value) {
            trackerPanel.setValue(row, col, 0);
        },
        background: 'white',
        stroke: 'black',
        fill: 'red'
    });

    var multiButtonLabel = new Interface.Label({ 
    bounds:[.05,.82,.875,.05],
    hAlign:"left",
    value: "Note :",
    });

    a.background = 'white';

    for(var i = 0; i < multiButton._values.length; i++) {
    multiButton._values[i] = Math.random() > .5 ;
    }

    a.add(multiButton, trackerPanel, multiButtonLabel);
    //a.add(multiButton, multiButtonLabel);
}()

window.onload = function() {
    console.log("page loaded!");
    const startButton = document.getElementById("startButton");
    startButton.onclick = function() {
        if(!playing) {
            playing = true;
            play = setInterval(startPlaying, decayRate*1000)
        }
    }
    
    const stopButton = document.getElementById("stopButton");
    stopButton.onclick = function() {
        stopPlaying(playing, play);
    }

    const clearButton = document.getElementById("clearButton");
    clearButton.onclick = function() {
        for(var col = 0; col < 16; col++) {
            for(var row = 0; row < 8; row++) {
                multiButton.setValue(row, col, 0);
            }
            toPlayArray[col] = [];
            trackerPanel.setValue(0, col, 0);
        }
        count = 0;
        prevCount = 16;
        stopPlaying(playing, play);
    }

    const speedInput = document.getElementById("speedInput");
    speedInput.onchange = function() {
        decayRate = 1/speedInput.value;
        if(playing) {
            stopPlaying(playing, play);
            playing = true;
            play = setInterval(startPlaying, decayRate*1000);
        }
    }
    speedInput.onsubmit = function() {
        console.log('test');
    }

    const gainInput = document.getElementById("gainInput");
    gainInput.onchange = function() {
        gain = gainInput.value;
    }

    const waveInput = document.getElementById("waveTypes");
    waveInput.onchange = function() {
        oscType = waveInput.value;
    }
}