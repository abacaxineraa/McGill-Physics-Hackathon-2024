// Get player element and game area dimensions
const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');

// Initialize player position
let playerX = gameArea.offsetWidth / 2 - player.offsetWidth / 2;
let playerY = gameArea.offsetHeight / 2 - player.offsetHeight / 2;

// Update player position
function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

// Handle keydown events
function movePlayer(event) {
    const step = 10; // Speed of movement
    
    if (event.key === 'ArrowUp') {
        if (playerY > 0) playerY -= step;
    }
    if (event.key === 'ArrowDown') {
        if (playerY < gameArea.offsetHeight - player.offsetHeight) playerY += step;
    }
    if (event.key === 'ArrowLeft') {
        if (playerX > 0) playerX -= step;
    }
    if (event.key === 'ArrowRight') {
        if (playerX < gameArea.offsetWidth - player.offsetWidth) playerX += step;
    }
    
    updatePlayerPosition();
}

// Add event listener for arrow key presses
document.addEventListener('keydown', movePlayer);

// Initial update
updatePlayerPosition();
