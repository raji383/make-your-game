const back = document.getElementById('background');
const mario = document.getElementById('player');
const marioim = document.getElementById('player-img');
const coinEl = document.getElementById('coin');
const over = document.getElementById('gameover')
const win = document.getElementById('win')

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

class Background {
    constructor(element, game) {
        this.game = game;
        this.element = element;
        this.positionX = 0;
        this.speed = 0;
        this.maxScroll = 7038 - 900;
    }

    draw() {
        this.positionX += this.speed;
        if (this.positionX >= this.maxScroll) {
            this.positionX = this.maxScroll;
            this.game.gameOver = true
            this.game.win = true
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
            //{ startX: 5100, endX: 5190, yPosition: 500 },
        ];

        this.bloks = [
            ///anabib
            /*onpop1*/ { startX: 930, endX: 990, startY: 395, endY: 395, box: false },
            /*onpop2*/ { startX: 1280, endX: 1325, startY: 365, endY: 395, box: false },
            /*onpop3*/ { startX: 1545, endX: 1590, startY: 330, endY: 395, box: false },
            /*onpop4*/ { startX: 1915, endX: 1940, startY: 330, endY: 395, box: false },
            /*onpop4*/ { startX: 5450, endX: 5500, startY: 395, endY: 395, box: false },
            /*onpop4*/ { startX: 5975, endX: 6020, startY: 395, endY: 395, box: false },


            ////daraj
            //draj1
            { startX: 4480, endX: 4490, startY: 425, endY: 395, box: false },
            { startX: 4520, endX: 4540, startY: 390, endY: 395, box: false },
            { startX: 4550, endX: 4580, startY: 355, endY: 395, box: false },
            { startX: 4590, endX: 4600, startY: 325, endY: 395, box: false },
            //draj2
            { startX: 4680, endX: 4695, startY: 330, endY: 395, box: false },
            { startX: 4770, endX: 4785, startY: 430, endY: 395, box: false },
            { startX: 4740, endX: 4755, startY: 395, endY: 395, box: false },
            { startX: 4710, endX: 4725, startY: 360, endY: 395, box: false },
            //draj3
            { startX: 4953, endX: 4960, startY: 425, endY: 395, box: false },
            { startX: 4993, endX: 5010, startY: 390, endY: 395, box: false },
            { startX: 5023, endX: 5050, startY: 355, endY: 395, box: false },
            { startX: 5063, endX: 5100, startY: 325, endY: 395, box: false },
            //draj4
            { startX: 5270, endX: 5285, startY: 430, endY: 395, box: false },
            { startX: 5240, endX: 5255, startY: 395, endY: 395, box: false },
            { startX: 5210, endX: 5225, startY: 360, endY: 395, box: false },
            { startX: 5180, endX: 5195, startY: 330, endY: 395, box: false },
            //darj final
            { startX: 6030, endX: 6050, startY: 425, endY: 395, box: false },
            { startX: 6080, endX: 6100, startY: 390, endY: 395, box: false },
            { startX: 6110, endX: 6140, startY: 355, endY: 395, box: false },
            { startX: 6150, endX: 6170, startY: 325, endY: 395, box: false },
            { startX: 6180, endX: 6200, startY: 290, endY: 395, box: false },
            { startX: 6210, endX: 6230, startY: 255, endY: 395, box: false },
            { startX: 6240, endX: 6270, startY: 225, endY: 395, box: false },
            { startX: 6280, endX: 6330, startY: 190, endY: 395, box: false },


            ///solo bock
            /*1*/ { startX: 545, endX: 560, startY: 325, endY: 302, box: true },
            /*2*/ { startX: 745, endX: 759, startY: 190, endY: 202, box: true },
            /*3*/{ startX: 710, endX: 745, startY: 325, endY: 302, box: true },
             /*4*/{ startX: 780, endX: 810, startY: 325, endY: 302, box: true },
            /*3*/ { startX: 3145, endX: 3160, startY: 325, endY: 302, box: false },
            /*4*/ { startX: 3545, endX: 3570, startY: 325, endY: 302, box: true },
            /*5*/ { startX: 3645, endX: 3670, startY: 325, endY: 302, box: true },
            /*5-2*/ { startX: 3645, endX: 3670, startY: 190, endY: 202, box: true },
            /*6*/ { startX: 3745, endX: 3770, startY: 325, endY: 302, box: true },
            /*7*/ { startX: 3930, endX: 3970, startY: 325, endY: 302, box: false },

            //till bolck
            /*tall1*/{ startX: 680, endX: 840, startY: 325, endY: 302, box: false },
            /*tall2*/{ startX: 2570, endX: 2670, startY: 325, endY: 302, box: false },
            /*tall3*/{ startX: 2680, endX: 2920, startY: 190, endY: 202, box: false },
            /*tall3*/{ startX: 3060, endX: 3160, startY: 190, endY: 202, box: false },
            /*tall3*/{ startX: 3340, endX: 3400, startY: 325, endY: 302, box: false },
            /*tall4*/{ startX: 4020, endX: 4125, startY: 190, endY: 202, box: false },
            /*tall5*/{ startX: 4270, endX: 4405, startY: 190, endY: 202, box: false },
            /*tall5-2*/{ startX: 4320, endX: 4375, startY: 325, endY: 302, box: false },
            /*tall6*/{ startX: 5600, endX: 5730, startY: 325, endY: 302, box: false },
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
                this.player.positionY >= 380 &&
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

            if (
                this.player.velocityY < 0 &&
                playerBox.bottom > blokBox.bottom &&
                playerBox.top < blokBox.bottom &&
                playerBox.bottom > blokBox.top &&
                playerBox.right > blokBox.left &&
                playerBox.left < blokBox.right
            ) {
                if (blok.box) {
                    this.game.coin.collect()
                    const newDiv = document.createElement('div');
                    newDiv.style.width =  '32px';
                    newDiv.style.height = '32px';
                    newDiv.style.backgroundImage="url('block.png')";
                    newDiv.style.backgroundSize= 'cover';
                    newDiv.style.position = 'absolute';
                    newDiv.style.top = (blokBox.top-24) + 'px';
                    newDiv.style.left = (blokBox.left-11) + 'px';
                    newDiv.style.zIndex = "10";
                    document.getElementById('background').appendChild(newDiv);

                    blok.box = false;
                }
                this.player.velocityY = 0;
                this.player.positionY = blokBox.bottom;
                this.player.isJumping = true;
            }


            if (
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
                playerBox.left < blokBox.right &&
                !this.player.isJumping
            ) {
                this.player.positionX = this.player.moveright
                    ? blokBox.left - this.background.positionX - this.player.width
                    : blokBox.right - this.background.positionX;
            }
        });


        if (!onBlock) {
            this.player.ground = 390;
        }
    }
}

class Game {
    constructor() {
        this.background = new Background(back, this);
        this.player = new Player(mario, this, marioim);
        this.input = new Input(this);
        this.coin = new Coin(coinEl, this)
        this.map = new Map(this, this.background, this.player)
        this.score = 0;
        this.fulling = false;
        this.gameOver = false;
        this.win = false
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
        this.coin.draw()

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
    console.log(game.win)
    if (!game.gameOver) {
        requestAnimationFrame(animation);
    } else {
        if (game.win) {
            win.style.display = 'block'
        } else {
            over.style.display = 'block'
        }

    }

}

animation(0);