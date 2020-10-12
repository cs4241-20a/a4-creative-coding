
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = canvas.height = 1600;

let numColors = 4;
let sizeTiles = 1;
let numTiles = 1;
let numCols = 4;
let numRows = 4;
let backgroundColor = [255, 255, 255];
let strokeColor = [0, 0, 0];
let control = {
    numColors,
    sizeTiles,
    numTiles,
    numCols,
    numRows,
    backgroundColor,
    strokeColor
};

const ctx = canvas.getContext('2d');
let x = y = 0;

async function getTiles() {
    await fetch('/getTiles')
}

function drawBlanks() {

}

function drawTiles(tiles) {
    tiles.forEach((tile) => {
        ctx.fillStyle = tile.color;
        ctx.fillRect(tile.x, tile.y, 100 * control.sizeTiles, 100 * control.sizeTiles);
        ctx.strokeStyle = 'rgb(' + control.strokeColor[0] + ', ' + control.strokeColor[1] + ', ' + control.strokeColor[2] + ')';
        ctx.strokeRect(tile.x, tile.y, 100 * control.sizeTiles, 100 * control.sizeTiles);

    })
}

// function collides(rects, x, y) {
//     var isCollision = false;
//     for (var i = 0, len = rects.length; i < len; i++) {
//         var left = rects[i].x, right = rects[i].x + 100;
//         var top = rects[i].y, bottom = rects[i].y + 100;
//         if (right >= x
//             && left <= x
//             && bottom >= y
//             && top <= y) {
//             isCollision = rects[i];
//         }
//     }
//     return isCollision;
// }

// canvas.addEventListener('click', function(e) {
//     var rect = collides(tiles, e.offsetX, e.offsetY);
//     let username = document.getElementById('user').value;
//     if (username === "") {
//         alert("Username must not be empty");
//     }
//     if (rect && round === 'reveal' && username !== "") {
//         selection = {x: rect.x / 100, y: rect.y / 100};
//         fetch('/sendSelection', {
//             method: "POST",
//             body: JSON.stringify({user: username, selection}),
//             headers: {"Content-Type": "application/json"}
//         });
//         console.log("sent selection");
//     }
// }, false);
let round;
// async function getRound() {
//     round = await fetch('/getRound').then(result => result.json());
//     console.log(round);
// }
const colors = ['red', 'blue', 'green', 'purple', 'orange', 'yellow', 'indigo', 'violet'];
let tiles = [];
// function generateTiles() {
//     for (let i = 0; i < 4; i++) {
//         for (let j = 0; j < 4; j++) {
//             tiles.push({x: i * 100 * control.sizeTiles, y: j * 100 * control.sizeTiles, color: 'white'});
//         }
//     }
// }

let color;
// setInterval();
let selection;
// const init = async function () {
//     // get which round from server
//     round = await fetch('/getRound').then(result => result.json());
//     if (round === 'memorization') {
//         fetch('/getTiles').then(res => res.json()).then(res => drawTiles(res));
//     }
//     else if (round === 'reveal') {
//         color = await fetch('/getColor').then(res => res.json());
//         generateTiles();
//         drawTiles(tiles);
//         alert("The color is " + color);
//     }
//     // if first 10 seconds of 30 secs show tiles - memorization
//     // if second 10 seconds show color - reveal
//     // if last 10 seconds show black and white tiles - selection
// }();

function generateColorTiles() {
    let tiles = []
    for (let i = 0; i < control.numCols; i++) {
        for (let j = 0; j < control.numRows; j++) {
            tiles.push({x: i * 100 * control.sizeTiles, y: j * 100 * control.sizeTiles, color: colors[Math.floor(Math.random() * control.numColors)]});
        }
    }
    return tiles;
}

const gui = new dat.GUI();



gui.add(control, "numColors").min(1).max(8).step(1);
gui.add(control, "sizeTiles").min(0).max(3).step(.2);
gui.add(control, "numCols").min(1).max(8).step(1);
gui.add(control, "numRows").min(1).max(8).step(1);
gui.addColor(control, "backgroundColor");
gui.addColor(control, "strokeColor");
let colortiles = generateColorTiles();
alert("This site displays a disco dance floor. The controls are on the right to change the size, and other properties. Press the '?' on the keyboard to bring this back up.");
document.body.addEventListener("keydown", (e) => {
    if (e.key === '?') {
        alert("This site displays a disco dance floor. The controls are on the right to change the size, and other properties. Press the '?' on the keyboard to bring this back up.");
    }
});

setInterval(function () {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTiles(generateColorTiles());
    document.body.style.backgroundColor = 'rgb(' + control.backgroundColor[0] + ', ' + control.backgroundColor[1] + ', ' + control.backgroundColor[2] + ')';
}, 200);

