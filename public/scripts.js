const reqString = "http://api.nobelprize.org/v1/laureate.json"
let laureateData  = null


window.onload = function(){
    d3.json(reqString, function (data){
        laureateData = data
    })
}


