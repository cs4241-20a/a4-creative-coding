const express = require('express')
const WebSocket = require('ws')
const { v4: uuidv4 } = require('uuid')
const app = express()
app.set('view engine', 'ejs');
const port = process.env.PORT || 3000

// Used to unset interval when game ends.
var loop;

// WebSocket server
const wss = new WebSocket.Server({port: 8000})

var words = ["chef", "mutton", "bear", "truck", "car", "tree", "fish", "building", "house", "snake"]

const ROUND_LENGTH = 15

// Set up initial game state
var game = {
    players: [],
    leader: null,
    nowDrawingIdx: 0,
    answerIdx: 0,
    correctPlayers: [],
    timeLeft: ROUND_LENGTH,
    started: true,
}

// NODE SERVER
app.use(express.static("public"))

app.get('/', (req, res) => {
    res.render("index", {title: "Home"})
})

// Start game
app.post('/game/start/', (req, res) => {

})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

// WEBSOCKET
var messages = []

wss.on('connection', (ws) => {
    // Generate unique ID and add to list of clients
    var client_id = uuidv4();

    console.log("New client connected!")
    console.log("Total clients connected: %d", wss.clients.size)

    for(let i = 0; i < messages.length; i++) {
        ws.send(messages[i])
    }

    ws.on('message', (message) => {
        const obj = JSON.parse(message)
        
        if(obj["command"] === "NEW_PLAYER") {
            // Add new player to game state and send unique ID to client
            const isLeader = game.players.length < 1

            const player = {
                id: client_id,
                socket: ws,
                name: obj.name,
                leader: isLeader,
                correct: 0,
                score: 0,
            }

            game.players.push(player);

            ws.send(JSON.stringify({
                command: "ID",
                id: client_id,
                isLeader: isLeader,
            }))

            if(isLeader) {
                game.leader = player;
            }

            console.log("Registered new player!")
            console.log("Playername: %s", obj.name)

            var players = game.players.map(p => {
                return {name: p.name, correct: p.correct};
            })

            sendToClients(
                JSON.stringify({
                    command: "UPDATE_PLAYERS",
                    players: players
                })
            )
        }
        
        // Start game
        else if(obj.command === "START" && obj.id === game.leader.id) {
            console.log("Game starting!")
            tick();
            sendWordToClients();
            enableDrawing(game.players[game.nowDrawingIdx].id)
            loop = setInterval(gameLoop, 1000);
        }

        else if(obj.command === "GUESS" && game.started) {
            const player = game.players.find(p => p.id === obj.id);

            // Don't let leader guess & don't let players guess more than once
            if(game.players[game.nowDrawingIdx] === player || game.correctPlayers.includes(player)) {
                return;
            }

            // Correct guess
            else if(obj.guess === words[game.answerIdx]) {
                player.correct++;
                game.correctPlayers.push(player);
                sendToClients(JSON.stringify(
                    {
                        command: "CORRECT",
                        name: player.name,
                        correct: player.correct
                    }
                ))
            }
            // Incorrect guess
            else {
                sendToClients(JSON.stringify(
                    {
                        command: "GUESS",
                        name: player.name,
                        guess: obj.guess
                    }
                ))
            }

            console.log("Player %s guessed: %s", player.name, obj.guess);
        }

        // Check that clear command has authority to do so, then send to all clients
        else if(obj["command"] === "CLEAR" && obj["id"] === game.players[game.nowDrawingIdx].id) {
            messages = [];
            sendToClients(JSON.stringify({command: "CLEAR"}))
            return;
        }

        // Check that draw command has authority to do so, then send to all clients
        else if(obj["command"] === "DRAW" && obj["id"] === game.players[game.nowDrawingIdx].id) {
            console.log("Sending draw!")
            messages.push(message);
            sendToClients(message);
        }
    })

    ws.on('close', () => {
        console.log("Client disconnected!")
        console.log("Total clients connected: %d", wss.clients.size)
    })
})

// Send given message to all clients.
function sendToClients(msg) {
    wss.clients.forEach((c) => {
        if(c.readyState === WebSocket.OPEN) {
            c.send(msg)
        }
    })
}

// Send given message ONLY to individual client.
function sendToClient(id, msg) {
    var sock = game.players.find( p => p.id === id).socket
    if(sock.readyState === WebSocket.OPEN) {
        sock.send(msg)
    }
}

// Get word, blanked out except for specified position
function getBlankedWord(word, revealLetters=[]) {
    console.log("Word: %s", word)
    let blankedWord = "_".repeat(word.length);
    for(let i = 0; i < revealLetters.length; i++) {
        let idx = revealLetters[i]
        blankedWord = blankedWord.substring(0, idx) + word[idx] + blankedWord.substring(idx+1)
    }
    return blankedWord;
}

// Disables drawing for all players, then enables drawing for specified player
function enableDrawing(id) {
    sendToClients(JSON.stringify(
        {
            command: "DISABLE_DRAW"
        }
    ));
    console.log("LETTING CLIENT %s DRAW", id)
    sendToClient(id, JSON.stringify(
        {
            command: "ENABLE_DRAW"
        }
    ))
}

// Sends word to clients
function sendWordToClients() {
    // Send blanked word to all clients
    sendToClients(JSON.stringify({
        command: "WORD",
        word: getBlankedWord(words[game.answerIdx]),
    }))

    // Send full word to client drawing
    sendToClient(game.players[game.nowDrawingIdx].id, JSON.stringify({
        command: "WORD",
        word: words[game.answerIdx],
        nowDrawing: true
    }))
}

// Updates clients with time left in round
function tick() {
    sendToClients(JSON.stringify({
        command: "TICK",
        timeLeft: game.timeLeft
    }))
}

function endGame() {
    // Reset values
    game.started = false;
    game.answerIdx = 0;
    game.nowDrawingIdx = 0;
    game.timeLeft = 15;
    game.correctPlayers = [];
    clearInterval(loop);
    sendToClients(JSON.stringify({
        command: "GAME_OVER"
    }))
}

// Actual gameplay loop. Starts when leader hits start.
const gameLoop = function() {
    game.timeLeft--;
    console.log(game.timeLeft);
    tick();
    // Check length -1 because currently drawing player doesn't get to guess
    if(game.correctPlayers.length === game.players.length - 1 || game.timeLeft === 0) {
        if(game.answerIdx === words.length - 1) {
            endGame();
        }
        else {
            // Go to next question
            nextQuestion();
        }
    }
}

// Setup gamestate for new question
function nextQuestion() {
    game.correctPlayers = []
    game.answerIdx++;
    game.timeLeft = ROUND_LENGTH;
    game.nowDrawingIdx = (game.nowDrawingIdx + 1) % game.players.length;
    sendToClients(JSON.stringify({command: "CLEAR"}));
    sendWordToClients();
    enableDrawing(game.players[game.nowDrawingIdx].id);
}