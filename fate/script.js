window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;

    class Input {
        constructor(game) {
            this.game = game;
            this.keys = [];
            window.addEventListener('keydown', e => {
                if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', ' ', 'a'].includes(e.key) && !this.keys.includes(e.key)) {
                    this.keys.push(e.key);
                }
            });
           /* window.addEventListener('keyup', e => {
                if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', ' ', 'a'].includes(e.key)) {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });*/
        }
    }

    class Player {
        constructor(game) {
            this.game = game;
            this.width = 70;
            this.height = 80;
            this.x = 50;
            this.y = this.game.height - this.height - this.game.groundMargin;
            this.speedX = 0;
            this.speedY = 0;
            this.gravity = 0.5;
            this.image = document.getElementById('player');
            this.frameX = 0;
            this.frameY = 0;
            this.frameTimer = 0;
            this.frameInterval = 100;
            this.maxFrame = 3;
        }

        draw(context) {
            context.drawImage(
                this.image,
                this.frameX * this.width, this.frameY * this.height,
                this.width, this.height,
                this.x, this.y, this.width, this.height
            );
        }

        handleInput(input) {
            this.speedX = 0;

            if (input.includes('ArrowRight')) {
                this.speedX = 5;
                this.frameY = 1;
                this.maxFrame = 3;
            } 
            if (input.includes('ArrowLeft')) {
                this.speedX = -5;
                this.frameY = 1;
                this.maxFrame = 3;
            }
            if (input.includes('ArrowUp') && this.y >= this.game.height - this.height - this.game.groundMargin) {
                this.speedY = -10;
                this.frameY = 8;
                this.maxFrame = 7;
            } 
             if (input.includes('ArrowDown')) {
                this.frameY = 9;
                this.maxFrame = 1;
            } 
            if (input.includes(' ')) {
                this.frameY = 0;
                this.maxFrame = 4;
            } 
             if (input.includes('a')) {
                this.frameY = 2;
                this.maxFrame = 3;
            } 
            else {
                this.frameY = 1;
                this.maxFrame = 3;
            }
        }

        update(deltaTime) {
            this.handleInput(this.game.input.keys);
            if (this.frameTimer > this.frameInterval) {
                this.frameX = (this.frameX + 1) % this.maxFrame;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }

            this.x += this.speedX;
            this.y += this.speedY;
            if (this.y < this.game.height - this.height - this.game.groundMargin) {
                this.speedY += this.gravity;
            } else {
                this.y = this.game.height - this.height - this.game.groundMargin;
                this.speedY = 0;
            }
        }
    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 20;
            this.input = new Input(this);
            this.player = new Player(this);
        }

        update(deltaTime) {
            this.player.update(deltaTime);
        }

        draw(context) {
            this.player.draw(context);
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }

    animate(0);
});
