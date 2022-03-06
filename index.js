

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let BOX_WIDTH = canvas.width / 10;
let BOX_HEIGHT = canvas.width / 50;
let BALL_RADIUS = canvas.width / 100;
let PLAYER_COLOR = "#fff";



class Rectangle {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }
    resize(old_width, old_height) {
        this.w = BOX_WIDTH;
        this.h = BOX_HEIGHT;
        this.x = this.x * canvas.width / old_width;
        this.y = this.y * canvas.height / old_height;
    }
    draw() {
        ctx.fillStyle= this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Player extends Rectangle {}

class Ball {
    constructor(x, y, rad, color) {
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.color = color;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 0, 360);
        ctx.fill();
    }

    resize(old_width, old_height) {
        this.rad = BALL_RADIUS;
        this.x = this.x * canvas.width / old_width;
        this.y = this.y * canvas.height / old_height;
    }
}

const player = new Player(canvas.width / 2 - BOX_WIDTH/2, canvas.height - 10, BOX_WIDTH, BOX_HEIGHT, PLAYER_COLOR);
const ball = new Ball(player.x+player.w/2, player.y-BALL_RADIUS, BALL_RADIUS, "white");
const boxes = [];

function init_boxes() {
    const colors = ["red", "red", "orange", "orange", "green", "green", "yellow", "yellow"]
    for(let i = 0;i < canvas.width;i+=BOX_WIDTH) {
        let idx = 0;
        for(let j = 0;j < BOX_HEIGHT * colors.length;j+=BOX_HEIGHT) {
            boxes.push(new Rectangle(i, j, BOX_WIDTH, BOX_HEIGHT, colors[idx]));
            idx++;
        }
    }
}

function update() {

}


function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    ball.draw();
    boxes.forEach((box) => {
        box.draw();
    });
}

function mainloop() {
    update();
    draw();
    requestAnimationFrame(mainloop);
}

function resize() {
    const old_width = canvas.width;
    const old_height = canvas.height;
    canvas.width = 512;
    canvas.height = 512;
    if (innerWidth < 512) {
        canvas.width = innerWidth;
        canvas.height = innerWidth;
    }
    BOX_WIDTH = canvas.width / 10;
    BOX_HEIGHT = canvas.width / 50;
    BALL_RADIUS = canvas.width / 100;
    player.resize(old_width, old_height);
    ball.resize(old_width, old_height);
    boxes.forEach((box) => {
        box.resize(old_width, old_height);
    });
}

window.onresize = resize;
resize();
init_boxes();

mainloop();

