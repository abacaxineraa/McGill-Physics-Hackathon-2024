// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scale = 1.4;

let monsters = [];
let spawnRate = 0.03;

// Function to spawn monsters outside the frame
function spawnMonster() {
    // Only spawn a monster if the number of monsters is less than 5
    if (monsters.length >= Math.round(5 + 10 * spawnRate)) return;

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
    let t = getRandInt();
    console.log(t)

    // myInterval = setInterval(increment(5),1000);
    let ran = (1-spawnRate) * Math.random() * Math.min(canvas.height/3, canvas.width/3) + 2.5 * Math.min(player.w, player.h)
    

    let maxtime = 8 // multiplier for the max seconds -- implies that 10 seconds is the maxtime
    monsters.push(new Monsters(spawnX, spawnY, vx, vy, size, size, hp, glow, ran, t, null));
    console.log(monsters.length)
    monsters[monsters.length-1].interval = setInterval(increment,1000,monsters.length-1);
}


function increment(smt){
    console.log(smt, monsters.length)
    monsters[smt].t -= 1
    console.log(smt, monsters[smt].t)
    

    if(monsters[smt].t <= 0){
        console.log("BOOM,")
        clearInterval(monsters[smt].interval);
    }
}

function getRandInt(){
    return 2 + Math.floor(Math.random() * 8);
}


// Player and camera settings
const smoothness = 0.1; // Smoothness for camera movement (lower is smoother but slower)

let cameraX = canvas.width/2;
let cameraY = canvas.height/2;


// setting up player
let player = new Player(canvas.width/2, canvas.height/2, 60, 60, 0, 0, 0.25, 0.25, true)
let aimer = new Aimer(0, 30, 10)


// Math functions
function dist(x1, y1, x2, y2){
    return (Math.sqrt((x1-x2)**2 + (y1-y2)**2))
}

function collision(obj1, obj2){
    return (Math.abs(obj1.x - obj2.x) <= (obj1.w/2 + obj2.w/2) && // Distance between x-coordinates <= Sum of half-widths
            Math.abs(obj1.y - obj2.y) <= (obj1.h/2 + obj2.h/2)) // Distance between y-coordinates <= Sum of half-heights  
}


// Time functions




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
let redphotons = []

function shoot(){
    if (photons.length < 4){
    let shootVX = c * Math.cos(aimer.angle);
    let shootVY = c * Math.sin(aimer.angle);  
    let shootR = Math.min(canvas.width/2,canvas.height/2);
    photons.push(new Photons(aimer.x + aimer.w * Math.cos(aimer.angle), aimer.y + aimer.w * Math.sin(aimer.angle),
        5,5,shootVX,shootVY,shootR, "cyan"));
    }
}

function redshoot(monster, target){
    console.log(monster.x, monster.y, target.x, target.y)
    let followAngle;
    if (target.x >= monster.x){
        followAngle = Math.atan((target.y - monster.y)/(target.x - monster.x))
    } else if (player.x < monster.x){
        followAngle = Math.atan((target.y - monster.y)/(target.x - monster.x)) + Math.PI
    }
    console.log(followAngle)
    followAngle += Math.PI/12 - Math.random() * Math.PI/6 // Variety in Shooting
    let shootVX = c * Math.cos(followAngle);
    let shootVY = c * Math.sin(followAngle);  
    let shootR = Math.min(canvas.width/2,canvas.height/2);
    redphotons.push(new Photons(monster.x, monster.y, 5,5,shootVX,shootVY,shootR, "orange"));
    
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



function updateGame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateCamera()

    // Inside updateGame function:
    player.draw(ctx, player.spriteSheet, cameraX, cameraY, canvas);
    aimer.draw();

    if (Math.random() < spawnRate) spawnMonster()
    
    // Draw the monsters
    for(i=0; i < monsters.length; i++){
        monsters[i].move();
        monsters[i].draw(player);
        
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
        photons[i].move();
    }
    for(i = 0; i < redphotons.length; i++){
        redphotons[i].draw();
        redphotons[i].move();  
    }

    // Check monsters-photons
    monsters = monsters.filter(checkCollision);
    function checkCollision(monster){
        for (i = 0; i < photons.length; i++){
            if (collision(monster, photons[i])) {
                if (spawnRate < 1) spawnRate *= 1.05
                /* if (Math.random() < Math.min(5*spawnRate, 1)) */ redshoot(monster, player)
                return false}
        }
        return true
    }

    // Request the next animation frame
    requestAnimationFrame(updateGame);
}

// Get the elements
const welcomeScreen = document.getElementById('welcome-screen');
const playButton = document.getElementById('play-button');

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
}

// Set up the Play button to start the game
playButton.addEventListener('click', startGame);


// Listen for key presses to move the player
document.addEventListener('keydown', movePlayer);
canvas.addEventListener('mousemove', moveAim);




// Start the game loop
updateGame();
