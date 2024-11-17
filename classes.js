
class Player {

    // position, width, height, velocity, acceleration, health
    constructor(x,y,w,h,vx,vy,ax,ay,hp){
        this.x = x;
        this.y = y;
        this.w = w; 
        this.h = h;
        this.vx = vx; 
        this.vy = vy;
        this.ax = ax;
        this.ay = ay; 
        this.hp = hp;

	// Sprite properties
	this.spriteSheet = new Image();
	this.spriteSheet.src =  "./img/Slime yellow.png"; // Image file path for the monster sprite sheet
	this.spriteWidth = 48;  
	this.spriteHeight = 48; 
	this.totalFrames = 4;    
	this.currentFrame = 0;   
	this.frameRate = 3;    
	this.frameTimer = 0;   
	this.animationRow = 2;  
	this.sourceY = this.animationRow * this.spriteHeight; 
    }
    
    move(){

        if(this.vx != 0){
            this.vx -= 0.10 * this.vx/Math.abs(this.vx) * this.ax;
            
        }
        
        if(this.vy != 0){
            this.vy -= 0.10 * this.vy/Math.abs(this.vy) * this.ay;
        }
    
        
        this.x += this.vx;
        this.y += this.vy;
    }
    // Sprite animation function
    draw(ctx, spriteSheet, cameraX, cameraY, canvas) {
        this.move();

        // Update frame timer
        this.frameTimer++;
        if (this.frameTimer >= 60 / this.frameRate) {
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames; // Loop through frames
            this.frameTimer = 0;
        }

        // Calculate the player's position relative to the camera
        this.drawX = canvas.width / 2 + (this.x - cameraX) - this.spriteWidth / 2;
        this.drawY = canvas.height / 2 + (this.y - cameraY) - this.spriteHeight / 2;

        scale = 1.4

        // Draw the sprite at the player's position
        ctx.drawImage(
            spriteSheet,
            this.currentFrame * this.spriteWidth, // Source X position
            this.sourceY, // Source Y position (calculated from the row)
            this.spriteWidth,
            this.spriteHeight,
            canvas.width / 2 + this.x - cameraX - this.w / 2, // Center on the canvas
            canvas.height / 2 + this.y - cameraY - this.h / 2, // Center on the canvas
            this.w*scale*0.9,
            this.h*scale*0.9
        );
    }
}


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

class Monsters {

    // position of monsters, velocity of monsters, width of monsters, health of monsters, glow of monsters, glow of monsters on or off
    constructor(x,y,vx,vy,w,h,hp,glow,ran, t, myinterval){
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


    
    draw(player) {

	const c = 1; // Normalized speed of light (for this simulation, we use 1)
	const speed = Math.sqrt(player.vx ** 2 + player.vy ** 2); // Total speed (magnitude of velocity)

	// Limit the speed to 0.9c to avoid going faster than light
	const realSpeed = Math.min(speed, 0.9 * c);

	// Calculate the Lorentz factor (gamma) based on total speed
	const gamma = 1 / Math.sqrt(1 - (realSpeed / c) ** 2);

	// Function to calculate contraction factor based on velocity direction
	function getContractionFactor(velocity) {
	    return 1 / Math.sqrt(1 - (Math.min(Math.abs(velocity), 0.9 * c) / c) ** 2);
	}

	// Apply length contraction depending on the direction of movement
	const contractionFactorX = 1/getContractionFactor(player.vx);
	const contractionFactorY = 1/getContractionFactor(player.vy);

	const contractedWidth = this.spriteWidth * scale * contractionFactorX;
	const contractedHeight = this.spriteHeight * scale * contractionFactorY;

	// Adjust monster's frame rate based on player's speed (time dilation)
	const dilationFactor = gamma;
	const adjustedFrameRate = this.frameRate * dilationFactor; // Monsters' frame rate decreases as player goes faster



	this.frameTimer++;
	if (this.frameTimer >= 60 / adjustedFrameRate*10) {
	    this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
	    this.frameTimer = 0;
	}

	
	// Calculate the monster's position relative to the camera
	this.drawX = canvas.width / 2 + (this.x - cameraX) - this.spriteWidth / 2;
        this.drawY = canvas.height / 2 + (this.y - cameraY) - this.spriteHeight / 2;

        // Draw the monster sprite at the calculated position
        ctx.drawImage(
            this.spriteSheet,
            this.currentFrame * this.spriteWidth, // Source X position (frame width multiplied by current frame)
            this.sourceY, // Source Y position (based on the row)
            this.spriteWidth,
            this.spriteHeight,
            this.drawX,  // Draw at monster position
            this.drawY,  // Draw at monster position
            contractedWidth,  // Scale to contracted width
            contractedHeight // Scale to contracted height
        );
        if(this.glow){
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "yellow"
            ctx.fillRect(this.drawX, this.drawY, contractedWidth, contractedHeight);
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


class Walls {
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

    }
}
