
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

}


class Aimer {


    // angle, width of aimer and height of aimer
    constructor(theta,w,h){
        this.theta = theta;
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
    constructor(x,y,vx,vy,rad,ran){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.rad = rad;
        this.ran = ran;
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
    }

    draw() {
        ctx.fillStyle = this.glow ? 'yellow' : 'green';
        ctx.fillRect(canvas.width / 2 + this.x - cameraX - this.w / 2, 
                     canvas.height / 2 + this.y - cameraY - this.h / 2, 
                     this.w, this.h);
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

class Box {
    constructor(x,y,c){this.x = x; this.y=y; this.c = c}
    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect( canvas.width/2 + this.x - cameraX -this.c/2, canvas.height/2 + this.y - cameraY -this.c/2, this.c, this.c);
    }
}
