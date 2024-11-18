// Game setup

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scale = 1.4;

let photons = []
let redphotons = []


// Function to resize canvas to fit the window
function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Resize canvas on window load and resize
window.addEventListener('resize', resizeCanvas);
resizeCanvas(canvas);


let spawnRate = TrueSpawnRate
let monsters = [];
let monstersKilled = 0;
let id=0;

function findId(anId) {
    for (i=0; i<monsters.length; i++){
        if (monsters[i].id == anId) return monsters[i]
    }
    return (new Monsters(0,0,0,0,0,0,0,0,0,-10,0,0))
}

// Function to spawn monsters outside the frame
function spawnCreature(maxCreature, object) {
    if (object.length <= Math.round(maxCreature + 10 * spawnRate)) {

    // Random position outside the player's current view
    let spawnX = player.x + ((-1)**Math.floor(2*Math.random())) * (Math.random() * 3 + 3) * player.w;  // Spawn on X-axis (some dist from player)
    let spawnY = player.y  + ((-1)**Math.floor(2*Math.random())) * (Math.random() * 3 + 3) * player.h;  // Spawn on Y-axis

    // Random size for the monster
    let tempSize = Math.min(canvas.width, canvas.height)
    let size = Math.random() * tempSize/10 + tempSize/32;
    
    // Random velocity for the monster (to make them move)
    let vx = Math.random() * 1.8 - 1; 
    let vy = Math.random() * 1.8 - 1; 

    
    let hp = true;
    
    // Random glow effect for the monster
    let glow = Math.random() < 0.5;
    let ran = (1-spawnRate) * Math.random() * Math.min(canvas.height/6, canvas.width/6) + 2.5 * Math.min(player.w, player.h)
    

    let maxtime = 5
    let time = Math.round(2 + Math.random()*(maxtime-2)) // multiplier for the max seconds -- implies that 5 seconds is the maxtime
    if (object == monsters) {
        object.push(new Monsters(spawnX, spawnY, vx, vy, size, size, hp, glow, ran, time, null, id));
        object[object.length-1].interval = setInterval(increment,1000,id);
        id++
        console.log(id)
	}
}
}


function increment(smt){
    let tempMonst = findId(smt)
    tempMonst.t -= 1
    
    if(tempMonst.t <= 0 && tempMonst.t > -5){
        tempMonst.glow = (tempMonst.glow == false)
        let maxtime = 5
        let time = Math.round(2 + Math.random()*(maxtime-2)) 
        tempMonst.t = time
        clearInterval(tempMonst.interval);
        tempMonst.interval = setInterval(increment, 1000, smt)
    }
}





// Player and camera settings
const smoothness = 0.1; // Smoothness for camera movement (lower is smoother but slower)

let cameraX = canvas.width/2;
let cameraY = canvas.height/2;




// setting up player
let player = new Player(canvas.width/2, canvas.height/2, 60, 60, 0, 0, 0.003* c, 0.003*c, true)
let aimer = new Aimer(0, 30, 10)

let IRF = player;




// Math functions
function dist(x1, y1, x2, y2){
    return (Math.sqrt((x1-x2)**2 + (y1-y2)**2))
}

function collision(obj1, obj2){
    return (Math.abs(obj1.x - obj2.x) <= (obj1.w/2 + obj2.w/2) && // Distance between x-coordinates <= Sum of half-widths
            Math.abs(obj1.y - obj2.y) <= (obj1.h/2 + obj2.h/2)) // Distance between y-coordinates <= Sum of half-heights  
}


// Time functions
let maxtime = 10 // multiplier for the max seconds -- implies that 10 seconds is the maxtime
function getRandInt(){
    return Math.floor(Math.random() * maxtime);
}





let keysPressed = {}; // Tracks keys that are currently pressed

document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
    movePlayer();
});

document.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});


canvas.addEventListener('click',shoot);

function movePlayer() {
    let dx = 0;
    let dy = 0;

    // Check the keys that are currently pressed and set dx and dy accordingly
    if (keysPressed['ArrowUp'] || keysPressed['w'] || keysPressed['W']) dy = -1;
    if (keysPressed['ArrowDown'] || keysPressed['s'] || keysPressed['S']) dy = 1;
    if (keysPressed['ArrowLeft'] || keysPressed['a'] || keysPressed['A']) dx = -1;
    if (keysPressed['ArrowRight'] || keysPressed['d'] || keysPressed['D']) dx = 1;
    
    // Normalize the movement vector if both x and y directions are active
    
    if (dx !== 0 || dy !== 0) {
        const length = Math.sqrt(dx * dx + dy * dy);
        let speed = Math.sqrt(player.vx ** 2 + player.vy ** 2)
        dx /= length;
        dy /= length;

        // Update player position with normalized speed
        if (speed < 0.8 * c) player.vx += dx * player.ax * Math.exp(1.1, -player.vx);

        if (speed < 0.8 * c) player.vy += dy * player.ay * Math.exp(1.1, -player.vy);

    
        
        
    }
    
}


// Smooth interpolation (lerp) for the camera to follow the player
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Draw the player
function drawPlayer() {
    ctx.fillStyle = '#007bff';
    ctx.fillRect(canvas.width/2  + player.x - cameraX - player.w/2, canvas.height/2 + player.y - cameraY - player.h/2, player.w, player.h); // Adjust for camera
    
    
 
    ctx.fillRect(canvas.width/2  + player.x - cameraX + 30*Math.cos(aimer.angle) -5 , canvas.height/2 + player.y - cameraY + 30*Math.sin(aimer.angle) - 5, 10, 10); // Adjust for camera
       
}


// Draw and update aimer()
function moveAim(event){
    let trueX = canvas.width/2 + player.x -cameraX
    let trueY = canvas.height/2 + player.y -cameraY
    if (event.offsetX >= (trueX)){
        aimer.angle = Math.atan((event.offsetY - trueY)/(event.offsetX - trueX))
    } else if (event.offsetX < trueX){
        aimer.angle = (Math.atan((event.offsetY - trueY)/(event.offsetX - trueX)) + Math.PI)
    }
}

// Setting up photons

function shoot(){
    if (photons.length < 4){
    let shootVX = c * Math.cos(aimer.angle);
    let shootVY = c * Math.sin(aimer.angle);  
    let shootR = Math.min(canvas.width/2,canvas.height/2);
    photons.push(new Photons(aimer.x + aimer.w * Math.cos(aimer.angle), aimer.y + aimer.w * Math.sin(aimer.angle),
        5,5,shootVX,shootVY,shootR, "blue"));
    }
}

function redshoot(monster, target){
    let followAngle;
    if (target.x >= monster.x){
        followAngle = Math.atan((target.y - monster.y)/(target.x - monster.x))
    } else if (player.x < monster.x){
        followAngle = Math.atan((target.y - monster.y)/(target.x - monster.x)) + Math.PI
    }
    followAngle += Math.PI/20 - Math.random() * Math.PI/10 // Variety in Shooting
    let shootVX = c * Math.cos(followAngle);
    let shootVY = c * Math.sin(followAngle);  
    let shootR = Math.min(canvas.width,canvas.height);
    redphotons.push(new Photons(monster.x, monster.y, 5,5,shootVX,shootVY,shootR, "red"));
    
}


// Update the camera position smoothly
function updateCamera() {
    cameraX = lerp(cameraX, IRF.x, smoothness);
    cameraY = lerp(cameraY, IRF.y, smoothness);
}





// Sprite animation setup
const spriteSheet = new Image();
spriteSheet.src = "./img/Slime_Medium_Green copy.png"; // Path to your sprite sheet

// Sprite properties from png file
const spriteWidth = 128; // Width of each frame
const spriteHeight = 128; // Height of each frame
const totalFrames = 4; // Total number of frames in the idle animation
let currentFrame = 0; // Track the current frame
const frameRate = 10; // Frames per second
let frameTimer = 0; // Timer for frame updates

// Define the starting row for the sprite png
const animationRow = 2; // 0-based index for the third row
const sourceY = animationRow * spriteHeight; // Y position in the sprite sheet

// Sprite animation function
function drawSprite(player) {
    player.move()

    // Update frame timer
    frameTimer++;
    if (frameTimer >= 60 / frameRate) {
        currentFrame = (currentFrame + 1) % totalFrames; // Loop through frames
        frameTimer = 0;
    }
    
// Calculate the player's position relative to the camera
   const drawX = canvas.width / 2 + (player.x - cameraX) - spriteWidth / 2;
   const drawY = canvas.height / 2 + (player.y - cameraY) - spriteHeight / 2;

    // Draw the sprite at the player's position
    ctx.drawImage(
        spriteSheet,
        currentFrame * spriteWidth, // Source X position
        sourceY, // Source Y position (calculated from the row)
        spriteWidth,
        spriteHeight,
        canvas.width / 2 + player.x - cameraX - player.w / 2, // Center on the canvas
        canvas.height / 2 + player.y - cameraY - player.h / 2, // Center on the canvas
        player.w,
        player.h
    );
}




function updateGame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateCamera();
    updateBackground(IRF);

    // Inside updateGame function:
    player.draw(ctx, player.spriteSheet, cameraX, cameraY, canvas);
    aimer.draw();
    if (Math.random() < spawnRate) spawnCreature(5, monsters)
    
    calculateRelativeSpeed(IRF);
    displayKills();
    
    // Draw the monsters
    for(i=0; i < monsters.length; i++){
        monsters[i].move();
        monsters[i].draw(IRF);        
    }



    // Check photons
    photons = photons.filter(checkRange);
    redphotons = redphotons.filter(checkRange);


    function checkRange(photon) {
        return photon.ran >= 0;
    }
    
    // Draw the photons
    for(i = 0; i < photons.length; i++){
        photons[i].draw();
        photons[i].move(IRF);
    }
    for(i = 0; i < redphotons.length; i++){
        redphotons[i].draw();
        redphotons[i].move(IRF);  
    }


    // Check monsters-photons
    monsters = monsters.filter(checkCollision);
    function checkCollision(monster){
        for (i = 0; i < photons.length; i++){
            if (collision(monster, photons[i]) && monster.glow) {
                if (monster === IRF) {
                    IRF = player;
                }
                monstersKilled++

                clearInterval(monster.interval)
                if (spawnRate < 1) {spawnRate *= 1.05}
                if (Math.random() < Math.min(10*spawnRate, 1)) {redshoot(monster, player)}
                return false

            }
        }
        return true
    }

    // Check monsters-player
    if (monsters.length != 0) {
        for (i=0; i < monsters.length; i++){
            if (collision(player, monsters[i])) endGame();
        }
    }

    // Check player - redphotons
    if (redphotons.length != 0){
        for (i=0; i<redphotons.length; i++){
            if (collision(redphotons[i], player)){
                if (monsters.length != 0){
                    let smallest = dist(monsters[0].x, monsters[0].y, player.x, player.y)
                    let temp = 0
                    for (j=0; j < monsters.length; j++) {
                        if (dist(monsters[j].x, monsters[j].y, player.x, player.y) <= smallest ) temp = j
                    }
                    IRF = monsters[temp]
                }
            }
        }
    }

    


    // Request the next animation frame
    requestAnimationFrame(updateGame);
}
function displayKills(){
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Monsters Killed: ${monstersKilled}`, canvas.width - 175, 30);

}
// Get the elements
const welcomeScreen = document.getElementById('welcome-screen');
const playButton = document.getElementById('play-button');

canvas.style.display = 'none' // So it is not visible initially!

// Game initialization function (you can replace this with your actual game setup)
function startGame() {
    // Fade out the welcome screen
    welcomeScreen.style.opacity = 0;
    
    // After the fade-out is complete, hide the welcome screen and show the canvas
    setTimeout(() => {
        welcomeScreen.style.display = 'none'; // Hide the welcome screen
        canvas.style.display = 'block';   // Show the game canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        updateGame(); // Start the game loop
    }, 500); // Duration of the fade-out effect (0.5s)

    updateGame()
}

// Set up the Play button to start the game
playButton.addEventListener('click', startGame);

function endGame() {
    // Hide the game canvas
    canvas.style.display = 'none';

    // Show the end screen with fade-in effect
    const endScreen = document.getElementById('end-screen');
    document.getElementById("play-again-button").innerText = "Play Again (Score:  " + monstersKilled + ")"
    endScreen.style.opacity = 1;
    endScreen.style.display = 'flex'; // Ensure it's visible
}

// Set up the Play Again button
const playAgainButton = document.getElementById('play-again-button');

playAgainButton.addEventListener('click', () => {
    // Fade out the end screen
    const endScreen = document.getElementById('end-screen');
    endScreen.style.opacity = 0;

    // After fade-out, restart the game by calling startGame
    setTimeout(() => {
        // Hide the end screen
        endScreen.style.display = 'none';

        // Reset the game elements (reset player position, score, etc.)
        resetGame();

        // Show the canvas and start the game
        canvas.style.display = 'block';
        updateGame();  // Restart the game loop
    }, 1500); // Fade-out duration (matches the CSS transition)
});

function resetGame() {    //CAN SOMEONE FIX THIS RESETGAME FUNCTION PLZ THANKS
    // Reset the player's state
    
    player = new Player(canvas.width/2, canvas.height/2, 60, 60, 0, 0, 0.003 * c, 0.003*c, true)
    aimer = new Aimer(0, 30, 10);
    IRF = player;

    // Reset any other game variables, such as monsters, score, camera, etc.
    monsters = [];
    monstersKilled = 0;
    spawnRate = TrueSpawnRate;
    cameraX = canvas.width/2;
    cameraY = canvas.height/2;
}

// Listen for key presses to move the player
document.addEventListener('keydown', movePlayer);
canvas.addEventListener('mousemove', moveAim);




