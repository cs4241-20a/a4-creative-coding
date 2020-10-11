// client-side js, loaded by index.html
// run by the browser each time the page is loaded

// define variables that reference elements on our page
const canvas = document.getElementById("canvas");
const cp = document.getElementById("colorpicker");
const clear = document.getElementById("clear");
const middle = document.getElementById("middle");
const help = document.getElementById("help");

const defaultX = canvas.width / 2;
const defaultY = canvas.height / 2;
let xCoor = canvas.width / 2;
let yCoor = canvas.height / 2;

let up = false;
let down = false;
let left = false;
let right = false;
let space = true;

let ctx = canvas.getContext("2d");
ctx.beginPath();
ctx.moveTo(defaultX, defaultY);

document.onkeydown = function(event) {
  var key = event.keyCode;
  event.preventDefault();

  if (key === 38) up = true;
  if (key === 40) down = true;
  if (key === 37) left = true;
  if (key === 39) right = true;
};

document.onkeyup = function(event) {
  var key = event.keyCode;
  event.preventDefault();

  if (key === 38) up = false;
  if (key === 40) down = false;
  if (key === 37) left = false;
  if (key === 39) right = false;
  if (key === 32) showHideHelp();
};

function move() {
  if (up) {
    yCoor--;
  }
  if (down) {
    yCoor++;
  }
  if (left) {
    xCoor--;
  }
  if (right) {
    xCoor++;
  }

  if (yCoor < 0) {
    yCoor = 0;
  }
  if (yCoor > canvas.height) {
    yCoor = canvas.height;
  }
  if (xCoor < 0) {
    xCoor = 0;
  }
  if (xCoor > canvas.width) {
    xCoor = canvas.width;
  }

  ctx.lineTo(xCoor, yCoor);
  ctx.stroke();
}
setInterval(move, 10);

function changeColor() {
  ctx.strokeStyle = cp.value;
  ctx.beginPath();
}

clear.onclick = function() {
  middle.classList.add("apply-shake");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var w = canvas.width;
  canvas.width = 1;
  canvas.width = w;
};

middle.addEventListener("animationend", (e) => {
    middle.classList.remove("apply-shake");
});

function showHideHelp() {
  if (space) {
    middle.removeChild(help);
    space = false;
  } else if (!space) {
    middle.appendChild(help);
    space = true;
  }
}
