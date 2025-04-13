const back = document.getElementById('background');
const mario = document.getElementById('player');
const marioim = document.getElementById('player-img');
const coinEl = document.getElementById('coin');
const over = document.getElementById('gameover')

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
        this.width = 50;
        this.height = 70;
        this.element = element;
        this.marioim = marioim;
        this.positionX = 300;
        this.positionY = 390;
        this.speed = 5;
        this.jumpSpeed = 13;
        this.gravity = 0.5;
        this.frameTimer = 0;
        this.frameInterval = 100;
        this.frameX = 0;
        this.ground = 390;
        this.isJumping = false;
        this.velocityY = 0;
        this.moveright = true;
        this.fulling = false

    }

    moveLeft(deltaTime) {

        this.moveright = false;
        if (!this.isJumping) {

            this.positionY = this.ground;


            this.marioim.style.top = '0';
        }

        if (this.positionX > 200) {
            this.positionX -= this.speed;
        } else if (this.game.background.positionX > 0) {
            this.game.background.positionX -= this.speed;
        }
        if (!this.isJumping) {
            this.frameTimer += deltaTime
            if (this.frameTimer >= this.frameInterval) {
                this.frameTimer = 0;
                if (this.frameX < 450) {
                    this.frameX = 850
                } else {
                    this.frameX -= 150;
                }
            }
            this.marioim.style.left = `-${this.frameX}%`;
        }

    }

    moveRight(deltaTime) {


        this.moveright = true;

        if (!this.isJumping) {

            this.positionY = this.ground;

            this.marioim.style.top = '-650%';
        }

        if (this.positionX < 600) {
            this.positionX += this.speed;
        } else if (this.game.background.positionX < this.game.background.maxScroll) {
            this.game.background.positionX += this.speed;
        }

        if (!this.isJumping) {
            this.frameTimer += deltaTime;
            if (this.frameTimer >= this.frameInterval) {
                this.frameTimer = 0;
                if (this.frameX >= 300) {
                    this.frameX = 0;
                } else {
                    this.frameX += 150;
                }
            }
            this.marioim.style.left = `-${this.frameX}%`;
        }
    }


    jump() {

        if (!this.isJumping) {

            this.isJumping = true;
            this.velocityY = -this.jumpSpeed;
            this.positionY += this.velocityY;
            console.log(this.velocityY, this.ground)
            if (this.moveright) {
                this.marioim.style.left = '-720%'
            } else {
                this.marioim.style.left = '-150%';
            }
        }
    }


    applyGravity() {
        if (this.isJumping || this.fulling) {
            this.velocityY += this.gravity;
            this.positionY += this.velocityY;

            if (this.moveright) {
                this.marioim.style.top = '-650%';
                this.marioim.style.left = '-720%';
            } else {
                this.marioim.style.top = '0';
                this.marioim.style.left = '-150%';
            }

            if (this.positionY >= this.ground) {
                if (!this.moveright) {
                    this.positionY = this.ground;
                } else {
                    this.positionY = this.ground;
                }

                this.isJumping = false;
                this.fulling = false
                this.velocityY = 0;
                this.marioim.style.left = this.moveright ? '0' : '-850%';
            }
        }
    }



    draw() {
        if (this.positionY + 5 <= this.ground) {
            this.fulling = true

        }
        if (!this.game.fulling) {
            this.element.style.left = `${this.positionX}px`;
        }

        this.element.style.top = `${this.positionY}px`;


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
                if (this.game.player.moveright) {
                    this.game.player.marioim.style.left = '0'

                } else {
                    this.game.player.marioim.style.left = '-850%';
                }
            }
        });
    }
}
class Map {
    constructor(game, background, player) {
        this.game = game;
        this.background = background;
        this.player = player;

        this.holes = [
            { startX: 2290, endX: 2385, yPosition: 500 },
            { startX: 2850, endX: 2950, yPosition: 500 },
            { startX: 5100, endX: 5190, yPosition: 500 },
        ];

        this.bloks = [
           /*onpop1*/ { startX: 930, endX: 990, startY: 395, endY: 395, box: false },
            ///*onpop2*/  { startX: 1280, endX: 1325, startY: 390, endY: 310, box: false },
            // /*onpop3*/ { startX: 1545, endX: 1590, startY: 390, endY: 340, box: false },
            // /*onpop4*/ { startX: 1915, endX: 1940, startY: 390, endY: 340, box: false },
            //  { startX: 4900, endX: 4990, startY: 390, endY: 365, box: false },
            //  /*1*/ { startX: 545, endX: 560, startY: 325, endY: 302, box: true },
            // /*2*/ { startX: 650, endX: 759, startY: 285, endY: 210, box: true },
            // /*tall1*/{ startX: 680, endX: 840, startY: 325, endY: 302, box: true },
        ];
    }

    getPlayerHitbox() {
        return {
            top: this.player.positionY,
            bottom: this.player.positionY + this.player.height,
            left: this.player.positionX + this.background.positionX,
            right: this.player.positionX + this.background.positionX + this.player.width,
        };
    }

    update() {
        const playerBox = this.getPlayerHitbox();
        let onBlock = false;

        this.holes.forEach(hole => {
            if (
                playerBox.left > hole.startX &&
                playerBox.right < hole.endX &&
                !this.player.isJumping
            ) {
                if (this.player.positionY < hole.yPosition) {
                    this.player.positionY += this.player.speed;
                    this.player.marioim.style.left = '0';
                    this.player.marioim.style.top = '0';
                    this.game.fulling = true;
                }
            }
        });

        this.bloks.forEach(blok => {
            const blokBox = {
                top: blok.startY,
                bottom: blok.endY,
                left: blok.startX,
                right: blok.endX
            };

            /* if (
                 playerBox.top <= blokBox.bottom &&
                 playerBox.top >= blokBox.bottom - 10 &&
                 playerBox.right > blokBox.left &&
                 playerBox.left < blokBox.right &&
                 this.player.velocityY < 0 &&
                 blok.box
             ) {
                 console.log("Hit box block!");
                 blok.box = false;
                 
             }*/


            if (
                this.player.moveright &&
                playerBox.bottom <= blokBox.top &&
                playerBox.right > blokBox.left &&
                playerBox.left < blokBox.right

            ) {
                this.player.ground = blokBox.top - this.player.height;
                onBlock = true;
                this.fulling = false;
            }
            console.log(playerBox.bottom <= blokBox.top, playerBox.right > blokBox.left, playerBox.left < blokBox.right)
            if (
                !this.player.moveright &&
                playerBox.bottom <= blokBox.top &&
                playerBox.right > blokBox.left &&
                playerBox.left < blokBox.right

            ) {
                this.player.ground = blokBox.top - this.player.height;
                onBlock = true;
                this.fulling = false;
            }


            if (
                playerBox.bottom > blokBox.top &&
                playerBox.top < blokBox.bottom &&
                playerBox.right > blokBox.left &&
                playerBox.left < blokBox.right

            ) {
                if (this.player.moveright) {
                    this.player.positionX = blokBox.left - this.background.positionX - this.player.width;
                }
            }

            if (
                playerBox.bottom > blokBox.top &&
                playerBox.top - 5 < blokBox.bottom &&
                playerBox.right > blokBox.left &&
                playerBox.left < blokBox.right

            ) {
                if (!this.player.moveright) {
                    this.player.positionX = blokBox.right - this.background.positionX;
                }
            }
        });
        

        if (!onBlock) {

            if (!this.player.moveright&&!this.player.isJumping) {
                this.player.positionY = this.player.ground + 5
            }
            this.player.ground = 390;

        }
    }
}

class Game {
    constructor() {
        this.background = new Background(back);
        this.player = new Player(mario, this, marioim);
        this.input = new Input(this);
        this.map = new Map(this, this.background, this.player)
        this.score = 0;
        this.fulling = false;
        this.gameOver = false;
    }

    updateInput(deltaTime) {
        const keys = this.input.keys;
        if (keys.includes(' ')) this.player.jump(deltaTime);
        if (keys.includes('ArrowLeft')) this.player.moveLeft(deltaTime);
        if (keys.includes('ArrowRight')) this.player.moveRight(deltaTime);

    }

    draw(deltaTime) {
        this.updateInput(deltaTime);
        this.background.draw();
        this.player.draw();
        this.player.applyGravity(deltaTime);

        this.map.update();
        if (this.player.positionY > 430) {
            this.gameOver = true
        }
    }
}

const game = new Game();
let lastTime = 0;
function animation(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.draw(deltaTime);
    if (!game.gameOver) {
        requestAnimationFrame(animation);
    } else {
        over.style.display = 'block'
    }

}

animation(0);