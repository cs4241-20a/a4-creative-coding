// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");
confirm("Welcome to the Gamelan (Slendro) Synthesizer! Select a waveform and then play some notes!");

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscList = [];
let masterGainNode = null;

let detuneNum = 0;

let keyboard = document.querySelector(".keyboard");
let wavePicker = document.querySelector("select[name='waveform']");
let volumeControl = document.querySelector("input[name='volume']");
let noteFreq = null;
let sineTerms = null;
let cosineTerms = null;

function createNoteTable() {
  let noteFreq = [];
  for (let i = 0; i < 6; i++) {
    noteFreq[i] = [];
  }

  noteFreq[0]["1"] = 27.5;
  noteFreq[0]["2"] = 31.589;
  noteFreq[0]["3"] = 36.286;
  noteFreq[0]["4"] = 41.682;
  noteFreq[0]["5"] = 47.88;

  noteFreq[1]["1"] = 55.0;
  noteFreq[1]["2"] = 63.178;
  noteFreq[1]["3"] = 72.573;
  noteFreq[1]["4"] = 83.364;
  noteFreq[1]["5"] = 95.761;

  noteFreq[2]["1"] = 110.0;
  noteFreq[2]["2"] = 126.357;
  noteFreq[2]["3"] = 145.146;
  noteFreq[2]["4"] = 166.729;
  noteFreq[2]["5"] = 191.521;

  noteFreq[3]["1"] = 220.0;
  noteFreq[3]["2"] = 252.714;
  noteFreq[3]["3"] = 290.292;
  noteFreq[3]["4"] = 333.458;
  noteFreq[3]["5"] = 383.042;

  noteFreq[4]["1"] = 440.0;
  noteFreq[4]["2"] = 505.427;
  noteFreq[4]["3"] = 580.583;
  noteFreq[4]["4"] = 666.915;
  noteFreq[4]["5"] = 766.084;

  noteFreq[5]["1"] = 880.0;
  noteFreq[5]["2"] = 1010.855;
  noteFreq[5]["3"] = 1161.167;
  noteFreq[5]["4"] = 1333.831;
  noteFreq[5]["5"] = 1532.169;

  return noteFreq;
}

noteFreq = createNoteTable();

function createKey(note, octave, freq) {
  let keyElement = document.createElement("div");
  let labelElement = document.createElement("div");

  keyElement.className = "key";
  keyElement.dataset["octave"] = octave;
  keyElement.dataset["note"] = note;
  keyElement.dataset["frequency"] = freq;

  labelElement.innerHTML = note + "<sub>" + octave + "</sub>";
  keyElement.appendChild(labelElement);

  keyElement.addEventListener("mousedown", notePressed, false);
  keyElement.addEventListener("mouseup", noteReleased, false);
  keyElement.addEventListener("mouseover", notePressed, false);
  keyElement.addEventListener("mouseleave", noteReleased, false);

  return keyElement;
}

function playTone(freq) {
  let osc = audioContext.createOscillator();
  osc.connect(masterGainNode);

  let type = wavePicker.options[wavePicker.selectedIndex].value;

  osc.type = type;
  
  osc.frequency.value = freq;
  osc.detune.setValueAtTime(detuneNum, audioCtx.currentTime);
  osc.start();
  
  

  return osc;
  
}

function notePressed(event) {
  if (event.buttons & 1) {
    let dataset = event.target.dataset;

    if (!dataset["pressed"]) {
      oscList[dataset["octave"][dataset["note"]]] = playTone(
        dataset["frequency"]
      );
      dataset["pressed"] = "yes";
    }
  }
}

function noteReleased(event) {
  let dataset = event.target.dataset;

  if (dataset && dataset["pressed"]) {
    oscList[dataset["octave"][dataset["note"]]].stop();
    oscList[dataset["octave"][dataset["note"]]] = null;
    delete dataset["pressed"];
  }
}

function changeVolume(event) {
  masterGainNode.gain.value = volumeControl.value;
}

function setup() {
  noteFreq = createNoteTable();

  volumeControl.addEventListener("change", changeVolume, false);

  masterGainNode = audioContext.createGain();
  masterGainNode.connect(audioContext.destination);
  masterGainNode.gain.value = volumeControl.value;

  // Create the keys; skip any that are sharp or flat; for
  // our purposes we don't need them. Each octave is inserted
  // into a <div> of class "octave".

  noteFreq.forEach(function(keys, idx) {
    let keyList = Object.entries(keys);
    let octaveElem = document.createElement("div");
    octaveElem.className = "octave";

    keyList.forEach(function(key) {
      if (key[0].length == 1) {
        octaveElem.appendChild(createKey(key[0], idx, key[1]));
      }
    });

    keyboard.appendChild(octaveElem);
  });

  document
    .querySelector("div[data-note='B'][data-octave='5']")
    .scrollIntoView(false);

  sineTerms = new Float32Array([0, 0, 1, 0, 1]);
  cosineTerms = new Float32Array(sineTerms.length);

  for (let i = 0; i < 9; i++) {
    oscList[i] = [];
  }
}
let audioCtx = new window.AudioContext();


function loadAudio(object, url) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      object.buffer = buffer;
    });
  };
  request.send();
}

function detune(){
  let num = document.getElementById('hzValue').value; 
  console.log(num);
  detuneNum = num;
}

function reverbObject(url) {
  this.source = url;
  loadAudio(this, url);
}

setup();
