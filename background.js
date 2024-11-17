const backgroundImage = new Image();
backgroundImage.src = "img/grass.png"; // Your repeating background image

backgroundImage.onload = () => {
    // Start drawing only once the image is fully loaded
    updateBackground();
};


const tileWidth = 100;  // Width of each background tile
const tileHeight = 100; // Height of each background tile


function updateBackground() {
    const offsetX = Math.floor(player.x / tileWidth) * tileWidth;
    const offsetY = Math.floor(player.y / tileHeight) * tileHeight;

    // Redraw the background tiles in the grid
    for (let i = 0; i < Math.ceil(canvas.width / tileWidth) + 1; i++) {
        for (let j = 0; j < Math.ceil(canvas.height / tileHeight) + 1; j++) {
            ctx.drawImage(
                backgroundImage, 
                offsetX + i * tileWidth, 
                offsetY + j * tileHeight, 
                tileWidth, 
                tileHeight
            );
        }
    }
}

// Handle canvas resizing (if needed)
window.addEventListener('resize', () => {
    // Update the canvas size (if necessary)
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    // Redraw background to match the new canvas size
    updateBackground();
});
