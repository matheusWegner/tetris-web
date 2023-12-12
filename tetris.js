const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const zoom = 30;
var miliSecUpdateTime = 1000;
var updateTime = 10;
var newBlock = true;
const colors = ["red", "yellow", "green", "purple", "blue"];

canvas.width = 11 * zoom;
canvas.height = 20 * zoom;
c.fillRect(30, 0, canvas.width, canvas.height);
const shapes = [
   [[1, 1],
   [1, 1]],

   [[0, 0, 1, 0],
   [0, 0, 1, 0],
   [0, 0, 1, 0],
   [0, 0, 1, 0]],

   [[0, 1, 0],
   [0, 1, 0],
   [0, 1, 1]],

   [[0, 1, 0],
   [0, 1, 0],
   [1, 1, 0]],

   [[1, 0, 0],
   [1, 1, 0],
   [0, 1, 0]],

   [[0, 0, 1],
   [0, 1, 1],
   [0, 1, 0]],

   [[0, 0, 0],
   [0, 1, 0],
   [1, 1, 1]]
];
let mapaBlocos = new Map();
let mapaBlocos1 =
   [[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
   [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]]
let blocos = [];
var bloco;
var formatoReserva;
class BlockImage {
   constructor(src) {
      this.img = new Image();
      this.img.src = src;
   }
}
var images = new Map([
   ["red", new BlockImage('./images/red.png')],
   ["yellow", new BlockImage('./images/yellow.png')],
   ["green", new BlockImage('./images/green.png')],
   ["purple", new BlockImage('./images/purple.png')],
   ["blue", new BlockImage('./images/blue.png')],
   ["blank", new BlockImage('./images/blank.png')],
   ["background", new BlockImage('./images/background.png')],
]);
class Shape {
   constructor(number) {
      this.format = (shapes[number].map((i) => i.map((j) => j)));
   }
}

class Bloco {
   constructor({ color, position }) {
      this.velocity = 1,
      this.position = position,
      this.width = zoom,
      this.height = zoom,
      this.stopped = false;
      this.setted = false;
      this.color = Math.floor(Math.random() * 5);
      this.blockImage = images.get(colors[this.color]);
      this.shape = new Shape(Math.floor(Math.random() * 7));
      /*this.positionUpdateInterval = setInterval(() => {
         if (!this.stopped) {
            let colisao = calcularColisao();
            if (colisao > 0) {
               this.stopped = true;
               let setBlockInterval = setInterval(() => {
                  let colisaoRec = calcularColisao();
                  if (colisaoRec > 0 && !this.setted) {
                     setBlock();
                     this.setted = true;
                     clearInterval(this.positionUpdateInterval);
                  } else {
                     this.stopped = false;
                     clearInterval(setBlockInterval);
                  }
               }, 3000);
            } else {
               if (this.setted) {
                  clearInterval(this.positionUpdateInterval);
               } else if (!keys.s.pressed) {
                  this.position.y += 1;
               }
            }

         }

      }, miliSecUpdateTime);*/
   }

   draw() {
      /*if(keys.d.pressed){
          colisao = calcularColisaoX(bloco,bloco.shape.format,1);
          if(colisao == 0){
             bloco.stopped = false;
             bloco.position.x += 1;
          }
       }else if(keys.a.pressed){
 
       }*/
      for (var i = 0; i < this.shape.format.length; i++) {
         for (var j = 0; j < this.shape.format.length; j++) {
            if (this.shape.format[i][j] == 1) {
               c.drawImage(this.blockImage.img, (this.position.x + j) * zoom, (this.position.y + i) * zoom);
            }
         }
      }
   }
   shift() {
      let colisao = 0;
      const n = this.shape.format.length;
      var rotatedMatrix = new Array(n).fill(null).map(() => new Array(n).fill(0));
      for (let i = 0; i < n; i++) {
         for (let j = 0; j < n; j++) {
            rotatedMatrix[j][n - 1 - i] = this.shape.format[i][j];
         }
      }
      colisao = calcularColisaoX(this, rotatedMatrix, 0);
      if (colisao == 0) {
         this.shape.format = rotatedMatrix;
      } else {
         var position = this.position.y;
         var reposition = 0;
         var move = +1
         do {
            reposition += move;
            colisao = calcularColisaoX(this, rotatedMatrix, reposition);
            if (colisao == 0) {
               this.position.x += reposition;
               this.shape.format = rotatedMatrix;
               break;
            } else {
               reposition = 0;
               move = -move;
               if (move > 0) {
                  move++;
               }
            }
            if (move > 2) {
               if (position - this.position.y > 1) {
                  this.position.y = position;
                  break;
               }
               this.position.y -= 1;
               reposition = 0;
               move = 1;
            }
         } while (colisao != 0)
      }
   }
   update() {
      this.draw();
   }
}

class Table {
   constructor({ position }) {
      this.position = position,
         this.color = 'red';
      this.shape = mapaBlocos1;
      this.image = new Image();
      this.image.src = './images/background.png';
      this.red = new Image();
      this.red.src = './images/red.png';
      this.images = images;
   }

   draw() {
      for (let i = 0; i < this.shape.length; i++) {
         for (let j = 0; j <= this.shape[0].length; j++) {
            c.globalAlpha = 1;
            if (mapaBlocos1[i][j] > 0 && mapaBlocos1[i][j] < 6) {
               c.drawImage(images.get(colors[mapaBlocos1[i][j] - 1]).img, j * zoom, i * zoom);
            } else if (mapaBlocos1[i][j] == 0) {
               c.globalAlpha = 2 / 3;
               c.drawImage(this.image, j * zoom, i * zoom);
            } else if (mapaBlocos1[i][j] == -10) {
               c.drawImage(images.get("blank").img, (j) * zoom, i * zoom);

            }
         }
      }
   }
   breakLine() {
      for (let i = 0; i < this.shape.length - 1; i++) {
         let filtered = this.shape[i].filter(l => l == 0 || l == -10);
         if (!(filtered.length > 0)) {
            this.shape[i] = [9, -10, -10, -10, -10, -10, -10, -10, -10, -10, -10, 9]
            setTimeout(() => {
               this.shape.splice(i, 1);
               this.shape.unshift([9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9]);
            }, 200);
         }
      }
   }

   update() {
      this.breakLine();
      this.draw();
   }
}

setInterval(() => {
   miliSecUpdateTime -= updateTime;
   updateTime -= 0.07
}, miliSecUpdateTime);


for(var i = 0; i < 5; i++){
   blocos.push(new Bloco({
      color: 'red',
      position: {
         x: 4,
         y: 0
      },
      velocity: {
         x: 1,
         y: 1
      }
   }));
}
const keys = {
   a: {
      pressed: false
   },
   d: {
      pressed: false
   },
   s: {
      pressed: false
   },
   space: {
      pressed: false
   }
}
bloco = blocos[0];
setBlocoInterval();
let table = new Table({
   position: {
      x: canvas.width / 2,
      y: 0
   }
});
function animate() {
   window.requestAnimationFrame(animate);
   c.clearRect(0, 0, canvas.width, canvas.height);
   table.update();
   bloco.update();
   if (bloco.setted) {
      createNewBloco();
   }
}
animate();
function createNewBloco() {
   newBlock = true;
   clearInterval(bloco.positionUpdateInterval);
   blocos.splice(0, 1);
   bloco = blocos[0];
   blocos.push(new Bloco({
      color: 'red',
      position: {
         x: 4,
         y: 0
      },
      velocity: {
         x: 1,
         y: 1
      }
   }));
   setBlocoInterval();
}
function changeBlock() {
   clearInterval(bloco.positionUpdateInterval);
   blocoAux = blocoReserva;
   blocoReserva = bloco;
   if(blocoAux){
      bloco = blocoAux;
   }else{
      createNewBloco();
   }
   blocoReserva.position.x = 4;
   blocoReserva.position.x = 0;
   setBlocoInterval();
   newBlock = false;
}
function setBlocoInterval(){
   bloco.positionUpdateInterval = setInterval(() => {
      if (!bloco.stopped) {
         let colisao = calcularColisao();
         if (colisao > 0) {
            bloco.stopped = true;
            let setBlockInterval = setInterval(() => {
               let colisaoRec = calcularColisao();
               if (colisaoRec > 0 && !bloco.setted) {
                  setBlock();
                  bloco.setted = true;
                  clearInterval(bloco.positionUpdateInterval);
               } else {
                  bloco.stopped = false;
                  clearInterval(setBlockInterval);
               }
            }, 3000);
         } else {
            if (bloco.setted) {
               clearInterval(bloco.positionUpdateInterval);
            } else if (!keys.s.pressed) {
               bloco.position.y += 1;
            }
         }
   
      }
   }, miliSecUpdateTime);
}

function calcularColisao() {
   let colisao = 0;
   for (var i = 0; i < bloco.shape.format.length; i++) {
      for (var j = 0; j < bloco.shape.format.length; j++) {
         if (bloco.shape.format[i][j] == 1) {
            colisao = mapaBlocos1[bloco.position.y + i + 1][bloco.position.x + j];
            if (colisao > 0) {
               return colisao;
            }
         }
      }
   }
   return colisao;
}

function calcularColisaoX(bloco, shape, previsao) {
   let colisao = 0;
   for (var i = 0; i < shape.length; i++) {
      for (var j = 0; j < shape.length; j++) {
         if (shape[i][j] == 1) {
            colisao = mapaBlocos1[bloco.position.y + i][bloco.position.x + j + previsao];
            if (colisao > 0) {
               return colisao;
            }
         }
      }
   }
   return colisao;
}
/*function calcularColisao(){
   let colisao = 0;
   for(var i = 0; i < bloco.shape.format.length;i++){
     for(var j = 0; j < bloco.shape.format.length;j++){
        if(bloco.shape.format[i][j] == 1){
           colisao =  mapaBlocos1[bloco.position.y + i + 1][bloco.position.x + j];
           if(colisao > 0){
              bloco.stopped = true;
              setTimeout(function(){
                 if(bloco.stopped){
                    setBlock();
                 }   
              },3000);
              break;
           }       
        }
     }
   }
   return colisao;
}*/

function setBlock() {
   for (var i = 0; i < bloco.shape.format.length; i++) {
      for (var j = 0; j < bloco.shape.format.length; j++) {
         if (bloco.shape.format[i][j] == 1) {
            mapaBlocos1[bloco.position.y + i][bloco.position.x + j] = bloco.color + 1;
         }
      }
   }
}


window.addEventListener("keydown", (event) => {
   event.preventDefault();
   let colisao = 0;
   switch (event.key) {
      case " ":
         keys.space.pressed = true;
         bloco.stopped = false;
         while (!bloco.stopped) {
            let colisao = calcularColisao();
            if (colisao > 0) {
               setBlock();
               bloco.stopped = true;
               bloco.setted = true;
            }
            bloco.position.y += 1;
         }
         createNewBloco();
         break
      case 'd':
         colisao = calcularColisaoX(bloco, bloco.shape.format, 1);
         if (colisao == 0) {
            bloco.stopped = false;
            bloco.position.x += 1;
         }
         keys.d.pressed = true;
         break
      case 'a':
         colisao = calcularColisaoX(bloco, bloco.shape.format, -1);
         if (colisao == 0) {
            bloco.stopped = false;
            bloco.position.x -= 1;
         }
         keys.a.pressed = true;
         break
      case 's':
         bloco.stopped = false;
         keys.s.pressed = true;
         bloco.position.y += 1;
         break
      case 'w':
         bloco.shift();
         break
      case 'Shift':
         if(newBlock){
            changeBlock();
         }
         break;   
   }
});

window.addEventListener('keyup', (event) => {
   console.log(event.key);
   switch (event.key) {
      case 'd':
         keys.d.pressed = false;
         break
      case 'a':
         keys.a.pressed = false;
         break
      case 's':
         keys.s.pressed = false;
         break
   }
});