// "use strict";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

// ブロックの変数
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetleft = 30;

let bricks = [];
for(let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for(let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {x: 0, y: 0, status: 1};
  }
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if(e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = true;
  }
  if(e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if(e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = false;
  }
  if(e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = false;
  }
}

function collisionnDetection() {
  for(let c = 0; c < brickColumnCount; c++) {
    for(let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if(b.status == 1) {
        if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
        }
      }
    }
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for(let c = 0; c < brickColumnCount; c++) {
    for(let r = 0; r < brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
        let brickX = (c * (brickWidth + brickPadding)) + brickOffsetleft;
        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionnDetection();

  if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx*1.03;
  }

  if(y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy*1.03;
    } else {
      clearInterval(interval); 
      document.location.reload();
      alert("GAME OVER");
    }
  }

  if(rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx*1.03;
  y += dy*1.03;
}

let interval = setInterval(draw, 10);