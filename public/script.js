var allOrOne;
var flightType;
var size;
var carOrTime;
var grid;
var color;
var id1 = document.getElementById("airfly");
var id2 = document.getElementById("flights");
var id3 = document.getElementById("data");
var id4 = document.getElementById("Size");
var id5 = document.getElementById("Color");
var id6 = document.getElementById("Grid");

function showDocumentation() {
  window.alert(
    "Welcome! This site displays flight data from major USA airports on June 2003, you can use the selection boxes to navigate the available data and find what you're looking for, and if at some point you're not able to differentiate to bars use the grid and large input boxes to analyze the data"
  );
}

showDocumentation();

var margin = { top: 20, right: 20, bottom: 70, left: 40 };
var width = 600 - margin.left - margin.right;
var height = 300 - margin.top - margin.botom;

var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);
var y = d3.scale.linear().range([height, 0]);

function parameter1() {
  allOrOne = id1.options[id1.selectedIndex].value;
  flightType = id2.options[id2.selectedIndex].value;
  carOrTime = id3.options[id3.selectedIndex].value;
  size = id4.options[id4.selectedIndex].value;
  color = id5.options[id5.selectedIndex].value;
  grid = id6.options[id6.selectedIndex].value;

  if (size == "Regular") {
    width = 600 - margin.left - margin.right;
    height = 300 - margin.top - margin.bottom;
    x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);
    y = d3.scale.linear().range([height, 0]);
  } else if (size == "Large") {
    width = 800 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;
    x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);
    y = d3.scale.linear().range([height, 0]);
  }

  d3.json("airlines.json", function(data) {
    if (allOrOne == "All Flights") {
      if (flightType == "Delayed") {
        d3.selectAll("svg").remove();
        var xAxis = createX();
        var yAxis = createY();
        var svg = createSVG();

        data.forEach(function(d) {
          if (d.Time.Month == 6 && d.Time.Year == 2003) {
            d.Airport.Code = d.Airport.Code;
            d.Statistics.Flights.Delayed = d.Statistics.Flights.Delayed;
          }
          //d.Airport.Code = d.Airport.Code;
          //d.Statistics.Flights.Delayed = d.Statistics.Flights.Delayed;
        });
        x.domain(
          data.map(function(d) {
            return d.Airport.Code;
          })
        );
        y.domain([
          0,
          d3.max(data, function(d) {
            return d.Statistics.Flights.Delayed;
          })
        ]);

        if (grid == "nogrid") {
        } else if (grid == "grid") {
          svg
            .append("g")
            .attr("class", "grid")
            .call(
              yAxis
                .scale(y)
                .tickSize(-width, 0, 0)
                .tickFormat("")
            );
        }

        svg
          .append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", "-.55em")
          .attr("transform", "rotate(-90)");

        svg
          .append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("");

        svg
          .selectAll("bar")
          .data(data)
          .enter()
          .append("rect")
          .style("fill", color)
          .attr("x", function(d) {
            return x(d.Airport.Code);
          })
          .attr("width", x.rangeBand())
          .attr("y", function(d) {
            return y(d.Statistics.Flights.Delayed);
          })
          .attr("height", function(d) {
            return height - y(d.Statistics.Flights.Delayed);
          });
      } else if (flightType == "OnTime") {
        d3.selectAll("svg").remove();
        var xAxis = createX();
        var yAxis = createY();
        var svg = createSVG();

        data.forEach(function(d) {
          if (d.Time.Month == 6 && d.Time.Year == 2003) {
            d.Airport.Code = d.Airport.Code;
            d.Statistics.Flights.OnTime = d.Statistics.Flights.OnTime;
          }
        });
        x.domain(
          data.map(function(d) {
            return d.Airport.Code;
          })
        );
        y.domain([
          0,
          d3.max(data, function(d) {
            return d.Statistics.Flights.OnTime;
          })
        ]);

        if (grid == "nogrid") {
        } else if (grid == "grid") {
          svg
            .append("g")
            .attr("class", "grid")
            .call(
              yAxis
                .scale(y)
                .tickSize(-width, 0, 0)
                .tickFormat("")
            );
        }

        svg
          .append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", "-.55em")
          .attr("transform", "rotate(-90)");

        svg
          .append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("");

        svg
          .selectAll("bar")
          .data(data)
          .enter()
          .append("rect")
          .style("fill", color)
          .attr("x", function(d) {
            return x(d.Airport.Code);
          })
          .attr("width", x.rangeBand())
          .attr("y", function(d) {
            return y(d.Statistics.Flights.OnTime);
          })
          .attr("height", function(d) {
            return height - y(d.Statistics.Flights.OnTime);
          });
      } else if (flightType == "Cancelled") {
        d3.selectAll("svg").remove();
        var xAxis = createX();
        var yAxis = createY();
        var svg = createSVG();

        data.forEach(function(d) {
          if (d.Time.Month == 6 && d.Time.Year == 2003) {
            d.Airport.Code = d.Airport.Code;
            d.Statistics.Flights.Cancelled = d.Statistics.Flights.Cancelled;
          }
        });
        x.domain(
          data.map(function(d) {
            return d.Airport.Code;
          })
        );
        y.domain([
          0,
          d3.max(data, function(d) {
            return d.Statistics.Flights.Cancelled;
          })
        ]);

        if (grid == "nogrid") {
        } else if (grid == "grid") {
          svg
            .append("g")
            .attr("class", "grid")
            .call(
              yAxis
                .scale(y)
                .tickSize(-width, 0, 0)
                .tickFormat("")
            );
        }

        svg
          .append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", "-.55em")
          .attr("transform", "rotate(-90)");

        svg
          .append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("");

        svg
          .selectAll("bar")
          .data(data)
          .enter()
          .append("rect")
          .style("fill", color)
          .attr("x", function(d) {
            return x(d.Airport.Code);
          })
          .attr("width", x.rangeBand())
          .attr("y", function(d) {
            return y(d.Statistics.Flights.Cancelled);
          })
          .attr("height", function(d) {
            return height - y(d.Statistics.Flights.Cancelled);
          });
      } else {
        d3.selectAll("svg").remove();
        var xAxis = createX();
        var yAxis = createY();
        var svg = createSVG();

        var i = 0;
        data.forEach(function(d) {
          if (d.Time.Month == 6 && d.Time.Year == 2003) {
            d.Airport.Code = d.Airport.Code;
            d.Statistics.Flights.Total = d.Statistics.Flights.Total;
          }
        });
        x.domain(
          data.map(function(d) {
            return d.Airport.Code;
          })
        );
        y.domain([
          0,
          d3.max(data, function(d) {
            return d.Statistics.Flights.Total;
          })
        ]);

        if (grid == "nogrid") {
        } else if (grid == "grid") {
          svg
            .append("g")
            .attr("class", "grid")
            .call(
              yAxis
                .scale(y)
                .tickSize(-width, 0, 0)
                .tickFormat("")
            );
        }

        svg
          .append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", "-.55em")
          .attr("transform", "rotate(-90)");

        svg
          .append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("");

        svg
          .selectAll("bar")
          .data(data)
          .enter()
          .append("rect")
          .style("fill", color)
          .attr("x", function(d) {
            return x(d.Airport.Code);
          })
          .attr("width", x.rangeBand())
          .attr("y", function(d) {
            return y(d.Statistics.Flights.Total);
          })
          .attr("height", function(d) {
            return height - y(d.Statistics.Flights.Total);
          });
      }
    } else if (allOrOne == "CompData") {
      if (carOrTime == "Carriers") {
        d3.selectAll("svg").remove();
        var xAxis = createX();
        var yAxis = createY();
        var svg = createSVG();

        data.forEach(function(d) {
          if (d.Time.Month == 6 && d.Time.Year == 2003) {
            d.Airport.Code = d.Airport.Code;
            d.Statistics.Carriers.Total = d.Statistics.Carriers.Total;
          }
        });
        x.domain(
          data.map(function(d) {
            return d.Airport.Code;
          })
        );
        y.domain([
          0,
          d3.max(data, function(d) {
            return d.Statistics.Carriers.Total;
          })
        ]);

        if (grid == "nogrid") {
        } else if (grid == "grid") {
          svg
            .append("g")
            .attr("class", "grid")
            .call(
              yAxis
                .scale(y)
                .tickSize(-width, 0, 0)
                .tickFormat("")
            );
        }

        svg
          .append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", "-.55em")
          .attr("transform", "rotate(-90)");

        svg
          .append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("");

        svg
          .selectAll("bar")
          .data(data)
          .enter()
          .append("rect")
          .style("fill", color)
          .attr("x", function(d) {
            return x(d.Airport.Code);
          })
          .attr("width", x.rangeBand())
          .attr("y", function(d) {
            return y(d.Statistics.Carriers.Total);
          })
          .attr("height", function(d) {
            return height - y(d.Statistics.Carriers.Total);
          });
      } else if (carOrTime == "Minutes") {
        d3.selectAll("svg").remove();
        var xAxis = createX();
        var yAxis = createY();
        var svg = createSVG();

        data.forEach(function(d) {
          if (d.Time.Month == 6 && d.Time.Year == 2003) {
            d.Airport.Code = d.Airport.Code;
            d.Statistics.MinutesDelayed.Total =
              d.Statistics.MinutesDelayed.Total;
          }
        });
        x.domain(
          data.map(function(d) {
            return d.Airport.Code;
          })
        );
        y.domain([
          0,
          d3.max(data, function(d) {
            return d.Statistics.MinutesDelayed.Total;
          })
        ]);

        if (grid == "nogrid") {
        } else if (grid == "grid") {
          svg
            .append("g")
            .attr("class", "grid")
            .call(
              yAxis
                .scale(y)
                .tickSize(-width, 0, 0)
                .tickFormat("")
            );
        }

        svg
          .append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", "-.55em")
          .attr("transform", "rotate(-90)");

        svg
          .append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("");

        svg
          .selectAll("bar")
          .data(data)
          .enter()
          .append("rect")
          .style("fill", color)
          .attr("x", function(d) {
            return x(d.Airport.Code);
          })
          .attr("width", x.rangeBand())
          .attr("y", function(d) {
            return y(d.Statistics.MinutesDelayed.Total);
          })
          .attr("height", function(d) {
            return height - y(d.Statistics.MinutesDelayed.Total);
          });
      } else {
        d3.selectAll("svg").remove();
      }
    } else {
      d3.selectAll("svg").remove();
    }
  });
  console.log(allOrOne);
}

function createX() {
  var xA = d3.svg
    .axis()
    .scale(x)
    .orient("bottom");
  return xA;
}

function createY() {
  var yA = d3.svg
    .axis()
    .scale(y)
    .orient("left");
  return yA;
}

function createSVG() {
  var SVG = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  return SVG;
}
