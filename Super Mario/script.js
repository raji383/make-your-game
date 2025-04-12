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
        this.width=50;
        this.height=70;
        this.element = element;
        this.marioim = marioim;
        this.positionX = 300;
        this.positionY = 390;
        this.speed = 5;
        this.jumpSpeed = 10;
        this.gravity = 0.5;
        this.frameTimer = 0;
        this.frameInterval = 100;
        this.frameX = 0;
        this.isJumping = false;
        this.velocityY = 0;
        this.moveright = true;
    }

    moveLeft(deltaTime) {

        this.moveright = false;
        if (!this.isJumping) {
            this.positionY = 395;
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
            this.positionY = 390;
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
            console.log("Jump triggered!");
            this.isJumping = true;
            this.velocityY = -this.jumpSpeed;
            this.positionY += this.velocityY;
            if (this.moveright) {
                this.marioim.style.left = '-720%'
            } else {
                this.marioim.style.left = '-150%';
            }
        }
    }


    applyGravity() {
        if (this.isJumping) {
            this.velocityY += this.gravity;
            this.positionY += this.velocityY;

            if (this.moveright) {
                this.marioim.style.top = '-650%';
                this.marioim.style.left = '-720%';
            } else {
                this.marioim.style.top = '0';
                this.marioim.style.left = '-150%';
            }

            if (this.positionY >= 395) {
                if (!this.moveright) {
                    this.positionY = 395;
                } else {
                    this.positionY = 390;
                }

                this.isJumping = false;
                this.velocityY = 0;
                this.marioim.style.left = this.moveright ? '0' : '-850%';
            }
        }
    }



    draw() {
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
            { startX: 2290, endX: 2330, yPosition: 500 },
            { startX: 2850, endX: 2950, yPosition: 500 },
            { startX: 5090, endX: 5150, yPosition: 1000 },
        ];
        this.bloks = [
            { startX: 900, endX: 990, startY: 390, endY: 350, box: false },
            { startX: 1235, endX: 1325, startY: 390, endY: 310, box: false },
            { startX: 1500, endX: 1590, startY: 390, endY: 340, box: false },
            { startX: 1870, endX: 1940, startY: 390, endY: 340, box: false },
            { startX: 4900, endX: 4990, startY: 390, endY: 365, box: false },
        ]
    }

    update() {
        this.holes.forEach(hole => {

            if (this.player.positionX + this.background.positionX > hole.startX &&
                this.player.positionX + this.background.positionX < hole.endX &&
                !this.player.isJumping) {


                if (this.player.positionY < hole.yPosition) {
                    this.player.positionY += this.player.speed;
                    this.player.marioim.style.left = 0;
                    this.player.marioim.style.top = 0;
                    this.game.fulling = true;

                }
            }
        });
        this.bloks.forEach(blok => {
            console.log(this.player.positionX + this.background.positionX)
            if (
                this.player.positionX + this.background.positionX > blok.startX &&
                this.player.positionX + this.background.positionX < blok.endX &&
                this.player.positionY > blok.endY

            ) {
                if (this.game.player.moveright) {
                      this.player.positionX = blok.startX - this.background.positionX
                }else{
                    this.player.positionX = blok.endX - this.background.positionX
                }
              
            }
            if ( this.player.positionY + this.player.height <= blok.startY &&
                this.player.positionX + this.background.positionX + this.player.width > blok.startX &&
                this.player.positionX + this.background.positionX < blok.endX) {
                this.player.positionY = blok.startY - this.player.height;
                this.player.isJumping = false;
            }
            
        });
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
        this.player.applyGravity(deltaTime);
        this.player.draw();
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