var game = {};

game.canvas = document.getElementById("rotationCanvas");
game.ctx = game.canvas.getContext("2d");

game.vakanen = {};
game.vakanen.start_x = 160;
game.vakanen.start_y = 175;
game.vakanen.thickness = 50;
game.vakanen.height = 125;
game.vakanen.width = 300;
game.vakanen.midpoint_x = game.vakanen.start_x +
  (game.vakanen.thickness + game.vakanen.width) * 0.5;
game.vakanen.midpoint_y = game.vakanen.start_y +
  (game.vakanen.height - game.vakanen.thickness + game.vakanen.height) * 0.5;
game.vakanen.color = "#FFFFFF";

document.addEventListener('DOMContentLoaded', function() {
    drawVakanen(game.vakanen.color);
    drawFunction = function() {
      drawVakanen("#000000");
    };
    for (i = 1; i <= 7; i++) {
      drawRotatedVakanen(drawFunction, i * 45);
    }
}, false);

function draw() {
    game.ctx.clearRect(0, 0, pong.canvas.width, pong.canvas.height);
    drawBall(pong.ctx, pong.state.ball.x, pong.state.ball.y, pong.constants.ballRadius, pong.constants.color);
    drawPaddle(pong.ctx, pong.state.paddle1.x, pong.state.paddle1.y, pong.constants.paddleHeight, pong.constants.paddleWidth, pong.constants.color);
    drawPaddle(pong.ctx, pong.state.paddle2.x, pong.state.paddle2.y, pong.constants.paddleHeight, pong.constants.paddleWidth, pong.constants.color);
    checkCollisions();
    updateBallLocation();
    updatePaddleLocation(pong.state.paddle1);
    updatePaddleLocation(pong.state.paddle2);
}

function drawVakanen(color) {
    game.ctx.fillStyle = color;
    game.ctx.fillRect(game.vakanen.start_x, game.vakanen.start_y,
             game.vakanen.thickness, game.vakanen.height);
    game.ctx.fillRect(game.vakanen.start_x + game.vakanen.thickness,
             game.vakanen.start_y + game.vakanen.height - game.vakanen.thickness,
             game.vakanen.width,
             game.vakanen.thickness);
}

function drawRotatedVakanen(drawFunction, rotation_deg) {
  game.ctx.translate(game.vakanen.midpoint_x, game.vakanen.midpoint_y );
  game.ctx.rotate((rotation_deg / 180) * Math.PI);
  game.ctx.translate(-game.vakanen.midpoint_x, -game.vakanen.midpoint_y );
  drawFunction();
}
