// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player and camera settings
const playerSize = 30;
const playerSpeed = 5;
const smoothness = 0.1; // Smoothness for camera movement (lower is smoother but slower)

let playerX = canvas.width / 2 - playerSize / 2;
let playerY = canvas.height / 2 - playerSize / 2;
let cameraX = 0;
let cameraY = 0;

// Handle player movement
function movePlayer(event) {
    if (event.key === 'ArrowUp') {
        if (playerY > 0) playerY -= playerSpeed;
    }
    if (event.key === 'ArrowDown') {
        if (playerY < canvas.height - playerSize) playerY += playerSpeed;
    }
    if (event.key === 'ArrowLeft') {
        if (playerX > 0) playerX -= playerSpeed;
    }
    if (event.key === 'ArrowRight') {
        if (playerX < canvas.width - playerSize) playerX += playerSpeed;
    }
}

// Smooth interpolation (lerp) for the camera to follow the player
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Draw the player
function drawPlayer() {
    ctx.fillStyle = '#007bff';
    ctx.fillRect(playerX - cameraX, playerY - cameraY, playerSize, playerSize); // Adjust for camera
}

// Update the camera position smoothly
function updateCamera() {
    cameraX = lerp(cameraX, playerX - canvas.width / 2 + playerSize / 2, smoothness);
    cameraY = lerp(cameraY, playerY - canvas.height / 2 + playerSize / 2, smoothness);
}

// Clear the canvas and redraw the game elements
function updateGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update camera position
    updateCamera();

    // Draw the player at the updated position
    drawPlayer();

    // Request the next animation frame
    requestAnimationFrame(updateGame);
}

// Listen for key presses to move the player
document.addEventListener('keydown', movePlayer);

// Start the game loop
updateGame();
