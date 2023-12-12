const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const zoom = 30;
const tableBeginPosition = 150;
const listBeginPosition = 570;
const storeBerginPosition = 120;
canvas.width = 30 * zoom;
canvas.height = 30 * zoom;
var miliSecUpdateTime = 1000;
var updateTime = 10;
var newBlock = true;


const shapes = [
   [["o", "o"],
   ["o", "o"]],
   [["i", "i",null, null],
   [null, "i", null, null],
   [null, "i", null, null],
   [null, "i", null, null]],
   [["rl",null, null],
   ["rl", null, null],
   ["rl", "rl", null]],
   [[null,"ll", null],
   [null, "ll", null],
   ["ll", "ll", null]],
   [["lz", null, null],
   ["lz", "lz", null],
   [null, "lz", null]],
   [[null, "rz", null],
   ["rz", "rz", null],
   ["rz", null, null]],
   [[null, null, null],
   [null, "t", null],
   ["t", "t", "t"]]
];
let mapaBlocos1 =
   [[9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
   [9, null, null, null, null, null, null, null, null, null, null, 9],
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

const colors = ["yellow", "blue", "green", "green", "red","red","purple"];
var images = new Map([
   ["o", new BlockImage('./images/yellow.png')],
   ["i", new BlockImage('./images/blue.png')],
   ["rl", new BlockImage('./images/green.png')],
   ["ll", new BlockImage('./images/green.png')],
   ["lz", new BlockImage('./images/red.png')],
   ["rz", new BlockImage('./images/red.png')],
   ["blank", new BlockImage('./images/blank.png')],
   ["t", new BlockImage('./images/purple.png')],
   ["background", new BlockImage('./images/background.png')]
]);
class Shape {
   constructor(number) {
      this.format = (shapes[number].map((i) => i.map((j) => j)));
      this.number = number;
   }
}

class Bloco {
   constructor({position,shadowPosition }) {
      this.velocity = 1,
      this.position = position,
      this.shadowPosition = shadowPosition;
      this.width = zoom,
      this.height = zoom,
      this.stopped = false;
      this.setted = false;
      this.color = Math.floor(Math.random() * 5);
      this.blockImage = images.get(colors[this.color]);
      this.shape = new Shape(Math.floor(Math.random() * 7));
   }

   draw() {
      c.globalAlpha = 1;
      for (var i = 0; i < this.shape.format.length; i++) {
         for (var j = 0; j < this.shape.format.length; j++) {
            if (this.shape.format[i][j]) {
               c.drawImage(images.get(this.shape.format[i][j]).img, tableBeginPosition  + (this.position.x + j) * zoom, (this.position.y + i) * zoom);
            }
         }
      }
   }

   drawShadow() {
      c.globalAlpha = 1/3;
      bloco.shadowPosition.y = bloco.position.y;
      bloco.shadowPosition.x = bloco.position.x;
      let colisao = calcularShadowColisao();
      if(!colisao){
         while (!colisao) {
            bloco.shadowPosition.y += 1;
            colisao = calcularShadowColisao();
         }
         for (var i = 0; i < this.shape.format.length; i++) {
            for (var j = 0; j < this.shape.format.length; j++) {
               if (this.shape.format[i][j]) {
                  c.drawImage(images.get(this.shape.format[i][j]).img, 150  + (this.shadowPosition.x + j) * zoom, (this.shadowPosition.y + i) * zoom);
               }
            }
         }
      }
      
      
   }
   shift() {
      let colisao;
      const n = this.shape.format.length;
      var rotatedMatrix = new Array(n).fill(null).map(() => new Array(n).fill(0));
      for (let i = 0; i < n; i++) {
         for (let j = 0; j < n; j++) {
            rotatedMatrix[j][n - 1 - i] = this.shape.format[i][j];
         }
      }
      colisao = calcularColisaoX(this, rotatedMatrix, 0);
      if (!colisao) {
         this.shape.format = rotatedMatrix;
      } else {
         var position = this.position.y;
         var reposition = 0;
         var move = +1
         do {
            reposition += move;
            colisao = calcularColisaoX(this, rotatedMatrix, reposition);
            if (!colisao) {
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
         } while (colisao)
      }
   }
   update() {
      this.draw();
      this.drawShadow();
   }
}
var blocoReserva;
class Table {
   constructor() {
      this.shape = mapaBlocos1;
      this.blocos = blocos;
      this.bloco = bloco;
      this.images = images;
   }

   draw() {
      for (let i = 0; i < this.shape.length - 1; i++) {
         for (let j = 1; j <= this.shape[0].length - 1; j++) {
             if (this.shape[i][j]  && this.shape[i][j] != 9) {
               c.globalAlpha = 1;
               c.drawImage(images.get(table.shape[i][j]).img, 150 + j * zoom, i * zoom);
            } else if( this.shape[i][j] != 9){
               c.globalAlpha  = 1/3
               c.strokeStyle = "white"; 
               c.strokeRect(tableBeginPosition + j * zoom, i * zoom,zoom,zoom);
            } 
         }
      }
      this.drawListBlock();
      this.drawStore();
   }

    drawListBlock(){
        c.globalAlpha = 1;
        c.strokeStyle = "white"; 
        c.strokeRect(listBeginPosition, 0, 120, 520);
        for(var k = 1;k < blocos.length;k++){
            var blocoAux = blocos[k];
            for (var i = 0; i < blocoAux.shape.format.length; i++) {
                for (var j = 0; j < blocoAux.shape.format.length; j++) {
                   if (blocoAux.shape.format[i][j]) {
                      c.drawImage(images.get(blocoAux.shape.format[i][j]).img, listBeginPosition + j*zoom + 30, 130*(k - 1) + i*zoom);
                   }
                }
             }
        }
    }
    
    drawStore(){
        c.fillRect(0, 0, storeBerginPosition + 30, canvas.height - 140);
        c.strokeStyle = "white"; 
        c.strokeRect(0, 0, storeBerginPosition+ 30,  140);
        c.globalAlpha = 1;
        if(blocoReserva){
            for (var i = 0; i < blocoReserva.shape.format.length; i++) {
               for (var j = 0; j < blocoReserva.shape.format.length; j++) {
                  if (blocoReserva.shape.format[i][j]) {
                     c.drawImage(images.get(blocoReserva.shape.format[i][j]).img, 40 + j * zoom, 18 + i * zoom);
                  }
               }
            }
         }
         
    }
   breakLine() {
      for (let i = 0; i < this.shape.length - 1; i++) {
         let filtered = this.shape[i].filter(l => (!l || l == -10) && l != 9);
         if (!(filtered.length > 0)) {
            this.shape[i] = [9, null, null, null, null, null, null, null, null, null, null, 9]
            setTimeout(() => {
               this.shape.splice(i, 1);
               this.shape.unshift([9, null, null, null, null, null, null, null, null, null, null, 9]   );
            }, 200);
         }
      }
   }

   update() {
      this.breakLine();
      this.draw();
   }
}
let table = new Table();
setInterval(() => {
   miliSecUpdateTime -= updateTime;
   updateTime -= 0.07
}, miliSecUpdateTime);


for(var i = 0; i < 5; i++){
   blocos.push(new Bloco({
      position: {
         x: 4,
         y: 0
      },
      shadowPosition: {
         x: 4,
         y: 0
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
      position: {
         x: 4,
         y: 0
      },
      shadowPosition: {
         x: 4,
         y: 0
      }
   }));
   setBlocoInterval();
}
function changeBlock() {
   clearInterval(bloco.positionUpdateInterval);
   blocoAux = blocoReserva;
   blocoReserva = bloco;
   blocoReserva.position.y = 0;
   blocoReserva.position.x = 4;
   if(blocoAux){
      bloco = blocoAux;
   }else{
        blocos.splice(0, 1);
        bloco = blocos[0];
        blocos.push(new Bloco({
            position: {
                x: 4,
                y: 0
            },
            shadowPosition: {
               x: 4,
               y: 0
            }
        }));
   }
   setBlocoInterval();
   newBlock = false;
}
function setBlocoInterval(){
   bloco.positionUpdateInterval = setInterval(() => {
      if (!bloco.stopped) {
         let colisao = calcularColisao();
         if (colisao) {
            bloco.stopped = true;
            let setBlockInterval = setInterval(() => {
               let colisaoRec = calcularColisao();
               if (colisaoRec && !bloco.setted) {
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
   let colisao;
   if(bloco){
      for (var i = 0; i < bloco.shape.format.length; i++) {
         for (var j = 0; j < bloco.shape.format.length; j++) {
            if (bloco.shape.format[i][j]) {
               colisao = table.shape[bloco.position.y + i + 1][bloco.position.x + j];
               if (colisao) {
                  return colisao;
               }
            }
         }
      }
   } 
   return colisao;
}

function calcularShadowColisao() {
   let colisao;
   for (var i = 0; i < bloco.shape.format.length; i++) {
      for (var j = 0; j < bloco.shape.format.length; j++) {
         if (bloco.shape.format[i][j]) {
            colisao = table.shape[bloco.shadowPosition.y + i + 1][bloco.shadowPosition.x + j];
            if (colisao) {
               return colisao;
            }
         }
      }
   }
   return colisao;
}

function calcularColisaoX(bloco, shape, previsao) {
   let colisao;
   for (var i = 0; i < shape.length; i++) {
      for (var j = 0; j < shape.length; j++) {
         if (shape[i][j]) {
            colisao = table.shape[bloco.position.y + i][bloco.position.x + j + previsao];
            if (colisao) {
               return colisao;
            }
         }
      }
   }
   return colisao;
}

function setBlock() {
   for (var i = 0; i < bloco.shape.format.length; i++) {
      for (var j = 0; j < bloco.shape.format.length; j++) {
         if (bloco.shape.format[i][j]) {
            table.shape[bloco.position.y + i][bloco.position.x + j] = bloco.shape.format[i][j];
         }
      }
   }
}


window.addEventListener("keydown", (event) => {
   event.preventDefault();
   let colisao;
   switch (event.key) {
      case " ":
         keys.space.pressed = true;
         bloco.stopped = false;
         while (!bloco.stopped) {
            colisao = calcularColisao();
            if (colisao) {
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
         if (!colisao) {
            bloco.stopped = false;
            bloco.position.x += 1;
         }
         keys.d.pressed = true;
         break
      case 'a':
         colisao = calcularColisaoX(bloco, bloco.shape.format, -1);
         if (!colisao) {
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