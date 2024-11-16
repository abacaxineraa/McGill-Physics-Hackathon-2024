// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


let monsters = [];

// Function to spawn monsters outside the frame
function spawnMonster() {
    // Only spawn a monster if the number of monsters is less than 5
    if (monsters.length >= 5) return;

    // Random position outside the player's current view
    let spawnX = player.x + (Math.random() * 800 - 400);  // Spawn outside the screen on X-axis
    let spawnY = player.y + (Math.random() * 800 - 400);  // Spawn outside the screen on Y-axis

    // Random size for the monster
    let size = Math.random() * 40 + 20;
    
    // Random velocity for the monster (to make them move)
    let vx = Math.random() * 2 - 1; // Random velocity between -1 and 1
    let vy = Math.random() * 2 - 1; // Random velocity between -1 and 1
    
    let hp = true;
    
    // Random glow effect for the monster
    let glow = Math.random() < 0.5;
    let ran = Math.random() * Math.min(canvas.height/2, canvas.width/2) + 2.5 * Math.min(player.w, player.h)
    
    // Create a new monster and add it to the monsters array
    monsters.push(new Monsters(spawnX, spawnY, vx, vy, size, size, hp, glow, ran));
    // console.log("here!")
}





// Player and camera settings
const smoothness = 0.1; // Smoothness for camera movement (lower is smoother but slower)

let cameraX = canvas.width/2;
let cameraY = canvas.height/2;

arrayBox=[]
arrayBox.push(new Box(300, 200, 100))
arrayBox.push(new Box(400, 200, 50))

function spawnRandomBox() {
    const randomX = player.x + (Math.random() * 400 - 200); // Random x within ±200 pixels of player
    const randomY = player.y + (Math.random() * 400 - 200); // Random y within ±200 pixels of player
    const randomSize = Math.random() * 50 + 20; // Random size between 20 and 70
    arrayBox.push(new Box(randomX, randomY, randomSize));
}




// setting up player
let player = new Player(canvas.width/2, canvas.height/2, 60, 60, 0, 0, 0.25, 0.25, true)
let aimer = new Aimer(0, 30, 10)
// Math functions
function dist(x1, y1, x2, y2){
    return (Math.sqrt((x1-x2)**2 + (y1-y2)**2))
}


// Time functions
let maxtime = 10 // multiplier for the max seconds -- implies that 10 seconds is the maxtime
function getRandInt(){
    return Math.floor(Math.random() * maxtime);
}

function increment(){
    myint -= 1
    console.log(myint)

    if(myint <= 0){
        clearInterval(myInterval);
    }
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
        dx /= length;
        dy /= length;

        // Update player position with normalized speed
        if (Math.abs(player.vx) < 3) player.vx += dx * player.ax;

        if (Math.abs(player.vy) < 3) player.vy += dy * player.ay;

    
        
        if (Math.random() < 0.2) {  // 20% chance to spawn a monster after every move
            spawnMonster();
        }
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
let c = 5; // speed of light

let photons = []

function shoot(){
    let shootVX = c * Math.cos(aimer.angle);
    let shootVY = c * Math.sin(aimer.angle);  
    let shootR = Math.min(canvas.width/2,canvas.height/2);
    photons.push(new Photons(aimer.x + aimer.w * Math.cos(aimer.angle), aimer.y + aimer.w * Math.sin(aimer.angle),5,5,shootVX,shootVY,shootR));

}


// Update the camera position smoothly
function updateCamera() {
    cameraX = lerp(cameraX, player.x, smoothness);
    cameraY = lerp(cameraY, player.y, smoothness);
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
    
    // console.log(canvas.width / 2 + player.x - cameraX - player.w / 2)
}



// Start the game loop after the sprite sheet is loaded
spriteSheet.onload = () => {
    updateGame();
};


function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateCamera();

    // Draw the sprite and other player elements
    drawSprite(player);


    //drawPlayer();
    aimer.draw();
    for(i=0; i < arrayBox.length; i++){

        arrayBox[i].draw();

    }
    
    // Draw the monsters
    for(i=0; i < monsters.length; i++){
        monsters[i].move();
        monsters[i].draw();


        
    }
    
    // Check photons
    photons = photons.filter(checkRange);


    function checkRange(photon) {
        return photon.ran >= 0;
    }

    // Draw the photons
    for(i = 0; i < photons.length; i++){
        photons[i].draw();
        photons[i].move();
        
    }
    
    // Request the next animation frame
    requestAnimationFrame(updateGame);
}

// Listen for key presses to move the player
document.addEventListener('keydown', movePlayer);
canvas.addEventListener('mousemove', moveAim);


var myint = getRandInt();
console.log(myint);
myInterval = setInterval(increment,1000);

// Start the game loop
updateGame();
