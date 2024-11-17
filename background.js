const backgroundImage = new Image();
backgroundImage.src = "img/smallgrass.png";

backgroundImage.onload = () => {
    // Start drawing only once the image is fully loaded
    updateBackground();
};


const tileWidth = 128;  // Width of each background tile
const tileHeight = 128; // Height of each background tile
function updateBackground() {
    // Speed of light and gamma factor for contraction
    const c = 5; // Speed of light in this simulation
    const playerSpeed = Math.sqrt(player.vx ** 2 + player.vy ** 2);
    const contractedSpeed = Math.min(playerSpeed, 0.9 * c); // Limiting to <0.9c
    const gamma = 1 / Math.sqrt(1 - (contractedSpeed / c) ** 2);

    // Contraction factors
    const contractionFactorX =  Math.sqrt(1 - (Math.min(Math.abs(player.vx), 0.9 * c) / c) ** 2);
    const contractionFactorY =  Math.sqrt(1 - (Math.min(Math.abs(player.vy), 0.9 * c) / c) ** 2);

    // Calculate the offset with contraction applied
    const offsetX = (-player.x + Math.floor(player.x / tileWidth) * tileWidth) * contractionFactorX;
    const offsetY = (-player.y + Math.floor(player.y / tileHeight) * tileHeight) * contractionFactorY;

    // Redraw the background tiles in the grid, applying contraction
    for (let i = 0; i < Math.ceil(canvas.width / (tileWidth * contractionFactorX))+1; i++) {
        for (let j = 0; j < Math.ceil(canvas.height / (tileHeight * contractionFactorY))+1; j++) {
            ctx.drawImage(
                backgroundImage,
                offsetX + i * tileWidth * contractionFactorX,
                offsetY + j * tileHeight * contractionFactorY,
                tileWidth * contractionFactorX,
                tileHeight * contractionFactorY
            );
            ctx.strokeStyle = "black 0.5px"
            ctx.beginPath();
            ctx.rect(offsetX + i * tileWidth * contractionFactorX,
                offsetY + j * tileHeight * contractionFactorY,
                tileWidth * contractionFactorX,
                tileHeight * contractionFactorY)     
            ctx.stroke();
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
