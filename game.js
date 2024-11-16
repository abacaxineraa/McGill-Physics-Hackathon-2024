// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Player {

    // position, width, height, velocity, acceleration, health
    constructor(x,y,w,h,vx,vy,ax,ay,hp){
        this.x = x;
        this.y = y;
        this.w = w; 
        this.h = h;
        this.vx = vx; 
        this.vy = vy;
        this.ax = ax;
        this.ay = ay; 
        this.hp = hp;

    }

}


class Aimer {


    // angle, width of aimer and height of aimer
    constructor(theta,w,h){
        this.theta = theta;
        this.w = w;
        this.h = h;
    }
    
}

class Photons {

    // position of photons, velocity of photons, radius, range of photons
    constructor(x,y,vx,vy,rad,ran){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.rad = rad;
        this.ran = ran;
    }

}

class Monsters {

    // position of monsters, velocity of monsters, width of monsters, health of monsters, glow of monsters
    constructor(x,y,vx,vy,w,h,hp,glow){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.w = w;
        this.h = h;
        this.hp = hp;
        this.glow = glow;
    }

        draw() {
        ctx.fillStyle = this.glow ? 'yellow' : 'green';
        ctx.fillRect(canvas.width / 2 + this.x - cameraX - this.w / 2, 
                     canvas.height / 2 + this.y - cameraY - this.h / 2, 
                     this.w, this.h);
    }
}



// Array to store monsters
let monsters = [];

// Function to spawn monsters outside the frame
function spawnMonster() {
    // Only spawn a monster if the number of monsters is less than 5
    if (monsters.length >= 5) return;

    // Random position outside the player's current view
    let spawnX = playerX + (Math.random() * 800 - 400);  // Spawn outside the screen on X-axis
    let spawnY = playerY + (Math.random() * 800 - 400);  // Spawn outside the screen on Y-axis

    // Random size for the monster
    let size = Math.random() * 40 + 20;
    
    // Random velocity for the monster (to make them move)
    let vx = Math.random() * 2 - 1; // Random velocity between -1 and 1
    let vy = Math.random() * 2 - 1; // Random velocity between -1 and 1
    
    // Random health for the monster
    let hp = Math.floor(Math.random() * 50 + 30);
    
    // Random glow effect for the monster
    let glow = Math.random() < 0.5;
    
    // Create a new monster and add it to the monsters array
    monsters.push(new Monsters(spawnX, spawnY, vx, vy, size, size, hp, glow));
}


function updateMonsters() {
    monsters.forEach(monster => {
        // Update monster's position based on velocity
        monster.x += monster.vx;
        monster.y += monster.vy;
    });
}


class Walls {
    // position of walls, width of walls, height of walls
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        
    }
}




class Box {
    constructor(x,y,c){this.x = x; this.y=y; this.c = c}
    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect( canvas.width/2 + this.x - cameraX -this.c/2, canvas.height/2 + this.y - cameraY -this.c/2, this.c, this.c);
   }
}

// Player and camera settings
const smoothness = 0.1; // Smoothness for camera movement (lower is smoother but slower)

let playerX = canvas.width / 2;
let playerY = canvas.height / 2;
let cameraX = canvas.width/2;
let cameraY = canvas.height/2;
let aimerAngle;

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
let player = new Player(canvas.width/2, canvas.height/2, 30, 30, 3, 3, 1, 1, true)
let aimer = new Aimer(0, 40, 20)
// Math functions
function dist(x1, y1, x2, y2){
    return (Math.sqrt((x1-x2)**2 + (y1-y2)**2))
}


let keysPressed = {}; // Tracks keys that are currently pressed

document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
    movePlayer();
});

document.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});

function movePlayer() {
    let dx = 0;
    let dy = 0;

    // Check the keys that are currently pressed and set dx and dy accordingly
    if (keysPressed['ArrowUp']) dy = -1;
    if (keysPressed['ArrowDown']) dy = 1;
    if (keysPressed['ArrowLeft']) dx = -1;
    if (keysPressed['ArrowRight']) dx = 1;

    // Normalize the movement vector if both x and y directions are active
    if (dx !== 0 || dy !== 0) {
        const length = Math.sqrt(dx * dx + dy * dy);
        dx /= length;
        dy /= length;


        playerX += dx * playerSpeed;
        playerY += dy * playerSpeed;

	
        // Spawn monsters when player is moving
        if (Math.random() < 0.02) { // Adjust probability as needed
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
    ctx.fillRect(canvas.width/2  + player.x - cameraX - playerSize/2, canvas.height/2 + playerY - cameraY - playerSize/2, playerSize, playerSize); // Adjust for camera
    ctx.fillStyle = "black";
    ctx.
    ctx.fillRect(canvas.width/2  + player.x - cameraX + 30*Math.cos(aimerAngle) -5 , canvas.height/2 + playerY - cameraY + 30*Math.sin(aimerAngle) - 5, 10, 10); // Adjust for camera
       
}

// Draw and update aimer()
function moveAim(event){
    let trueX = canvas.width/2 + playerX -cameraX
    let trueY = canvas.height/2 + playerY -cameraY
    console.log(trueX, trueY)
    console.log(event.offsetX, event.offsetY)
    if (event.offsetX > (trueX)){
        aimerAngle = Math.atan((event.offsetY - trueY)/(event.offsetX - trueX))
        console.log(aimerAngle)
        console.log("hi")
    } else if (event.offsetX < trueX){
        aimerAngle = (Math.atan((event.offsetY - trueY)/(event.offsetX - trueX)) + Math.PI)
        console.log("BEHIND: " + aimerAngle)
    }
}


// Update the camera position smoothly
function updateCamera() {
    cameraX = lerp(cameraX, playerX, smoothness);
    cameraY = lerp(cameraY, playerY, smoothness);
}

// Clear the canvas and redraw the game elements
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateCamera();

    drawPlayer();
    for(i=0; i < arrayBox.length; i++){

        arrayBox[i].draw();

    }
    
    // Draw the monsters
    monsters.forEach(monster => monster.draw());
    

    // Request the next animation frame
    requestAnimationFrame(updateGame);
}

// Listen for key presses to move the player
document.addEventListener('keydown', movePlayer);
canvas.addEventListener('mousemove', moveAim)

// Start the game loop
updateGame();
