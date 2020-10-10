var ctx, audio, canvas2, colorSelect
let audioContext, analyser, source, frequencyBin, hexCode
var timeStamp = 0
const input = document.querySelector('input[type="file"]')
audio = new Audio()
//initialize the canvas
window.onload = function (){

    colorSelect = document.getElementById("colorSelect")
    hexCode = "#ff0000"

    var canvas1 = document.getElementById('canvas1');
    canvas1.width = window.innerWidth;
    canvas1.height = window.innerHeight;
    // document.body.appendChild(canvas1);
    ctx = canvas1.getContext('2d');
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas1.width, canvas1.height);

    canvas2 = document.getElementById('canvas2');
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight*3/5;
    // document.body.appendChild(canvas2);
    alert("You can upload any audio and display it. Remember that only .ogg and .mp3 works." +
        "You may pause, resume or replay the audio as you want, and you can also set the audio on a loop" +
        " or stop the loop. There are three colors for you to choose to visualize the audio, the " +
        "red, the orange and the green")


    input.addEventListener('change', function (e){
        const reader = new FileReader()
        reader.readAsDataURL(input.files[0])
        var src = window.URL.createObjectURL(input.files[0])
        console.log(src)
        audio.src = src
        audio.play()

        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048
        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        // var frequencyBin = new Uint8Array(analyser.frequencyBinCount)
        // console.log(frequencyBin)
    }, false)

    if (audio.currentTime >= audio.duration){
        timeStamp = 0
    }



    render()
}

//open local music files and play it




function render(){
    requestAnimationFrame(render);
    colorSelect.onchange = (event) => {
        var inputText = event.target.value;
        if (inputText === "1"){
            hexCode = "#ff0000"
        }
        if (inputText === "2"){
            hexCode = "#ffa500"
        }
        if (inputText === "3"){
            hexCode = "#33ffc6"
        }
    }
    if (analyser && analyser.frequencyBinCount) {
        frequencyBin = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(frequencyBin);
        // console.log(frequencyBin)

        var ctx2 = canvas2.getContext('2d');
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
        ctx2.fillStyle = hexCode

        for (var i = 0; i < 1024; i++) {
            ctx2.fillRect(20+20*i, canvas2.height - frequencyBin[i] *1.2, 10, canvas2.height)
            ctx2.strokeRect(20+20*i, canvas2.height - frequencyBin[i] * 1.2, 10, canvas2.height)
        }

    }
}

var isPlaying = 0
function musicState(){
    timeStamp = audio.currentTime
    audio.pause()
    isPlaying = 1
}

function resuMe(){
    if (isPlaying === 1) {
        audio.currentTime = timeStamp
        audio.play()
        isPlaying = 0
    }
}

function replay(){
    audio.currentTime = 0
    audio.play()
    isPlaying = 0
}

var ifLoop = 1
function setLoop(){
    if (ifLoop === 1) {
        audio.loop = true
        ifLoop = 0
    }
    else {
        audio.loop = false
        ifLoop = 1
    }
}

function help(){
    alert("You can upload any audio and display it. Remember that only .ogg and .mp3 works." +
        "You may pause, resume or replay the audio as you want, and you can also set the audio on a loop" +
        " or stop the loop. There are three colors for you to choose to visualize the audio, the " +
        "red, the orange and the green")
}