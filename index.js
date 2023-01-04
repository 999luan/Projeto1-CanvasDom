// utilizo o Querry Selector para selecionar o meu Canvas
const image = new Image();
image.src = "./assets/plataforma.png";
const canvas = document.querySelector("canvas");

// Canvas em si
const context = canvas.getContext("2d");

//Tamanho do canvas de acordo com o espoaço da janela
canvas.width = 1024;
canvas.height = 576;

//gravidade

const gravity = 1.5;

//verificacoes
// console.log(canvas);
// console.log(context);

//Classe define nosso Player
class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = 32;
    this.height = 32;
  }
  //desenha objeto no canvas com os dados de dentro do constructor
  draw() {
    context.fillStyle = "blue";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    //adicionar gravidsade na vewlocidade aumentar a velocidade de queda, no If quando chega no pontro 0 do canvas ele muyda gravidade para 0
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else this.velocity.y = 0;
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

//chamando classes
const player = new Player();
const plataformas = [
  new Plataforma({ x: 0, y: 470, image }),
  new Plataforma({ x: image.width, y: 470, image }),
];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

//Metodo de animacão
//Animate vai ficar chamando a funcao animate a cada frame, assim ele fica redesenhando o sprite
function animate() {
  requestAnimationFrame(animate);
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  plataformas.forEach((plataforma) => {
    plataforma.draw();
  });
  //polayer desenhado por ultimo (na frente)
  player.update();

  //movimentacao utilizando objeto keys e switch
  if (keys.right.pressed && player.position.x < 600) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += 5;
      plataformas.forEach((plataforma) => {
        plataforma.position.x -= 5;
      });
    } else if (keys.left.pressed) {
      scrollOffset -= 5;
      plataformas.forEach((plataforma) => {
        plataforma.position.x += 5;
      });
    }
  }
  if (scrollOffset > 2000) {
    console.log("You win");
  }
  console.log(scrollOffset);
  //detector de colisao plataformas
  plataformas.forEach((plataforma) => {
    if (
      player.position.y + player.height <= plataforma.position.y &&
      player.position.y + player.height + player.velocity.y >=
        plataforma.position.y &&
      player.position.x + player.width >= plataforma.position.x &&
      player.position.x <= plataforma.position.x + plataforma.width
    ) {
      player.velocity.y = 0;
    }
  });
}
animate();
// {keycode} deveria receber o evento ao colocar dentro das brackets estamos descontruindo o event e pegando diretamente sua propriedade keycode
window.addEventListener("keydown", ({ keyCode }) => {
  // este console log descobre os key codes para os casos
  //   console.log(keyCode);
  switch (keyCode) {
    case 65:
      console.log("left");
      keys.left.pressed = true;

      break;
    case 37:
      console.log("left");
      keys.left.pressed = true;

      break;
    case 83:
      console.log("down");
      break;
    case 40:
      console.log("down");
      break;
    case 68:
      console.log("right");
      keys.right.pressed = true;

      break;
    case 39:
      console.log("right");
      keys.right.pressed = true;

      break;
    case 87:
      console.log("up");
      player.velocity.y -= 20;
      break;
    case 38:
      console.log("up");
      player.velocity.y -= 20;

      break;
  }
});

window.addEventListener("keyup", ({ keyCode }) => {
  // este console log descobre os key codes para os casos
  //   console.log(keyCode);
  switch (keyCode) {
    case 65:
      keys.left.pressed = false;
      console.log("left");

      break;
    case 37:
      keys.left.pressed = false;
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

      break;
    case 39:
      console.log("right");
      keys.right.pressed = false;

      break;
    case 87:
      console.log("up");
      break;
    case 38:
      console.log("up");

      break;
  }
});
