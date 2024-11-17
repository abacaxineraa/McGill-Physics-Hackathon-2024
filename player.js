
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
            this.vx -= 0.20 * this.vx/Math.abs(this.vx) * this.ax;
            
        }
        
        if(this.vy != 0){
            this.vy -= 0.20 * this.vy/Math.abs(this.vy) * this.ay;
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
        this.drawX = canvas.width / 2 + (this.x - cameraX) - this.w / 2;
        this.drawY = canvas.height / 2 + (this.y - cameraY) - this.h / 2;

        // Draw the sprite at the player's position
        ctx.drawImage(
            spriteSheet,
            this.currentFrame * this.spriteWidth, // Source X position
            this.sourceY, // Source Y position (calculated from the row)
            this.spriteWidth,
            this.spriteHeight,
            this.drawX, // Center on the canvas
            this.drawY, // Center on the canvas
            this.w,
            this.h
        );
    }
}
