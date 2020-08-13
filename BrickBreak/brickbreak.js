var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) }; //60 fps


  var keysDown = {};

  window.addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
  })

  window.addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
  })

  var canvas = document.createElement('canvas');
  var width = 400;
  var height = 600;
  canvas.width = width;
  canvas.height = height;
  var context = canvas.getContext('2d');

  var button = document.createElement('button');
  button.innerHTML = "Restart";
  var bWidth = 60;
  var bHeight = 20;
  button.width = bWidth;
  button.height = bHeight;


  var score = 0;
  var brickRows = 3;
  var brickCols = 4;
  var brickWidth = 60;
  var brickHeight = 10;
  var brickPadding = 10;
  var brickOffsetTop = 30;
  var brickOffsetLeft = 60;
  var maxScore = brickRows * brickCols;

  var bricks = [];
  for (var c = 0; c < brickCols; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRows; r++)
    {
      bricks[c][r] = {x: 0, y: 0, status: 1};
    }
  }

  function drawBricks () {
    for (var c = 0; c < brickCols; c++) {
      for (var r = 0; r < brickRows; r++) {
        if (bricks[c][r].status == 1) {
          var brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
          var brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          context.beginPath();
          context.rect(brickX, brickY, brickWidth, brickHeight);
          context.fillStyle = "#000099";
          context.fill();
          context.closePath();
        }
      }
    }
  }

  function drawScore() {
    context.font = "18px Arial";
    context.fillStyle = "#ff66cc";
    if ( score < maxScore){
      context.fillText("Score: " + score, 8, 20);
    }
    if (score === maxScore) {
      context.fillText("You Win! Click Restart Button to Play Again!", 8, 20);
    }
  }

  function drawButton() {

  }


  function Paddle (x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
  }

  Paddle.prototype.render = function () {
    context.fillStyle = "#000000";
    context.fillRect(this.x, this.y, this.width, this.height);

  }

  Paddle.prototype.move = function(x,y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if (this.x < 0) {
      this.x = 0;
      this.x_speed = 0;
    }
    else if (this.x + this.width > 400) {
      this.x = 400 - this.width;
      this.x_speed = 0;
    }
  }


  function Player () {
    this.paddle = new Paddle(175, 560, 50, 10);
  }

  Player.prototype.render = function () {
    this.paddle.render();
  };

  Player.prototype.update = function () {
    for (var key in keysDown) {
      var value = Number(key);
      if (value == 37) {
        this.paddle.move(-4, 0);
      }
      else if (value == 39) {
        this.paddle.move(4, 0);
      }
      else {
        this.paddle.move(0,0);
      }
    }
  };

  function Ball (x,y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 3;
    this.radius = 5;
  }

  Ball.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    context.fillStyle = "#cc0000";
    context.fill();
  }

  Ball.prototype.update = function (paddle) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;
    if (this.x - 5 < 0)
    {
      this.x = 5;
      this.x_speed = -this.x_speed;
    }
    else if (this.x + 5 > 400) {
      this.x = 395;
      this.x_speed = -this.x_speed;
    }
    if (this.y < 0 || this.y > 600) {
      this.x_speed = 0;
      this.y_speed = 3;
      this.x = 200;
      this.y = 300;
    }

    if (top_y > 300) {
      if (top_y < (paddle.y + paddle.height) && bottom_y > paddle.y &&
      top_x < (paddle.x + paddle.width) && bottom_x > paddle.x) {
        //hits the player paddle
        this.y_speed = -3;
        this.x_speed += (paddle.x_speed / 2);
        this.y += this.y_speed;
      }
    }

    for (var c = 0; c < brickCols; c++) {
      for (var r = 0; r < brickRows; r++) {
        var b = bricks[c][r];
        if (b.status == 1) {
        if (this.x > b.x && this.x < (b.x + brickWidth) && this.y > b.y && this.y < (b.y + brickHeight)) {
          this.y_speed = 3;
          this.x_speed += (paddle.x_speed / 2);
          this.y += this.y_speed;
          b.status = 0;
          score++;
        }
      }
      }
    }

    if (score === maxScore) {
      this.y_speed = 0;
      this.x_speed = 0
      this.x = 200;
      this.y = 300;
    }


  }

  var player = new Player();
  var ball = new Ball(200,300);


  var update = function () {
      player.update();
      ball.update(player.paddle);
  };

  var render = function () {
    context.fillStyle = "#99CCFF";
    context.fillRect(0, 0, width, height);
    drawBricks();
    drawScore();
    player.render();
    ball.render();
  };

  var step = function () {
    update();
    render();
    animate(step);
  };

  button.addEventListener("click", function () {
    location.reload();
  })

window.onload = function () {
  document.body.appendChild(canvas);
  document.body.appendChild(button);
  animate(step);
};
