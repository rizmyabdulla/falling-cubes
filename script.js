const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

let CANVAS_WIDTH = (c.width = 400);
let CANVAS_HEIGHT = (c.height = 600);

let mouseX = c.width / 2;

const playerMoveSpeed = 0.05;
let playerX = c.width / 2;
let playerY = c.height / 2 + 20;
let playerSize = 20;

// cube variables
let angle = 0;
let cubeSize = 35;
const cubeHalfSize = cubeSize / 2;
const cubeSpeed = 5;
const Cube = { x: [], y: [], color: [], collided: [], fallThreshold: [] };
const cubeColor = ["#FFFFFF", "#00FFB2"];

// level variables
let score = 0;

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

  Cube.x.push(lastX);
  Cube.y.push(lastY);
  Cube.color.push(Math.random() < 0.85 ? 0 : 1);
  Cube.collided.push(false);
  Cube.fallThreshold.push(Math.random() * 2 - randomFloat(1, 2.5));

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

    Cube.x.push(newX);
    Cube.y.push(newY);
    Cube.color.push(Math.random() < 0.9 ? 0 : 1);
    Cube.collided.push(false);
    Cube.fallThreshold.push(Math.random() * 2 - randomFloat(1, 2.5));

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

//////////////////----------------------////////////////////

const buttons = [];

function drawBtn(x, y, icon, onClick) {
  ctx.beginPath();
  ctx.arc(x, y, 30, 0, 2 * Math.PI);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();

  ctx.font = "30px FontAwesome";
  ctx.fillStyle = "#000000";
  ctx.fillText(icon, x, y + 10);

  buttons.push({ x, y, onClick });
}

canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  for (const button of buttons) {
    if (isInsideCircle(button.x, button.y, 30, mouseX, mouseY)) {
      button.onClick();
      break;
    }
  }
});

function isInsideCircle(x, y, radius, mouseX, mouseY) {
  return (mouseX - x) ** 2 + (mouseY - y) ** 2 <= radius ** 2;
}

//////////////////----------------------////////////////////

let gameOverTextY = -20;
let scoreTextY = CANVAS_HEIGHT + 70;
let currentDisplayedScore = 0;
let scoreIncreaseInterval;

const icon1X = CANVAS_WIDTH / 2 - 75;
const icon2X = CANVAS_WIDTH / 2 + 75;
const icon3X = CANVAS_WIDTH / 2;
let iconY = CANVAS_HEIGHT / 2 + 300;

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


  drawBtn(icon1X, iconY, "");
  drawBtn(icon2X, iconY, "", function () {
    Cube.x = [];
    Cube.y = [];
    Cube.color = [];
    Cube.collided = [];
    Cube.fallThreshold = [];
    score = 0;
    currentDisplayedScore = 0;
    playerX = c.width / 2;
    playerY = c.height / 2 + 20;
    playerSize = 20;
    cubeSize = 35;
    gameOverTextY = -20;
    scoreTextY = CANVAS_HEIGHT + 70;
    isGameOver = false;

    generateCubePos();
    gameScene();
  });
  drawBtn(icon3X, iconY, "");

  if (gameOverTextY < CANVAS_HEIGHT / 2) {
    gameOverTextY += 10;
  }
  if (scoreTextY > CANVAS_HEIGHT / 2 + 50) {
    scoreTextY -= 10;
  }
  if (iconY > CANVAS_HEIGHT / 2 + 120) {
    iconY -= 5;
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
    iconY < CANVAS_HEIGHT / 2 + 100 ||
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
    event.preventDefault();

    inputX = event.touches[0].clientX;
  }
  const rect = c.getBoundingClientRect();

  mouseX = (inputX - rect.left) * (CANVAS_WIDTH / rect.width);
}

document.addEventListener("mousemove", handleInput);
document.addEventListener("touchmove", handleInput, { passive: false });

////////////////////////////////////////////////////////////////////////////////////

function gameScene() {
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

  ctx.beginPath();
  ctx.arc(mouseX, playerY, 2, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();

  playerX += (mouseX - playerX) * playerMoveSpeed;

  playerX = playerX > c.width - 75 ? c.width - 75 : playerX < 75 ? 75 : playerX; // limit the player from going out of the handle

  // draw falling cubes
  Cube.x.forEach((x, i) => {
    let currentCubeSize = Cube.collided[i] ? cubeSize - 1 : cubeSize;
    drawObstacle(
      (Cube.x[i] += Cube.fallThreshold[i]),
      (Cube.y[i] += cubeSpeed),
      Cube.color[i],
      currentCubeSize
    );
  });

  for (let i = 0; i < Cube.x.length; i++) {
    // remove cubes that fall off the screen
    if (Cube.y[i] > c.height / 1.5) {
      Cube.y.splice(i, 1);
      Cube.x.splice(i, 1);
      Cube.color.splice(i, 1);
      Cube.collided.splice(i, 1);
      Cube.fallThreshold.splice(i, 1);
      continue;
    }
    let distance = getDistance(
      Cube.x[i] + cubeHalfSize,
      Cube.y[i] + cubeHalfSize,
      playerX,
      playerY
    );
    let minCollisionDistance =
      playerSize +
      Math.sqrt(cubeHalfSize * cubeHalfSize + cubeHalfSize * cubeHalfSize);

    let isCollided = distance < minCollisionDistance;
    if (isCollided && Cube.color[i] === 1 && !Cube.collided[i]) {
      score++;
      Cube.collided[i] = true;
      Cube.y.splice(i, 1);
      Cube.x.splice(i, 1);
      Cube.color.splice(i, 1);
      Cube.collided.splice(i, 1);
    } else if (isCollided && Cube.color[i] === 0 && !Cube.collided[i]) {
      isGameOver = true;
      Cube.collided[i] = true;
    }
  }
  angle += 2;

  if (!isGameOver) {
    requestAnimationFrame(gameScene);
  } else {
    if (cubeSize > 0) {
      cubeSize -= 1;
      playerSize -= 1;
      requestAnimationFrame(gameScene);
    } else {
      gameOverScene();
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////

gameScene();

generateCubePos();
