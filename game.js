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
    if (keysPressed['ArrowUp'] || keysPressed['w']) dy = -1;
    if (keysPressed['ArrowDown'] || keysPressed['s']) dy = 1;
    if (keysPressed['ArrowLeft'] || keysPressed['a']) dx = -1;
    if (keysPressed['ArrowRight'] || keysPressed['d']) dx = 1;
    
    // Normalize the movement vector if both x and y directions are active
    if (dx !== 0 || dy !== 0) {
        const length = Math.sqrt(dx * dx + dy * dy);
        dx /= length;
        dy /= length;

        // Update player position with normalized speed
        player.x += dx * player.vx;
        player.y += dy * player.vy;

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
    
    // Draw aimer (Rotate, draw, rotate back)
    ctx.fillStyle = "black";
    ctx.translate(aimer.x, aimer.y);
    ctx.rotate(aimer.angle);
    ctx.translate(-aimer.x, -aimer.y);
    ctx.fillRect(aimer.x - aimer.w/2, aimer.y - aimer.h/2, aimer.w, aimer.h);
    
    ctx.translate(aimer.x, aimer.y);
    ctx.rotate(-aimer.angle);
    ctx.translate(-aimer.x, -aimer.y);
 
    // ctx.fillRect(canvas.width/2  + player.x - cameraX + 30*Math.cos(aimer.angle) -5 , canvas.height/2 + player.y - cameraY + 30*Math.sin(aimer.angle) - 5, 10, 10); // Adjust for camera
       
}

// Draw and update aimer()
function moveAim(event){
    let trueX = canvas.width/2 + player.x -cameraX
    let trueY = canvas.height/2 + player.y -cameraY
    if (event.offsetX > (trueX)){
        aimer.angle = Math.atan((event.offsetY - trueY)/(event.offsetX - trueX))
    } else if (event.offsetX < trueX){
        aimer.angle = (Math.atan((event.offsetY - trueY)/(event.offsetX - trueX)) + Math.PI)
    }
    aimer.x = canvas.width/2  + player.x - cameraX + 30*Math.cos(aimer.angle) 
    aimer.y = canvas.height/2 + player.y - cameraY + 30*Math.sin(aimer.angle)
}


// Update the camera position smoothly
function updateCamera() {
    cameraX = lerp(cameraX, player.x, smoothness);
    cameraY = lerp(cameraY, player.y, smoothness);
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
