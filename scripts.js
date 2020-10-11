console.log("Welcome to assignment 4!")
const BLACK_KEYS = ['s', 'd', 'g', 'h', 'j']
const WHITE_KEYS = ['z', 'x', 'c', 'v', 'b', 'n', 'm']

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

function syncVolAmount(e) {
  const val = e.target.value
  volLevelRange.value = val;
  volLevelNumber.value = val;
}

document.getElementById("freqLevelRange").oninput = function () {
  this.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + this.value + '%, #fff ' + this.value + '%, white 100%)'
};

keys.forEach(key => {
  key.addEventListener('click', () => playNote(key))
})

document.addEventListener('keydown', e => {
  if (e.repeat) return
  const key = e.key;
  const blackKeyIndex = BLACK_KEYS.indexOf(key)
  const whiteKeyIndex = WHITE_KEYS.indexOf(key)

  if (whiteKeyIndex > -1) playNote(whiteKeys[whiteKeyIndex]);
  if (blackKeyIndex > -1) playNote(blackKeys[blackKeyIndex]);

})

function playNote(key) {
  const noteAudio = document.getElementById(key.dataset.note);
  noteAudio.currentTime = 0;
  noteAudio.play()
  key.classList.add('active');
  noteAudio.addEventListener('ended', () => {
    key.classList.remove('active');
  })
}

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

        buildPiano(data);
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

        buildPiano(data);
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

  let num_octaves = 0;
  if (document.getElementById('oneOctave').checked) {
    num_octaves = 1;
  } else if (document.getElementById('twoOctave').checked) {
    num_octaves = 2;
  } else if (document.getElementById('threeOctave').checked) {
    num_octaves = 3;
  } else {
    console.log("Error, octave somehow not checked");
  }
  

  const userSettings = {
    volume: document.getElementById('volLevelNumber').value,
    frequency: document.getElementById('freqLevelNumber').value,
    octaves: num_octaves,
    piano: document.getElementById('piano-checkbox').checked
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

//builds Piano page with server settings
function buildPiano(settings) {
  let piano = document.getElementById('pianotable');

  //set data values from settings
  document.getElementById('volLevelNumber').value = settings.volume;
  document.getElementById('volLevelRange').value = settings.volume;
  document.getElementById('freqLevelNumber').value = settings.frequency;
  document.getElementById('freqLevelRange').value = settings.frequency;

  //generate octaves here using the int settings.octaves
  let newPiano = `<div class="piano" id='pianotable'>\n`;

  console.log("Number of octaves: " + settings.octaves);
  //for adding octaves to virtual piano
  for (let i = 0; i < settings.octaves; i++) {
    newPiano += (`<div data-note="C${i+1}" class="key white"></div>\n`);
    newPiano += (`<div data-note="Db${i+1}" class="key black"></div>\n`);
    newPiano += (`<div data-note="D${i+1}" class="key white"></div>\n`);
    newPiano += (`<div data-note="Eb${i+1}" class="key black"></div>\n`);
    newPiano += (`<div data-note="E${i+1}" class="key white"></div>\n`);
    newPiano += (`<div data-note="F${i+1}" class="key white"></div>\n`);
    newPiano += (`<div data-note="Gb${i+1}" class="key black"></div>\n`);
    newPiano += (`<div data-note="G${i+1}" class="key white"></div>\n`);
    newPiano += (`<div data-note="Ab${i+1}" class="key black"></div>\n`);
    newPiano += (`<div data-note="A${i+1}" class="key white"></div>\n`);
    newPiano += (`<div data-note="Bb${i+1}" class="key black"></div>\n`);
    newPiano += (`<div data-note="B${i+1}" class="key white"></div>\n`);
  }
  newPiano += "\n";

  for (let i = 0; i < settings.octaves; i++) {
    newPiano += (`<audio id="C${i+1}" src="notes/C.mp3"></audio>\n`);
    newPiano += (`<audio id="Db${i+1}" src="notes/Db.mp3"></audio>\n`);
    newPiano += (`<audio id="D${i+1}" src="notes/D.mp3"></audio>\n`);
    newPiano += (`<audio id="Eb${i+1}" src="notes/Eb.mp3"></audio>\n`);
    newPiano += (`<audio id="E${i+1}" src="notes/E.mp3"></audio>\n`);
    newPiano += (`<audio id="F${i+1}" src="notes/F.mp3"></audio>\n`);
    newPiano += (`<audio id="Gb${i+1}" src="notes/Gb.mp3"></audio>\n`);
    newPiano += (`<audio id="G${i+1}" src="notes/G.mp3"></audio>\n`);
    newPiano += (`<audio id="Ab${i+1}" src="notes/Ab.mp3"></audio>\n`);
    newPiano += (`<audio id="A${i+1}" src="notes/A.mp3"></audio>\n`);
    newPiano += (`<audio id="Bb${i+1}" src="notes/Bb.mp3"></audio>\n`);
    newPiano += (`<audio id="B${i+1}" src="notes/B.mp3"></audio>\n`);
  }

  newPiano += (`</div>`);
  piano = newPiano;
  document.getElementById('piano-checkbox').checked = settings.piano;

  console.log("Table populated");
  console.log(newPiano);
}


window.onload = function () {
  const savebtn = document.getElementById('savebtn');
  savebtn.onclick = save;
  const loadbtn = document.getElementById('loadbtn');
  loadbtn.onclick = load;
  const resetbtn = document.getElementById('resetbtn');
  resetbtn.onclick = reset;
  reset();
  document.getElementById('oneOctave').checked = true;
  document.getElementById('piano-checkbox').checked = true;
  console.log("Loaded!");
}