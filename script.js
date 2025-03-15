window.addEventListener('load', function () {
    const ball = document.getElementById('ball');
    const blok = document.getElementById('blok');
    const mesag = document.getElementById('mesag');
    const scoreDisplay = document.getElementById('score');
    const gameContainer = document.getElementById('bord');

    const width = 800;
    const height = 700;

    class Input {
        constructor(game) {
            this.game = game;
            this.keys = [];
            window.addEventListener('keydown', e => {
                if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key) && !this.keys.includes(e.key)) {
                    this.keys.push(e.key);
                    if (e.key === ' ' && this.game.gameover) this.resetGame();
                }
            });
            window.addEventListener('keyup', e => {
                if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
        }

        resetGame() {
            this.game.gameover = false;
            this.game.move = false;
            this.game.score = 0;
            scoreDisplay.textContent = this.game.score;
            mesag.style.display = "none";
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
            this.x = 400;
            this.y = height - 30;
            this.width = 100;
            this.height = 15;
        }

        update(input) {
            if (input.includes('ArrowLeft') && this.x > 0) {
                this.x -= this.speed;
            } else if (input.includes('ArrowRight') && this.x + this.width < width) {
                this.x += this.speed;
            }
        }
    }

    class Ball {
        constructor(game) {
            this.game = game;
            this.reset();
            this.radius = 10;
        }

        reset() {
            this.x = 400;
            this.y = 350;
            this.dx = 3;
            this.dy = -3;
        }

        update() {
            if (!this.game.move) return;

            this.x += this.dx;
            this.y += this.dy;

            if (this.x + this.radius >= width || this.x - this.radius <= 0) this.dx *= -1;
            if (this.y - this.radius <= 0) this.dy *= -1;

            if (this.y + this.radius >= this.game.blok.y - 18 &&
                this.x >= this.game.blok.x &&
                this.x <= this.game.blok.x + this.game.blok.width) {
                this.dy *= -1;
                const hitPos = (this.x - this.game.blok.x) / this.game.blok.width;
                this.dx = 5 * (hitPos - 0.5);
            }

            this.game.checkBrickCollision();

            if (this.y + this.radius >= height) {
                this.game.gameover = true;
            }
        }

        handleInput(input) {
            if (input.includes(' ')) {
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
            gameContainer?.appendChild(this.element);


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

            const colors = {
                1: '#4CAF50',
                2: '#FFC107',
                3: '#F44336'
            };
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
            this.element.remove();
            this.markedForDeletion = true;
        }

        reset() {
            this.durability = 1;
            this.markedForDeletion = false;
            this.updateAppearance();
            this.element.style.display = 'block';
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
            this.move = false;
            this.bricks = [];
            this.score = 0;
            this.createBricks();
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
            document.querySelectorAll('.brick').forEach(brick => brick.remove());
            this.createBricks();
        }

        checkBrickCollision() {
            this.bricks.forEach((brick, index) => {
                if (this.ball.x >= brick.x &&
                    this.ball.x <= brick.x + brick.width &&
                    this.ball.y >= brick.y &&
                    this.ball.y <= brick.y + brick.height) {
                    this.ball.dy *= -1;
                    brick.destroy();
                    this.bricks.splice(index, 1);
                    this.score += 10;
                    scoreDisplay.textContent = this.score;
                }
            });
        }
    }

    const game = new Game(width, height);

    function animate() {
        game.ball.handleInput(game.input.keys);
        game.ball.update();
        game.blok.update(game.input.keys);

        blok.style.left = game.blok.x + 'px';
        ball.style.left = game.ball.x + 'px';
        ball.style.top = game.ball.y + 'px';

        if (!game.gameover) {
            requestAnimationFrame(animate);
        } else {
            mesag.style.display = "block";
        }
    }

    animate();
});