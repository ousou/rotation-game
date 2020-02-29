var game = {};

game.canvas = document.getElementById("rotationCanvas");
game.ctx = game.canvas.getContext("2d");

document.addEventListener('DOMContentLoaded', function() {
    drawVakanen(game.ctx);
}, false);

function drawVakanen(ctx) {
    ctx.beginPath();
    start_x = 160;
    start_y = 175;
    thickness = 50;
    height = 125;
    width = 90;
    ctx.rect(start_x, start_y, thickness, height);
    ctx.rect(start_x + thickness, start_y + height - thickness,
             start_x + thickness + width, thickness);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
}
