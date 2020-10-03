import { ConwaysGameOfLife } from './gol.js';

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('gol-render');
const ctx = canvas.getContext("2d", { alpha: false });
const bufferCanvas = document.createElement('canvas');
const buffer = bufferCanvas.getContext("2d", { alpha: false });

let options = {
    paused: false,
    wrap: false,
    color: "#000000",
    cyclesPerSecond: 30,
    renderScale: 5
};
let conways = new ConwaysGameOfLife({width: 0, height: 0}, false);

const gui = new dat.GUI({width: 350});
gui.add(options, "paused").name("Pause");
gui.add(options, "wrap").name("Enable wrapping");
gui.addColor(options, "color").name("Live cell color");
gui.add(options, "cyclesPerSecond").min(1).max(120).step(1).name("Generations per second");
gui.add(options, "renderScale").min(4).max(8).step(1).name("Render scale");
gui.add({flip() { 
    for (let x = 0; x < conways.width; x++) {
        for (let y = 0; y < conways.height; y++) {
            conways.board[x][y] = !conways.board[x][y];
        }
    }
}}, "flip").name("Flip alive/dead");
gui.add({randomize() { conways.randomize() }}, "randomize").name("Randomize game");
gui.add({help() { location.href = "../" }}, "help").name("View instructions");

let oldWidth = 0;
let oldHeight = 0;
let oldScale = 0;

function render() {
    bufferCanvas.width = window.innerWidth;
    bufferCanvas.height = window.innerHeight - 4; // Mystery -4 px makes stuff work
    const gameWidth = Math.floor(bufferCanvas.width / options.renderScale);
    const gameHeight = Math.floor(bufferCanvas.height / options.renderScale);

    if (oldWidth !== bufferCanvas.width || oldHeight !== bufferCanvas.height || oldScale !== options.renderScale) {
        oldWidth = bufferCanvas.width;
        oldHeight = bufferCanvas.height;
        oldScale = options.renderScale;
        conways = new ConwaysGameOfLife({width: gameWidth, height: gameHeight}, options.wrap);
        conways.randomize();
    }

    buffer.fillStyle = "#ffffff";
    buffer.fillRect(0, 0, bufferCanvas.width, bufferCanvas.height);
    buffer.fillStyle = options.color;
    const cellSize = Math.min(bufferCanvas.width / gameWidth, bufferCanvas.height / gameHeight);
    const offsetX = (bufferCanvas.width - gameWidth * cellSize) / 2;
    const offsetY = (bufferCanvas.height - gameHeight * cellSize) / 2;
    for (let x = 0; x < gameWidth; x++) {
        for (let y = 0; y < gameHeight; y++) {
            if (conways.board[x][y]) {
                buffer.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
            }
        }
    }

    canvas.width = bufferCanvas.width;
    canvas.height = bufferCanvas.height;
    ctx.drawImage(bufferCanvas, 0, 0);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);

let keepWarningVisible = 0;
const warningTextElt = document.getElementById('warning-text');

let endTime = window.performance.now();
let lastWait = 0;
(function conwaysCycle() {
    const startTime = window.performance.now();
    const timeoutLoss = startTime - endTime - lastWait;
    conways.wrap = options.wrap;
    if (!options.paused) {
        conways.iterate();
    }
    endTime = window.performance.now();
    lastWait = 1000 / options.cyclesPerSecond - (endTime - startTime) - timeoutLoss;
    if (lastWait < timeoutLoss) {
        console.log("Uh oh, the computation can't keep up", lastWait);

        keepWarningVisible++;
        warningTextElt.hidden = false;
        setTimeout(() => {
            keepWarningVisible--;
            if (keepWarningVisible === 0) warningTextElt.hidden = true
        }, 300);
    }
    lastWait = Math.max(lastWait, 0);
    setTimeout(conwaysCycle, lastWait);
})();