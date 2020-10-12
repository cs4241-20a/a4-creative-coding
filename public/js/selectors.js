import {openInfo, clickColor, customColor, saveImage, changeBrushStyle, fillCanvas, changeBrushSize, clearCanvas, changeColor } from './main.js';


document.querySelector('#saveFile').addEventListener('click', saveImage);
document.querySelector('#clear').addEventListener('click', clearCanvas);
document.querySelector('#fillCanvas').addEventListener('click', fillCanvas);
document.querySelector('#fillCanvas').addEventListener('click', fillCanvas);
document.querySelector('#squareBrush').addEventListener('click', function () { changeBrushStyle('square'); });
document.querySelector('#RoundBrush').addEventListener('click', function () { changeBrushStyle('round'); });
document.querySelector('#brushSize1').addEventListener('click', function () { changeBrushSize(1); });
document.querySelector('#brushSize2').addEventListener('click', function () { changeBrushSize(5); });
document.querySelector('#brushSize3').addEventListener('click', function () { changeBrushSize(15); });
document.querySelector('#brushSize4').addEventListener('click', function () { changeBrushSize(40); });

document.querySelector('#red').addEventListener('click', function () { changeColor('#ff0000'); });
document.querySelector('#orange').addEventListener('click', function () { changeColor('#ffa500'); });
document.querySelector('#yellow').addEventListener('click', function () { changeColor('#ffff00'); });
document.querySelector('#green').addEventListener('click', function () { changeColor('#008000'); });
document.querySelector('#blue').addEventListener('click', function () { changeColor('#0000ff'); });
document.querySelector('#indigo').addEventListener('click', function () { changeColor('#4b0082'); });
document.querySelector('#violet').addEventListener('click', function () { changeColor('#ee82ee'); });
document.querySelector('#black').addEventListener('click', function () { changeColor('#000000'); });
document.querySelector('#grey').addEventListener('click', function () { changeColor('#808080'); });
document.querySelector('#white').addEventListener('click', function () { changeColor('#ffffff'); });
document.querySelector('#maroon').addEventListener('click', function () { changeColor('#800000'); });
document.querySelector('#orangered').addEventListener('click', function () { changeColor('#ff4500'); });
document.querySelector('#gold').addEventListener('click', function () { changeColor('#ffd700'); });
document.querySelector('#lime').addEventListener('click', function () { changeColor('#00ff00'); });
document.querySelector('#lightblue').addEventListener('click', function () { changeColor('#add8e6'); });
document.querySelector('#plum').addEventListener('click', function () { changeColor('#dda0dd'); });
document.querySelector('#lavender').addEventListener('click', function () { changeColor('#e6e6fa'); });
document.querySelector('#darkgrey').addEventListener('click', function () { changeColor('#a9a9a9'); });
document.querySelector('#lightgrey').addEventListener('click', function () { changeColor('#d3d3d3'); });
document.querySelector('#tan').addEventListener('click', function () { changeColor('#d2b48c'); });

document.querySelector('#currentColor').addEventListener('click', clickColor);
document.querySelector('#colorSelect').addEventListener('change', customColor);
document.querySelector('#info').addEventListener('click', openInfo);