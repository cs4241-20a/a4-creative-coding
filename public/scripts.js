const reqString = "http://api.nobelprize.org/v1/laureate.json"
const mapReqString = "world.geojson"
let laureateData = null
let map = null

let physicsLaureates = []
let ecoLaureates = []
let chemLaureates = []
let litLaureates = []
let peaceLaureates = []
let medLaureates = []
let femaleLaureates = []
let maleLaureates = []
let byYear = {}

let genderSlider = document.getElementById("yearGenderSlider")
let mapSlider = document.getElementById("yearMapSlider")
let helpBtn = document.getElementById("helpBtn")

window.onload = function () {
    d3.json(reqString, function (data) {
        laureateData = data
        setUp()
    })

    d3.json(mapReqString, function (error, topology) {
        map = topology
        mapSetUp()

    });

    genderSlider.oninput = genderSliderControl
    mapSlider.oninput = mapSliderControl

    Array.from(document.getElementsByClassName("catCheck")).forEach((e => e.onchange = ageGraphControl))
    $('#exampleModal').modal('show');
}


function setUp() {
    getAges()
    ageGraphControl()
    genderSlider.value = 2020
    genderSliderControl()
    getGender(2019)
    mapSlider.value = 2020
    mapSliderControl()
}

function mapSetUp() {
    document.getElementById("mapChart").innerHTML = ""
    let height = 500
    let width = +d3.select('#mapChart').style('width').slice(0, -2)

    let projection = d3.geoEquirectangular();

    let geoGenerator = d3.geoPath()
        .projection(projection);

    let svg = d3.select("#mapChart").append("svg").attr("width", width).attr("height", height).attr("class", "map")
    let g = svg.append('g')
    let u = g.selectAll('path')
        .data(map.features);

    u.enter()
        .append('path')
        .attr('d', geoGenerator);

}

const getAges = function () {
    for (section of Object.keys(laureateData.laureates)) {
        laureateData.laureates[section].prizes.forEach(prize => {
            let award = {
                name: laureateData.laureates[section].firstname + " " + laureateData.laureates[section].surname,
                category: prize.category,
                description: prize.motivation,
                country: laureateData.laureates[section].bornCountry,
                countryCode: laureateData.laureates[section].bornCountryCode
            }
            if (prize.year in byYear) {
                byYear[prize.year].push(award)
            } else {
                byYear[prize.year] = [award]
            }
            let name = laureateData.laureates[section].firstname + " " + laureateData.laureates[section].surname
            if(laureateData.laureates[section].gender == "org"){
                name = laureateData.laureates[section].firstname
            }
            if (laureateData.laureates[section].born != null) {
                let obj = {
                    year: prize.year,
                    age: prize.year - laureateData.laureates[section].born.substring(0, 4),
                    gender: laureateData.laureates[section].gender,
                    name
                }
                if (laureateData.laureates[section].gender === "female") {
                    femaleLaureates.push(obj)
                } else if (laureateData.laureates[section].gender === "male") {
                    maleLaureates.push(obj)
                }
                if (laureateData.laureates[section].gender != "org") {
                    switch (prize.category) {
                        case "physics":
                            physicsLaureates.push(obj)
                            break
                        case "chemistry":
                            chemLaureates.push(obj)
                            break
                        case "economics":
                            ecoLaureates.push(obj)
                            break
                        case "medicine":
                            medLaureates.push(obj)
                            break
                        case "peace":
                            peaceLaureates.push(obj)
                            break
                        case "literature":
                            litLaureates.push(obj)
                            break
                    }
                }
            }
        })
    }

}


const getGender = function (year) {
    let women = 0, men = 0
    for (section of Object.keys(laureateData.laureates)) {
        if (laureateData.laureates[section].prizes[0].year > year) {
            break
        }
        if (laureateData.laureates[section].gender == "male") {
            men++
        } else if (laureateData.laureates[section].gender == "female") {
            women++
        }
    }
    return [women, men]
}

const genderSliderControl = function () {

    let values = getGender(genderSlider.value)
    if (values[0] === 1) {
        document.getElementById("genderText").innerText = `From 1901 to ${genderSlider.value}, out of ${values[0] + values[1]} laureates only ${values[0]} was a woman.`
    } else if (values[0] === 0) {
        document.getElementById("genderText").innerText = `From 1901 to ${genderSlider.value}, out of ${values[0] + values[1]} laureates none of them were a woman.`
    } else {
        document.getElementById("genderText").innerText = `From 1901 to ${genderSlider.value}, out of ${values[0] + values[1]} laureates only ${values[0]} were women.`
    }

    let percW = (values[0]) / (values[0] + values[1])
    let percM = (values[1]) / (values[0] + values[1])
    document.getElementById("genderBar").innerHTML = ""
    let width = +d3.select('#genderRatio').style('width').slice(0, -2)
    var svg = d3.select("#genderBar").append("svg").attr("width", width).attr("height", 40);
    svg.append("rect").attr("x", 0).attr("y", 0).attr("width", (width) * percM).attr("height", 40).attr("fill", "#1578b3");
    svg.append("rect").attr("x", (width) * percM).attr("y", 0).attr("width", (width) * percW).attr("height", 40).attr("fill", "#b35394");

}

const mapSliderControl = function () {

    let countries = {}
    document.getElementById("mapChart").innerHTML = ""
    let year = mapSlider.value
    document.getElementById("yearText").innerText = "Year " + year
    let laureates = byYear[year]
    if (laureates != undefined) {
        laureates.forEach(l => {
            let countryGeo = map.features.find(obj => {
                return obj.properties["ISO_A2"] == l.countryCode
            })
            let award = l
            if (l.countryCode in countries) {
                countries[l.countryCode].push(award)
            } else {
                countries[l.countryCode] = [award]
            }
        })
    }

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    let height = 500
    let width = +d3.select('#mapChart').style('width').slice(0, -2)

    let projection = d3.geoEquirectangular();

    let geoGenerator = d3.geoPath()
        .projection(projection);

    let svg = d3.select("#mapChart").append("svg").attr("width", width).attr("height", height).attr("class", "map")
    let g = svg.append('g')
    let u = g.selectAll('path')
        .data(map.features);
    u.enter()
        .append('path')
        .attr('d', geoGenerator)

    g.selectAll('path').attr("fill", function (d) {
        if (Object.keys(countries).includes(d.properties.ISO_A2)) {
            return '#1578b3'
        }
        return '#aaa'
    })
    g.selectAll('path').on("mouseover", function(d){
        if (Object.keys(countries).includes(d.properties.ISO_A2)) {
            div.transition()
                .duration(200)
                .style("opacity", .9).style("display", "inline");
            let text = "";
            countries[d.properties.ISO_A2].forEach(l => {
                text += "<b>"+l.name+"</b> " +l.description+ "<br/>"
                }
            )
            div	.html(text )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            d3.select(this).style("fill", "#094bb3")
        }
    });
    g.selectAll('path').on("mouseout", function(d){
        if (Object.keys(countries).includes(d.properties.ISO_A2)) {
            div.transition()
                .duration(500)
                .style("opacity", 0).style("display", "none");
            d3.select(this).style("fill", "#0b82b3")
        }
    });

}

const ageGraphControl = function () {

    let highlightFemale = document.getElementById("femaleCheck").checked
    document.getElementById("ageCol").innerHTML = ""
    // set the dimensions and margins of the graph
    let margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = +d3.select('#ageCol').style('width').slice(0, -2) - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

// append the svg object to the body of the page
    var svg = d3.select("#ageCol")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Add X axis
    var x = d3.scaleLinear()
        .domain([1900, 2020])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format(".0f")));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    if (document.getElementById("chemCheck").checked) {
        svg.append('g')
            .selectAll("dot")
            .data(chemLaureates)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x(parseInt(d.year));
            })
            .attr("cy", function (d) {
                return y(d.age);
            })
            .attr("r", function (d) {
                if (d.gender == "female" && highlightFemale) {
                    return 3
                } else if (highlightFemale) {
                    return 1
                } else {
                    return 1.5
                }
            })
            .style("fill", "#54b3b2").on("mouseover", function(d){
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html(d.name + "<br/>" )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
        })
    }
    if (document.getElementById("medCheck").checked) {
        svg.append('g')
            .selectAll("dot")
            .data(medLaureates)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x(parseInt(d.year));
            })
            .attr("cy", function (d) {
                return y(d.age);
            })
            .attr("r", function (d) {
                if (d.gender == "female" && highlightFemale) {
                    return 3
                } else if (highlightFemale) {
                    return 1
                } else {
                    return 1.5
                }
            })
            .style("fill", "#b3454a").on("mouseover", function(d){
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html(d.name + "<br/>" )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
    }
    if (document.getElementById("peaceCheck").checked) {
        svg.append('g')
            .selectAll("dot")
            .data(peaceLaureates)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x(parseInt(d.year));
            })
            .attr("cy", function (d) {
                return y(d.age);
            })
            .attr("r", function (d) {
                if (d.gender == "female" && highlightFemale) {
                    return 3
                } else if (highlightFemale) {
                    return 1
                } else {
                    return 1.5
                }
            })
            .style("fill", "#5ab335").on("mouseover", function(d){
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html(d.name + "<br/>" )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
    }
    if (document.getElementById("ecoCheck").checked) {
        svg.append('g')
            .selectAll("dot")
            .data(ecoLaureates)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x(parseInt(d.year));
            })
            .attr("cy", function (d) {
                return y(d.age);
            })
            .attr("r", function (d) {
                if (d.gender == "female" && highlightFemale) {
                    return 3
                } else if (highlightFemale) {
                    return 1
                } else {
                    return 1.5
                }
            })
            .style("fill", "#9a53b3").on("mouseover", function(d){
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html(d.name + "<br/>" )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
    }
    if (document.getElementById("phyCheck").checked) {
        svg.append('g')
            .selectAll("dot")
            .data(physicsLaureates)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x(parseInt(d.year));
            })
            .attr("cy", function (d) {
                return y(d.age);
            })
            .attr("r", function (d) {
                if (d.gender == "female" && highlightFemale) {
                    return 3
                } else if (highlightFemale) {
                    return 1
                } else {
                    return 1.5
                }
            })
            .style("fill", "#1578b3").on("mouseover", function(d){
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html(d.name + "<br/>" )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
    }
    if (document.getElementById("litCheck").checked) {
        svg.append('g')
            .selectAll("dot")
            .data(litLaureates)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x(parseInt(d.year));
            })
            .attr("cy", function (d) {
                return y(d.age);
            })
            .attr("r", function (d) {
                if (d.gender == "female" && highlightFemale) {
                    return 3
                } else if (highlightFemale) {
                    return 1
                } else {
                    return 1.5
                }
            })
            .style("fill", "#b38715").on("mouseover", function(d){
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html(d.name + "<br/>" )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
    }

}
