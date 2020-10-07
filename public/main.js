const BOARD_PIXEL_SIZE = 640;
const CELL_PIXEL_SIZE = 16;
const TOTAL_ROWS = BOARD_PIXEL_SIZE / CELL_PIXEL_SIZE;
const TOTAL_COLUMNS = TOTAL_ROWS;
const SHOW_GRID = true; //TODO Add a button for this

function main() {

    // Hook up buttons
    document.getElementById("stepButton").onclick = startSimulation;

    // Initialize canvas
    const canvas = document.getElementById('boardDisplay');

    // Initialize array with Zeroes
    let boardArray = Array(TOTAL_ROWS).fill(0).map(() => Array(TOTAL_ROWS).fill(0));


    // Check support for canvas
    if (!canvas.getContext) {
        return;
    }

    // Get render context
    let ctx = canvas.getContext('2d');
    redrawBoardDisplay(boardArray);

    // On click color selection
    canvas.addEventListener("click", (event) => {
        let rect = canvas.getBoundingClientRect();

        let mouseX = Math.floor(event.clientX - rect.left);
        let mouseY = Math.floor(event.clientY - rect.top);

        boardArray[Math.floor(mouseX / CELL_PIXEL_SIZE)][Math.floor(mouseY / CELL_PIXEL_SIZE)] = 1;
        redrawBoardDisplay(boardArray);
    })

    // update display with array for next cycle
    function redrawBoardDisplay(updatedArray) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // loop through array and color if cell is alive
        for (let r = 0; r < TOTAL_ROWS; r++) {
            for (let c = 0; c < TOTAL_ROWS; c++) {

                if (updatedArray[r][c] === 1) {
                    ctx.fillStyle = "#b533cc";
                    ctx.fillRect((r * CELL_PIXEL_SIZE), (c * CELL_PIXEL_SIZE), CELL_PIXEL_SIZE, CELL_PIXEL_SIZE);
                }

                // Draw grid
                if (SHOW_GRID) {
                    ctx.strokeStyle = "#ababab";
                    ctx.strokeRect((r * CELL_PIXEL_SIZE), (c * CELL_PIXEL_SIZE), CELL_PIXEL_SIZE, CELL_PIXEL_SIZE);
                }
            }
        }
    }

    // Starts the simulation based on what exists in the canvas
    function startSimulation(e) {
        e.preventDefault();
        setInterval(runGeneration, 500);
    }

    // execute one cycle of the simulation
    // note: unfortunately this function cannot be combined with redrawBoardDisplay as it would prevent live updating via mouse click
    function runGeneration() {

        // must maintain a separate array of results to avoid conflicts during iteration
        let newBoardArray = Array(TOTAL_ROWS).fill(0).map(() => Array(TOTAL_ROWS).fill(0));

        for (let r = 0; r < TOTAL_ROWS; r++) {
            for (let c = 0; c < TOTAL_ROWS; c++) {
                newBoardArray[r][c] = cellStatus(r,c);
            }
        }

        boardArray = newBoardArray;
        redrawBoardDisplay(boardArray);
    }

    // Evaluates the status of a single cell based on Conway's rules
    function cellStatus(r, c) {
        let lookups = [[0,1], [1,1], [1,0], [1,-1], [0,-1], [-1,-1], [-1,0], [-1,1]];
        let totalNeighbors = 0;

        lookups.forEach((entry)=>{
            let neighborRow = r + entry[1];
            let neighborCol = c + entry[0];

            if (neighborRow > TOTAL_ROWS - 1 || neighborRow < 0 || neighborCol > TOTAL_ROWS - 1 || neighborCol < 0) {
                return; //Outside of bounds
            }

            if (boardArray[neighborRow][neighborCol] === 1) {
                totalNeighbors++;
            }
        });

        if (boardArray[r][c] === 1 && totalNeighbors < 2) {
            return 0;
        }
        else if (boardArray[r][c] === 1 && totalNeighbors > 3) {
            return 0;
        }
        else if (boardArray[r][c] === 0 && totalNeighbors === 3) {
            return 1;
        }
        else {
            return boardArray[r][c];
        }

    }
}
