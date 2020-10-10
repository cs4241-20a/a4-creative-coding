var theme, placement, size, bgcolor, height, audio, audioCtx, material, analyser, canv, context;

function init() {
    theme = "";
    placement = "";
    size = "";
    bgcolor = ""
    height = "";
    audio = document.getElementById("audio");
    audio.src = "./music/dynamite.mp3";
    audio.crossOrigin = "anonymous";
    audioCtx = new AudioContext();
    material = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    canv = document.getElementById("canvas");
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
    context = canv.getContext("2d");
    material.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 1024;

}

var bufferLength = analyser.frequencyBinCount;

var bufferArray = new Unit8Array(bufferLength);

var screenWidth = canv.width;
var screenHeight = canv.height;

var barWidth = (screenWidth / bufferLength) * 2.5;
var barHeight;
var coord;

var mscInput = audio.play();

function renderer() {
    requestAnimationFrame();

    coord = 0;

    analyser.getByteFrequencyData(bufferArray);

    for (i = 0; i < bufferLength; i++) {
        //height
        if (height == "low")
            barHeight = bufferArray[i];
        else if (height == "default")
            barHeight = bufferArray[i] * 1.5;
        else if (height == "high")
            barHeight = bufferArray[i] * 2.2;
        else
            alert("Something went wrong");

        //theme
        if (theme == "gray")
            audioCtx.fillStyle = "D1CCC1";
        else if (theme == "red")
            audioCtx.fillStyle = "#B50000";
        else if (theme == "blue")
            audioCtx.fillStyle = "#2AA4BF";
        else
            alert("Something went wrong");

        //placement
        if (placement == "bottom")
            audioCtx.fillRect(coord, 0, barWidth, barHeight);
        else if (placement == "middle") {
            audioCtx.fillRect(coord, screenHeight / 2 - barHeight, barWidth, barHeight);
        }
        else
            alert("Something went wrong");

    }

    if (bgcolor == "white")
        audioCtx.fillStyle = "#E5E5E5";
    else if (bgcolor == "black")
        audioCtx.fillStyle = "#808080";
    else if (bgcolor == "turquoise")
        audioCtx.fillStyle = "#B0D9CD";
    else
        alert("Something went wrong");
    audioCtx.fillRect(0, 0, screenWidth, screenHeight);

    if (size == "default")
        barWidth = (screenWidth / bufferLength) * 3;
    else if (size == "large")
        barWidth = (screenWidth / bufferLength) * 5.5;
}

window.onload = function () {
    alert("Audio Visualizer that plays Dynamite from BTS. User can change the theme, placement, height, size, and background color, then load them");
    init();
    document.getElementById("play").addEventListener("play", function () {
        theme = document.getElementById("theme").value;
        placement = document.getElementById("placement").value;
        size = document.getElementById("size").value;
        height = document.getElementById("height").value;
        bgcolor = document.getElementById("bgcolor").value;

        context.resume().then(() => {
            renderer();
        });
    });

    if (mscInput != undefined) {
        mscInput.then(_ => {
            audio.load();
            audio.play();
            renderer();
        }).catch(error => {
            alert("Something went wrong with loading");
        });
    }

    var helpmsg = document.getElementById("help");
    helpmsg.onclick = function () {
        alert("Change the theme, placement, height, size, and background color as you like to modify the visualizer for BTS-Dynamite");
    }
}