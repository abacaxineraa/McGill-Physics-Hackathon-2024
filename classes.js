class Player {
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
}

class Aimer {
    constructor(theta,w,h){
        this.theta = theta;
        this.w = w;
        this.h = h;
    }
}

class Photons {
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
    constructor(x,y,vx,vy,w,h,hp,glow){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.w = w;
        this.h = h;
        this.hp = hp;
        this.glow = glow;
    }

    draw() {
        ctx.fillStyle = this.glow ? 'yellow' : 'green';
        ctx.fillRect(canvas.width / 2 + this.x - cameraX - this.w / 2, 
                     canvas.height / 2 + this.y - cameraY - this.h / 2, 
                     this.w, this.h);
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
