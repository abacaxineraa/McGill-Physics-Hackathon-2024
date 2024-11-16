


class Player {    
    // position, width, height, velocity, acceleration, health
    constructor(x, y, w, h, vx, vy, ax, ay, hp) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = vx;
        this.vy = vy;
        this.ax = ax;
        this.ay = ay;
        this.hp = hp;
        
        // Sprite properties (moved to the constructor)
	this.spriteSheet = new Image();
	this.spriteSheet.src = "./img/Slime_Medium_Green copy.png"; //
        this.spriteWidth = 128; // Width of each frame
        this.spriteHeight = 128; // Height of each frame
        this.totalFrames = 4; // Total number of frames in the idle animation
        this.currentFrame = 0; // Track the current frame
        this.frameRate = 10; // Frames per second
        this.frameTimer = 0; // Timer for frame updates

        // Define the starting row for the sprite png
        this.animationRow = 2; // 0-based index for the third row
        this.sourceY = this.animationRow * this.spriteHeight; // Y position in the sprite sheet
    }
    
    move() {
        if (this.vx != 0) {
            this.vx -= 0.10 * this.vx / Math.abs(this.vx) * this.ax;
        }
        if (this.vy != 0) {
            this.vy -= 0.10 * this.vy / Math.abs(this.vy) * this.ay;
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

        // Draw the sprite at the player's position
        ctx.drawImage(
            spriteSheet,
            this.currentFrame * this.spriteWidth, // Source X position
            this.sourceY, // Source Y position (calculated from the row)
            this.spriteWidth,
            this.spriteHeight,
            canvas.width / 2 + this.x - cameraX - this.w / 2, // Center on the canvas
            canvas.height / 2 + this.y - cameraY - this.h / 2, // Center on the canvas
            this.w,
            this.h
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

    // position of monsters, velocity of monsters, width of monsters, health of monsters, glow of monsters
    constructor(x,y,vx,vy,w,h,hp,glow, ran){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.w = w;
        this.h = h;
        this.hp = hp;
        this.glow = glow;
        this.ran = ran;

	

	// Sprite properties
	this.spriteSheet = new Image();
	this.spriteSheet.src =  "./img/monsters_image.png"; // Image file path for the monster sprite sheet
	this.spriteWidth = 36;  
	this.spriteHeight = 54; 
	this.totalFrames = 3;    
	this.currentFrame = 0;   
	this.frameRate = 10;    
	this.frameTimer = 0;   
	this.animationRow = 0;  
	this.sourceY = this.animationRow * this.spriteHeight; 
    }

    // draw() {
    //     ctx.fillStyle = this.glow ? 'yellow' : 'green';
    //     ctx.fillRect(canvas.width / 2 + this.x - cameraX - this.w / 2, 
    //                  canvas.height / 2 + this.y - cameraY - this.h / 2, 
    //                  this.w, this.h);
    // }

    draw() {
	// Update frame timer
	this.frameTimer++;
	if (this.frameTimer >= 60 / this.frameRate) {
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames; // Loop through frames
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
            this.w,       // Scale to monster's width
            this.h        // Scale to monster's height
        );
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
