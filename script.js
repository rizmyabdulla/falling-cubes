const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

c.width = 400;
c.height = 600;

let mouseX = c.width / 2;
let playerX = 0;
let playerY = c.height / 2 + 20;

// cube variables
let angle = 0;
const cubeSize = 35;
const cubeHalfSize = cubeSize / 2;
const cubePos = { x: [], y: [], color: [], collided: [] };
const cubeColor = ["#FFFFFF", "#00FFB2"];

// level variables
let score = 0;
const cubeSpeed = 5;
let isGameOver = false;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getDistance = (xpos1, ypos1, xpos2, ypos2) => {
  return Math.hypot(xpos2 - xpos1, ypos2 - ypos1);
};

function generateCubePos() {
  const minGap = 50;

  let lastX = randomInt(50, c.width - 50);
  let lastY = randomInt(-10, 0);
  cubePos.x.push(lastX);
  cubePos.y.push(lastY);
  cubePos.color.push(Math.random() < 0.85 ? 0 : 1);
  cubePos.collided.push(false);

  let interval = randomInt(200, 500);

  // generate a cube
  const generateCube = () => {
    let newX = lastX + randomInt(minGap, minGap * 2) + cubeSize;
    let newY = lastY - randomInt(minGap, minGap * 2) - cubeSize;

    if (newX > c.width - 50) {
      newX = randomInt(50, c.width - 50);
    }

    if (newY < -c.height) {
      newY = randomInt(-10, 0);
    }

    cubePos.x.push(newX);
    cubePos.y.push(newY);
    cubePos.color.push(Math.random() < 0.9 ? 0 : 1);
    cubePos.collided.push(false);

    lastX = newX;
    lastY = newY;

    if (!isGameOver) {
      setTimeout(generateCube, interval);
    }
  };

  generateCube();
}

// draw an obstacle (Falling Cube)
function drawObstacle(x, y, colorIndex) {
  ctx.save();
  ctx.translate(x + cubeHalfSize, y + cubeHalfSize);
  ctx.rotate((angle * Math.PI) / 180);

  ctx.fillStyle = cubeColor[colorIndex];
  ctx.fillRect(-cubeHalfSize, -cubeHalfSize, cubeSize, cubeSize);
  ctx.restore();
}

// move the player with the mouse position
document.onmousemove = (event) => {
  const rect = c.getBoundingClientRect();
  mouseX = (event.clientX - rect.left) / 3;
};

function loop() {
  document.getElementById("gameOver").innerHTML = isGameOver;
  // draw the background
  ctx.fillStyle = "#1F2539";
  ctx.fillRect(0, 0, c.width, c.height);

  // draw the handle
  ctx.fillStyle = "#111A23";
  ctx.fillRect((c.width - (c.width - 75)) / 2, c.height / 2, c.width - 75, 40);

  // draw the player
  ctx.beginPath();
  ctx.arc(playerX, playerY, 20, 0, 2 * Math.PI);
  ctx.fillStyle = "#00FFB2";
  ctx.fill();

  playerX = c.width / 2 + mouseX;

  playerX = playerX > c.width - 75 ? c.width - 75 : playerX < 75 ? 75 : playerX; // limit the player from going out of the handle
  document.getElementById("score").innerHTML = score;
  // draw falling cubes
  cubePos.x.forEach((x, i) => {
    drawObstacle(x, (cubePos.y[i] += cubeSpeed), cubePos.color[i]);
  });

  for (let i = 0; i < cubePos.x.length; i++) {
    // remove cubes that fall off the screen
    if (cubePos.y[i] > c.height / 1.5) {
      cubePos.y.splice(i, 1);
      cubePos.x.splice(i, 1);
      cubePos.color.splice(i, 1);
      cubePos.collided.splice(i, 1);
      continue;
    }
    let distance = getDistance(
      cubePos.x[i] + cubeHalfSize,
      cubePos.y[i] + cubeHalfSize,
      playerX,
      playerY
    );
    let minCollisionDistance =
      20 + Math.sqrt(cubeHalfSize * cubeHalfSize + cubeHalfSize * cubeHalfSize);

    let isCollided = distance < minCollisionDistance;
    if (isCollided && cubePos.color[i] === 1 && !cubePos.collided[i]) {
      score++;
      cubePos.collided[i] = true;
      cubePos.y.splice(i, 1);
      cubePos.x.splice(i, 1);
      cubePos.color.splice(i, 1);
      cubePos.collided.splice(i, 1);
    } else if (isCollided && cubePos.color[i] === 0 && !cubePos.collided[i]) {
      isGameOver = true;
      cubePos.collided[i] = true;
    }
  }
  angle += 2;

  if (!isGameOver) {
    requestAnimationFrame(loop);
  }
}
generateCubePos();
loop();
