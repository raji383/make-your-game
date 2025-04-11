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
            this.frameTimer+=deltaTime
            if (this.frameTimer >= this.frameInterval) {
                this.frameTimer = 0;
            if (this.frameX < 450) {
                this.frameX =   850
            }else{
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
                }else{
                    this.positionY = 390;
                }
              
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
                if (this.game.player.moveright) {
                    this.game.player.marioim.style.left = '0' 
                   
                }else{
                    this.game.player.marioim.style.left= '-850%';
                }
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
        this.coin.checkCollision();
        this.coin.draw();
    }
}

const game = new Game();
let lastTime =0;
function animation(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.draw(deltaTime);
    requestAnimationFrame(animation);
}

animation(0);
