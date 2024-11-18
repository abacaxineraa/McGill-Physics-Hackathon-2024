const backgroundImage = new Image();
backgroundImage.src = "img/smallgrass.png";

backgroundImage.onload = () => {
    // Start drawing only once the image is fully loaded
    updateBackground(IRF);
};


const tileWidth = 128;  // Width of each background tile
const tileHeight = 128; // Height of each background tile
function updateBackground(him) {
    // Speed of light and gamma factor for contraction
    const playerSpeed = Math.sqrt(him.vx ** 2 + him.vy ** 2);
    const contractedSpeed = Math.min(playerSpeed, 0.9 * c); // Limiting to <0.9c
    const gamma = 1 / Math.sqrt(1 - (contractedSpeed / c) ** 2);

    // Contraction factors
    const contractionFactorX =  1 //Math.sqrt(1 - (Math.min(Math.abs(him.vx), 0.9 * c) / c) ** 2);
    const contractionFactorY =  1 //Math.sqrt(1 - (Math.min(Math.abs(him.vy), 0.9 * c) / c) ** 2);

    

    // Calculate the offset with contraction applied
    const offsetX = (-cameraX + Math.floor(him.x / tileWidth) * tileWidth) * contractionFactorX;
    const offsetY = (-cameraY + Math.floor(him.y / tileHeight) * tileHeight) * contractionFactorY;

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
});
