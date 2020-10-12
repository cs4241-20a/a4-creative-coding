let color = ~~(Math.random() * 360),
  spans = d3.selectAll("._3dbox"),
  len = 15;

spans.style("background-color", function(d) {
  return "hsl(" + random(0, 360) + ", 60%, 50%)";
});

function changeColor(){
  spans.style("background-color", function(d) {
  return "hsl(" + random(0, 360) + ", 60%, 50%)";
});
}

function draw() {
  spans
    .transition()
    .duration(500)
    .ease("elastic")
    .style("height", function(d) {
      return d * 5 + "px";
    });
}

setInterval(function() {
  //var arr = Array.apply(null, new Array(len)).map(function() {
  //  return [random(10, 80)];
  //});
  analyser.getByteFrequencyData(frequencyData);
  
  spans.data(frequencyData);
  draw();
}, 800);



function random(min, max) {
  return min + ~~(Math.random() * (max - min));
}

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audioElement = document.getElementById("audioElement");
var audioSrc = audioCtx.createMediaElementSource(audioElement);
var analyser = audioCtx.createAnalyser();

// Bind our analyser to the media element source.
audioSrc.connect(analyser);
audioSrc.connect(audioCtx.destination);

function play() {
  audioCtx.resume();
  audioElement.play();
}

var frequencyData = new Uint8Array(15);

var svgHeight = "300";
var svgWidth = "1200";
var barPadding = "1";

function createSvg(parent, height, width) {
  return d3
    .select(parent)
    .append("svg")
    .attr("height", height)
    .attr("width", width);
}

var svg = createSvg("body", svgHeight, svgWidth);

// Create our initial D3 chart.
svg
  .selectAll("rect")
  .data(frequencyData)
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    return i * (svgWidth / frequencyData.length);
  })
  .attr("width", svgWidth / frequencyData.length - barPadding);


function renderChart() {
   requestAnimationFrame(renderChart);

   // Copy frequency data to frequencyData array.
   analyser.getByteFrequencyData(frequencyData);

   // Update d3 chart with new data.
   svg.selectAll('rect')
      .data(frequencyData)
      .attr('y', function(d) {
         return svgHeight - d;
      })
      .attr('height', function(d) {
         return d;
      })
      .attr('fill', function(d) {
         return 'rgb(0, 0, ' + d + ')';
      });
}

// Run the loop
renderChart();