import { openInfo, startup } from './info.js';
var canvas = document.getElementById('canvasArea');
var context = canvas.getContext('2d');
context.lineWidth = 5;
context.lineCap = 'round';
var down = false;
var xPos;
var yPos;

canvas.addEventListener('mousemove', draw);

canvas.addEventListener('mousedown', function () {
    down = true;
    context.beginPath();
    context.moveTo(xPos, yPos);
    canvas.addEventListener('mousemove', draw);
});

canvas.addEventListener('mouseup', function () {
    down = false;
});

canvas.addEventListener('mouseleave', function () {
    down = false;
});

function draw (e) {
    xPos = e.clientX - canvas.offsetLeft;
    yPos = e.clientY - canvas.offsetTop;
    if (down === true) {
        context.lineTo(xPos, yPos);
        context.stroke();
    }
}

function changeColor (color) {
    context.strokeStyle = color;
    context.fillStyle = color;
    document.getElementById('currentColor').style.background = color;
    document.getElementById('colorSelect').value = color;
}

function clearCanvas () {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function changeBrushSize (size) {
    context.lineWidth = size;
}

function fillCanvas () {
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function changeBrushStyle (brush) {
    context.lineCap = brush;
}

function customColor () {
    var color = document.getElementById('colorSelect').value;
    changeColor(color);
}

function clickColor () {
    document.getElementById('colorSelect').click();
}

function saveImage () {
    var link = document.getElementById('link');
    link.setAttribute('download', 'webwaredrawing.png');
    link.setAttribute('href', document.getElementById('canvasArea').toDataURL('image/png').replace('image/png', 'image/octet-stream'));
    link.click();
}

startup();

export {openInfo, clickColor, customColor, saveImage, changeBrushStyle, fillCanvas, changeBrushSize, clearCanvas, changeColor, draw };