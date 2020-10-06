//Normal Game Setup -----------------------------------------------------
var windowWidth, windowHeight, width, height;
var createDiv, createCanvas;
let score, cnv;
var frameRate, stroke, strokeWeight;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function centerScore() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 6;
  score.position(x - 50, y * 5 + 60);
}

function setup() {
  score = createDiv("Score = 0");
  centerScore();
  score.id = "score";
  score.style("color", "black");
  score.style("font-size", "50px");
  score.style("letter-spacing", "2px");
  score.style("font-family", "Bangers");

  cnv = createCanvas(500, 500);
  centerCanvas();

  //Serpent speed:
  frameRate(18);

  //Serpent design:
  stroke("rgb(255,140,0)");
  strokeWeight(16);

  updateFruit();

  for (let i = 0; i < serpentLength; i++) {
    xCor.push(xStart + i * diff);
    yCor.push(yStart);
  }
}

function windowResized() {
  centerCanvas();
  centerScore();
}
//-----------------------------------------------------------------------

//Draw the Serpent:------------------------------------------------------
let serpentLength = 10;
let direction = "right";

//Starting Serpent Location and Length
const xStart = 0;
const yStart = 250;
const diff = 10;

let xCor = [];
let yCor = [];

let xFruit = 0;
let yFruit = 0;

var background;
var line;

//Draw Function to show game:---------------------------------------------
function draw() {
  background(0);
  for (let i = 0; i < serpentLength - 1; i++) {
    line(xCor[i], yCor[i], xCor[i + 1], yCor[i + 1]);
  }
  updateSerpent();
  checkStatus();
  checkFruit();
}

function updateSerpent() {
  for (let i = 0; i < serpentLength - 1; i++) {
    xCor[i] = xCor[i + 1];
    yCor[i] = yCor[i + 1];
  }
  switch (direction) {
    case "left":
      xCor[serpentLength - 1] = xCor[serpentLength - 2] - diff;
      yCor[serpentLength - 1] = yCor[serpentLength - 2];
      break;
    case "down":
      xCor[serpentLength - 1] = xCor[serpentLength - 2];
      yCor[serpentLength - 1] = yCor[serpentLength - 2] + diff;
      break;
    case "right":
      xCor[serpentLength - 1] = xCor[serpentLength - 2] + diff;
      yCor[serpentLength - 1] = yCor[serpentLength - 2];
      break;
    case "up":
      xCor[serpentLength - 1] = xCor[serpentLength - 2];
      yCor[serpentLength - 1] = yCor[serpentLength - 2] - diff;
      break;
  }
}

var noLoop;

function checkStatus() {
  if (
    xCor[xCor.length - 1] > width ||
    xCor[xCor.length - 1] < 0 ||
    yCor[yCor.length - 1] > height ||
    yCor[yCor.length - 1] < 0 ||
    checkCollision()
  ) {
    noLoop();
    const scoreVal = parseInt(score.html().substring(8));
    alert("Game Over!\nFinal Score: " + scoreVal);
  }
}

function checkCollision() {
  const HeadX = xCor[xCor.length - 1];
  const HeadY = yCor[yCor.length - 1];
  for (let i = 0; i < xCor.length - 1; i++) {
    if (xCor[i] === HeadX && yCor[i] === HeadY) {
      return true;
    }
  }
}

var point;

function checkFruit() {
  point(xFruit, yFruit);
  if (xCor[xCor.length - 1] === xFruit && yCor[yCor.length - 1] === yFruit) {
    const prevScore = parseInt(score.html().substring(8));
    score.html("Score = " + (prevScore + 1));
    xCor.unshift(xCor[0]);
    yCor.unshift(yCor[0]);
    serpentLength++;
    updateFruit();
  }
}

var floor;
var random;

function updateFruit() {
  xFruit = floor(random(10, (width - 100) / 10)) * 10;
  yFruit = floor(random(10, (height - 100) / 10)) * 10;
}

var keyCode;

//Controlling movement with arrow keys:
function keyPressed() {
  switch (keyCode) {
    case 37:
      if (direction !== "right") {
        direction = "left";
      }
      break;
    case 38:
      if (direction !== "down") {
        direction = "up";
      }
      break;
    case 39:
      if (direction !== "left") {
        direction = "right";
      }
      break;
    case 40:
      if (direction !== "up") {
        direction = "down";
      }
      break;
  }
}
