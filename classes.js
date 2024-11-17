class Aimer {


    // angle, width of aimer and height of aimer
    constructor(angle,w,h){
        this.angle = angle;
        this.w = w;
        this.h = h;
    }

    draw(){// Draw aimer (Rotate, draw, rotate back)
        ctx.globalAlpha = 0.5;
        let playerR = Math.sqrt(player.w**2 + player.h**2)/(2*Math.sqrt(2))
        this.x = player.x + playerR*Math.cos(aimer.angle)  
        this.y = player.y + playerR*Math.sin(aimer.angle)
        ctx.fillStyle = "black";
        ctx.translate(canvas.width/2 + this.x - cameraX, canvas.height/2 + this.y - cameraY);
        ctx.rotate(this.angle);
        ctx.translate( - canvas.width/2 - this.x + cameraX, - canvas.height/2 - this.y + cameraY);
        ctx.fillRect( canvas.width/2 + this.x - cameraX - this.w/2, canvas.height/2 + this.y - cameraY - this.h/2, this.w, this.h);
        
        
        ctx.translate(canvas.width/2 + this.x - cameraX, canvas.height/2 + this.y - cameraY);
        ctx.rotate(-this.angle);
        ctx.translate( - canvas.width/2 - this.x + cameraX, - canvas.height/2 - this.y + cameraY);
        ctx.globalAlpha = 1;
    }
    
}

class Photons {

    // position of photons, velocity of photons, radius, range of photons
    constructor(x,y,w,h,vx,vy,ran, color){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = vx;
        this.vy = vy;
        this.ran = ran;
        this.color = color;
    }

    draw(){
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;
        ctx.fillRect(canvas.width / 2 + this.x - cameraX - this.w / 2, 
            canvas.height / 2 + this.y - cameraY - this.h / 2, 
            this.w, this.h);
        
    }
    move(){
        this.x += this.vx;
        this.y += this.vy;
        this.ran -= Math.sqrt((this.vx)**2+(this.vy)**2);
    }

}



class Walls {
    constructor(x,y,w,h,vx,vy,color){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = vx;
        this.vy = vy;
        this.color = color;

	// Sprite properties
	this.spriteSheet = new Image();
	this.spriteSheet.src =  "./img/stonesheet.png"; // Image file path for the monster sprite sheet
	this.spriteWidth = 72;  
	this.spriteHeight = 72; 
	this.totalFrames = 2;    
	this.currentFrame = 0;   
	this.frameRate = 10;    
	this.frameTimer = 0;   
	this.animationRow = 0;  
	this.sourceY = this.animationRow * this.spriteHeight; 

    }


    draw(him){
	const c = 5; // Normalized speed of light (for this simulation, we use 5)
	const speed = Math.sqrt(him.vx ** 2 + him.vy ** 2); // Total speed (magnitude of velocity)

	// Limit the speed to 0.9c to avoid going faster than light
	const realSpeed = Math.min(speed, 0.9 * c);

	// Calculate the Lorentz factor (gamma) based on total speed
	const gamma = 1 / Math.sqrt(1 - (realSpeed / c) ** 2);

	// Function to calculate contraction factor based on velocity direction
	function getContractionFactor(velocity) {
	    return 1 / Math.sqrt(1 - (Math.min(Math.abs(velocity), 0.9 * c) / c) ** 2);
	}

	// Apply length contraction depending on the direction of movement
	const contractionFactorX = 1/getContractionFactor(him.vx);
	const contractionFactorY = 1/getContractionFactor(him.vy);

	this.contractedWidth = this.w * contractionFactorX;
	this.contractedHeight = this.h * contractionFactorY;

	// Adjust monster's frame rate based on player's speed (time dilation)
	const dilationFactor = gamma;
	const adjustedFrameRate = this.frameRate * dilationFactor; // Monsters' frame rate decreases as player goes faster



	this.frameTimer++;
	if (this.frameTimer >= 60 / adjustedFrameRate*10) {
	    this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
	    this.frameTimer = 0;
	}

	
	// Apply length contraction to the distance between player and monster
	const deltaX = this.x - him.x;
	const deltaY = this.y - him.y;
	const contractedDeltaX = deltaX / gamma;
	const contractedDeltaY = deltaY / gamma;
	
	// Calculate the monster's position based on contracted distances
	this.drawX = canvas.width / 2 + contractedDeltaX;
	this.drawY = canvas.height / 2 + contractedDeltaY;

	// Draw the monster sprite at the calculated position
	ctx.drawImage(
            this.spriteSheet,
            this.currentFrame * this.spriteWidth, // Source X position (frame width multiplied by current frame)
            this.sourceY, // Source Y position (based on the row)
            this.spriteWidth,
            this.spriteHeight,
            this.drawX - this.contractedWidth,  // Draw at monster position
            this.drawY - this.contractedHeight,  // Draw at monster position
            this.contractedWidth,  // Scale to contracted width
            this.contractedHeight // Scale to contracted height
	);
}
}
