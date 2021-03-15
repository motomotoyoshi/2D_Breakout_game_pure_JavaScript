// "use strict";
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// ボールの変数
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;

// パドルの変数
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

// ブロックの変数
let brickRowCount = 12;
let brickColumnCount = 6;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetleft = 30;
let brickStatusMax = 3;

let bricks = [];
for(let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for(let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {x: 0, y: 0, status: brickStatusMax};
  }
}

// スコア
let score = 0;

// ライフ
let lives = 3;


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

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

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function collisionnDetection() {
  for(let c = 0; c < brickColumnCount; c++) {
    for(let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if(b.status > 0) {
        if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status--;
          score++;
          if(score == brickRowCount * brickColumnCount * brickStatusMax) {
            alert(`YOU WIN, CONGRATULATIONS!\nYOUR SCORE: ${score}`);
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
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

      if(bricks[c][r].status > 0) {
        let brickX = (c * (brickWidth + brickPadding)) + brickOffsetleft;
        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);

        if (bricks[c][r].status == 3) {
          ctx.fillStyle = "#0095DD";
        } else if (bricks[c][r].status == 2) {
          ctx.fillStyle = "#DEB900";
        } else {
          ctx.fillStyle = "#DE0025";
        }
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
  drawScore();
  drawLives();
  collisionnDetection();

  if(x + dx >= canvas.width - ballRadius || x + dx <= ballRadius) {
    dx = -dx * 1.03;
  }

  if(y + dy < ballRadius) {
    dy = -dy * 1.03;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      if(y = y - paddleHeight ) {
        dy = -dy * 1.03;
      }
    } else {
      lives--;
      if(!lives) {
        alert(`GAME OVER\nYOUR SCORE: ${score}`);
        document.location.reload();
        clearInterval(interval); 
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if(rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 6;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 6;
  }

  x += dx*1.03;
  y += dy*1.03;
  requestAnimationFrame(draw);
}


draw();