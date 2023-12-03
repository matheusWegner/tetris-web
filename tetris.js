const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const zoom = 30;
var miliSecUpdateTime = 1000;
var updateTime = 10;
setInterval(() => {
   miliSecUpdateTime -= updateTime;
   updateTime -= 0.07
}, miliSecUpdateTime);
canvas.width = 11*zoom;
canvas.height = 20*zoom;

c.fillRect(30,0,canvas.width,canvas.height);
let mapaBlocos = new Map();
let mapaBlocos1 = 
[[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,0,0,0,0,0,0,0,0,0,0,3],
[3,3,3,3,3,3,3,3,3,3,3,3]]
let blocos = [];
let blocoAtual = 0;
let shapes = [
    [[1,1],
     [1,1]],//square
    
    [[0,0,1,0],
     [0,0,1,0],
     [0,0,1,0],
     [0,0,1,0]],
     
    [[0,1,0],
     [0,1,0],
     [0,1,1]],
     
    [[0,1,0],
     [0,1,0],
     [1,1,0]],
     
    [[1,0,0],
     [1,1,0],
     [0,1,0]],
     
    [[0,0,1],
     [0,1,1],
     [0,1,0]],
    
    [[0,0,0],
     [0,1,0],
     [1,1,1]]
];
class Shape {
   constructor(number){
       this.format =(shapes[number].map((i) => i.map((j) => j))); 
   }
}

class Bloco {
    constructor({color,position}){
       this.color = color,
       this.velocity = 1,
       this.position = position,
       this.width = zoom,
       this.height = zoom,
       this.stopped = false;
       this.setted = false;
       this.image =  new Image();
       this.image.src = './images/red.png';
       this.shape = new Shape(Math.floor(Math.random() * 7));
       this.positionUpdateInterval = setInterval(() => {
         if(!this.stopped){
            let colisao = calcularColisao();
            if(colisao > 0){
               this.stopped = true;
               let setBlockInterval = setInterval(() => {
                   let colisaoRec = calcularColisao();
                   if(colisaoRec > 0 && !this.setted){
                     setBlock();
                     this.setted = true;
                     clearInterval(this.positionUpdateInterval); 
                   }else{
                     this.stopped = false;
                     clearInterval(setBlockInterval);
                   }
               },3000);
            }else{
               if (this.setted) {
                  clearInterval(this.positionUpdateInterval); 
               }else if(!keys.s.pressed){
                  this.position.y += 1;
               }
            }
            
         }
         
      }, miliSecUpdateTime);
    } 
    
    draw() {
       for(var i = 0; i < this.shape.format.length;i++){
          for(var j = 0; j < this.shape.format.length;j++){
             if(this.shape.format[i][j] == 1){
                c.drawImage(this.image,(this.position.x + j)*zoom, (this.position.y + i)*zoom);
             }
          }
       }
      /* this.position.y++;
       c.font = "48px serif";
       c.fillStyle = 'white'
       c.fillText("Hello world", this.position.x, this.position.y);*/
    }
    shift(){
            let colisao = 0;
            const n = this.shape.format.length;
            var rotatedMatrix = new Array(n).fill(null).map(() => new Array(n).fill(0));
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                   rotatedMatrix[j][n - 1 - i] = this.shape.format[i][j];
                }
            }
            colisao = calcularColisaoX(this,rotatedMatrix, 0);
            if(colisao == 0){
               this.shape.format = rotatedMatrix;
            }else{
                let reposition;
               if(this.position.y < 5){
                  reposition = +1;
               }else{
                  reposition = -1;
               }
               colisao = calcularColisaoX(this,rotatedMatrix, reposition);
               if(colisao == 0){
                  this.position.x += reposition;
                  this.shape.format = rotatedMatrix;
               }
            }
    }
    update(){
       this.draw();
    }
}

class Table {
   constructor({position}){
      this.position = position,
      this.color = 'red';
      this.shape = mapaBlocos1;
      this.image = new Image();
      this.image.src = './images/background3.png';
      this.red = new Image();
      this.red.src = './images/red.png';
   } 
   
   draw() {
      for(let i = 0; i < this.shape.length;i++){
         for(let j =0;j <= this.shape[0].length;j++){
            if(mapaBlocos1[i][j] == 1){
               c.drawImage(this.red,j*zoom,i*zoom);
            }else if(mapaBlocos1[i][j] == 0){
               c.drawImage(this.image,(j)*zoom,i*zoom);
            }else if(mapaBlocos1[i][j] == -10){
               c.fillStyle = "rgba(255, 255, 255, 0.1)";
               c.fillRect(zoom, i * zoom, canvas.width, zoom);
            }
         }
      }
   }
   breakLine(){
      for(let i = 0; i < this.shape.length - 1;i++){
         let filtered = this.shape[i].filter(l => l == 0 || l == -10);
         if(!(filtered.length > 0)){
            this.shape[i] = [3,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,3]
            setTimeout(() => {
               this.shape.splice(i, 1);  
               this.shape.unshift([3,0,0,0,0,0,0,0,0,0,0,3]);
            }, 500);
         }
      }
   }

   update(){
      this.breakLine();
      this.draw();
   }
}

const keys = {
    a:{
       pressed:false
    },
    d:{
       pressed:false
    },
    s:{
      pressed:false 
    },
    space:{
      pressed:false
    }
}

let bloco = new Bloco({
  color: 'red',
  position: {
    x:4,
    y:0
  },
  velocity: {
    x:1,
    y:1
  },
});
let table = new Table({
   position: {
     x:canvas.width/2,
     y:0
   }
});
function animate() {
    window.requestAnimationFrame(animate);
    //c.fillStyle = 'black'
    //c.fillRect(0, 0, canvas.width, canvas.height);
    c.clearRect(0, 0, canvas.width, canvas.height);
    table.update();
    bloco.update(); 
    if(bloco.setted){
      createNewBloco();
    }
} 
animate();
function createNewBloco(){
      bloco = new Bloco({
        color: 'red',
        position: {
          x:4,
          y:0
        },
        velocity: {
          x:1,
          y:1
        }
      });       
}    

function calcularColisao(){
    let colisao = 0;
    for(var i = 0; i < bloco.shape.format.length;i++){
      for(var j = 0; j < bloco.shape.format.length;j++){
         if(bloco.shape.format[i][j] == 1){
            colisao =  mapaBlocos1[bloco.position.y + i + 1][bloco.position.x + j];
            if(colisao > 0){
               return colisao;
            }       
         }
      }
    }
    return colisao;
}

function calcularColisaoX(bloco,shape,previsao){
   let colisao = 0;
   for(var i = 0; i < shape.length;i++){
     for(var j = 0; j < shape.length;j++){
        if(shape[i][j] == 1){
              colisao =  mapaBlocos1[bloco.position.y + i][bloco.position.x + j + previsao];
              if(colisao > 0){
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

function setBlock(){
   for(var i = 0; i < bloco.shape.format.length;i++){
      for(var j = 0; j < bloco.shape.format.length;j++){
         if(bloco.shape.format[i][j] == 1){
              mapaBlocos1[bloco.position.y + i][bloco.position.x + j] = 1;
         }
      }
   }
}


window.addEventListener("keydown" , (event) =>{
      let colisao = 0;
      switch(event.key){
         case " ":
            keys.space.pressed = true;
            bloco.stopped = false;
            while(!bloco.stopped){
               let colisao = calcularColisao();
               if(colisao > 0){
                  setBlock();
                  bloco.stopped = true;
                  bloco.setted = true;
               }
               bloco.position.y += 1;
            }
            for(let i  = 0;i  < 10;i++){
               c.globalAlpha = i/10;
               bloco.draw()
            }
            createNewBloco();
         break  
         case 'd':
            colisao = calcularColisaoX(bloco,bloco.shape.format,1);
            if(colisao == 0){
               bloco.stopped = false;
               bloco.position.x += 1;
            }
            keys.d.pressed = true;
         break
         case 'a':
            colisao = calcularColisaoX(bloco,bloco.shape.format,-1);
            if(colisao == 0){
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
      }
      event.preventDefault();
});

window.addEventListener('keyup' , (event) => {
    console.log(event.key);
      switch(event.key){
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
      event.preventDefault();
 });