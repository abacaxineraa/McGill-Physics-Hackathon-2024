function calculateRelativeSpeed(player) {
    let speedpixels = Math.sqrt(player.vx ** 2 + player.vy ** 2);
    let percentage = (speedpixels / c) * 100;
    let speedC= 299792458;
    
    let speed = percentage * speedC

    speed= speed.toFixed(0)
    percentage= percentage.toFixed(0)

    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Speed: ${speed} m/s`, 20, 30); // Actual speed
    ctx.fillText(`Relative to c: ${percentage}%`, 20, 60); // Percentage of speed of light
}
