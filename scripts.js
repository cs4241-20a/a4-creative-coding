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

// const submit = function (e) {
//   //prevent default form action from being carried out
//   e.preventDefault();

//   if (document.getElementById('yourname').value === "") {
//     alert("Please don't leave the name blank");
//     return false;
//   }

//   const userScore = {
//     name: document.getElementById('yourname').value,
//     clicks: clickcount,
//     seconds: seconds
//   }

//   const body = JSON.stringify(userScore);

//   fetch('/submit', {
//     method: 'POST',
//     body
//   })
//     .then(function (response) {
//       //response
//       response.json().then(function (data) {
//         //data
//         console.log("Submit Response:", response);
//         console.log("Returned data: ", data);
//         restartGame();

//         buildTable(data);
//       })
//     })

//   return false;
// }



window.onload = function () {
  //  const button = document.getElementById('submitbtn');
  document.getElementById('pianoSoundCheckBox').checked = true;
  console.log("Loaded!");
}