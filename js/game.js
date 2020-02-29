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
game.vakanen.current_rotation_deg = 0;

document.addEventListener("DOMContentLoaded", start, false);

function start() {

  setInterval(drawRotatedVakanen, 1);
}

function drawRotatedVakanen(drawFunction) {
    drawFunction = function() {
      drawVakanen(game.vakanen.color);
    };
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    drawRotated(drawFunction, game.vakanen.current_rotation_deg);
    game.vakanen.current_rotation_deg += 0.5;
    game.vakanen.current_rotation_deg = game.vakanen.current_rotation_deg % 360;
}


function drawVakanen(color) {
    game.ctx.fillStyle = color;
    game.ctx.fillRect(game.vakanen.start_x, game.vakanen.start_y,
             game.vakanen.thickness, game.vakanen.height);
    game.ctx.fillRect(game.vakanen.start_x + game.vakanen.thickness - 1,
             game.vakanen.start_y + game.vakanen.height - game.vakanen.thickness,
             game.vakanen.width,
             game.vakanen.thickness);
}

function drawRotated(drawFunction, rotation_deg) {
  doRotation(rotation_deg, game.vakanen.midpoint_x, game.vakanen.midpoint_y);
  drawFunction();
  cleanupRotation(rotation_deg, game.vakanen.midpoint_x, game.vakanen.midpoint_y);
}

function doRotation(rotation_deg, midpoint_x, midpoint_y) {
  game.ctx.translate(midpoint_x, midpoint_y );
  game.ctx.rotate((rotation_deg / 180) * Math.PI);
  game.ctx.translate(-midpoint_x, -midpoint_y );
}

function cleanupRotation(rotation_deg, midpoint_x, midpoint_y) {
  game.ctx.translate(midpoint_x, midpoint_y );
  game.ctx.rotate(-(rotation_deg / 180) * Math.PI);
  game.ctx.translate(-midpoint_x, -midpoint_y );
}
