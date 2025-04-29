const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 500;

class Player {
    constructor(game) {
        this.game = game;
        this.width = 250;
        this.height = 180;
        this.frameX = 0;
        this.img = document.getElementById('plyer');
        this.x = 100 ;
        this.y = canvas.height - this.height; 
        this.maxFrame = 7;
        this.fps = 60;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps;
    }
    update(deltaTime) {
        
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }
    draw() {
        ctx.drawImage(
            this.img,                    // image source
            this.frameX * this.width,    // source x
            0,                           // source y
            this.width,                  // source width
            this.height,                 // source height
            this.x,                      // destination x
            this.y,                      // destination y
            this.width,                  // destination width
            this.height                  // destination height
        );
    }
}

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.player = new Player(this); 
    }
    update(deltaTime) {
        this.player.update(deltaTime);
    }
    draw() {
        this.player.draw();
    }
}

const game = new Game(canvas.width, canvas.height);

let lastTime = 0;
function animation(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw();
    requestAnimationFrame(animation);
}
animation(0);