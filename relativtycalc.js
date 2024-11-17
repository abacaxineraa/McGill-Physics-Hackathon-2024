function calculateRelativeSpeed(player) {
    let speed = Math.sqrt(player.vx ** 2 + player.vy ** 2);
	let percentageOfC = (speed / c) * 100;

    speed= speed.toFixed(2)
    percentage= percentageOfC.toFixed(2)

    ctx.font = "20px Arial";
	ctx.fillStyle = "white";
	ctx.fillText(`Speed: ${speed} units/s`, 20, 30); // Actual speed
	ctx.fillText(`Relative to c: ${percentage}%`, 20, 60); // Percentage of speed of light
}
