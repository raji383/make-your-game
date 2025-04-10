const back = document.getElementById('background');
const mario = document.getElementById('player');
const marioim = document.getElementById('player-img');

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
            this.positionX = 0;
        }
        this.element.style.left = `-${this.positionX}px`;
    }
}

class Player {
    constructor(element, game) {
        this.game = game;
        this.element = element;
        this.positionX = 300;
        this.positionY = 395;
        this.speed = 5;
        this.jumpSpeed = 10;
        this.gravity = 0.5;
        this.isJumping = false;
        this.velocityY = 0;
        class gg{
            
        }
    }

    moveLeft() {

        this.game.background.positionX -= this.speed;
    }

    moveRight() {
        this.game.background.positionX += this.speed;
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.velocityY = -this.jumpSpeed;
        }
    }

    applyGravity() {
        if (this.isJumping) {
            this.velocityY += this.gravity;
            this.positionY += this.velocityY;

            if (this.positionY >= 395 ) {
                this.positionY = 395;
                this.isJumping = false;
                this.velocityY = 0;
            }
        }
    }

    draw() {
        this.element.style.left = `${this.positionX}px`;
        this.element.style.top = `${this.positionY}px`;
    }
}

class Game {
    constructor() {
        this.background = new Background(back);
        this.player = new Player(mario, this);
        this.initControls();
    }

    initControls() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.player.moveLeft();
                    break;
                case 'ArrowRight':
                    this.player.moveRight();
                    break;
                case ' ':
                    this.player.jump();
                    break;
            }
        });
    }

    draw() {
        this.background.draw();
        this.player.applyGravity();
        this.player.draw();
    }
}

const game = new Game();

function animation() {
    game.draw();
    requestAnimationFrame(animation);
}

animation();