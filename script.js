window.addEventListener('load', function () {
    const ball = document.getElementById('ball');
    const blok = document.getElementById('blok');
    const mesag = document.getElementById('mesag');

    const width = 800;
    const height = 700;

    class Input {
        constructor(game) {
            this.game = game;
            this.keys = [];
            window.addEventListener('keydown', e => {
                if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key) && !this.keys.includes(e.key)) {
                    this.keys.push(e.key);
                }
            });
            window.addEventListener('keyup', e => {
                if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
        }
    }

    class Blok {
        constructor(game) {
            this.game = game;
            this.x = 400;
            this.y = height - 30;
            this.width = 100;
            this.height = 15;
            this.speed = 7;
        }

        update(input) {
            if (input.includes('ArrowLeft') && this.x > 0) {
                this.x -= this.speed;
            } else if (input.includes('ArrowRight') && this.x + this.width < this.game.width) {
                this.x += this.speed;
            }
        }
    }

    class Ball {
        constructor(game) {
            this.game = game;
            this.x = 400;
            this.y = 350;
            this.dx = 3;
            this.dy = 3;
            this.radius = 10;
        }

        update() {
            if (this.game.move) {
                this.x += this.dx;
                this.y += this.dy;
            }


            if (this.x + this.radius >= this.game.width || this.x - this.radius <= 0) this.dx *= -1;

            if (this.y - this.radius <= 0) this.dy *= -1;


            if (
                this.y + this.radius >= this.game.blok.y - 20 &&
                this.x >= this.game.blok.x &&
                this.x <= this.game.blok.x + this.game.blok.width
            ) {
                this.dy *= -1;

            }

            if (this.y + this.radius >= this.game.height) {
                this.game.gameover = true;
            }
        }

        handleInput(input) {
            if (input.includes(' ')) {
                this.game.move = true;
            }
        }
    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.ball = new Ball(this);
            this.input = new Input(this);
            this.blok = new Blok(this);
            this.gameover = false;
            this.move = false;
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
