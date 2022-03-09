const gameElem = document.querySelector("#game");
const ASPECT = 6/5;
let SCREEN_WIDTH = gameElem.clientWidth;
let SCREEN_HEIGHT = SCREEN_WIDTH * ASPECT;

const OG_MIN = 25;
const OG_WIDTH = 160;
const OG_HEIGHT = 192;


function rerange_value(value) {
    return value / OG_WIDTH * SCREEN_WIDTH;
}

function unrange_value(value) {
    return value / SCREEN_WIDTH * OG_WIDTH;
}


class GameObject {
    update() {}
    draw() {}
}

class UIData extends GameObject {
    constructor() {
        super();
        this.score = 0;
        this.lives = 3;
    }

    draw() {
        textSize(32);
        fill("white");
        text(`Lives: ${this.lives}`, 10, 48);
        text(`Score: ${this.score}`, SCREEN_WIDTH - SCREEN_WIDTH / 2.5, 48)
    }
}

class Brick extends GameObject {
    constructor(x, y, w, h, color) {
        super();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }
    draw() {
        stroke(this.color);
        fill(this.color);
        rect(
            rerange_value(this.x),
            rerange_value(this.y),
            rerange_value(this.w),
            rerange_value(this.h)
        );

    }
}

class Player extends Brick {
    update() {
        this.x = unrange_value(mouseX) - this.w/2;
    }
}

class Ball extends GameObject {
    constructor(x, y, r, speed, color) {
        super();
        this.x = x;
        this.y = y;
        this.r = r;
        this.speed = speed;
        this.og_speed = speed;
        this.color = color;
        this.vx = 0;
        this.vy = -1;
        this.state = "standby";
    }
    update_standby(player) {
        this.x = player.x + player.w / 2;
        this.y = player.y - this.r;
        if (keyIsDown(32) || mouseIsPressed) {
            this.state = "playing";
        }
        this.vx = 0;
        this.vy = -1;
    }

    collide_brick(brick, nx, ny) {
        let hit = false;
        if (collideRectCircle(brick.x, brick.y, brick.w, brick.h, nx, ny, this.r)) {
            if (this.x < brick.x || this.x > brick.x + brick.w) {
                this.vx = -this.vx;
            }
            else if (this.y < brick.y || this.y > brick.y + brick.h) {
                this.vy = -this.vy;
            }
            hit = true;
        }
        return hit;
    }
    update_playing(player, bricks, data) {
        let self = this;
        let nx = this.x + this.vx;
        let ny = this.y + this.vy;

        bricks.forEach((brick, i) => {
            if(self.collide_brick(brick, nx, ny)) {
                bricks.splice(i, 1);
                data.score += 1;
                if(bricks.length == 0) {
                    initBricks();
                    this.speed *= 2;
                }
            }
        });
        if(this.collide_brick(player, nx, ny)) {
            if(this.x < player.x + player.w/2) {
                this.vx = (this.x - (player.x + player.w/2)) * 0.5;
            }
            else if(this.x > player.x + player.w / 2) {
                this.vx = (this.x - (player.x + player.w / 2)) * 0.5;
            }
            this.vy = -3;
        }

        if(nx - this.r < 0 || nx + this.r > OG_WIDTH) {
            this.vx = -this.vx;
        }
        if(ny - this.r < OG_MIN) {
            this.vy = -this.vy
        }
        if(ny > OG_HEIGHT) {
            this.state = "standby";
            data.lives -= 1;
            if(data.lives < 0) {
                data.score = 0;
                data.lives = 3;
                this.speed = this.og_speed;
            }
        }
        const denom = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        this.vx = this.vx / denom;
        this.vy = this.vy / denom;
        nx = this.x + this.speed * this.vx;
        ny = this.y + this.speed * this.vy;
        this.x = nx;
        this.y = ny;
    }
    update(player, bricks, data) {
        if(this.state == "standby") {
            this.update_standby(player);
        }
        else {
            this.update_playing(player, bricks, data);
        }
    }

    draw() {
        fill(this.color);
        stroke(this.color);
        circle(
            rerange_value(this.x),
            rerange_value(this.y),
            rerange_value(this.r)
        );
    }
}

const uiData = new UIData();
const player = new Player(68, 188, 32, 2, "white");
const bricks = [];
function initBricks() {
    const rows = ["red", "red", "orange", "orange", "green", "green", "yellow", "yellow"];
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < OG_WIDTH; j += 10) {
            bricks.push(new Brick(j, i * 3 + OG_MIN, 10, 3, rows[i]));
        }
    }
}
initBricks();

const ball = new Ball(player.x + player.w / 2, player.y - 2, 2, 1.5, "white");

function setup() {
    const canvas = createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    canvas.parent(gameElem);
    canvas.style.position = "absolute";
    console.log(canvas);
}

function draw() {
    background("rgba(0, 0, 0, 0.3)");

    uiData.update();
    player.update();
    bricks.forEach((brick) => { brick.update() })
    ball.update(player, bricks, uiData);

    uiData.draw();
    player.draw();
    bricks.forEach((brick) => { brick.draw() })
    ball.draw();
}

function windowResized() {
    SCREEN_WIDTH = gameElem.clientWidth;
    SCREEN_HEIGHT = SCREEN_WIDTH * ASPECT;
    resizeCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
}