const reqString = "http://api.nobelprize.org/v1/laureate.json"
const mapReqString = "https://datahub.io/core/geo-countries/datapackage.json"
let laureateData = null
let map  = null

let physicsLaureates = []
let ecoLaureates = []
let chemLaureates = []
let litLaureates = []
let peaceLaureates = []
let medLaureates = []
let femaleLaureates = []
let maleLaureates = []
let universities = {}

window.onload = function () {
    d3.json(reqString, function (data) {
        laureateData = data
        setUp()
    })


    d3.json("https://unpkg.com/world-atlas@1/world/110m.json", function(error, topology) {
       map =topology
       mapSetUp()

    });
}

function setUp() {
    getAges()
    ageGraphControl()
    genderSlider.value = 2019
    genderSliderControl()
    getGender(2019)
}

function mapSetUp() {
    document.getElementById("mapChart").innerHTML = ""
    height = 500
    let width = +d3.select('#mapChart').style('width').slice(0, -2)

    var projection = d3.geoMercator()
        .translate([width / 2.2, height / 1.5]);

    var path = d3.geoPath()
        .projection(projection);

    var svg = d3.select("#mapChart").append("svg").attr("width", width).attr("height", 600).attr("class", "map");
    svg.append('g').selectAll("path")
        .data(topojson.feature(map, map.objects.countries)
            .features)
        .enter()
        .append("path")
        .attr("d", path)
}

const getAges = function () {
    for (section of Object.keys(laureateData.laureates)) {
        console.log(laureateData.laureates[section])
        laureateData.laureates[section].prizes.forEach(prize => {
            if (laureateData.laureates[section].born != null) {
                let obj = {
                    year: prize.year,
                    age: prize.year - laureateData.laureates[section].born.substring(0, 4),
                    gender: laureateData.laureates[section].gender,
                }
                if(laureateData.laureates[section].gender === "female"){
                    femaleLaureates.push(obj)
                }else if(laureateData.laureates[section].gender === "male"){
                    maleLaureates.push(obj)
                }
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

const ageGraphControl = function () {

    let highlightFemale = document.getElementById("femaleCheck").checked
    document.getElementById("ageCol").innerHTML = ""
    // set the dimensions and margins of the graph
    let margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = +d3.select('#ageCol').style('width').slice(0, -2) - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

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

        if(document.getElementById("chemCheck").checked){
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
                .attr("r", function(d){
                    if(d.gender =="female" && highlightFemale){
                        return 3
                    }else if (highlightFemale){
                        return 1
                    }else{
                        return 1.5
                    }
                })
                .style("fill", "#69b3a2")
        }
    if(document.getElementById("medCheck").checked){
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
            .attr("r", function(d){
                if(d.gender =="female" && highlightFemale){
                    return 3
                }else if (highlightFemale){
                    return 1
                }else{
                    return 1.5
                }
            })
            .style("fill", "#b3454a")
    }
    if(document.getElementById("peaceCheck").checked){
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
            .attr("r", function(d){
                if(d.gender =="female" && highlightFemale){
                    return 3
                }else if (highlightFemale){
                    return 1
                }else{
                    return 1.5
                }
            })
            .style("fill", "#44b346")
    }
    if(document.getElementById("ecoCheck").checked){
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
            .attr("r", function(d){
                if(d.gender =="female" && highlightFemale){
                    return 3
                }else if (highlightFemale){
                    return 1
                }else{
                    return 1.5
                }
            })
            .style("fill", "#b35394")
    }
    if(document.getElementById("phyCheck").checked){
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
            .attr("r", function(d){
                if(d.gender =="female" && highlightFemale){
                    return 3
                }else if (highlightFemale){
                    return 1
                }else{
                    return 1.5
                }
            })
            .style("fill", "#1578b3")
    }
    if(document.getElementById("litCheck").checked){
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
            .attr("r", function(d){
                if(d.gender =="female" && highlightFemale){
                    return 3
                }else if (highlightFemale){
                    return 1
                }else{
                    return 1.5
                }
            })
            .style("fill", "#b37111")
    }

}

let genderSlider = document.getElementById("yearGenderSlider")
genderSlider.oninput = genderSliderControl

Array.from(document.getElementsByClassName("catCheck")).forEach((e => e.onchange = ageGraphControl))