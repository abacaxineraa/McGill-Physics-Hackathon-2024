const backgroundImage = new Image();
backgroundImage.src = "img/background.png"; // Your repeating background image

const tileWidth = 100;  // Width of each background tile
const tileHeight = 100; // Height of each background tile


function updateBackground() {
    const offsetX = Math.floor(player.x / tileWidth) * tileWidth;
    const offsetY = Math.floor(player.y / tileHeight) * tileHeight;

    // Draw the tiles in a grid pattern
    for (let i = 0; i < Math.ceil(canvas.width / tileWidth) + 1; i++) {
        for (let j = 0; j < Math.ceil(canvas.height / tileHeight) + 1; j++) {
            ctx.drawImage(backgroundImage, offsetX + i * tileWidth, offsetY + j * tileHeight, tileWidth, tileHeight);
        }
    }
}
