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
        player.x += dx * player.vx;
        player.y += dy * player.vy;

        console.log(player.x, player.y)
    }

}


// Smooth interpolation (lerp) for the camera to follow the player
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Draw the player
function drawPlayer() {
    ctx.fillStyle = '#007bff';
    console.log(canvas.width/2  + player.x - cameraX - player.w/2, canvas.height/2 + player.y - cameraY - player.h/2, player.w, player.h)
    ctx.fillRect(canvas.width/2  + player.x - cameraX - player.w/2, canvas.height/2 + player.y - cameraY - player.h/2, player.w, player.h); // Adjust for camera
    ctx.fillStyle = "black";
    ctx.fillRect(canvas.width/2  + player.x - cameraX + 30*Math.cos(aimer.angle) -5 , canvas.height/2 + player.y - cameraY + 30*Math.sin(aimer.angle) - 5, 10, 10); // Adjust for camera
       
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
        arrayBox[i].draw()
    }

    if (Math.random() < 0.01) { // Adjust probability as desired
        spawnRandomBox();
    }

    // Request the next animation frame
    requestAnimationFrame(updateGame);
}

// Listen for key presses to move the player
document.addEventListener('keydown', movePlayer);
canvas.addEventListener('mousemove', moveAim)

// Start the game loop
updateGame();
