function generateGuestNumber() {
   // Generate a random number between 10000 and 99999
   const guestNumber = Math.floor(10000 + Math.random() * 90000);
   return `guest${guestNumber}`;
 }

 const GUEST = generateGuestNumber();
 
 class BlockImage {
    constructor(src) {
       this.img = new Image();
       this.img.src = src;
    }
 }
 
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const ZOOM = 30;
const BLOCK_SIZE = 30;
const BLOCK_ENEMY_SIZE = 15;
const TABLE_BEGIN_POSITION = 150;
const LIST_BEGIN_POSITION = 570;
const STORE_BEGIN_POSITION = 120;
const ENEMIES_BEGIN_POSITION = 850
canvas.width = 70 * ZOOM;
canvas.height = 70 * ZOOM;
var miliSecUpdateTime = 1000;
var updateTime = 10;
var newBlock = true;
var conn;
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
 const colors = ["yellow", "blue", "green", "green", "red", "red", "purple"];
 const images = new Map([
    ["o", new BlockImage(`./images/yellow.png`)],
    ["i", new BlockImage(`./images/blue.png`)],
    ["rl", new BlockImage(`./images/green.png`)],
    ["ll", new BlockImage(`./images/green.png`)],
    ["lz", new BlockImage(`./images/red.png`)],
    ["rz", new BlockImage(`./images/red.png`)],
    ["blank", new BlockImage(`./images/blank.png`)],
    ["t", new BlockImage(`./images/purple.png`)],
    ["background", new BlockImage(`./images/background.png`)]
 ]);
 const shapes = [
    [["o", "o"],
    ["o", "o"]],
    [["i"],
    ["i"],
    ["i"],
    ["i"]],
    [["rl",null],
    ["rl", null],
    ["rl", "rl"]],
    [[null,"ll"],
    [null, "ll"],
    ["ll", "ll"]],
    [["lz", null],
    ["lz", "lz"],
    [null, "lz"]],
    [[null, "rz"],
    ["rz", "rz"],
    ["rz", null]],
    [[null, null, null],
    [null, "t", null],
    ["t", "t", "t"]]
 ];
 let shape =
   [["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", null, null, null, null, null, null, null, null, null, null, "9"],
   ["9", "9", "9", "9", "9", "9", "9", "9", "9", "9", "9", "9"]];

 class Shape {
    constructor(number) {
       this.format = shapes[number].map(row => [...row]);
       this.number = number;
    }
 }
 
 class Bloco {
    constructor({ position, shadowPosition }) {
       this.velocity = 1;
       this.position = { ...position };
       this.shadowPosition = { ...shadowPosition };
       this.width = BLOCK_SIZE;
       this.height = BLOCK_SIZE;
       this.stopped = false;
       this.setted = false;
       this.color = Math.floor(Math.random() * colors.length);
       this.blockImage = images.get(colors[this.color]);
       this.shape = new Shape(Math.floor(Math.random() * 7));
    }
 
    draw() {
       c.globalAlpha = 1;
       this.shape.format.forEach((row, i) => {
          row.forEach((cell, j) => {
             if (cell) {
                c.drawImage(images.get(cell).img, TABLE_BEGIN_POSITION + (this.position.x + j) * BLOCK_SIZE, (this.position.y + i) * BLOCK_SIZE);
             }
          });
       });
    }
 
    drawShadow() {
        c.globalAlpha = 1/3;
        this.shadowPosition.y = this.position.y;
        this.shadowPosition.x = this.position.x;
        let colisao = calcularShadowColisao();
        if(!colisao){
           while (!colisao) {
            this.shadowPosition.y += 1;
              colisao = calcularShadowColisao();
           }
           for (var i = 0; i < this.shape.format.length; i++) {
              for (var j = 0; j < this.shape.format.length; j++) {
                 if (this.shape.format[i][j]) {
                    c.drawImage(images.get(this.shape.format[i][j]).img, 150  + (this.shadowPosition.x + j) * ZOOM, (this.shadowPosition.y + i) * ZOOM);
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
        colisao = calcularColisaoX(rotatedMatrix, 0);
        if (!colisao) {
           this.shape.format = rotatedMatrix;
        } else {
           var position = this.position.y;
           var reposition = 0;
           var move = +1
           do {
              reposition += move;
              colisao = calcularColisaoX(rotatedMatrix, reposition);
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
    }
 }
 
 class Table {
    constructor() {
       this.c = document.querySelector('canvas').getContext('2d');
       this.ZOOM = BLOCK_SIZE;
       this.tableBeginPosition = 150;
       this.LIST_BEGIN_POSITION = 570;
       this.storeBeginPosition = 120;
       this.canvas = document.querySelector('canvas');
       this.canvas.width = 50 * this.ZOOM;
       this.canvas.height = 50 * this.ZOOM;
       this.shapes = shapes;
       this.shape = shape;
       this.blocos = [];
       this.bloco = null;
       this.images = images;
       this.keys = { a: { pressed: false }, d: { pressed: false }, s: { pressed: false }, space: { pressed: false } };
       this.miliSecUpdateTime = 1000;
       this.updateTime = 10;
       this.newBlock = true;
       this.enemies = [];
       this.finished = false;
       this.initializeBlocos();
    }
 
    initializeBlocos() {
       for (let i = 0; i < 5; i++) {
          this.blocos.push(new Bloco({ position: { x: 4, y: 0 }, shadowPosition: { x: 4, y: 0 } }));
       }
       this.bloco = this.blocos[0];
       this.setBlocoInterval();
    }
 
    setBlocoInterval() {
       this.bloco.positionUpdateInterval = setInterval(() => {
          if (!this.bloco.stopped) {
             let colisao = this.calcularColisao();
             if (colisao) {
                this.bloco.stopped = true;
                let setBlockInterval = setInterval(() => {
                   let colisaoRec = this.calcularColisao();
                   if (colisaoRec && !this.bloco.setted) {
                      this.setBlock();
                      this.bloco.setted = true;
                      clearInterval(this.bloco.positionUpdateInterval);
                   } else {
                      this.bloco.stopped = false;
                      clearInterval(setBlockInterval);
                   }
                }, 3000);
             } else {
                if (this.bloco.setted) {
                   clearInterval(this.bloco.positionUpdateInterval);
                } else if (!this.keys.s.pressed) {
                   this.bloco.position.y += 1;
                }
             }
          }
       }, this.miliSecUpdateTime);
    }
 
    draw() {
      if(!this.finished){
         for (let i = 0; i < this.shape.length - 1; i++) {
            for (let j = 1; j <= this.shape[0].length - 1; j++) {
               if (this.shape[i][j] && this.shape[i][j] != "9") {
                  c.globalAlpha = 1;
                  c.drawImage(images.get(this.shape[i][j]).img, this.tableBeginPosition + j * BLOCK_SIZE, i * BLOCK_SIZE);
               } else if (this.shape[i][j] != "9") {
                  c.globalAlpha = 1 / 3;
                  c.strokeStyle = "white";
                  c.strokeRect(this.tableBeginPosition + j * BLOCK_SIZE, i * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
               }
            }
         }
         this.drawBlockShadow();
         this.drawListBlock();
         this.drawStore();
      }
      this.drawEnemies();
    }
    
    drawEnemies() {
      let count=0;
         this.enemies.forEach((obj, key,map) => {
            if(key != GUEST){
               count++;
               obj.bloco.shape.format.forEach((row, i) => {
                  row.forEach((cell, j) => {
                     if (cell) {
                        c.drawImage(images.get(cell).img, ENEMIES_BEGIN_POSITION*count + (obj.bloco.position.x + j) * BLOCK_SIZE, (obj.bloco.position.y + i) * BLOCK_SIZE);
                     }
                  });
               });
               for (let i = 0; i < obj.shape.length - 1; i++) {
                  for (let j = 1; j <= obj.shape[0].length - 1; j++) {
                     if (obj.shape[i][j] && obj.shape[i][j] != "9") {
                        c.globalAlpha = 1;
                        c.drawImage(images.get(obj.shape[i][j]).img, ENEMIES_BEGIN_POSITION*count + j * BLOCK_SIZE, i * BLOCK_SIZE);
                     } else if (obj.shape[i][j] != "9") {
                        c.globalAlpha = 1 / 3;
                        c.strokeStyle = "white";
                        c.strokeRect(ENEMIES_BEGIN_POSITION*count + j * BLOCK_SIZE, i * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                     }
                  }
               }
            }
         });
         
    }

    drawListBlock() {
       c.globalAlpha = 1;
       c.strokeStyle = "white";
       c.strokeRect(this.LIST_BEGIN_POSITION, 0, 120, 540);
       this.blocos.forEach((blocoAux, k) => {
          if (k > 0) {
             blocoAux.shape.format.forEach((row, i) => {
                row.forEach((cell, j) => {
                   if (cell) {
                      c.drawImage(images.get(cell).img, this.LIST_BEGIN_POSITION  + j * BLOCK_SIZE + 30, 130 * (k - 1) + i * BLOCK_SIZE + BLOCK_SIZE);
                   }
                });
             });
          }
       });
    }
 
    drawStore() {
       c.fillRect(0, 0, this.storeBeginPosition + 30, this.canvas.height - 140);
       c.strokeStyle = "white";
       c.strokeRect(0, 0, this.storeBeginPosition + 30, 140);
       c.globalAlpha = 1;
       if (this.blocoReserva) {
          this.blocoReserva.shape.format.forEach((row, i) => {
             row.forEach((cell, j) => {
                if (cell) {
                   c.drawImage(images.get(cell).img, 40 + j * BLOCK_SIZE, 18 + i * BLOCK_SIZE);
                }
             });
          });
       }
    }

    drawBlockShadow() {
        c.globalAlpha = 1/3;
        this.bloco.shadowPosition.y = this.bloco.position.y;
        this.bloco.shadowPosition.x = this.bloco.position.x;
        let colisao = this.calcularShadowColisao();
        if(!colisao){
           while (!colisao) {
            this.bloco.shadowPosition.y += 1;
              colisao = this.calcularShadowColisao();
           }
           for (var i = 0; i < this.bloco.shape.format.length; i++) {
              for (var j = 0; j < this.bloco.shape.format.length; j++) {
                 if (this.bloco.shape.format[i][j]) {
                    c.drawImage(images.get(this.bloco.shape.format[i][j]).img, 150  + (this.bloco.shadowPosition.x + j) * ZOOM, (this.bloco.shadowPosition.y + i) * ZOOM);
                 }
              }
           }
        }
    }
 
    shift() {
        let colisao;
        const n = this.bloco.shape.format.length;
        var rotatedMatrix = new Array(n).fill(null).map(() => new Array(n).fill(0));
        for (let i = 0; i < n; i++) {
           for (let j = 0; j < n; j++) {
              rotatedMatrix[j][n - 1 - i] = this.bloco.shape.format[i][j];
           }
        }
        colisao = this.calcularColisaoX(rotatedMatrix, 0);
        if (!colisao) {
            this.bloco.shape.format = rotatedMatrix;
        } else {
            var position = this.bloco.position.y;
            var reposition = 0;
            var move = +1
            do {
              reposition += move;
              colisao = this.calcularColisaoX(rotatedMatrix, reposition);
              if (!colisao) {
                this.bloco.position.x += reposition;
                 this.bloco.shape.format = rotatedMatrix;
                 break;
              } else {
                 reposition = 0;
                 move = -move;
                 if (move > 0) {
                    move++;
                 }
              }
              if (move > 2) {
                 if (position - this.bloco.position.y > 1) {
                    this.bloco.position.y = position;
                    break;
                 }
                 this.bloco.position.y -= 1;
                 reposition = 0;
                 move = 1;
              }
            } while (colisao)
        }
    }
 
    breakLine() {
       for (let i = 0; i < this.shape.length - 1; i++) {
          let filtered = this.shape[i].filter(cell => (!cell || cell == -10) && cell != "9");
          if (!(filtered.length > 0)) {
             this.shape[i] = ["9", null, null, null, null, null, null, null, null, null, null, "9"];
             setTimeout(() => {
                this.shape.splice(i, 1);
                this.shape.unshift(["9", null, null, null, null, null, null, null, null, null, null, "9"]);
             }, 200);
          }
       }
    }
 
    update() {
       this.breakLine();
       this.draw();
    }
 
    calcularColisao() {
       let colisao;
       for (var i = 0; i < this.bloco.shape.format.length; i++) {
            for (var j = 0; j < this.bloco.shape.format.length; j++) {
                if (this.bloco.shape.format[i][j]) {
                    colisao = this.shape[this.bloco.position.y + i + 1][this.bloco.position.x + j];
                    if (colisao) {
                        return colisao;
                    }
                }
            }
       }
       return colisao;
    }
 
    calcularShadowColisao() {
        let colisao;
        for (var i = 0; i < this.bloco.shape.format.length; i++) {
           for (var j = 0; j < this.bloco.shape.format.length; j++) {
              if (this.bloco.shape.format[i][j]) {
                 colisao = this.shape[this.bloco.shadowPosition.y + i + 1][this.bloco.shadowPosition.x + j];
                 if (colisao) {
                    return colisao;
                 }
              }
           }
        }
        return colisao;
    }
 
    calcularColisaoX(shape, previsao) {
        let colisao;
        for (var i = 0; i < shape.length; i++) {
           for (var j = 0; j < shape.length; j++) {
              if (shape[i][j]) {
                 colisao = this.shape[this.bloco.position.y + i][this.bloco.position.x + j + previsao];
                 if (colisao) {
                    return colisao;
                 }
              }
           }
        }
        return colisao;
    }
 
    setBlock() {
       this.bloco.shape.format.forEach((row, i) => {
          row.forEach((cell, j) => {
             if (cell) {
                this.shape[this.bloco.position.y + i][this.bloco.position.x + j] = cell;
             }
          });
       });
    }
 
    createNewBloco() {
       this.newBlock = true;
       clearInterval(this.bloco.positionUpdateInterval);
       this.blocos.shift();
       this.bloco = this.blocos[0];
       this.blocos.push(new Bloco({ position: { x: 4, y: 0 }, shadowPosition: { x: 4, y: 0 } }));
       let colisao = this.calcularColisao();
       if(colisao){
           this.finished = true;
           return;  
       }
       this.setBlocoInterval();
    }
 
    changeBlock() {
      if(this.newBlock){
         clearInterval(this.bloco.positionUpdateInterval);
         const blocoAux = this.blocoReserva;
         this.blocoReserva = this.bloco;
         this.blocoReserva.position.y = 0;
         this.blocoReserva.position.x = 4;
         if (blocoAux) {
            this.bloco = blocoAux;
         } else {
            this.blocos.shift();
            this.bloco = this.blocos[0];
            this.blocos.push(new Bloco({ position: { x: 4, y: 0 }, shadowPosition: { x: 4, y: 0 } }));
         }
         this.setBlocoInterval();
         this.newBlock = false;
      }
       
    }
 }
 
 const table = new Table();
 
 function animate() {
      requestAnimationFrame(animate);
      table.c.clearRect(0, 0, table.canvas.width, table.canvas.height);
      table.update();
      if(!table.finished){
         table.bloco.update();
         if (table.bloco.setted) {
            table.createNewBloco();
         }
         if(conn){
           let body = {};
           body.shape = table.shape;
           body.bloco = table.bloco;
           body.id = GUEST;
           conn.send(JSON.stringify(body));
         }
      }
 }
 
 animate();
 
 window.addEventListener("keydown", (event) => {
    event.preventDefault();
    let colisao;
    switch (event.key) {
       case " ":
          table.keys.space.pressed = true;
          table.bloco.stopped = false;
          while (!table.bloco.stopped) {
             colisao = table.calcularColisao();
             if (colisao) {
                table.setBlock();
                table.bloco.stopped = true;
                table.bloco.setted = true;
             }
             table.bloco.position.y += 1;
          }
          table.createNewBloco();
          break;
       case 'd':
          colisao = table.calcularColisaoX(table.bloco.shape.format, 1);
          if (!colisao) {
             table.bloco.stopped = false;
             table.bloco.position.x += 1;
          }
          keys.d.pressed = true;
          break
       case 'a':
          colisao = table.calcularColisaoX(table.bloco.shape.format, -1);
          if (!colisao) {
            table.bloco.stopped = false;
            table.bloco.position.x -= 1;
          }
          keys.a.pressed = true;
          break
       case 's':
          table.bloco.stopped = false;
          keys.s.pressed = true;
          colisao = table.calcularColisao();
          if(!colisao){
             table.bloco.position.y += 1;
           }
          break
       case 'w':
          table.shift();
          break
       case 'Shift':
          if(newBlock){
             table.changeBlock();
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

 window.onload = function () {

   if (window["WebSocket"]) {
       conn = new WebSocket("ws://8.tcp.ngrok.io:18281/ws?id=teste222&idPlayer="+GUEST);
       conn.onclose = function (evt) {
            console.log(evt);
       };
       conn.onmessage = function (evt) {
           console.log(evt)
           var messages = evt.data.split('\n');
           for (var i = 0; i < messages.length -1; i++) {
               var item = document.createElement("div");
               let body = JSON.parse(messages[i]);
               console.log(body);
               item.innerText = messages[i];
               let enemy = {}
               enemy.shape = body.shape;
               enemy.bloco = body.bloco;
               table.enemies = new Map(Object.entries(body));
           }
       };
   } else {
      console.log("browse does not suport web socket")
   }
};


window.addEventListener('beforeunload', function (event) {
   conn.close();
});

