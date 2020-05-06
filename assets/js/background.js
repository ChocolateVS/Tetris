var canvasB = document.getElementById('backgroundCanvas');

canvasB.height = window.innerHeight;
canvasB.width = window.innerWidth;
var b = canvasB.getContext('2d');

var lineF = [0, 0, 0, 1, 0, 2, 0, 3, "cyan"];
var squareF = [0, 0, 1, 0, 0, 1, 1, 1, "yellow"];
var lF = [0, 0, 0, 1, 0, 2, 1, 2, "orange"];
var jF = [0, 0, 0, 1, 0, 2, -1, 2, "blue"];
var sF = [0, 0, 0, 1, 1, 1, 1, 2, "green"];
var zF = [0, 0, 0, 1, -1, 1, -1, 2, "red"];
var tF = [0, 0, 1, 0, 2, 0, 1, 1, "purple"];
var tetriminosF = [lineF, squareF, lF, jF, zF, sF, tF];

var width = 20;
var height = 20;

var fallingTetriminos = [];
function randomFalling() {
    var dy = 1; //CHECK FOR ILLEGAL PLACES X COORDINATE....
    var tetrimino = Math.floor(Math.random() * tetriminosF.length);
    newTetrimino = tetriminosF[tetrimino];
    
    var dy = Math.random();
    console.log(dy);
    var w = 10; 
    var h = 10;
    var x = Math.round(Math.random() * canvasB.width);
    var y = Math.round(Math.random() * canvasB.width);
    var x1 = x + (w * newTetrimino[2]);
    var y1 = y + (w * newTetrimino[3]);
    var x2 = x + (w * newTetrimino[4]); 
    var y2 = y + (w * newTetrimino[5]);
    var x3 = x + (w * newTetrimino[6]);
    var y3 = y + (w * newTetrimino[7]);
    var tetriminoColor = newTetrimino[8];
    fallingTetriminos.push(new DrawFallingTetrimino(x, y, x1, y1, x2, y2, x3, y3, w, h, tetriminoColor, dy));
}
for (i = 0; i < 30; i++) {
    randomFalling();
}
animateFalling();
var time = 0;
function animateFalling() {
    requestAnimationFrame(animateFalling);
    //if (time == 10) {
        //randomFalling();
        b.clearRect(0,0, innerWidth,innerHeight);
        for (i=0; i<fallingTetriminos.length; i++){
            fallingTetriminos[i].update();
        }
    //}
    //time++;
}

function DrawFallingTetrimino(x, y, x1, y1, x2, y2, x3, y3, w, h, color, dy) {
    this.color = color;
    this.dy = dy;
    this.w = w;
    this.h = h; 
    this.x = x;
    this.y = y;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
    this.draw = function() {
        b.beginPath();
        b.strokeStyle = this.color;
        b.fillStyle = this.color;
        b.rect(this.x,this.y,this.w,this.h);
        b.rect(this.x1,this.y1,this.w,this.h);
        b.rect(this.x2,this.y2,this.w,this.h);
        b.rect(this.x3,this.y3,this.w,this.h);
        b.stroke();
        b.fill();
    }

    this.update = function() {
        //CHECK FOR LINES AND TETRISES
        /*if (this.y < (24*this.h) && this.y1 < (24*this.h) && this.y2 < (24*this.h) && this.y3 < (24*this.h) && go) {
            this.y += (this.dy * this.h); 
            this.y1 += (this.dy * this.h); 
            this.y2 += (this.dy * this.h); 
            this.y3 += (this.dy * this.h); 
        }*/
        
        if (this.y > canvas.height + this.w) {
            this.y = this.y - (canvas.height + this.w * 4);
        }
        if (this.y1 > canvas.height + this.w) {
            this.y1 = this.y1 - (canvas.height + this.w * 4);
        }
        if (this.y2 > canvas.height + this.w) {
            this.y2 = this.y2 - (canvas.height + this.w * 4);
        }
        if (this.y3 > canvas.height + this.w) {
            this.y3 = this.y3 - (canvas.height + this.w * 4);
        }
        
        this.y += (this.dy); 
        this.y1 += (this.dy); 
        this.y2 += (this.dy); 
        this.y3 += (this.dy); 
        
        this.draw();
    }
}



items = [];
items.forEach(element => {

});