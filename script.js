const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

let CANVAS_WIDTH = (c.width = 400);
let CANVAS_HEIGHT = (c.height = 600);

let mouseX = c.width / 2;
let playerX = 0;
let playerY = c.height / 2 + 20;
let playerSize = 20;

// cube variables
let angle = 0;
let cubeSize = 35;
const cubeHalfSize = cubeSize / 2;
const cubePos = { x: [], y: [], color: [], collided: [], fallThreshold: [] };
const cubeColor = ["#FFFFFF", "#00FFB2"];

// level variables
let score = 0;
const cubeSpeed = 5;
let cubeFallThreshold = Math.random() * 2 - randomInt(1, 3);
let isGameOver = false;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
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
  cubePos.fallThreshold.push(Math.random() * 2 - randomFloat(1, 2.5));

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
    cubePos.fallThreshold.push(Math.random() * 2 - randomFloat(1, 2.5));

    lastX = newX;
    lastY = newY;

    if (!isGameOver) {
      setTimeout(generateCube, interval);
    }
  };

  generateCube();
}

// draw an obstacle (Falling Cube)
function drawObstacle(x, y, colorIndex, size) {
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  ctx.rotate((angle * Math.PI) / 180);

  ctx.fillStyle = cubeColor[colorIndex];
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.restore();
}

////////////////////////////////////////////////////////////////////////////////////////

let gameOverTextY = -20;
let scoreTextY = CANVAS_HEIGHT + 70;
let currentDisplayedScore = 0;
let scoreIncreaseInterval;

function gameOverScene() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // draw the background
  ctx.fillStyle = "#1F2539";
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.font = "50px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", CANVAS_WIDTH / 2, gameOverTextY);

  ctx.font = "30px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText("Score: " + currentDisplayedScore, CANVAS_WIDTH / 2, scoreTextY);

  if (gameOverTextY < CANVAS_HEIGHT / 2) {
    gameOverTextY += 10;
  }
  if (scoreTextY > CANVAS_HEIGHT / 2 + 50) {
    scoreTextY -= 10;
  }

  if (
    gameOverTextY >= CANVAS_HEIGHT / 2 &&
    scoreTextY <= CANVAS_HEIGHT / 2 + 50
  ) {
    scoreIncreaseInterval = setInterval(increaseScore, 200);
  }

  if (
    gameOverTextY < CANVAS_HEIGHT / 2 ||
    scoreTextY > CANVAS_HEIGHT / 2 + 50 ||
    currentDisplayedScore <= score
  ) {
    requestAnimationFrame(gameOverScene);
  }

  function increaseScore() {
    if (currentDisplayedScore < score) {
      currentDisplayedScore += 1;
    } else {
      clearInterval(scoreIncreaseInterval);
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////


function handleInput(event) {
  let inputX;
  if (event.type === "mousemove") {
    inputX = event.clientX;
  } else if (event.type === "touchmove") {
    inputX = event.touches[0].clientX;
  }
  const rect = c.getBoundingClientRect();
  mouseX = (inputX - rect.left) / 3;
}

document.addEventListener("mousemove", handleInput);
document.addEventListener("touchmove", handleInput);

// Main Loop
function loop() {
  // draw the background
  ctx.fillStyle = "#1F2539";
  ctx.fillRect(0, 0, c.width, c.height);

  // draw the handle
  ctx.fillStyle = "#111A23";
  ctx.fillRect((c.width - (c.width - 75)) / 2, c.height / 2, c.width - 75, 40);

  //draw score text
  ctx.font = "80px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText(score, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 1.2);

  // draw the player
  ctx.beginPath();
  ctx.arc(playerX, playerY, playerSize > 0 ? playerSize : 0, 0, 2 * Math.PI);
  ctx.fillStyle = "#00FFB2";
  ctx.fill();

  playerX = c.width / 2 + mouseX;

  playerX = playerX > c.width - 75 ? c.width - 75 : playerX < 75 ? 75 : playerX; // limit the player from going out of the handle

  // draw falling cubes
  cubePos.x.forEach((x, i) => {
    let currentCubeSize = cubePos.collided[i] ? cubeSize - 1 : cubeSize;
    drawObstacle(
      (cubePos.x[i] += cubePos.fallThreshold[i]),
      (cubePos.y[i] += cubeSpeed),
      cubePos.color[i],
      currentCubeSize
    );
  });

  for (let i = 0; i < cubePos.x.length; i++) {
    // remove cubes that fall off the screen
    if (cubePos.y[i] > c.height / 1.5) {
      cubePos.y.splice(i, 1);
      cubePos.x.splice(i, 1);
      cubePos.color.splice(i, 1);
      cubePos.collided.splice(i, 1);
      cubePos.fallThreshold.splice(i, 1);
      continue;
    }
    let distance = getDistance(
      cubePos.x[i] + cubeHalfSize,
      cubePos.y[i] + cubeHalfSize,
      playerX,
      playerY
    );
    let minCollisionDistance =
      playerSize +
      Math.sqrt(cubeHalfSize * cubeHalfSize + cubeHalfSize * cubeHalfSize);

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
  } else {
    if (cubeSize > 0) {
      cubeSize -= 1;
      playerSize -= 1;
      requestAnimationFrame(loop);
    } else {
      gameOverScene();
    }
  }
}
generateCubePos();
loop();
