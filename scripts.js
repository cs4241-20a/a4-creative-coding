//key press buttons for UI keyboard
const WHITE_KEYS = ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i']
const BLACK_KEYS = ['s', 'd', 'g', 'h', 'j', '2', '3', '5', '6', '7']
let waveform;

const keys = document.querySelectorAll('.key');
const whiteKeys = document.querySelectorAll('.key.white');
const blackKeys = document.querySelectorAll('.key.black');

const freqLevelRange = document.getElementById('freqLevelRange');
const freqLevelNumber = document.getElementById('freqLevelNumber');

freqLevelRange.addEventListener('input', syncFreqAmount)
freqLevelNumber.addEventListener('input', syncFreqAmount)

function syncFreqAmount(e) {
    const val = e.target.value
    freqLevelRange.value = val;
    freqLevelNumber.value = val;
}

const volLevelRange = document.getElementById('volLevelRange');
const volLevelNumber = document.getElementById('volLevelNumber');

volLevelRange.addEventListener('input', syncVolAmount)
volLevelNumber.addEventListener('input', syncVolAmount)

//syncs volume range with volume number
function syncVolAmount(e) {
    const val = e.target.value
    volLevelRange.value = val;
    volLevelNumber.value = val;
}


//event listeners to add active effect to keyboard
document.addEventListener('keydown', e => {
    if (e.repeat) return
    const key = e.key;
    const blackKeyIndex = BLACK_KEYS.indexOf(key)
    const whiteKeyIndex = WHITE_KEYS.indexOf(key)

    if (whiteKeyIndex > -1)
        whiteKeys[whiteKeyIndex].classList.add('active');
    if (blackKeyIndex > -1)
        blackKeys[blackKeyIndex].classList.add('active');
});

//event listeners to remove active effect from keyboard
document.addEventListener('keyup', e => {
    if (e.repeat) return
    const key = e.key;
    const blackKeyIndex = BLACK_KEYS.indexOf(key)
    const whiteKeyIndex = WHITE_KEYS.indexOf(key)

    if (whiteKeyIndex > -1)
        whiteKeys[whiteKeyIndex].classList.remove('active')
    if (blackKeyIndex > -1)
        blackKeys[blackKeyIndex].classList.remove('active');
});



//Initialize audio on window load to avoid null pointers
function initializeAudio() {

    //Web Audio API utilization
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    //Process volume and filter
    const volume = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    const activeOscillators = {};

    //default waveform
    waveform = 'sine'


    //Keycode to musical frequency hashmap
    const keyboardFrequencyMap = {
        '90': 130.81,  //Z - note: C3
        '83': 138.59, //S - C3#
        '88': 146.83,  //X - D3
        '68': 155.56, //D - D3#
        '67': 164.81,  //C - E3
        '86': 174.61,  //V - F3
        '71': 185.00, //G - F3#
        '66': 196.00,  //B - G3
        '72': 207.65, //H - G3#
        '78': 220.00,  //N - A3
        '74': 233.08, //J - A3#
        '77': 246.94,  //M - B3
        '81': 261.63,  //Q - C4
        '50': 277.18, //2 - C4#
        '87': 293.66,  //W - D4
        '51': 311.13, //3 - D4#
        '69': 329.63,  //E - E4
        '82': 349.23,  //R - F4
        '53': 369.99, //5 - F4#
        '84': 392.00,  //T - G4
        '54': 415.30, //6 - G4#
        '89': 440.00,  //Y - A4
        '55': 466.16, //7 - A4#
        '85': 493.88,  //U - B4
        '73': 523.25, //I - C5
    }

    volume.connect(filter);
    filter.connect(audioCtx.destination);

    //Listens for changes to the volume
    const volumeControl = document.getElementById('volLevelRange')
    volumeControl.addEventListener('change', function (event) {
        volume.gain.setValueAtTime(event.target.value, audioCtx.currentTime)
    });

    //Listens for changes to the waveform
    const waveformControl = document.getElementById('waveform')
    waveformControl.addEventListener('change', function (event) {
        waveform = event.target.value
    });


    //Listens for change in pass type
    const passTypeControl = document.getElementById('passType')
    passTypeControl.addEventListener('change', function (event) {
        filter.type = event.target.value
    });

    //Listens for change in frequency
    const frequencyLevelControl = document.getElementById('freqLevelRange')
    frequencyLevelControl.addEventListener('change', function (event) {
        filter.frequency.setValueAtTime(event.target.value, audioCtx.currentTime)
    });

    //Listen for keypresses to play notes
    window.addEventListener('keydown', keyDown, false);
    window.addEventListener('keyup', keyUp, false);

    //When key is pressed, if it's the right key and key is not pressed, play note
    function keyDown(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
            playNote(key);
        }
    }

    //When key is released, delete key's oscillator
    function keyUp(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && activeOscillators[key]) {
            activeOscillators[key].stop();
            delete activeOscillators[key];
        }
    }

    //Creates an oscillation for a specific key
    function playNote(key) {
        const osc = audioCtx.createOscillator();
        osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime)
        osc.type = waveform
        activeOscillators[key] = osc
        activeOscillators[key].connect(volume)
        activeOscillators[key].start();
    }
};

//gets default settings from server
const reset = function (e) {
    //prevent default form action from being carried out
    // e.preventDefault();
  
    fetch('/reset', {
      method: 'GET'
    })
      .then(function (res) {
        //response
        res.json().then(function (data) {
          //data
          console.log("Submit Response:", res);
          console.log("Returned data: ", data);
  
          setSettings(data);
        })
      })
  
    return false;
  }
  
  //gets last saved settings from server
  const load = function (e) {
    //prevent default form action from being carried out
    e.preventDefault();
  
    fetch('/load', {
      method: 'GET'
    })
      .then(function (res) {
        //response
        res.json().then(function (data) {
          //data
          console.log("Submit Response:", res);
          console.log("Returned data: ", data);
  
          setSettings(data);
        })
      })
  
    return false;
  }
  
  // const freqLevelRange = document.getElementById('freqLevelRange');
  // const freqLevelNumber = document.getElementById('freqLevelNumber');
  //posts current settings to server
  const save = function (e) {
    //prevent default form action from being carried out
    e.preventDefault();
  
    if (document.getElementById('volLevelNumber').value > 100) {
      alert("Volume cannot be that high");
      document.getElementById('volLevelNumber').value = 100;
      document.getElementById('volLevelRange').value = 100;
    }
  
    const userSettings = {
      volume: document.getElementById('volLevelNumber').value,
      waveform: document.getElementById('waveform').value,
      passtype: document.getElementById('passType').value,
      frequency: document.getElementById('freqLevelNumber').value
    }
    console.log("User settings: " + userSettings)
    
    fetch('/save', {
      method: 'POST',
      body: JSON.stringify(userSettings),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(function (res) {
        //response
        res.json().then(function (data) {
          //data
          console.log("Submit Response:", res);
          console.log("Returned data: ", data);
          alert('Settings saved!');
        })
      })
  
    return false;
  }

//run functions on window load
window.onload = function () {
    initializeAudio();
    //initialize buttons
    const savebtn = document.getElementById('savebtn');
    savebtn.onclick = save;
    const loadbtn = document.getElementById('loadbtn');
    loadbtn.onclick = load;
    const resetbtn = document.getElementById('resetbtn');
    resetbtn.onclick = reset;
    console.log("Loaded!");
}