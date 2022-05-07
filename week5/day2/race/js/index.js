const game = {
  frames: 0,
  score: 0,
  start: function () {
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    const roadImage = new Image();
    const carImage = new Image();
    roadImage.src = "images/road.png";
    carImage.src = "images/car.png";
    roadImage.onload = () => {
      this.road = new Road(roadImage);
      carImage.onload = () => {
        this.car = new Car(carImage);
        this.road.update();
        this.car.update();
        document.onkeydown = (e) => {
          switch (e.key) {
            case "ArrowLeft":
              this.car.speedX -= 1;
              break;
            case "ArrowRight":
              this.car.speedX += 1;
              break;
            default:
              break;
          }
        };
        document.onkeyup = () => {
          this.car.speedX = 0;
        };
        updateGame();
      };
    };
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};
const obstacles = [];

window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };

  function startGame() {
    game.start();
  }
};

// class that accepts an image or draws a rectangle
// if it is a rectangle, should also accept size
// if it is an image, should accept scaling values
// needs to have speed;

class Component {
  constructor(posX, posY, width, height) {
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
  }

  getX() {
    return this.posX;
  }

  getY() {
    return this.posY;
  }

  getSpeedX() {
    return this.speedX;
  }

  getSpeedY() {
    return this.speedY;
  }

  setX(newX) {
    this.posX = newX;
  }

  setY(newY) {
    this.posY = newY;
  }

  setSpeedX(newSpeed) {
    this.speedX = newSpeed;
  }

  setSpeedY(newSpeed) {
    this.speedY = newSpeed;
  }

  update() {}

  move() {
    this.setX(this.getX() + this.getSpeedX());
    this.setY(this.getY() + this.getSpeedY());
  }

  left() {
    return this.posX;
  }
  right() {
    return this.posX + this.width;
  }
  top() {
    return this.posY;
  }
  bottom() {
    return this.posY + this.height;
  }

  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
}

class Road extends Component {
  constructor(image) {
    super(0, 0, game.canvas.width, game.canvas.height);
    this.image = image;
  }

  update() {
    game.context.drawImage(
      this.image,
      this.posX,
      this.posY,
      this.width,
      this.height
    );
  }
}

class Obstacle extends Component {
  constructor() {
    const xPos = Math.floor(Math.random() * game.canvas.width);
    const height = 30;
    const width = 100;
    const yPos = -height;
    super(xPos, yPos, width, height);
    this.color = "red";
    this.speedY = 1;
  }

  update() {
    this.move();
    game.context.fillStyle = this.color;
    game.context.fillRect(this.posX, this.posY, this.width, this.height);
  }
}

class Car extends Component {
  constructor(image) {
    super(200, 450, 40, 90);
    this.image = image;
  }

  update() {
    this.move();
    game.context.drawImage(
      this.image,
      this.posX,
      this.posY,
      this.width,
      this.height
    );
  }

  setX(newX) {
    if (newX >= 0 && newX < game.canvas.width - this.width) {
      this.posX = newX;
    }
  }
}

function updateGame() {
  game.clear();
  game.road.update();
  game.car.update();
  if (game.frames % 120 === 0) {
    obstacles.push(new Obstacle());
  }
  obstacles.forEach((element) => {
    element.update();
  });
  game.frames += 1;
  game.context.font = "48px serif";
  game.context.fillStyle = "black";
  game.context.fillText(`${game.score}`, 200, 200);
  const gameOver = obstacles.some((element) => {
    return game.car.crashWith(element);
  });
  if (!gameOver) {
    game.score += 10;
    requestAnimationFrame(updateGame);
  } else {
    alert(`Congrats, you just got ${game.score} points`);
  }
}
