const ball = document.getElementById('ball');
const blok = document.getElementById('blok');
const mesag = document.getElementById('mesag');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const timerDisplay = document.getElementById('timer');
const gameContainer = document.getElementById('bord');
const pauseMenu = document.getElementById('pauseMenu');
const continueBtn = document.getElementById('continueBtn');
const restartBtn = document.getElementById('restartBtn');

const width = 800;
const height = 700;

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

    resetGame() {
        this.game.gameover = false;
        this.game.paused = false;
        this.game.move = false;
        this.game.score = 0;
        this.game.lives = 3;
        this.game.startTime = performance.now();
        scoreDisplay.textContent = this.game.score;
        livesDisplay.textContent = this.game.lives;
        mesag.style.display = "none";
        pauseMenu.classList.add('hidden');
        this.game.ball.reset();
        this.game.blok.reset();
        this.game.resetBricks();
        animate();
    }
}

class Blok {
    constructor(game) {
        this.game = game;
        this.reset();
        this.speed = 7;
    }

    reset() {
        this.x = width / 2 - 50;
        this.y = height - 30;
        this.width = 100;
        this.height = 15;
    }

    update(input) {
        if (this.game.paused || this.game.gameover) return;
        if (input.includes('ArrowLeft') && this.x > 0) this.x -= this.speed;
        if (input.includes('ArrowRight') && this.x + this.width < width) this.x += this.speed;
    }
}

class Ball {
    constructor(game) {
        this.game = game;
        this.reset();
        this.radius = 10;
    }

    reset() {
        this.x = width / 2;
        this.y = height / 2;
        this.dx = 4;
        this.dy = -5;
    }

    update() {
        if (this.game.paused || this.game.gameover || !this.game.move) return;

        this.x += this.dx;
        this.y += this.dy;

        if (this.x + this.radius >= width || this.x - this.radius <= 0) this.dx *= -1;
        if (this.y - this.radius <= 0) this.dy *= -1;

        if (this.y + this.radius >= this.game.blok.y &&
            this.y + this.radius <= this.game.blok.y + this.game.blok.height &&
            this.x >= this.game.blok.x &&
            this.x <= this.game.blok.x + this.game.blok.width) {
            this.dy *= -1;
            const hitPos = (this.x - this.game.blok.x) / this.game.blok.width;
            this.dx = 8 * (hitPos - 0.5);
        }

        this.game.checkBrickCollision();

        if (this.y + this.radius >= height) {
            this.game.lives--;
            livesDisplay.textContent = this.game.lives;
            if (this.game.lives <= 0) {
                this.game.endGame(false);
            } else {
                this.reset();
                this.game.move = false;
            }
        }
    }

    handleInput(input) {
        if (input.includes(' ') && !this.game.paused) {
            this.game.move = true;
        }
    }
}

class Brick {
    constructor(x, y, durability = 1) {
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 20;
        this.durability = durability;
        this.markedForDeletion = false;
        this.element = this.createBrickElement();
        gameContainer.appendChild(this.element);
        this.updateAppearance();
    }

    createBrickElement() {
        const brick = document.createElement('div');
        brick.classList.add('brick');
        Object.assign(brick.style, {
            position: 'absolute',
            left: `${this.x}px`,
            top: `${this.y}px`,
            width: `${this.width}px`,
            height: `${this.height}px`,
            borderRadius: '3px'
        });
        return brick;
    }

    updateAppearance() {
        const colors = { 1: '#4CAF50', 2: '#FFC107', 3: '#F44336' };
        this.element.style.backgroundColor = colors[this.durability] || '#9E9E9E';
    }

    hit() {
        this.durability--;
        if (this.durability <= 0) {
            this.destroy();
        } else {
            this.updateAppearance();
        }
    }

    destroy() {
        this.element.style.opacity = '0';
        setTimeout(() => this.element.remove(), 200);
        this.markedForDeletion = true;
    }
}

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.ball = new Ball(this);
        this.blok = new Blok(this);
        this.input = new Input(this);
        this.gameover = false;
        this.paused = false;
        this.move = false;
        this.bricks = [];
        this.score = 0;
        this.lives = 3;
        this.startTime = performance.now();
        this.createBricks();

        continueBtn.addEventListener('click', () => this.togglePause());
        restartBtn.addEventListener('click', () => this.input.resetGame());
    }

    createBricks() {
        this.bricks = [];
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 10; col++) {
                this.bricks.push(new Brick(col * 75 + 15, row * 30 + 50));
            }
        }
    }

    resetBricks() {
        this.bricks.forEach(brick => brick.element.remove());
        this.createBricks();
    }

    checkBrickCollision() {
        this.bricks.forEach((brick, index) => {
            if (!brick.markedForDeletion &&
                this.ball.x + this.ball.radius >= brick.x &&
                this.ball.x - this.ball.radius <= brick.x + brick.width &&
                this.ball.y + this.ball.radius >= brick.y &&
                this.ball.y - this.ball.radius <= brick.y + brick.height) {
                this.ball.dy *= -1;
                brick.hit();
                if (brick.markedForDeletion) {
                    this.bricks.splice(index, 1);
                    this.score += 10;
                    scoreDisplay.textContent = this.score;
                    if (this.bricks.length === 0) this.endGame(true);
                }
            }
        });
    }

    endGame(won) {
        this.gameover = true;
        this.move = false;
        mesag.textContent = won ? "You Win! Press Space to Restart" : "Game Over! Press Space to Restart";
        mesag.style.display = "block";
    }

    togglePause() {
        if (this.gameover) return;
        this.paused = !this.paused;
        pauseMenu.classList.toggle('hidden', !this.paused);
    }

    updateTimer() {
        if (!this.paused && !this.gameover) {
            const elapsed = Math.floor((performance.now() - this.startTime) / 1000);
            timerDisplay.textContent = elapsed;
        }
    }
}

const game = new Game(width, height);

let lastTime = 0;
let frameCount = 0;

function animate(timestamp) {
    if (lastTime) {
        frameCount++;
        if (timestamp - lastTime >= 1000) {
            console.log(`FPS: ${frameCount}`);
            frameCount = 0;
            lastTime = timestamp;
        }
    } else {
        lastTime = timestamp;
    }

    game.ball.handleInput(game.input.keys);
    game.ball.update();
    game.blok.update(game.input.keys);
    game.updateTimer();

    blok.style.left = game.blok.x + 'px';
    ball.style.left = `${game.ball.x - game.ball.radius}px`;
    ball.style.top = `${game.ball.y - game.ball.radius}px`;

    if (!game.gameover) {
        requestAnimationFrame(animate);
    }
}

animate();