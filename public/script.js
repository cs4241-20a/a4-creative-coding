
// client-side js, loaded by index.html
// run by the browser each time the page is loaded

const app = {
  init() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    const cellArray = []
    const gridSize = 50
    const cellSize = 16
    const gridDimension = (cellSize * gridSize)
    let globalSpeed = 500
    let stop = false

    class Rule {
        constructor(count, type, on, off) {
            this.count = count;
            this.on = on
            this.off = off;
            if (type === 'Greater Than') {
                this.type = 0;
            }
            else if (type === 'Equal To') {
                this.type = 1;
            }
            else if (type === 'Less Than') {
                this.type = 2;
            } else {
                this.type = type
            }
        }
    }

    const rules = []
    
    rules.push(new Rule(3, 1, false, true))
    rules.push(new Rule(3, 0, true, false))
    rules.push(new Rule(2, 2, true, false))

    class Cell {
        constructor(x,y,state) {
            this.x = x
            this.y = y
            this.state = false
            this.neighborCount = 0
            this.neighbors = []
        }
        increment() {
            this.neighborCount++
        }

        decrement() {
            this.neighborCount--
        }
        stateChange() {
            this.state = !this.state
            if (this.state) {
                for (let i of this.neighbors) {
                    i.increment()
                }
                ctx.fillStyle = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
            } else {
                for (let i of this.neighbors) {
                    i.decrement()
                }
                ctx.fillStyle = '#888888'
            }
            ctx.fillRect(this.y*cellSize,this.x*cellSize,cellSize-1,cellSize-1)

        }
        pushNeighbor(neighbor) {
            this.neighbors.push(neighbor)
        }
    }

    initBoard()
    populateNeighbors()

    function initBoard() {
        ctx.fillStyle = '#888888'
        for (let i = 0; i < gridDimension; i += cellSize) {
            let tempArr = []
            for (let j = 0; j < gridDimension; j += cellSize) {
                ctx.fillRect(j,i,cellSize-1,cellSize-1)
                tempArr.push(new Cell(j/cellSize, i/cellSize, false))
            }
            cellArray.push(tempArr)
        }
    }

    function populateNeighbors() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                for (let x = -1; x < 2; x++) {
                    for (let y = -1; y < 2; y++) {
                        if (!(x === 0 && y === 0)) {
                            try {
                                let cell = cellArray[i + x][j + y]
                                if (typeof(cell) !== 'undefined') cellArray[i][j].pushNeighbor(cellArray[i+x][j+y])
                            } catch (error) {
                                continue
                            }
                        }
                    }
                }
            }
        }
    }

    function processGen() {
        let changedCells = []
        for (let cellArr of cellArray) {
            for (let cell of cellArr) {
                if ((!cell.state) && (cell.neighborCount === 0)) {
                    continue
                }
                let neighborCount = cell.neighborCount
                let state = cell.state
                for (let rule of rules) {
                    let onCheck = rule.on && state
                    let offCheck = rule.off && (!state)
                    switch( rule.type ) {
                        case (0):
                            if ((onCheck || offCheck) && (neighborCount > rule.count)) {
                                changedCells.push(cell)
                            }
                            break
                        case(1):
                            if ((onCheck || offCheck) && (neighborCount === rule.count)) {
                                changedCells.push(cell)
                            }
                            break
                        case(2): 
                            if ((onCheck || offCheck) && (neighborCount < rule.count)) {
                                changedCells.push(cell)
                            }
                            break   
                    }
                }
                // if (neighborCount === 3 && state === false) {
                //     changedCells.push(cell)
                // } else if (neighborCount > 3 && state === true) {
                //     changedCells.push(cell)
                // } else if (neighborCount < 2 && state === true) {
                //     changedCells.push(cell)
                // }
            }
        }
        return changedCells;
    }
    

    canvas.addEventListener('click', (event) => {
        let canvasLeft = canvas.offsetLeft + canvas.clientLeft
        let canvasTop = canvas.offsetTop + canvas.clientTop
        let cellLeft = event.pageX - canvasLeft
        let cellTop = event.pageY - canvasTop
        let cellIndex1 = Math.floor(cellLeft/cellSize)
        let cellIndex2 = Math.floor(cellTop/cellSize)
        let target = cellArray[cellIndex1][cellIndex2]
        let neighbors = target.neighbors
        target.stateChange()
    }, false)

    let done = true;

    canvas.addEventListener('mousedown', (event => {
        done = false;
    }))


    let target
    let lastIndex1 = -1
    let lastIndex2 = -1
    canvas.addEventListener('mousemove', (event => {
        if (!done) {
            let canvasLeft = canvas.offsetLeft + canvas.clientLeft
            let canvasTop = canvas.offsetTop + canvas.clientTop
            let cellLeft = event.pageX - canvasLeft
            let cellTop = event.pageY - canvasTop
            let cellIndex1 = Math.floor(cellLeft/cellSize)
            let cellIndex2 = Math.floor(cellTop/cellSize)
            target = cellArray[cellIndex1][cellIndex2]
            if ((cellIndex1 !== lastIndex1) || (cellIndex2 !== lastIndex2)) {
                lastIndex1 = cellIndex1
                lastIndex2 = cellIndex2
                target.stateChange()
            }
        }
    }))
    
    canvas.addEventListener('mouseup', (event => {
        done = true;
    }))

    document.getElementById('NextGen').addEventListener('click', (event => {
        let changedCells = processGen()
        for (let cell of changedCells) {
            cell.stateChange()
        }
    }));

    let state = false;

    document.getElementById('Play').addEventListener('click', (event => {
        console.log(rules)
        if (state === false) {
            state = true
            document.getElementById('Play').innerHTML = 'Pause'
        } 
        else {
            state = false
            document.getElementById('Play').innerHTML = 'Play'
        }
        function generate () {
            setTimeout (() => {
                if (state) {
                    let changedCells = processGen()
                    for (let cell of changedCells) {
                        cell.stateChange()
                    }
                    window.requestAnimationFrame(generate)
                }
            }, (1000 - globalSpeed))
        }
        window.requestAnimationFrame(generate)
        
    }))

    document.getElementById('speedRange').addEventListener('mouseup', () => {
        globalSpeed = document.getElementById('speedRange').value
        console.log(globalSpeed)
    })

    document.getElementById("Clear").addEventListener('click', (event => {
        stop = true;
        for (let cellArr of cellArray) {
            for (let cell of cellArr) {
                if (cell.state) {
                    cell.stateChange();
                }
            }
        }
    }))

    for (let i = 0; i < rules.length; i++) {
        let li = document.getElementById(`rule${i}`)
        li.addEventListener('click', (event => {
            li.parentNode.removeChild(li)
            if (rules.length > 1) {
                rules.splice(i, i+1)
            } else {
                rules.shift()
            }
            console.log(rules)
        }))
    }

    document.getElementById("submit").addEventListener('click', (event => {
        event.preventDefault()
        let count = parseInt(document.getElementById("numNeighbors").value)
        let state = document.getElementById("stateCheck").value
        let type = document.getElementById("checkType").value
        let typeText; 
        let checkText;
        let on
        let off
        console.log("state ", state, typeof(state))
        if (state === "0") {
            on = false
            off = true
            checkText = 'off'
        } else if (state === "1") {
            on = true
            off = false
            checkText = 'on'
        } else if (state === "2"){
            on = true
            off = true
            checkText = 'on or off'
        }
        let rule = new Rule(count, type, on, off)
        if (rule.type === 0) {
            typeText = "greater than"
        } else if (rule.type === 1) {
            typeText = ""
        } else {
            typeText = "less than"
        }
        let isDuplicate = false
        if (rules.length > 0) {
            for (let x of rules) {
                if (rule.count === x.count && rule.type === x.type && rule.on === x.on && rule.off === x.off) {
                    isDuplicate = true
                    break
                }
            }
        }
        console.log(rule)
        if (!isDuplicate) {
            rules.push(rule)
            let ul = document.getElementById("ruleList")
            let li = document.createElement("li")
            li.setAttribute("id", `rule${rules.length}`)
            li.setAttribute("class", "list-group-item bg-primary text-white")
            li.appendChild(document.createTextNode(`A cell will change when it has ${typeText} ${count} neighbors and is ${checkText}`))
            ul.appendChild(li);
            li.addEventListener('click', (event => {
                li.parentNode.removeChild(li)
            }))
        }
    }))
  }
}
window.onload = () => app.init()
window.alert("Welcome to the Game of Life! \n \n DRAWING \n Hold down the left mouse button or click on the grid to change cell color. \n \n RULES \n To add rules, follow the form at the bottom of the page. \n To remove existing rules, just click on the rule to the right of the grid. \n \n PLAYING \n To run, just hit the play button in the top bar. \n Upon clicking, it will become a pause button to pause the animation \n Animation speed may be controlled with the slider to the right of the Animation Speed Block. \n \n REVIEW \n To review this help dialogue, please click the rightmost button on the top bar.");


