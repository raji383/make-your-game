const back = document.getElementById('background');
const mario = document.getElementById('player');
const marioim = document.getElementById('player-img');
const coinEl = document.getElementById('coin');

class Background {
    constructor(element) {
        this.element = element;
        this.positionX = 0;
        this.speed = 0;
        this.maxScroll = 7038 - 900;
    }

    draw() {
        this.positionX += this.speed;
        if (this.positionX >= this.maxScroll) {
            this.positionX = this.maxScroll;
        }
        if (this.positionX < 0) {
            this.positionX = 0;
        }
        this.element.style.left = `-${this.positionX}px`;
    }
}

class Player {
    constructor(element, game, marioim) {
        this.game = game;
        this.element = element;
        this.marioim = marioim;
        this.positionX = 300;
        this.positionY = 395;
        this.speed = 5;
        this.jumpSpeed = 10;
        this.gravity = 0.5;
        this.frameX = 0;
        this.isJumping = false;
        this.velocityY = 0;
        this.moveright = true;
    }

    moveLeft() {
        this.moveright = false;
        this.marioim.style.top = '0';
        if (this.positionX > 200) {
            this.positionX -= this.speed;
        } else if (this.game.background.positionX > 0) {
            this.game.background.positionX -= this.speed;
        }

        this.frameX = this.frameX < 450 ? 850 : this.frameX - 150;
        this.marioim.style.left = `-${this.frameX}%`;
    }

    moveRight() {
        this.moveright = true;
        this.marioim.style.top = '-650%';

        if (this.positionX < 600) {
            this.positionX += this.speed;
        } else if (this.game.background.positionX < this.game.background.maxScroll) {
            this.game.background.positionX += this.speed;
        }

        this.frameX = this.frameX > 300 ? 0 : this.frameX + 150;
        this.marioim.style.left = `-${this.frameX}%`;
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.velocityY = -this.jumpSpeed;
            this.marioim.style.left = this.moveright ? '-720%' : '-150%';
        }
    }

    applyGravity() {
        if (this.isJumping) {
            this.velocityY += this.gravity;
            this.positionY += this.velocityY;

            if (this.positionY >= 395) {
                this.positionY = 395;
                this.isJumping = false;
                this.velocityY = 0;
                this.marioim.style.left = this.moveright ? '0' : '-850%';
            }
        }
    }

    draw() {
        this.element.style.left = `${this.positionX}px`;
        this.element.style.top = `${this.positionY}px`;
    }
}

class Coin {
    constructor(element, game) {
        this.element = element;
        this.game = game;
        this.collected = false;
        this.positionX = 1000;
        this.positionY = 395;
    }

    checkCollision() {
        const player = this.game.player;
        const distance = Math.abs((this.positionX - this.game.background.positionX) - player.positionX);
        if (distance < 40 && !this.collected) {
            this.collect();
        }
    }

    collect() {
        this.collected = true;
        this.element.style.display = "none";
        this.game.score++;
        document.getElementById("score").textContent = `Score: ${this.game.score}`;
    }

    draw() {
        if (!this.collected) {
            const offset = this.positionX - this.game.background.positionX;
            this.element.style.left = `${offset}px`;
            this.element.style.top = `${this.positionY}px`;
        }
    }
}

class Input {
    constructor(game) {
        this.game = game;
        this.keys = [];
        window.addEventListener('keydown', e => {
            if (['ArrowLeft', 'ArrowRight', ' ', 'p'].includes(e.key) && !this.keys.includes(e.key)) {
                this.keys.push(e.key);
            }
        });
        window.addEventListener('keyup', e => {
            if (['ArrowLeft', 'ArrowRight', ' ', 'p'].includes(e.key)) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}

class Game {
    constructor() {
        this.background = new Background(back);
        this.player = new Player(mario, this, marioim);
        this.input = new Input(this);
        this.coin = new Coin(coinEl, this);
        this.score = 0;
    }

    updateInput() {
        const keys = this.input.keys;
        if (keys.includes('ArrowLeft')) this.player.moveLeft();
        if (keys.includes('ArrowRight')) this.player.moveRight();
        if (keys.includes(' ')) this.player.jump();
    }

    draw() {
        this.updateInput();
        this.background.draw();
        this.player.applyGravity();
        this.player.draw();
        this.coin.checkCollision();
        this.coin.draw();
    }
}

const game = new Game();

function animation() {
    game.draw();
    requestAnimationFrame(animation);
}

animation();
