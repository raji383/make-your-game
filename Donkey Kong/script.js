const scrin = document.getElementById('game');
const context = scrin.getContext('2d');

// تعيين أبعاد الشاشة بناءً على حجم النافذة
const width = window.innerWidth;
const height = window.innerHeight;
scrin.width = width;
scrin.height = height;

class Input {
    constructor(game) {
        this.game = game;
        this.keys = [];
        window.addEventListener('keydown', e => {
            if (['ArrowLeft', 'ArrowRight', ' ', 'p'].includes(e.key) && !this.keys.includes(e.key)) {
                this.keys.push(e.key);
                if (e.key === ' ' && this.game.gameover) this.resetGame();
                if (e.key === 'p' && !this.game.gameover) this.game.togglePause();
            }
        });
        window.addEventListener('keyup', e => {
            if (['ArrowLeft', 'ArrowRight', ' ', 'p'].includes(e.key)) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}

class Player {
    constructor(game) {
        this.game = game;
        
        this.width = 38; 
        this.height = 34;
        this.x = this.game.width / 2;
        this.y = this.game.height - this.height - 93;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 2;
        this.frameTimer = 0;
        this.frameInterval = 100;
        this.image = document.getElementById('player');
        this.speed = 2;
    }

    draw() {
        context.drawImage(
            this.image,
            this.frameX * this.width, this.frameY * this.height,
            this.width, this.height,
            this.x, this.y,
            this.width * 2, this.height * 2 
        );
    }

    update(deltaTime, input) {
        if (input.keys.includes('ArrowRight')) {
            this.x += this.speed;
            this.frameY = 1;
            this.animateFrames(deltaTime, 0, 2);
        }
        else if (input.keys.includes('ArrowLeft')) {
            this.x -= this.speed;
            this.frameY = 0;
            this.animateFrames(deltaTime, 1, 3);
        }
        else if (input.keys.includes(' ')) {
            this.frameY = 4;
            this.animateFrames(deltaTime, 0, 3);
        }
        else {
            this.frameY = 0;
            this.frameX = 3;
        }
    }

    animateFrames(deltaTime, start, end) {
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < start || this.frameX > end) this.frameX = start;
            else this.frameX++;
            if (this.frameX > end) this.frameX = start;
        } else {
            this.frameTimer += deltaTime;
        }
    }
}

class Background {
    constructor(game) {
        this.game = game;
        this.width = 250;
        this.height = 252;
        this.image = document.getElementById('back');
        this.x = 0;
    }

    update() {

    }

    draw() {
        context.drawImage(
            this.image,
            0*this.width, 0*this.height,
            this.width, this.height,
            this.x, 0,
            this.game.width, this.game.height
        );
    }
}

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.player = new Player(this);
        this.input = new Input(this);
        this.background = new Background(this);
        this.gameover = false;
    }

    update(deltaTime) {
        this.player.update(deltaTime, this.input);
        this.background.update(this.player.x);
    }

    draw() {
        this.background.draw();
        this.player.draw();
    }

    togglePause() {
        
    }
}

const game = new Game(width, height);
let lastTime = 0;

function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    context.clearRect(0, 0, width, height);
    game.update(deltaTime);
    game.draw();
    lastTime = timeStamp;
    requestAnimationFrame(animate);
}

animate(0);

window.addEventListener('resize', () => {
    scrin.width = window.innerWidth;
    scrin.height = window.innerHeight;
    game.width = window.innerWidth;
    game.height = window.innerHeight;
});
