var canvas,
  ctx,
  center_x,
  center_y,
  radius,
  bars,
  x_end,
  y_end,
  bar_height,
  bar_width,
  frequency_array,
  longerBar;

var audio, analyser, source, rads, x, y;

bars = 200;
bar_width = 2;

// i did look at https://www.kkhaydarov.com/audio-visualizer/ and refer to the design; i undertood every step it took to draw the elements in canvas(circle, bars); I edited most part and added all user interfaces

/**
 **render method
 */
function animationLooper() {
  // set to the size of device
  canvas = document.getElementById("renderer");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");

  // find the center of the window
  center_x = canvas.width / 2;
  center_y = canvas.height / 2;
  radius = parseInt(document.getElementById("radius").value);

  var background_color = document.getElementById("background_color").value;

  // style the background
  var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  if (background_color == "default") {
    gradient.addColorStop(0, "rgba(35, 7, 83, 1)");
    gradient.addColorStop(1, "rgba(204, 100, 40, 1)");
  } else if (background_color == "simple") {
    gradient.addColorStop(0, "rgba(0, 0, 50, 1)");
    gradient.addColorStop(1, "rgba(200, 210, 220, 1)");
  } else if (background_color == "rose") {
    gradient.addColorStop(0, "rgba(220, 110, 140, 1)");
    gradient.addColorStop(1, "rgba(234, 200, 200, 1)");
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //draw a circle
  ctx.beginPath();
  ctx.arc(center_x, center_y, radius, 0, 2 * Math.PI);
  ctx.stroke();

  // if we want longer bar
  longerBar = 1;

  analyser.getByteFrequencyData(frequency_array);
  for (var i = 0; i < bars; i++) {
    //divide a circle into equal parts
    rads = (Math.PI * 2) / bars;

    longerBar = parseFloat(document.getElementById("bar_length").value);
    bar_height = frequency_array[i] * 0.7 * longerBar;

    // set coordinates
    x = center_x + Math.cos(rads * i) * radius;
    y = center_y + Math.sin(rads * i) * radius;
    x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
    y_end = center_y + Math.sin(rads * i) * (radius + bar_height);

    //draw a bar which
    //     the width will depend on
    drawBar(x, y, x_end, y_end, bar_width, frequency_array[i]);
  }
  window.requestAnimationFrame(animationLooper);
}

// for drawing a bar
function drawBar(x1, y1, x2, y2, width, frequency) {
  var bar_color = document.getElementById("bar_color").value;
  if (bar_color == "default") {
    var lineColor = "rgb(" + frequency + ", " + frequency + ", " + 200 + ")";
  } else if (bar_color == "simple") {
    var lineColor = "rgb(230,230,255)";
  } else if (bar_color == "rose") {
    var lineColor = "rgb(230,50,70)";
  }

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

window.onload = function() {
  alert(
    "This is a 2D music visualizer that plays animation according to music's frequency. The song is 'anxiete' by Pomme. You can choose to pause, play, and adjust the circle radius, bar length, and the general theme."
  );
  // alert(
  //   "A 2d Music Visualizer that auto plays a song."
  // )
  audio = new Audio();
  context = new (window.AudioContext || window.webkitAudioContext)();
  analyser = context.createAnalyser();

  audio.src =
    "https://cdn.glitch.com/3fef6d8d-fa32-4845-b10e-851dde22bc68%2Fanxiete.mp3?v=1602454378741";
  audio.crossOrigin = "anonymous"; // the source path
  source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);

  frequency_array = new Uint8Array(analyser.frequencyBinCount);

  audio.play();
  document.getElementById("pause").addEventListener("click", function() {
    audio.pause();
  });
  document.getElementById("play").addEventListener("click", function() {
    audio.play();
  });
  document.getElementById("help").addEventListener("click", function() {
    alert(
      "This is a 2D music visualizer that plays animation according to music's frequency. The song is 'anxiete' by Pomme. You can choose to pause, play, and adjust the circle radius, bar length, and the general theme."
    );
  });
  animationLooper();
};
