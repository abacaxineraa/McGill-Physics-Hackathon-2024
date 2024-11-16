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
        this.ax = ay; 
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
const playerSize = 30;
const playerSpeed = 5;
const smoothness = 0.2; // Smoothness for camera movement (lower is smoother but slower)

let playerX = canvas.width / 2;
let playerY = canvas.height / 2;
let cameraX = canvas.width/2;
let cameraY = canvas.width/2;
let cameraNewX;
let cameraNewY = cameraY;
let aimerAngle;

arrayBox=[]
arrayBox.push(new Box(300, 200, 100))
arrayBox.push(new Box(400, 200, 50))
// setting up player
let player = new Player()
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

        // Update player position with normalized speed
        playerX += dx * playerSpeed;
        playerY += dy * playerSpeed;
    }

    updateCamera();
}


// Smooth interpolation (lerp) for the camera to follow the player
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Draw the player
function drawPlayer() {
    ctx.fillStyle = '#007bff';
    ctx.fillRect(canvas.width/2 - playerSize/2, canvas.height/2 + playerY - cameraY - playerSize/2, playerSize, playerSize); // Adjust for camera
    ctx.fillRect(canvas.width/2  + playerX - cameraX - playerSize/2, canvas.height/2 + playerY - cameraY - playerSize/2, playerSize, playerSize); // Adjust for camera
    ctx.fillRect(canvas.width/2 - playerSize/2 + 30 *Math.cos(aimerAngle), canvas.height/2 + playerY - cameraY - playerSize/2, playerSize, playerSize); // Aimer for now
}

// Draw and update aimer()
function moveAim(event){
    if (MouseEvent.clientX > playerX){
        aimerAngle = Math.atan((MouseEvent.clientY - playerY)/(MouseEvent.clientX - playerX))
    } else if (MouseEvent.clientX < playerX){
        aimerAngle = (Math.atan((MouseEvent.clientY - playerY)/(MouseEvent.clientX - playerX)) + Math.PI)
    }

}


// Update the camera position smoothly
function updateCamera() {
    cameraX = lerp(cameraX, playerX - canvas.width / 2 + playerSize / 2, smoothness);
    cameraY = lerp(cameraY, playerY, smoothness);
}

// Clear the canvas and redraw the game elements
function updateGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update camera position
    updateCamera();

    // Draw the player at the updated position
    drawPlayer();
    for(i=0; i < arrayBox.length; i++){
        arrayBox[i].draw();
    }

    // Request the next animation frame
    requestAnimationFrame(updateGame);
}

// Listen for key presses to move the player
document.addEventListener('keydown', movePlayer);
canvas.addEventListener('mousemove', moveAim)



// Start the game loop
updateGame();
