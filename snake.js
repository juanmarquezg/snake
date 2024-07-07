const myCanvas = document.getElementById("myCanvas");
const context = myCanvas.getContext("2d");

const SIZE = 20;

const head = { x: 0, y: 0 };
const body = [];

let food = null; // x: y:

let dx = 0;
let dy = 0;
let score = 0;

// desde x = 0, desde y = 0, hasta x = 20, hasta y = 20
//context.fillRect(0, 0, 20, 20);

let lastAxis; // 'Y', 'X'

setInterval(main, 150); // 1000ms = 1s

function main() {
  update(); // actualizar las variables del juego
  draw(); // dibujar todos los objetos del juego
}

function drawScore(score) {
  const scoreContainer = document.getElementById("scoreContainer");
  scoreContainer.textContent = `Score: ${score}`;
}

function update() {
  const collisionDetected = checkSnakeCollision();
  if (collisionDetected) {
    gameOver();
    return;
  }

  // salvar la posición previa del último elemento de la serpiente
  let prevX, prevY;
  if (body.length >= 1) {
    prevX = body[body.length - 1].x;
    prevY = body[body.length - 1].y;
  } else {
    prevX = head.x;
    prevY = head.y;
  }

  //console.log(body)
  //console.log(body.length)

  // el cuerpo de la seriente siga a la cabeza de la serpiente
  for (let i = body.length - 1; i >= 1; --i) {
    body[i].x = body[i - 1].x;
    body[i].y = body[i - 1].y;
  }

  if (body.length >= 1) {
    body[0].x = head.x;
    body[0].y = head.y;
  }

  // actualizar las coordenadas de la cabeza de la serpiente
  head.x += dx;
  head.y += dy;

  // determinamos en qué eje ha ocurrido el último movimiento
  if (dx !== 0) {
    lastAxis = "X";
  } else if (dy !== 0) {
    lastAxis = "Y";
  }

  // detectar si la serpiente ha consumido el alimento
  if (food && head.x === food.x && head.y === food.y) {
    food = null;

    // aumentar el tamaño de la serpiente
    increaseSnakeSize(prevX, prevY);
    score = score + 1;
    drawScore(score);
  }

  // generar el alimento en caso que no exista
  if (!food) {
    food = randomFoodPosition();
    //food = { x: getRandomX(), y: getRandomY() };
  }
}

function checkSnakeCollision() {
  // coordenadas de la cabeza sean igual a las coordenadas de un elem del cuerpo
  for (let i = 0; i < body.length; ++i) {
    if (head.x == body[i].x && head.y == body[i].y) {
      return true;
    }
  }

  // verificar que la serpiente no salga de los límites permitidos
  const topCollision = head.y < 0;
  const bottomCollision = head.y > myCanvas.height - 20;
  const leftCollision = head.x < 0;
  const rightCollision = head.x > myCanvas.width - 20;

  if (topCollision || bottomCollision || leftCollision || rightCollision) {
    return true;
  }

  return false;
}

function gameOver() {
  alert(`Has perdido tu puntaje fue ${score}`);
  score = 0;
  head.x = 0;
  head.y = 0;
  dy = 0;
  dx = 0;
  body.length = 0;
  drawScore(score);
}

function increaseSnakeSize(prevX, prevY) {
  // console.log("******* increaseSnakeSize prevX", prevX);
  // console.log("******* increaseSnakeSizeprevY ", prevY);
  body.push({
    x: prevX,
    y: prevY
  });
}

function randomFoodPosition() {
  let position;
  do {
    position = { x: getRandomX(), y: getRandomY() };
  } while (checkFoodCollision(position));
  return position;
}

function checkFoodCollision(position) {
  // comparar las coordenadas del alimento generado con el cuerpo de la serpiente
  for (let i = 0; i < body.length; ++i) {
    if (position.x == body[i].x && position.y == body[i].y) {
      return true;
    }
  }

  // comparar las coordenadas del alimento generado con la cabeza de la serpiente
  if (position.x == head.x && position.y == head.y) {
    return true;
  }

  return false;
}

function getRandomX() {
  // 0, 20, 40, ..., 380
  // 380/20 = 19
  // 1, 2, ..., 19
  return 20 * parseInt(Math.random() * 20); // 19 porque Math.random devuelve desde 0
}

function getRandomY() {
  // 0, 20, 40, ..., 440
  // 440/20 = 22
  // 1, 2, ..., 22
  return 20 * parseInt(Math.random() * 23); // 23 porque Math.random devuelve desde 0
}

function draw() {
  // definir un fondo nego
  context.fillStyle = "black";
  context.fillRect(0, 0, myCanvas.width, myCanvas.height);
  // context.clearRect(0, 0, myCanvas.width, myCanvas.height);

  // pintar cabeza
  drawObject(head, "lime");

  // pintar cuerpo
  body.forEach(elem => drawObject(elem, "lime"));

  // pintar alimento
  drawObject(food, "white");
}

function drawObject(obj, color) {
  context.fillStyle = color;
  context.fillRect(obj.x, obj.y, SIZE, SIZE);
}

// genera error
//document.addEventListener('keydown', moveSnake());

// document.addEventListener('keydown', event => console.log(event));
document.addEventListener("keydown", moveSnake);

function moveSnake(event) {
  // las condiciones restringen el movimiento sobre el mismo eje
  // si el movimiento actual es en y solo puede moverse en x y viceversa
  switch (event.key) {
    case "ArrowUp":
      if (lastAxis !== "Y") {
        dx = 0;
        dy = -SIZE;
        console.log("Mover hacia arriba");
      }
      break;
    case "ArrowDown":
      if (lastAxis !== "Y") {
        dx = 0;
        dy = +SIZE;
        console.log("Mover hacia abajo");
      }
      break;
    case "ArrowRight":
      if (lastAxis !== "X") {
        dx = +SIZE;
        dy = 0;
        console.log("Mover hacia la derecha");
      }
      break;
    case "ArrowLeft":
      if (lastAxis !== "X") {
        dx = -SIZE;
        dy = 0;
        console.log("Mover hacia la izquierda");
      }
      break;
  }
}
