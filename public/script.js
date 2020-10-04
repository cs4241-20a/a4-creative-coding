var theme = "default";
var size = "default";
var direction = "default";
var color = "default";
var height = "default";
var background = "default";
var audio = document.getElementById("audio");
audio.src =
  "https://cdn.glitch.com/a5b21985-691d-452b-b106-602026424f28%2F557.mp3?v=1601776756349";
audio.crossOrigin = "anonymous";

var context = new AudioContext();

var src = context.createMediaElementSource(audio);
var analyser = context.createAnalyser();

var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

src.connect(analyser);
analyser.connect(context.destination);

analyser.fftSize = 256;

var bufferLength = analyser.frequencyBinCount;
console.log(bufferLength);

var dataArray = new Uint8Array(bufferLength);

var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var barWidth = (WIDTH / bufferLength) * 2.5;
var barHeight;
var x = 0;

var playPromise = audio.play();
console.log(playPromise);

function renderFrame() {
  requestAnimationFrame(renderFrame);

  x = 0;

  analyser.getByteFrequencyData(dataArray);
  //console.log(theme);
  if (background === "lightCyan") {
    ctx.fillStyle = "#FD0F4EA";
  } else if (background === "cadetGrey") {
    ctx.fillStyle = "#829399";
  } else if (background === "mintCream") {
    ctx.fillStyle = "#F1F7ED";
  } else {
    ctx.fillStyle = "#000";
  }

  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (size === "large") {
    barWidth = (WIDTH / bufferLength) * 5;
  } else if (size === "small") {
    barWidth = WIDTH / bufferLength;
  } else {
    barWidth = (WIDTH / bufferLength) * 2.5;
  }

  for (var i = 0; i < bufferLength; i++) {
    if (height === "high") {
      barHeight = dataArray[i] * 2.3;
    } else if (height === "low") {
      barHeight = dataArray[i] * 0.7;
    } else {
      barHeight = dataArray[i];
    }

    var r = 255;
    var g = 255;
    var b = 255;

    if (color === "low") {
      r = (i / bufferLength) * 500;
      g = (i / bufferLength) * 500;
      b = (i / bufferLength) * 500;
    } else if (color === "high") {
      r = (i / bufferLength) * 1000;
      g = (i / bufferLength) * 1000;
      b = (i / bufferLength) * 1000;
    }

    if (theme === "rose") {
      if (color === "low") {
        r = barHeight + 250 * (i / bufferLength);
        g = 250 * (i / bufferLength);
        b = 0;
      } else if (color === "high") {
        r = barHeight + i / bufferLength;
        g = i / bufferLength;
        b = 50;
      } else {
        r = barHeight + 25 * (i / bufferLength);
        g = 250 * (i / bufferLength);
        b = 50;
      }
    } else if (theme === "ocean") {
      if (color === "low") {
        r = 0;
        g = 250 * (i / bufferLength);
        b = barHeight + 250 * (i / bufferLength);
      } else if (color === "high") {
        r = 50;
        g = i / bufferLength;
        b = barHeight + i / bufferLength;
      } else {
        r = 50;
        g = 250 * (i / bufferLength);
        b = barHeight + 25 * (i / bufferLength);
      }
    }
    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";

    if (direction === "top") {
      ctx.fillRect(x, 0, barWidth, barHeight);
    } else if (direction === "center") {
      ctx.fillRect(x, HEIGHT / 2 - barHeight / 2, barWidth, barHeight);
    } else {
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
    }

    x += barWidth + 1;
  }
}

window.onload = function() {
  alert(
    "This is a audio visualizer for the piano song 'One Man's Dream'. You can modify the theme, size, direction, color gradient, amplitude, and background color of the display. Please click the LOAD button every time after modify."
  );
  document.getElementById("load").addEventListener("click", function() {
    theme = document.getElementById("theme").value;
    size = document.getElementById("size").value;
    direction = document.getElementById("direction").value;
    color = document.getElementById("color").value;
    height = document.getElementById("height").value;
    background = document.getElementById("background").value;

    context.resume().then(() => {
      renderFrame();
      console.log("Playback resumed successfully");
    });
  });

  if (playPromise !== undefined) {
    playPromise
      .then(_ => {
        // Automatic playback started!
        // Show playing UI.
        audio.load();
        audio.play();
        renderFrame();
      })
      .catch(error => {
        // Auto-play was prevented
        // Show paused UI.
        alert("Please click the LOAD button every time before display.");
      });
  }
  var help = document.getElementById("help");
  help.onclick = function() {
    alert(
      "This is a audio visualizer for the piano song 'One Man's Dream'. You can modify the theme, size, direction, color gradient, amplitude, and background color of the display. Please click the LOAD button every time after modify."
    );
  };
};
