let c = 5; // speed of light

let TrueSpawnRate = 0.03;


let framecount = 0;
let Kframecount = 0;
let framecounting = false;
let frameInterval;

let button1 = document.getElementById("play-button")
let button2 = document.getElementById("adjust-c")

function calculateFrames() {
    framecounting = true;
    frameInterval = setTimeout(frameStop, 1000)
    button1.style.display = "none"
    button2.style.display = "none"

    loopF()
}

function loopF() {
    framecount++
    if (!framecounting || framecount == -1) return;
        else  setTimeout(loopF, 0)
}

function frameStop() {
    framecounting = false
    console.log(framecount, Kframecount)
    button1.style.display = "block"
    button2.style.display = "block"
    framecount = 0;
}
