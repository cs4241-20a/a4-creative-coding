const BOARD_PIXEL_SIZE = 640;
let supported

function main() {

    // Hook up buttons
    document.getElementById("stepButton").onclick = ()=>console.log("step");

    // Initialize canvas
    const canvas = document.getElementById('boardDisplay');

    // Check support for canvas
    if (canvas.getContext) {

        // Get render context
        let ctx = canvas.getContext('2d');

        // Draw grid
        for(let x = 0; x < BOARD_PIXEL_SIZE; x += 16) {
            for (let y = 0; y < BOARD_PIXEL_SIZE; y += 16) {
                ctx.strokeRect(x, y, 16, 16);
            }
        }

        // On click color selection
        canvas.addEventListener("click", (event)=>{
            let rect = canvas.getBoundingClientRect();

            let mouseX = Math.floor(event.clientX - rect.left);
            let mouseY = Math.floor(event.clientY - rect.top);

            console.log("Canvas clicked at: (" + mouseX + "," + mouseY + ")");
            ctx.beginPath();
            ctx.rect(Math.floor(mouseX / 16) * 16, Math.floor(mouseY / 16) * 16, 16, 16);
            ctx.fillStyle = "magenta";
            ctx.fill();
        })

    }

}