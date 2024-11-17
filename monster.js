class Monsters {

    // position of monsters, velocity of monsters, width of monsters, health of monsters, glow of monsters, glow of monsters on or off
    constructor(x,y,vx,vy,w,h,hp,glow,ran, t, myinterval,id){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.w = w;
        this.h = h;
        this.hp = hp;
        this.glow = glow;
        this.ran = ran;
        this.t = t;
        this.myinterval = myinterval;
        this.id = id;

	

	// Sprite properties
	this.spriteSheet = new Image();
	this.spriteSheet.src =  "./img/Slime purple.png"; // Image file path for the monster sprite sheet
	this.spriteWidth = 48;  
	this.spriteHeight = 40; 
	this.totalFrames = 4;    
	this.currentFrame = 0;   
	this.frameRate = 10;    
	this.frameTimer = 0;   
	this.animationRow = 5;  
	this.sourceY = this.animationRow * this.spriteHeight; 
    }


    
    draw(him) {
        // console.log(this.x, this.y)

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
	const deltaY = this.y - him.x;
	const contractedDeltaX = deltaX / gamma;
	const contractedDeltaY = deltaY / gamma;
	
	this.drawX = canvas.width / 2 + contractedDeltaX;
	this.drawY = canvas.height / 2 + contractedDeltaY;


        // Draw the monster sprite at the calculated position
        ctx.drawImage(
            this.spriteSheet,
            this.currentFrame * this.spriteWidth, // Source X position (frame width multiplied by current frame)
            this.sourceY, // Source Y position (based on the row)
            this.spriteWidth,
            this.spriteHeight,
            this.drawX - this.contractedWidth ,  // Draw at monster position
            this.drawY - this.contractedHeight,  // Draw at monster position
            this.contractedWidth,  // Scale to contracted width
            this.contractedHeight // Scale to contracted height
        );
        if(this.glow){
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = "yellow"
            ctx.fillRect(this.drawX-this.contractedWidth, this.drawY-this.contractedHeight, 
                this.contractedWidth, this.contractedHeight);
            ctx.globalAlpha = 1;
        }
    }





    

    move() {
        if (dist(this.x, this.y, player.x, player.y) >= this.ran){
            let followAngle;
            if (player.x >= this.x){
                followAngle = Math.atan((player.y - this.y)/(player.x - this.x))
            } else if (player.x < this.x){
                followAngle = Math.atan((player.y - this.y)/(player.x - this.x)) + Math.PI
            }
            // Rebalancing VX and VY so that monster follows player
            let followV = Math.sqrt(this.vx ** 2 + this.vy ** 2)
            this.vx = followV * Math.cos(followAngle)
            this.vy = followV * Math.sin(followAngle)
        }
        this.x += this.vx;
        this.y += this.vy;
    }
}
