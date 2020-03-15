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

game.constants = {};
game.constants.friction = 0.95;
game.constants.update_delay_ms = 15;

game.state = {};
game.state.mouse_down_inside = false;
game.state.hit_done = false;


document.addEventListener("DOMContentLoaded", startAnimation, false);

function startAnimation() {
    game.vakanen.start_animation_interval = setInterval(drawIntroRotatedVakanen,
      game.constants.update_delay_ms);
}

function startGame() {
    clearInterval(game.vakanen.start_animation_interval);
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    drawFunction = function() {
      drawVakanen(game.vakanen.color);
    };
    game.vakanen.current_rotation_deg = 0;
    drawRotated(drawFunction, game.vakanen.current_rotation_deg);
    var info = document.getElementsByClassName("info");

    for (var i = 0; i < info.length; i ++) {
        info[i].style.visibility = "visible";
    }

    game.canvas.onmousedown = checkMouseDown;
    game.canvas.onmousemove = checkMouseMove;
    game.canvas.onmouseup = checkMouseUp;
}

function monitorHit() {
}

function getCoordinates(e) {
    var rect = game.ctx.canvas.getBoundingClientRect();
    x = e.x - rect.left;
    y = e.y - rect.top;
    return [x, y];
}

function checkMouseDown(e) {
    coords = getCoordinates(e);
    console.log("x " + x);
    console.log("y " + y);
    if (isInsideVakanen(coords[0], coords[1])) {
        game.state.mouse_down_inside = true;
        game.state.mouse_down_orig_x = coords[0];
        game.state.mouse_down_orig_y = coords[1];
        game.state.mouse_down_orig_rotation = game.vakanen.current_rotation_deg;
        console.log("game.state.mouse_down_orig_x " + game.state.mouse_down_orig_x);
        console.log("game.state.mouse_down_orig_y " + game.state.mouse_down_orig_y);
        console.log("game.state.mouse_down_orig_rotation " + game.state.mouse_down_orig_rotation);
    } else {
        game.state.mouse_down_inside = false;
    }
}

function checkMouseUp(e) {
    if (game.state.hit_done === true) return;
    game.state.hit_done = true;
    game.state.mouse_down_inside = false;
    speed = game.state.mouse_current_y - game.state.mouse_prev_y;
    console.log("speed " + speed);
    setTimeout(function() {animateHit(speed);}, 10);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function animateHit(speed) {
    movement = speed * 0.5;
    while (Math.abs(movement) > 0.1) {
        game.vakanen.current_rotation_deg += movement;
        drawRotatedVakanen();
        movement *= game.constants.friction;
        await sleep(game.constants.update_delay_ms);
    }
    game.state.hit_done = false;
}

function checkMouseMove(e) {
    if (game.state.mouse_down_inside == false) {
        return;
    }
    coords = getCoordinates(e);
    x = coords[0];
    y = coords[1];
    rotation_deg = calculateRotationDeg(x, y);
    console.log("rotation_deg " + rotation_deg);
    // console.log("Drawing!");
    game.vakanen.current_rotation_deg = rotation_deg;
    game.state.mouse_prev_x = game.state.mouse_current_x;
    game.state.mouse_prev_y = game.state.mouse_current_y;
    game.state.mouse_current_x = coords[0];
    game.state.mouse_current_y = coords[1];
    drawRotatedVakanen();
}

function calculateRotationDeg(x, y) {
    x_rel = x - game.vakanen.midpoint_x;
    y_rel = y - game.vakanen.midpoint_y;
    // console.log("x_rel " + x_rel);
    // console.log("y_rel " + y_rel);
    if (y_rel == 0) {
        return 0;
    }
    rotation_rad = Math.atan(y_rel / x_rel);
    rotation_deg = (rotation_rad * 180) / Math.PI;
    if (x_rel < 0) {
        rotation_deg += 180;
    } else if (x_rel > 0 && y_rel < 0) {
        rotation_deg += 360;
    }
    if (game.state.mouse_down_orig_x < game.vakanen.midpoint_x &&
      (game.state.mouse_down_orig_rotation < 90 || game.state.mouse_down_orig_rotation > 270)) {
        rotation_deg += 180;
    }

    // if (game.state.mouse_down_orig_x > game.vakanen.midpoint_x &&
    //  (90 < game.state.mouse_down_orig_rotation < 270)) {
    //    rotation_deg -= 180;
    // }
    return rotation_deg % 360;
}

function drawRotatedVakanen() {
    drawFunction = function() {
      drawVakanen(game.vakanen.color);
    };
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    drawRotated(drawFunction, game.vakanen.current_rotation_deg);
}

function drawIntroRotatedVakanen() {
    drawRotatedVakanen();
    game.vakanen.current_rotation_deg += 2;
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

function isInsideVakanen(x, y) {
    doRotation(game.vakanen.current_rotation_deg,
      game.vakanen.midpoint_x, game.vakanen.midpoint_y);
    game.ctx.beginPath();
    game.ctx.rect(game.vakanen.start_x, game.vakanen.start_y,
             game.vakanen.thickness, game.vakanen.height);
    game.ctx.rect(game.vakanen.start_x + game.vakanen.thickness - 1,
             game.vakanen.start_y + game.vakanen.height - game.vakanen.thickness,
             game.vakanen.width,
             game.vakanen.thickness);
    var isInside = false;
    if (game.ctx.isPointInPath(x,y)) {
        isInside = true;
    }
    cleanupRotation(game.vakanen.current_rotation_deg,
      game.vakanen.midpoint_x, game.vakanen.midpoint_y);
    return isInside;
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
