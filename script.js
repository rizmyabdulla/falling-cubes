const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

c.width = 400;
c.height = 600;

let angle = 0;
const size = 35;
const speed = 5;
const halfSize = size / 2;
const cubePos = { x: [], y: [] };

let mouseX = c.width / 2;
let playerX = 0;
let playerY = c.height / 2 + 20;
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

  let interval = randomInt(200, 500);

  const generateCube = () => {
    let newX = lastX + randomInt(minGap, minGap * 2) + size;
    let newY = lastY - randomInt(minGap, minGap * 2) - size;

    if (newX > c.width - 50) {
      newX = randomInt(50, c.width - 50);
    }

    if (newY < -c.height) {
      newY = randomInt(-10, 0);
    }

    cubePos.x.push(newX);
    cubePos.y.push(newY);

    lastX = newX;
    lastY = newY;

    if (!isGameOver) {
      setTimeout(generateCube, interval);
    }
  };

  generateCube();
}

function drawObstacles(x, y) {
  ctx.save();
  ctx.translate(x + halfSize, y + halfSize);
  ctx.rotate((angle * Math.PI) / 180);

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(-halfSize, -halfSize, size, size);
  ctx.restore();
}

document.onmousemove = (event) => {
  const rect = c.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
};

function loop() {
  ctx.fillStyle = "#1F2539";
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.fillStyle = "#111A23";
  ctx.fillRect((c.width - (c.width - 75)) / 2, c.height / 2, c.width - 75, 40);

  playerX = c.width / 2 + mouseX;

  document.getElementById("pX").innerHTML = "playerX : " + playerX;
  if (playerX > c.width - 75) {
    document.getElementById("pX").innerHTML = "playerX : Increased";
    playerX = c.width - 75;
  }

  if (playerX < 75) {
    document.getElementById("pX").innerHTML = "playerX : Decreased";
    playerX = 75;
  }

  ctx.beginPath();
  ctx.arc(playerX, playerY, 20, 0, 2 * Math.PI);
  ctx.fillStyle = "green";
  ctx.fill();

  cubePos.x.forEach((x, i) => {
    drawObstacles(x, (cubePos.y[i] += speed));
  });

  for (let i = 0; i < cubePos.x.length; i++) {
    if (cubePos.y[i] > c.height / 1.5) {
      cubePos.y.splice(i, 1);
      cubePos.x.splice(i, 1);
    }

    console.log(cubePos.y);
    if (getDistance(cubePos.x[i], cubePos.y[i], playerX, playerY) < 20) {
      isGameOver = true;
    }
  }
  angle += 2;

  if (!isGameOver) {
    requestAnimationFrame(loop);
  }
}
generateCubePos();
loop();
