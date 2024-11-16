// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


class Box {
    constructor(x,y,c){this.x = x; this.y=y; this.c = c}
    create() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x-this.c/2, this.y-this.c/2, this.c, this.c);
    }
}

// Player and camera settings
const playerSize = 30;
const playerSpeed = 5;
const smoothness = 0.1; // Smoothness for camera movement (lower is smoother but slower)

let playerX = canvas.width / 2 - playerSize / 2;
let playerY = canvas.height / 2 - playerSize / 2;
let cameraX = canvas.width/2;
let cameraY = canvas.width/2;
let cameraNewX;
let cameraNewY = cameraY;

arrayBox=[]
arrayBox.push(new Box(300, 200, 100))
arrayBox.push(new Box(400, 200, 50))



// Handle player movement
function movePlayer(event) {
    if (event.key === 'ArrowUp') {
       
            for(i=0; i < arrayBox.length; i++){
                cameraNewY += playerSpeed; 
                arrayBox[i].y -= cameraY;
                updateCamera()
                arrayBox[i].y += cameraY;
            }
        
    }
    if (event.key === 'ArrowDown') {
       
            for(i=0; i < arrayBox.length; i++){
            cameraNewY -= playerSpeed; 
            arrayBox[i].y -= cameraY;
            updateCamera()
            arrayBox[i].y += cameraY;
        }
    }
    if (event.key === 'ArrowLeft') {
        playerX -= playerSpeed;
    }
    if (event.key === 'ArrowRight') {
        playerX += playerSpeed;
    }
}

// Smooth interpolation (lerp) for the camera to follow the player
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Draw the player
function drawPlayer() {
    console.log("I'm going insane")
    ctx.fillStyle = '#007bff';
    console.log(canvas.width/2 - playerSize/2, canvas.length/2 - playerSize/2, playerSize, playerSize)
    ctx.fillRect(canvas.width/2 - playerSize/2, canvas.height/2 - playerSize/2, playerSize, playerSize); // Adjust for camera
}

// Update the camera position smoothly
function updateCamera() {
    cameraX = lerp(cameraX, playerX - canvas.width / 2 + playerSize / 2, smoothness);
    cameraY = lerp(cameraNewY, cameraY, smoothness);
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
        arrayBox[i].create()
    }

    // Request the next animation frame
    requestAnimationFrame(updateGame);
}

// Listen for key presses to move the player
document.addEventListener('keydown', movePlayer);

// Start the game loop
updateGame();
