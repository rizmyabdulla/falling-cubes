const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

c.width = 400;
c.height = 600;

let angle = 0;
const size = 35;
const speed = 5;
const halfSize = size / 2;
const cubePos = { x: [], y: [] };
let isGameOver = false;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

function loop() {
  ctx.fillStyle = "#1F2539";
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.fillStyle = "#111A23";
  ctx.fillRect((c.width - (c.width - 75)) / 2, c.height / 2 , c.width - 75, 40);

  ctx.beginPath();
  ctx.arc((c.width - (c.width - 75)) / 1, c.height / 2 + 20, 20, 0, 2 * Math.PI);
  ctx.fillStyle = "green";
  ctx.fill();

  cubePos.x.forEach((x, i) => {
    drawObstacles(x, (cubePos.y[i] += speed));
  });
  angle += 2;

  if (!isGameOver) {
    requestAnimationFrame(loop);
  }
}

generateCubePos();
loop();
