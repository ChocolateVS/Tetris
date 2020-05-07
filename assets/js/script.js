/*
- Check for block touching top and bottom on update    //DONE
- Check for block touching Left on left press          //DONE
- Check for block touching right on right press        //DONE
- Check for block collisions (Stacking) on update      //DONE - rare unkown issue
- Check for block collision on left press              //DONE
- Check for block collision on right press             //DONE
- Check for left collision on block rotate             ?? - ISSUES
- Check for right collision on block rotate            ?? - ISSUES
- Check for block collision on rotate                  ?? - ISSUES

- Add inactive block positions to array properly       ?? - ISSUES
- Check for full lines and tetrises
*/
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}
var placedSound;
var canvas = document.getElementById('canvas');

var gameSpeed = 40;//document.getElementById("gameSpeedSlider").value;
var gameSpeedSlider = document.getElementById("gameSpeedSlider");
var count = 0;
gameSpeedSlider.oninput = function() {
    gameSpeed = this.value;
    count = 0;
    console.log(Math.round(500/this.value));
}

//Original States
var line = [6, 1, 6, 2, 6, 3, 6, 4, "cyan"];
var square = [5, 2, 6, 2, 5, 3, 6, 3, "yellow"];
var l = [5, 1, 5, 2, 5, 3, 6, 3, "orange"];
var j = [6, 1, 6, 2, 6, 3, 5, 3, "blue"];
var s = [5, 1, 5, 2, 6, 2, 6, 3, "green"];
var z = [6, 1, 6, 2, 5, 2, 5, 3, "red"];
var t = [5, 2, 6, 2, 6, 3, 7, 2, "purple"];

var scale = 24;

var gridWidth = document.getElementById("gameSpeedSlider").value;
var gridHeight = 24;

canvas.height = window.innerHeight - 20;
canvas.width = 10 * (canvas.height/24);
var c = canvas.getContext('2d');

var loadingArea = 3;
var tetriminoHeight = (canvas.height / scale);
var tetriminoWidth = tetriminoHeight;
var gridX = 0; 
var gridY = 0;
var tetriminos = [line, square, l, j, z, s, t];
var activeTetriminos = [];
var inactiveTetriminos = [];
var topBarY = gridY + (4 * tetriminoHeight);
var go = true;
var moveLeft = true;
var moveRight = true;
var rows = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function start() {
    placedSound = new sound("assets/sounds/fall.mp3");
    randomTetrimino();
    animate();
}
start();
function randomTetrimino() {
    var dy = 1;
    var tetrimino = Math.floor(Math.random() * tetriminos.length);
    newTetrimino = tetriminos[tetrimino];

    var w = tetriminoWidth; 
    var h = tetriminoHeight;
    var x = newTetrimino[0];
    var y = newTetrimino[1];
    var x1 = newTetrimino[2];
    var y1 = newTetrimino[3];
    var x2 = newTetrimino[4]; 
    var y2 = newTetrimino[5];
    var x3 = newTetrimino[6];
    var y3 = newTetrimino[7];
    var tetriminoColor = newTetrimino[8];
    activeTetriminos.push(new DrawTetrimino(x, y, x1, y1, x2, y2, x3, y3, w, h, tetriminoColor, tetrimino, dy));
}

function grid() {
    var fillColor;
    var h = tetriminoHeight;
    var w = tetriminoWidth;
    var x = gridX;
    var y = gridY;
    for (j=0; j<gridHeight; j++){
        if (j < loadingArea) {
            fillColor = "rgba(255,0,0,0.7)";
        }
        if (j > loadingArea) {
            fillColor = "rgba(0,100,255,0.7)";
        }
        for (i=0; i<gridWidth; i++){
            c.beginPath();
            c.strokeStyle = "#000000";
            c.fillStyle = fillColor;
            c.rect(x,y,w,h);
            c.fill();
            //c.stroke();
            c.closePath();
            c.beginPath();
            c.strokeStyle = "";

            x += h;
        }
        x = gridX;
        y += h;
    }
}

function animate(){
    requestAnimationFrame(animate);
    count++;
    if(count == Math.round(500/gameSpeed)) { 
        c.clearRect(0,0, innerWidth,innerHeight);
        grid();
        for (i=0; i<activeTetriminos.length; i++){
            activeTetriminos[i].update();
        }
        for (i=0; i<inactiveTetriminos.length; i++){
            inactiveTetriminos[i].draw();
            go = true;
        }
        count = 0;
        moveLeft = true; 
        moveRight = true;
    }  
}
function DrawInactive(x,y,w,h,color){
    this.color = color;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
    this.draw = function(){
        c.beginPath();
        c.strokeStyle = this.color;
        c.fillStyle = this.color;
        c.rect(this.x,this.y,this.w,this.h);
        c.stroke();
        c.fill();
    }
}
var n = 100;
window.addEventListener("keydown", event => {
    event.preventDefault();
    var rX = activeTetriminos[0].x;
    var rX1 = activeTetriminos[0].x1;
    var rX2 = activeTetriminos[0].x2;
    var rX3 = activeTetriminos[0].x3;
    var rY = activeTetriminos[0].y;
    var rY1 = activeTetriminos[0].y1;
    var rY2 = activeTetriminos[0].y2;
    var rY3 = activeTetriminos[0].y3;
    var rW = activeTetriminos[0].w;
    var gX = Math.round(gridX * 10) / 10;
    
    if (event.keyCode === 37) { //LEFT
        console.log(moveLeft);
        /*console.log("BEFORE MOVE");
        console.log("X0", Math.round(activeTetriminos[0].x * 10) / 10, gX);
        console.log("X1", Math.round(activeTetriminos[0].x1 * 10) / 10, gX);
        console.log("X2", Math.round(activeTetriminos[0].x2 * 10) / 10, gX);
        console.log("X3", Math.round(activeTetriminos[0].x3 * 10) / 10, gX);*/
        if (Math.round(activeTetriminos[0].x * 10) / 10 == gX || Math.round(activeTetriminos[0].x1 * 10) / 10 == gX || Math.round(activeTetriminos[0].x2 * 10) / 10 == gX || Math.round(activeTetriminos[0].x3 * 10) / 10 == gX){
            moveLeft = false;
            console.log("NO YOU CANT LEAVE!");
            return;
        }
        else if (moveLeft){
            console.log("NEXT");
            inactiveTetriminos.forEach(element => {
                //console.log("0", Math.round(element.x * n) / n, Math.round((activeTetriminos[0].x - rW) * n) / n, Math.round(element.y * n) / n, Math.round((activeTetriminos[0].y + rW) * n) / n);
                //console.log("1", Math.round(element.x * n) / n, Math.round((activeTetriminos[0].x1 - rW) * n) / n, Math.round(element.y * n) / n, Math.round((activeTetriminos[0].y1 + rW) * n) / n);
                //console.log("2", Math.round(element.x * n) / n, Math.round((activeTetriminos[0].x2 - rW) * n) / n, Math.round(element.y * n) / n, Math.round((activeTetriminos[0].y2 + rW) * n) / n);
                //console.log("3", Math.round(element.x * n) / n, Math.round((activeTetriminos[0].x3 - rW) * n) / n, Math.round(element.y * n) / n, Math.round((activeTetriminos[0].y3 + rW) * n) / n);
                if (Math.round(element.x * n) / n == Math.round((activeTetriminos[0].x - rW) * n) / n && Math.round(element.y * n) / n == Math.round((activeTetriminos[0].y) * n) / n) {
                    moveLeft = false;
                    console.log("THERE WOULD BE A COLLISION 0");
                    return;
                }
                if (Math.round(element.x * n) / n == Math.round((activeTetriminos[0].x1 - rW) * n) / n && Math.round(element.y * n) / n == Math.round((activeTetriminos[0].y1) * n) / n) {
                    moveLeft = false;
                    console.log("THERE WOULD BE A COLLISION 1");
                    return;
                }
                if (Math.round(element.x * n) / n == Math.round((activeTetriminos[0].x2 - rW) * n) / n && Math.round(element.y * n) / n == Math.round((activeTetriminos[0].y2) * n) / n) {
                    moveLeft = false;
                    console.log("THERE WOULD BE A COLLISION 2");
                    return;
                }
                if (Math.round(element.x * n) / n == Math.round((activeTetriminos[0].x3 - rW) * n) / n && Math.round(element.y * n) / n == Math.round((activeTetriminos[0].y3) * n) / n) {
                    moveLeft = false;
                    console.log("THERE WOULD BE A COLLISION 3");
                    return;
                }
            });
        }
        
        //console.log("MOVE?: ", moveLeft);
        if (moveLeft){
            activeTetriminos[0].x -= activeTetriminos[0].h;
            activeTetriminos[0].x1 -= activeTetriminos[0].h;
            activeTetriminos[0].x2 -= activeTetriminos[0].h;
            activeTetriminos[0].x3 -= activeTetriminos[0].h;
            //console.log("AFTER MOVE");
            //console.log("X0", Math.round(activeTetriminos[0].x * 10) / 10, gX);
            //console.log("X1", Math.round(activeTetriminos[0].x1 * 10) / 10, gX);
            //console.log("X2", Math.round(activeTetriminos[0].x2 * 10) / 10, gX);
            //console.log("X3", Math.round(activeTetriminos[0].x3 * 10) / 10, gX);
        }
    }
    if (event.keyCode === 39) {
        if (Math.round(activeTetriminos[0].x * 10) / 10 == Math.round((gX + (9 * rW)) * 10) / 10 || Math.round(activeTetriminos[0].x1 * 10) / 10 == Math.round((gX + (9 * rW)) * 10) / 10 || Math.round(activeTetriminos[0].x2 * 10) / 10 == Math.round((gX + (9 * rW)) * 10) / 10 || Math.round(activeTetriminos[0].x3 * 10) / 10 == Math.round((gX + (9 * rW)) * 10) / 10){
            moveRight = false;
            console.log("NO YOU CANT LEAVE THIS WAY EITHER");
            return;
        }
        else if (moveRight) {
            inactiveTetriminos.forEach(element => {              
                /*if (element.x == (activeTetriminos[0].x + rW) && element.y == rY + rW || element.x == (rX1 + rW) && element.y == rY1 + rW || element.x == (rX2 + rW) && element.y == rY2 + rW || element.x == (rX3 + rW) && element.y == rY3 + rW) {
                    moveRight = false;
                }*/
                //console.log("0", Math.round(element.x * n) / n, Math.round((activeTetriminos[0].x + rW) * n) / n, Math.round(element.y * n) / n, Math.round((activeTetriminos[0].y) * n) / n);
                //console.log("1", Math.round(element.x * n) / n, Math.round((activeTetriminos[0].x1 + rW) * n) / n, Math.round(element.y * n) / n, Math.round((activeTetriminos[0].y1) * n) / n);
                //console.log("2", Math.round(element.x * n) / n, Math.round((activeTetriminos[0].x2 + rW) * n) / n, Math.round(element.y * n) / n, Math.round((activeTetriminos[0].y2) * n) / n);
                //console.log("3", Math.round(element.x * n) / n, Math.round((activeTetriminos[0].x3 + rW) * n) / n, Math.round(element.y * n) / n, Math.round((activeTetriminos[0].y3) * n) / n);
                if (Math.round(element.x * n) / n == Math.round((activeTetriminos[0].x + rW) * n) / n && Math.round(element.y * n) / n == Math.round((activeTetriminos[0].y) * n) / n) {
                    moveRight = false;
                    console.log("THERE WOULD BE A COLLISION 0");
                    return;
                }
                if (Math.round(element.x * n) / n == Math.round((activeTetriminos[0].x1 + rW) * n) / n && Math.round(element.y * n) / n == Math.round((activeTetriminos[0].y1) * n) / n) {
                    moveRight = false;
                    console.log("THERE WOULD BE A COLLISION 1");
                    return;
                }
                if (Math.round(element.x * n) / n == Math.round((activeTetriminos[0].x2 + rW) * n) / n && Math.round(element.y * n) / n == Math.round((activeTetriminos[0].y2) * n) / n) {
                    moveRight = false;
                    console.log("THERE WOULD BE A COLLISION 2");
                    return;
                }
                if (Math.round(element.x * n) / n == Math.round((activeTetriminos[0].x3 + rW) * n) / n && Math.round(element.y * n) / n == Math.round((activeTetriminos[0].y3) * n) / n) {
                    moveRight = false;
                    console.log("THERE WOULD BE A COLLISION 3");
                    return;
                }
            });   
        }
        if(moveRight) {
            activeTetriminos[0].x += activeTetriminos[0].h;
            activeTetriminos[0].x1 += activeTetriminos[0].h;
            activeTetriminos[0].x2 += activeTetriminos[0].h;
            activeTetriminos[0].x3 += activeTetriminos[0].h;
        }
    }
    /*if (event.keyCode === 40) {
        console.log("DOWN");
        activeTetriminos[0].dy += 1;
        activeTetriminos[0].dy += 1;
        activeTetriminos[0].dy += 1;
        activeTetriminos[0].dy += 1;
        return; //DOWN
    }*/
    
    if (event.keyCode === 88) {
        //Rotate right
        if (activeTetriminos[0].index == 0) { //LINE
            rotateBlock(8, -2, 2, -1, 1, 0, 0, 1, -1);
            return;
        }
        if (activeTetriminos[0].index == 8) {//LINE
            rotateBlock(0, 2, -2, 1, -1, 0, 0, -1, 1);
            return;
        }
        
        if (activeTetriminos[0].index == 2) {//L
            rotateBlock(11, 1, 1, 0, 0, -1, -1, -2, 0);
            return;
        }
        if (activeTetriminos[0].index == 11) {//L
            rotateBlock(10, -1, 1, 0, 0, 1, -1, 0, -2);
            return;
        }
        if (activeTetriminos[0].index == 10) {//L
            rotateBlock(9, -1, -1, 0, 0, 1, 1, 2, 0);
            return;
        }
        if (activeTetriminos[0].index == 9) {//L
            rotateBlock(2, 1, -1, 0, 0, -1, 1, 0, 2);
            return;
        }
        
        if (activeTetriminos[0].index == 3) {//J
            rotateBlock(12, 1, 1, 0, 0, -1, -1, 0, -2);
            return;
        }
        if (activeTetriminos[0].index == 12) {//J
            rotateBlock(13, -1, 1, 0, 0, 1, -1, 2, 0);
            return;
        }
        if (activeTetriminos[0].index == 13) {//J
            rotateBlock(14, -1, -1, 0, 0, 1, 1, 0, 2);
            return;
        }
        if (activeTetriminos[0].index == 14) {//J
            rotateBlock(3, 1, -1, 0, 0, -1, 1, -2, 0);
            return;
        }  
        
        if (activeTetriminos[0].index == 4) {//Z
            rotateBlock(15, -1, 1, 0, 0, 1, 1, 2, 0);
            return;
        }
        if (activeTetriminos[0].index == 15) {//Z
            rotateBlock(4, 1, -1, 0, 0, -1, -1, -2, 0);
            return;
        }
        
        if (activeTetriminos[0].index == 5) {//S
            rotateBlock(16, 1, 1, 0, 0, -1, 1, -2, 0);
            return;
        }
        if (activeTetriminos[0].index == 16) {//S
            rotateBlock(5, -1, -1, 0, 0, 1, -1, 2, 0);
            return;
        }
        
        if (activeTetriminos[0].index == 6) {//T
            rotateBlock(17, 0, 0, 0, 0, 0, 0, -1, -1);
            return;
        }
        if (activeTetriminos[0].index == 17) {//T
            rotateBlock(18, 0, 0, 0, 0, 1, -1, 0, 0);
            return;
        }
        if (activeTetriminos[0].index == 18) {//T
            rotateBlock(19, 1, 1, 0, 0, 0, 0, 0, 0);
            return;
        }
        if (activeTetriminos[0].index == 19) {//T
            rotateBlock(6, -1, -1, 0, 0, -1, 1, 1, 1);
            return;
        }
    }
    if (event.keyCode === 90) {
        //Rotate left
        if (activeTetriminos[0].index == 0) {//LINE
            rotateBlock(8, -2, 2, -1, 1, 0, 0, 1, -1);
            return;
        }
        if (activeTetriminos[0].index == 8) {//LINE
            rotateBlock(0, 2, -2, 1, -1, 0, 0, -1, 1);
            return;
        }
        
        if (activeTetriminos[0].index == 2) {//L
            rotateBlock(9, -1, 1, 0, 0, 1, -1, 0, -2);
            return;
        }
        if (activeTetriminos[0].index == 9) {//L
            rotateBlock(10, 1, 1, 0, 0, -1, -1, -2, 0);
            return;
        }
        if (activeTetriminos[0].index == 10) {//L
            rotateBlock(11, 1, -1, 0, 0, -1, 1, 0, 2);
            return;
        }
        if (activeTetriminos[0].index == 11) {//L
            rotateBlock(2, -1, -1, 0, 0, 1, 1, 2, 0);
            return;
        }
        
        if (activeTetriminos[0].index == 3) {//J
            rotateBlock(14, -1, 1, 0, 0, 1, -1, 2, 0);
            return;
        }
        if (activeTetriminos[0].index == 14) {//J
            rotateBlock(13, 1, 1, 0, 0, -1, -1, 0, -2);
            return;
        }
        if (activeTetriminos[0].index == 13) {//J
            rotateBlock(12, 1, -1, 0, 0, -1, 1, -2, 0);
            return;
        }
        if (activeTetriminos[0].index == 12) {//J
            rotateBlock(3, -1, -1, 0, 0, 1, 1, 0, 2);
            return;
        }
        
        if (activeTetriminos[0].index == 4) {//Z
            rotateBlock(15, -1, 1, 0, 0, 1, 1, 2, 0);
            return;
        }
        if (activeTetriminos[0].index == 15) {//Z
            rotateBlock(4, 1, -1, 0, 0, -1, -1, -2, 0);
            return;
        }
        
        if (activeTetriminos[0].index == 5) {//S
            rotateBlock(16, 1, 1, 0, 0, -1, 1, -2, 0);
            return;
        }
        if (activeTetriminos[0].index == 16) {//S
            rotateBlock(5, -1, -1, 0, 0, 1, -1, 2, 0);
            return;
        }
        
        if (activeTetriminos[0].index == 6) {//T
            rotateBlock(19, 1, 1, 0, 0, 1, -1, -1 , -1);
            return;
        }
        if (activeTetriminos[0].index == 19) {//T
            rotateBlock(18, -1, -1, 0, 0, 0, 0, 0, 0);
            return;
        }
        if (activeTetriminos[0].index == 18) {//T
            rotateBlock(17, 0, 0, 0, 0, -1, 1, 0, 0);
            return;
        }
        if (activeTetriminos[0].index == 17) {//T
            rotateBlock(6, 0, 0, 0, 0, 0, 0, 1, 1);
            return;
        }
        
    }
    //88 = x
    //90 = z
});  

function rotateBlock(newIndex, xm1, ym1, xm2, ym2, xm3, ym3, xm4, ym4) {
    //ROTATION COLLISION WITH SIDES
    var ax1 = activeTetriminos[0].x;
    var ax2 = activeTetriminos[0].x1;
    var ax3 = activeTetriminos[0].x2;
    var ax4 = activeTetriminos[0].x3;
    var aW =  activeTetriminos[0].w
    
    /*if (ax1 + (xm1 * aW) == gridX || ax1 + (xm1 * aW) == gridX + gridWidth * aW || activeTetriminos[0].x1 + (xm2 * activeTetriminos[0].w) == gridX || activeTetriminos[0].x1 + (xm1 * activeTetriminos[0].w) == gridX + gridWidth * activeTetriminos[0].w || activeTetriminos[0].x2 + (xm3 * activeTetriminos[0].w) == gridX || activeTetriminos[0].x2 + (xm1 * activeTetriminos[0].w) == gridX + gridWidth * activeTetriminos[0].w || activeTetriminos[0].x3 + (xm4 * activeTetriminos[0].w) == gridX || activeTetriminos[0].x3 + (xm1 * activeTetriminos[0].w) == gridX + gridWidth * activeTetriminos[0].w) {
        console.log("HMHMMM");
        return;
    }*/
    activeTetriminos[0].x = activeTetriminos[0].x + (xm1 * activeTetriminos[0].w);
    activeTetriminos[0].x1 = activeTetriminos[0].x1 + (xm2 * activeTetriminos[0].w);
    activeTetriminos[0].x2 = activeTetriminos[0].x2 + (xm3 * activeTetriminos[0].w);
    activeTetriminos[0].x3 = activeTetriminos[0].x3 + (xm4 * activeTetriminos[0].w);
    activeTetriminos[0].y = activeTetriminos[0].y + (ym1 * activeTetriminos[0].w);  
    activeTetriminos[0].y1 = activeTetriminos[0].y1 + (ym2 * activeTetriminos[0].w);  
    activeTetriminos[0].y2 = activeTetriminos[0].y2 + (ym3 * activeTetriminos[0].w);  
    activeTetriminos[0].y3 = activeTetriminos[0].y3 + (ym4 * activeTetriminos[0].w);  
    activeTetriminos[0].index = newIndex;
}
var keyPress = true;
function DrawTetrimino(x, y, x1, y1, x2, y2, x3, y3, w, h, color, index, dy) {
    this.index = index;
    this.color = color;
    this.dy = dy;
    this.w = w;
    this.h = h; 
    this.x = gridX + (x * this.w) - this.w;
    this.y = gridY + (y * this.h) - this.h;
    this.x1 = gridX + (x1 * this.w) - this.w;
    this.y1 = gridY + (y1 * this.h) - this.h;
    this.x2 = gridX + (x2 * this.w) - this.w;
    this.y2 = gridY + (y2 * this.h) - this.h;
    this.x3 = gridX + (x3 * this.w) - this.w;
    this.y3 = gridY + (y3 * this.h) - this.h;
    this.draw = function() {
        c.beginPath();
        c.strokeStyle = this.color;
        c.fillStyle = this.color;
        c.rect(this.x,this.y,this.w,this.h);
        c.rect(this.x1,this.y1,this.w,this.h);
        c.rect(this.x2,this.y2,this.w,this.h);
        c.rect(this.x3,this.y3,this.w,this.h);
        c.stroke();
        c.fill();
    }

    this.update = function() {
        //CHECK FOR LINES AND TETRISES
        var tetrisLine = false;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] == 10) {
                console.log("FULL ROW", i);
                inactiveTetriminos.forEach(element => {
                    //console.log(element.x, i * element.w);
                    /*if (element.x == i * element.w){
                        inactiveTetriminos.splice(element.index);
                        console.log("ROW SHOULD HAVE CLEARED");
                    }*/
                });
                
            }
        }
        //CHECK FOR ALL THE COLLISION AND STUFF
        
        //COLLISION WITH OTHER BLOCK OR TOP
        if (inactiveTetriminos.length != 0 && activeTetriminos.length == 1){    
            for (var i=0; i<inactiveTetriminos.length; i++){
                if (go){
                    var ix = Math.round(inactiveTetriminos[i].x * 1000) / 1000;
                    var iy = inactiveTetriminos[i].y;
                    if (iy <= topBarY){
                        console.log("LOSE");
                        rows = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        inactiveTetriminos = [];
                        activeTetriminos = [];
                        randomTetrimino();
                    }
                    //console.log("4: ", Math.round(this.x3 * 1000) / 1000, " = ", ix, " and ", this.y3 + this.h, "=", iy);
                    //console.log("2: ", Math.round(this.x), " = ", Math.round(ix), " or ", Math.round(this.y) + Math.round(this.h), "=", Math.round(iy));
                    //console.log("3: ", Math.round(this.x), " = ", Math.round(ix), " or ", Math.round(this.y) + Math.round(this.h), "=", Math.round(iy));
                    //console.log("4: ", Math.round(this.x), " = ", Math.round(ix), " or ", Math.round(this.y) + Math.round(this.h), "=", Math.round(iy));
                    
                    if (Math.round(this.x * 1000) / 1000 == ix && this.y + this.h == iy || Math.round(this.x1 * 1000) / 1000 == ix && this.y1 + this.h == iy || Math.round(this.x2 * 1000) / 1000 == ix && this.y2 + this.h == iy || Math.round(this.x3 * 1000) / 1000 == ix && this.y3 + this.h == iy){
                        console.log("collision");
                        placedSound.play();
                        activeTetriminos = [];

                        inactiveTetriminos.push(new DrawInactive(this.x, this.y, this.w, this.h, this.color));
                        inactiveTetriminos.push(new DrawInactive(this.x1, this.y1, this.w, this.h, this.color));
                        inactiveTetriminos.push(new DrawInactive(this.x2, this.y2, this.w, this.h, this.color));
                        inactiveTetriminos.push(new DrawInactive(this.x3, this.y3, this.w, this.h, this.color));   
                        
                        //console.log((this.y/this.w));
                        //console.log((this.y1/this.w));
                        //console.log((this.y2/this.w));
                        //console.log((this.y3/this.w));
                        rows[(this.y/this.w)-4] += 1;
                        rows[(this.y1/this.w)-4] += 1;
                        rows[(this.y2/this.w)-4] += 1;
                        rows[(this.y3/this.w)-4] += 1;
                        //console.log(rows);
                        randomTetrimino();
                        go = false;
                        i = 0;
                    }
                }
            }
        }
       
        //COLLIISION WITH BOTTOM
        //console.log("Y:", this.y,  24*this.h);
        //console.log("Y1:", Math.round(this.y1 / this.h));
        //console.log("Y2:", Math.round(this.y2 / this.h));
        //console.log("Y3:", Math.round(this.y3 / this.h));
        //console.log("Y3: ", this.y3 / 23, this.h, "Y: ", this.y / 23, this.h);
        if (Math.round(this.y/this.h) == 23 || Math.round(this.y1/this.h) == 23 || Math.round(this.y2/this.h) == 23 || Math.round(this.y3/this.h) == 23) {     
            go = false;
            placedSound.play();
            activeTetriminos = [];
            randomTetrimino();
            inactiveTetriminos.push(new DrawInactive(this.x, this.y, this.w, this.h, this.color));
            inactiveTetriminos.push(new DrawInactive(this.x1, this.y1, this.w, this.h, this.color));
            inactiveTetriminos.push(new DrawInactive(this.x2, this.y2, this.w, this.h, this.color));
            inactiveTetriminos.push(new DrawInactive(this.x3, this.y3, this.w, this.h, this.color));
            rows[(this.y/this.w)-4] += 1;
            rows[(this.y1/this.w)-4] += 1;
            rows[(this.y2/this.w)-4] += 1;
            rows[(this.y3/this.w)-4] += 1;
            //console.log(rows);
        }
        
        if (this.y < (24*this.h) && this.y1 < (24*this.h) && this.y2 < (24*this.h) && this.y3 < (24*this.h) && go) {
            this.y += (this.dy * this.h); 
            this.y1 += (this.dy * this.h); 
            this.y2 += (this.dy * this.h); 
            this.y3 += (this.dy * this.h); 
        }
        this.draw();
    }
}


