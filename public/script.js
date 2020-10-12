function loadInstruct() {
  var coll = document.getElementsByClassName("collapsible");
  console.log(coll[0])

  for(let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      console.log("clicked")
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}

var colors = [
  ["#952D98", "#FF7900", "#ED2939", "#FECB00", "#69BE28", "#0065BD", "#009FDA"],
  ["#FF0018", "#FFA52C", "#FFFF41", "#008018", "#0000F9", "#86007D", "#ee82ee"],
  ["#D8BFD8", "#DDA0DD", "#EE82EE", "#FF00FF", "#8A2BE2", "#4B0082", "#800080"],
  ["#A0A0A0", "#D0D0D0", "#B0B0B0", "#909090", "#696969", "#484848", "#202020"]
];
var keys = [["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"],
             ["w","a","d","s"]]
//Tetris themes were taken from the original Tetris soundtrack
var songs = ["https://cdn.glitch.com/e7b8999b-7138-470c-8319-d98ed52a8af5%2FTheme1.mp3?v=1602463005030", "https://cdn.glitch.com/e7b8999b-7138-470c-8319-d98ed52a8af5%2FTheme2.mp3?v=1602462758615", "https://cdn.glitch.com/e7b8999b-7138-470c-8319-d98ed52a8af5%2FTheme3.mp3?v=1602462757540", ""]

function runGame() {
  if(document.getElementById("enableDark").checked) {
    document.body.style.backgroundColor = "black";
    document.getElementsByTagName("H1")[0].style.color = "white";
    document.getElementById("delayLabel").style.color = "white";
    var all = document.getElementsByTagName("*");
    for (var i=0, max=all.length; i < max; i++) {
      if(!all[i].tagName == "canvas") {
        all[i].classList.add("is-dark");
      }
    }
    document.getElementById("canvas").style.border = "solid white";
    lineColor = "white";
  } else {
    document.body.style.backgroundColor = "white";
    document.getElementsByTagName("H1")[0].style.color = "black";
    document.getElementById("delayLabel").style.color = "black";
    var all = document.getElementsByTagName("*");
    for (var i=0, max=all.length; i < max; i++) {
        all[i].classList.remove("is-dark");
    }
    document.getElementById("canvas").style.border = "solid black";
    lineColor = "black";
  }
  c = document.getElementById("canvas");
  h = c.height;
  w = c.width;
  ctx = c.getContext("2d");
  ctx.lineWidth = 0.5;
  //vary colors row by color radio selection to get different color palettes
  let palette = document.querySelector('input[name="color"]:checked').value;
  keyChoice = document.querySelector('input[name="key"]:checked').value;
  const T = {
    piece: [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
    color: colors[palette][0],
    pos: [3, -1]
  };
  const J = {
    piece: [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
    color: colors[palette][1],
    pos: [3, -1]
  };
  const Z = {
    piece: [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
    color: colors[palette][2],
    pos: [3, -1]
  };
  const O = { piece: [[1, 1], [1, 1]], color: colors[palette][3], pos: [3, 0] };
  const S = {
    piece: [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
    color: colors[palette][4],
    pos: [3, -1]
  };
  const L = {
    piece: [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
    color: colors[palette][5],
    pos: [3, -1]
  };
  const I = {
    piece: [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
    color: colors[palette][6],
    pos: [3, -1]
  };
  pieces = [T, J, Z, O, S, L, I];
  music.pause();
  music = new Audio(songs[document.querySelector('input[name="song"]:checked').value]);
  music.play();
  maxTimer = document.getElementById("delay").value;
  increase = document.getElementById("enableIncrease").checked;
  reset();
  draw();
}

var board;
var piecePos;
var currentPiece;
var timer;
var maxTimer;
var prevBoard;
var score;
var c;
var h;
var w;
var ctx;
var pieces;
var keyChoice;
var music = new Audio("");
var increase;
var lineColor;
var justFlipped = false;

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shufflePieces(pieces) {
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
}

// modified form of https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
function rot(array) {
  var newArray = [];
  for (var row = 0; row < array[0].length; row++) {
    newArray.push([]);
  }

  for (var row = 0; row < array[0].length; row++) {
    for (var col = array.length - 1; col >= 0; col--) {
      newArray[row].push(array[col][row]);
    }
  }

  return newArray;
}

function arrCopy(baseArr, copyArr, startC, startR) {
  let newArr = JSON.parse(JSON.stringify(baseArr));
  for (let r = 0; r < copyArr.length; r++) {
    for (let c = 0; c < copyArr[0].length; c++) {
      if (startR + r > newArr.length - 1) {
        console.log("Piece hit bottom");
        if (copyArr[c][r]) {
          return null;
        } else {
          continue;
        }
      } else if (startC + c < 0 && copyArr[c][r]) {
        console.log("Left Collision");
        currentPiece.pos[0]++;
        return "Continue";
      } else if (startC + c > newArr[0].length - 1 && copyArr[c][r]) {
        console.log("Right Collision");
        currentPiece.pos[0]--;
        return "Continue";
      } else if (newArr[startR + r][startC + c] && copyArr[c][r]) {
        console.log("Collision with piece");
        return null;
      } else if (!newArr[startR + r][startC + c] && copyArr[c][r]) {
        //case where there is an empty space that would be filled
        newArr[startR + r][startC + c] = currentPiece;
      }
    }
  }
  return newArr;
}

function update(arr, ctx) {
  ctx.clearRect(0, 0, w, h);
  for (var i = 0; i < arr.length; i++) {
    var row = arr[i];
    for (var j = 0; j < row.length; j++) {
      if (row[j] != 0) {
        ctx.fillStyle = row[j].color;
        ctx.fillRect((j * w) / 10, (i * h) / 20, 20, 20);
      }
    }
  }
  ctx.strokeStyle = lineColor;
  for (let i = w / 10; i < w; i += w / 10) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, h);
    ctx.stroke();
  }

  for (let i = h / 20; i < h; i += h / 20) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(w, i);
    ctx.stroke();
  }
  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("badge").style.cssText =
    "width:" + (150 + 15 * score.toString().length) + "px !important";
}

function checkGameOver() {
  for (var i = 0; i < board[0].length; i++) {
    if (board[0][i] != 0) {
      return true;
    }
  }
  return false;
}

function handleFullRow() {
  let count = 0;
  for (var i = 0; i < board.length; i++) {
    if (!board[i].includes(0)) {
      board.splice(i, 1);
      board.unshift(Array(10).fill(0));
      count++;
      if(increase && maxTimer > 0) {
        maxTimer -= 5;
      } 
    }
  }
  switch (count) {
    case 1:
      score += 100;
      break;
    case 2:
      score += 300;
      break;
    case 3:
      score += 500;
      break;
    case 4:
      score += 800;
      break;
  }
}

function reset() {
  board = Array(20)
    .fill()
    .map(() => Array(10).fill(0));
  shufflePieces(pieces);
  piecePos = 0;
  currentPiece = JSON.parse(JSON.stringify(pieces[piecePos]));
  timer = 0;
  prevBoard = null;
  score = 0;
  window.scrollTo(0,0);
}

function updateBoard() {
  let tryBoard = arrCopy(
    board,
    currentPiece.piece,
    currentPiece.pos[0],
    currentPiece.pos[1]
  );
  if (tryBoard != null && tryBoard != "Continue") {
    update(tryBoard, ctx);
    prevBoard = tryBoard;
    justFlipped = false;
  } else if (tryBoard == null) {
    if (justFlipped) {
      gameOver()
    }
    board = prevBoard;
    if (piecePos > 5) {
      piecePos = 0;
      shufflePieces(pieces);
    } else {
      piecePos++;
    }
    currentPiece = JSON.parse(JSON.stringify(pieces[piecePos]));
    justFlipped = true;
  }
}

function draw() {
  if (new Date().getTime() - timer > maxTimer) {
    timer = new Date().getTime();
    currentPiece.pos[1]++;
    updateBoard();
    handleFullRow();
  }
  if (checkGameOver()) {
    gameOver()
  } else {
    window.requestAnimationFrame(draw);
  }
}

function gameOver() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", w / 2, h / 2);
  window.requestAnimationFrame(draw);
}

addEventListener("keydown", function(event) {
if (event.key == keys[keyChoice][0]) {
    event.preventDefault();
    currentPiece.piece = rot(currentPiece.piece);
    updateBoard();
  } else if (event.key == keys[keyChoice][1]) {
    event.preventDefault();
    currentPiece.pos[0]--;
    updateBoard();
  } else if (event.key == keys[keyChoice][2]) {
    event.preventDefault();
    currentPiece.pos[0]++;
    updateBoard();
  } else if (event.key == keys[keyChoice][3]) {
    event.preventDefault();
    currentPiece.pos[1]++;
    updateBoard();
  }
});