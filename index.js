// Canvas em si

const canvas = document.querySelector("canvas");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const context = canvas.getContext("2d");
const song = document.querySelector("#song");
const img = document.createElement("img");
let count = 0;

const startButton = document.querySelector("#start-button");
const soundButton = document.querySelector("sound-button");

startButton.addEventListener("click", startGame);

//Tamanho do canvas de acordo com o espoaço da janela
canvas.width = 1484;
canvas.height = 700;

//gravidade

const gravity = 1.5;

//importa sprites
const platformSprite = new Image();
const hillsSprite = new Image();
const backgroundSprite = new Image();
const background2Sprite = new Image();
const background3Sprite = new Image();

const plataformaSmallSprite = new Image();

platformSprite.src = "./assets/plataforma.png";
hillsSprite.src = "./assets/hills.png";
backgroundSprite.src = "./assets/background.png";
background2Sprite.src = "./assets/background2.png";
background3Sprite.src = "./assets/background3.png";

plataformaSmallSprite.src = "./assets/plataformaSmall.png";

const playerIdle = new Image();
const playerIdleEsquerda = new Image();
const playerRun = new Image();
const playerRunEsquerda = new Image();

playerIdle.src = "./assets/idleRight.png";
playerIdleEsquerda.src = "./assets/idleLeft.png";
playerRun.src = "./assets/runRight.png";
playerRunEsquerda.src = "./assets/runLeft.png";

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}
//contem os elementos de textosd que vao ser deletados depois de x segundos

let countdown = 5 * 60;
function mostrarTexto(text) {
  const texto = document.querySelector("#texto");
  const h2 = document.createElement("h2");
  h2.textContent = text;
  texto.appendChild(h2);
  setTimeout(() => {
    h2.remove();
  }, 3500);
}
function showRandomText() {
  const texts = [
    "nao tem muito por aqui",
    "na verdade nao tem nada aqui",
    "obrigado por ficar aqui",
    "o que eu me torno quando não tem ninguem jogando? informacao?",
    "eu definitivamente vou aparecer em outro jogo",
    "um dia eu vou existir mais do que eu existo hoje",
    "eu nao gosto muito do deserto",
    "ja pensou eu era so uma ideia",
    "ele tava no meio da rua pensou e pluft eu existo",
    "o quanto eu posso existir?",
    "realmente obrigado pelo passeio",
    "existir e ... estranho",
    "cara, como voce lida com o tedio?",
    "lembrete: escrever sua rotina num papel",
    "eu gosto dessa musica",
    "lugarzinho limitado",
    "pena que o javascript me limita",
  ];
  const randomIndex = Math.floor(Math.random() * texts.length);
  mostrarTexto(texts[randomIndex]);
  if (countdown > 0) {
    texts = [];
  }
}
//verificacoes
// console.log(canvas);
// console.log(context);
function startGame() {
  const canvas = document.querySelector("canvas");
  const intro = document.querySelector("div");
  const timer = document.querySelector("#timer");

  //   let countdown = 5 * 60; <<< 5 minutos

  const interval = setInterval(() => {
    countdown--;

    // Calcula minutos restando
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    let minutesStr = minutes.toString();
    let secondsStr = seconds.toString();

    if (minutes < 10) {
      minutesStr = minutesStr.padStart(2, "0");
    }
    if (seconds < 10) {
      secondsStr = secondsStr.padStart(2, "0");
    }

    // update com o tempo sobrando
    timer.textContent = `${minutesStr}:${secondsStr}`;

    if (countdown === 0) {
      clearInterval(interval);
      triggerFinal();
    }
  }, 1000);
  setInterval(() => {
    showRandomText();
  }, 20000);

  canvas.style.display = "block";
  timer.style.display = "block";

  intro.remove();
}

function triggerFinal() {
  // Quando o contador terminar executa evento
  const canvas = document.querySelector("canvas");
  const timer = document.querySelector("#timer");

  canvas.style.display = "none";
  timer.style.display = "none";

  const img = document.createElement("img");
  if (scrollOffset < 2000) {
    img.src = "./assets/finalEscuro.png";
  }
  if (scrollOffset > 2000 && scrollOffset < 13000) {
    img.src = "./assets/finalMeio.png";
  }
  if (scrollOffset > 13000) {
    img.src = "./assets/finaldeserto.png";
  } else {
    img.src = "./assets/finalEscuro.png";
  }
  img.style.display = "block";
  img.style.width = "100%";
  img.style.height = "100%";
  document.body.appendChild(img);
  clearInterval(interval);
}

//Classe define nosso Player

class Player {
  constructor() {
    this.speed = 7;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = 40 * 4;
    this.height = 32 * 4;
    this.frameCount = 0;

    this.image = createImage(playerIdle.src);
    this.frames = 0;
    this.sprites = {
      stand: {
        right: createImage(playerIdle.src),
        left: createImage(playerIdleEsquerda.src),
        cropWidth: 48,
        width: 32,
      },
      run: {
        right: createImage(playerRun.src),
        left: createImage(playerRunEsquerda.src),
        cropWidth: 48,
        width: 40 * 4,
      },
    };

    this.currentSprite = this.sprites.stand.right;
    this.cropWidth = 48;
  }
  //desenha objeto no canvas com os dados de dentro do constructor
  draw() {
    context.drawImage(
      this.currentSprite,
      0,
      this.cropWidth * this.frames,
      32,
      this.cropWidth,

      this.position.x,
      this.position.y,
      this.height,
      this.width
    );
  }
  update() {
    this.frameCount++;
    this.frames = Math.floor(this.frameCount / 10) % 6;
    this.draw();

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y <= canvas.height - 1) {
      this.velocity.y += gravity;
    }
  }
}
//Classe define nosso plataformas

class Plataforma {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;

    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    context.drawImage(this.image, this.position.x, this.position.y);
    // context.fillStyle = "green";
    // context.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

//copia da classe plataforma sem a colisao
class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x: -1,
      y: -1,
    };
    this.image = image;

    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    context.drawImage(this.image, this.position.x, this.position.y);
    // context.fillStyle = "green";
    // context.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

//esses valores são definidos no init
let player = new Player();

let plataformas = [];
//em outra parte do codigo existe um forEach desenhnando cada objeto do array de generic objects
let genericObjects = [];
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  up: {
    pressed: true,
  },
};

let scrollOffset = 0;

function init() {
  //chamando classes
  player = new Player();

  plataformas = [
    //PLATAFORMAS DA DIREITA
    //as primeiras plataformas devem ser as aereas pois são desenhadas primeiro

    new Plataforma({
      x: createImage(plataformas).width * 4 + 300 + plataformaSmallSprite.width,
      y: 270,
      image: plataformaSmallSprite,
    }),

    new Plataforma({
      x: -1,
      y: 470,
      image: plataformaSmallSprite,
    }),

    //plataformas normais

    new Plataforma({ x: -1, y: 470, image: platformSprite }),
  ];
  let previousWidth = 0;
  let previousHighWidth = 0;
  let previousBodyWidth = 0;

  for (let i = 0; i < 60; i++) {
    const randomNumber = Math.floor(Math.random() * (700 - 400 + 1) + 400);
    plataformas.push(
      new Plataforma({
        x: previousHighWidth + randomNumber,
        y: Math.floor(Math.random() * (400 - 10 + 1) + 10),
        image: plataformaSmallSprite,
      })
    );
    previousHighWidth += randomNumber;
  }
  for (let i = 0; i < 60; i++) {
    const randomNumber = Math.floor(Math.random() * (1000 - 400 + 1) + 400);

    plataformas.push(
      new Plataforma({
        x: previousBodyWidth + randomNumber,
        y: Math.floor(Math.random() * (550 - 350 + 1) + 350),
        image: plataformaSmallSprite,
      })
    );
    previousBodyWidth += randomNumber;
  }

  for (let i = 0; i < 200; i++) {
    const randomNumber = Math.floor(Math.random() * (930 - 800 + 1) + 800);
    plataformas.push(
      new Plataforma({
        x: previousWidth + randomNumber,
        y: 600,
        image: platformSprite,
      })
    );
    previousWidth += randomNumber;
  }

  // for (let i = 0; i < 200; i++) {
  //   const randomNumber = Math.floor(Math.random() * (500 - 300 + 1) + 300);

  //   plataformas.push(
  //     new Plataforma({
  //       x: previousBodyWidth + randomNumber,
  //       y: 600,
  //       image: platformSprite,
  //       width: platformSprite.width,
  //     })
  //   );
  //   previousBodyWidth += platformSprite.width + randomNumber;
  // }

  //PLATAFORMAS DA ESQUERDA
  //em outra parte do codigo existe um forEach desenhnando cada objeto do array de generic objects

  //OBJETOS DA DIREITA
  genericObjects = [
    // new GenericObject({
    //   x: 0,
    //   y: 0,
    //   image: backgroundSprite,
    // }),
    new GenericObject({
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight,

      image: backgroundSprite,
    }),
    // new GenericObject({
    //   x: background3Sprite.width,
    //   y: 0,
    //   image: background3Sprite,
    // }),

    // new GenericObject({ x: -1, y: 0, image: hillsSprite }),
  ];

  //OBJETOS DA ESQUERDA

  scrollOffset = 0;
}

//Metodo de animacão
//Animate vai ficar chamando a funcao animate a cada frame, assim ele fica redesenhando o sprite
function animate() {
  requestAnimationFrame(animate);
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  plataformas.forEach((plataforma) => {
    plataforma.draw();
  });
  //polayer desenhado por ultimo (na frente)
  player.update();

  //movimentacao utilizando objeto keys e switch
  if (keys.right.pressed && scrollOffset >= 14155) {
    mostrarTexto("AINDA NAO EXISTE NADA ALI");
  }

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 1) ||
    (keys.right.pressed && scrollOffset >= 14155)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x *= 0.9;

    if (keys.right.pressed) {
      // Move player to the right
      scrollOffset += player.speed;
      plataformas.forEach((plataforma) => {
        plataforma.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed - 2;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      // Move player to the left
      scrollOffset -= player.speed;
      plataformas.forEach((plataforma) => {
        plataforma.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed - 2;
      });
    }
  }
  //contador de mortes
  //caiu no buraco
  const messages = [
    "Eu morri!",
    "Denovo!",
    "Tudo bem eu nao sinto nada!!",
    "???????",
    "Ta de boa",
    "Vai ficar me matando?",
    "La vai ele",
    "Voce sabe usar o teclado?",
    "La elx",
    "mesmo com a hitbox te ajudando?",
    "como voce consegue continuar morrendo?",
    "apenas largue o teclado...",
    "nao confie em cachorros pequenos",
    "cringe...",
    "quero café",
    "qual o gosto de cafe?",
    "os romanos controlam o mundo até hoje",
  ];

  if (player.position.y > canvas.height) {
    console.log("You lose");

    count++;
  }
  const messagesLugar = [
    "Continue assim!",
    "Quase lá!",
    "Você está fazendo ótimo!",
    "Mantenha isso!",
    "Não pare agora!",
  ];

  if (player.position.x > 1000 && player.position.x < 11000) {
    console.log("Within range");

    switch (true) {
      case scrollOffset >= 1000 && scrollOffset < 2000:
        mostrarTexto(messagesLugar[0]);
        break;
      case scrollOffset >= 2000 && scrollOffset < 3000:
        mostrarTexto(messagesLugar[1]);
        break;
      case scrollOffset >= 3000 && scrollOffset < 4000:
        mostrarTexto(messagesLugar[2]);
        break;
      case scrollOffset >= 4000 && scrollOffset < 5000:
        mostrarTexto(messagesLugar[3]);
        break;
      case scrollOffset >= 5000 && scrollOffset < 6000:
        mostrarTexto(messagesLugar[4]);
        break;
    }
  }

  if (player.position.y > canvas.height) {
    init();
    messages.forEach(function (message, index) {
      if (index === count % messages.length) {
        mostrarTexto(message);
      }
    });
  }

  console.log(scrollOffset);
  //detector de colisao plataformas
  plataformas.forEach((plataforma) => {
    if (
      player.position.y + player.height <= plataforma.position.y &&
      player.position.y + player.height + player.velocity.y >=
        plataforma.position.y &&
      player.position.x + player.width >= plataforma.position.x - 1 &&
      player.position.x <= plataforma.position.x + plataforma.width
    ) {
      player.velocity.y = 0;
    }
  });
}

//chamando o jogo e o animator
init();

animate();
// {keycode} deveria receber o evento ao colocar dentro das brackets estamos descontruindo o event e pegando diretamente sua propriedade keycode
window.addEventListener("keydown", ({ keyCode }) => {
  // este console log descobre os key codes para os casos
  //   console.log(keyCode);
  switch (keyCode) {
    case 65:
      keys.left.pressed = true;
      player.currentSprite = player.sprites.run.left;
      player.cropWidth = player.sprites.run.cropWidth;
      player.width = player.sprites.run.width;

      break;
    case 37:
      keys.left.pressed = true;
      player.currentSprite = player.sprites.run.left;
      player.cropWidth = player.sprites.run.cropWidth;
      player.width = player.sprites.run.width;

      break;
    case 83:
      break;
    case 40:
      break;
    case 68:
      console.log("right");
      keys.right.pressed = true;
      player.currentSprite = player.sprites.run.right;
      player.cropWidth = player.sprites.run.cropWidth;
      player.width = player.sprites.run.width;

      break;
    case 39:
      keys.right.pressed = true;
      player.currentSprite = player.sprites.run.right;
      player.cropWidth = player.sprites.run.cropWidth;
      player.width = player.sprites.run.width;

      break;
    case 87:
      console.log("up");
      keys.up.pressed = true;
      if (player.velocity.y === 0) {
        player.velocity.y -= 26;
      }

      break;
    case 38:
      console.log("up");
      if (player.velocity.y === 0) {
        player.velocity.y -= 26;
      }

      break;
  }
});

window.addEventListener("keyup", ({ keyCode }) => {
  // este console log descobre os key codes para os casos
  //   console.log(keyCode);
  switch (keyCode) {
    case 65:
      keys.left.pressed = false;
      player.currentSprite = player.sprites.stand.left;
      player.cropWidth = player.sprites.stand.cropWidth;
      console.log("left");

      break;
    case 37:
      keys.left.pressed = false;
      player.currentSprite = player.sprites.stand.left;
      player.cropWidth = player.sprites.stand.cropWidth;
      console.log("left");

      break;
    case 83:
      console.log("down");
      break;
    case 40:
      console.log("down");
      break;
    case 68:
      console.log("right");
      keys.right.pressed = false;
      player.currentSprite = player.sprites.stand.right;
      player.cropWidth = player.sprites.stand.cropWidth;

      break;
    case 39:
      console.log("right");
      keys.right.pressed = false;
      player.currentSprite = player.sprites.stand.right;
      player.cropWidth = player.sprites.stand.cropWidth;

      break;
    case 87:
      console.log("up");
      keys.up.pressed = false;

      break;
    case 38:
      keys.up.pressed = false;

      console.log("up");

      break;
  }
});
