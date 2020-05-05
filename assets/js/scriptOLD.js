/////////////MENU SPREADDDDDD///////////
var canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var gameSpeed = 50;

//Original States
var line = [6, 1, 6, 2, 6, 3, 6, 4, "cyan"];
var square = [5, 2, 6, 2, 5, 3, 6, 3, "yellow"];
var l = [5, 1, 5, 2, 5, 3, 6, 3, "orange"];
var j = [6, 1, 6, 2, 6, 3, 5, 3, "blue"];
var s = [5, 1, 5, 2, 6, 2, 6, 3, "green"];
var z = [6, 1, 6, 2, 5, 2, 5, 3, "red"];
var t = [5, 2, 6, 2, 6, 3, 7, 2, "purple"];

//Secondary States
var scale = 30;

var gridWidth = 10;
var gridHeight = 24;

var loadingArea = 3;
var tetriminoHeight = canvas.height / scale;
var tetriminoWidth = tetriminoHeight;
var gridX = (canvas.width / 2) - ((gridWidth / 2) * (canvas.height / scale));
var gridY = 50;
var tetriminos = [line, square, l, j, z, s, t];
//var tetriminoColor = "blue";
var activeTetriminos = [];
var inactiveTetriminos = [];
var topBarY = gridY + (4 * tetriminoHeight);
var go = true;
var moveLeft = true;
var moveRight = true;
function randomTetrimino() {
    var dy = 1;
    var tetrimino = Math.floor(Math.random() * tetriminos.length);
    newTetrimino = tetriminos[tetrimino];
    console.log("INDEX: ", tetrimino);
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
randomTetrimino();
animate();
function grid() {
    var fillColor;
    var h = tetriminoHeight;
    var w = tetriminoWidth;
    var x = gridX;
    var y = gridY;
    for (j=0; j<gridHeight; j++){
        if (j < loadingArea) {
            fillColor = "rgba(255,0,0,0.5)";
        }
        if (j > loadingArea) {
            fillColor = "rgba(0,100,255,0.5)";
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
var count = 0;
function animate(){
    requestAnimationFrame(animate);
    count++;
    if(count == 500/gameSpeed) { 
        c.clearRect(0,0, innerWidth,innerHeight);
        grid();
        for (i=0; i<activeTetriminos.length; i++){
            activeTetriminos[i].update();
        }
        for (i=0; i<inactiveTetriminos.length; i++){
            inactiveTetriminos[i].draw();
            go = true;
            moveLeft = true; 
            moveRight = true;
        }
        count = 0;
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
        //console.log("GridX", gX);
        //console.log("GridX - Block Width: ", gX - rW);
        //console.log("X: ", rX, rX1, rX2, rX3);
        if (Math.round(rX * 10) / 10 == gX || Math.round(rX1 * 10) / 10 == gX || Math.round(rX2 * 10) / 10 == gX || Math.round(rX3 * 10) / 10 == gX){
            moveLeft = false
        }
        else if (moveLeft){
            inactiveTetriminos.forEach(element => {
                if (element.x == (rX - rW) && element.y == rY + rW || element.x == (rX1 - rW) && element.y == rY1 + rW || element.x == (rX2 - rW) && element.y == rY2 + rW || element.x == (rX3 - rW) && element.y == rY3 + rW) {
                    moveLeft = false;
                }
            });
        }
        if (moveLeft){
            activeTetriminos[0].x -= activeTetriminos[0].h;
            activeTetriminos[0].x1 -= activeTetriminos[0].h;
            activeTetriminos[0].x2 -= activeTetriminos[0].h;
            activeTetriminos[0].x3 -= activeTetriminos[0].h;
        }
    }
    if (event.keyCode === 39) {
        if (Math.round(rX1 * 10) / 10 == Math.round((gX + (9 * rW)) * 10) / 10 || Math.round(rX3 * 10) / 10 == Math.round((gX + (9 * rW)) * 10) / 10){
            moveRight = false;
        }
        else if (moveRight) {
            inactiveTetriminos.forEach(element => {              
                if (element.x == (rX + rW) && element.y == rY + rW || element.x == (rX1 + rW) && element.y == rY1 + rW || element.x == (rX2 + rW) && element.y == rY2 + rW || element.x == (rX3 + rW) && element.y == rY3 + rW) {
                    moveRight = false;
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
        var blocksInRow = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        inactiveTetriminos.forEach(element => {
            console.log(element.y, (19 * element.w) + (gridY + (4 * element.w))); 
            if (element.y == (19 * element.w) + (gridY + (4 * element.w))) {
                console.log("Block placed at bottom");
            }
            //for (var i = 0; i < 9; i++){
            //    //console.log(element.y, (i * element.w) + gridY);
            //        if (element.y == (i * element.w) + gridY + (4*element.w)) {
            //        blocksInRow[i] = blocksInRow[i] + 1;
            //        console.log("HI");
            //    }
            //}
        });
        //CHECK FOR ALL THE COLLISION AND STUFF
        
        //COLLISION WITH OTHER BLOCK OR TOP
        if (inactiveTetriminos.length != 0 && activeTetriminos.length == 1){     
            for (var i=0; i<inactiveTetriminos.length; i++){
                if (go){
                    var ix = inactiveTetriminos[i].x;
                    var iy = inactiveTetriminos[i].y;
                    //console.log("I", ix,iy);
                    //console.log("T", this.x1, this.y1);
                    if (iy <= topBarY){
                        go = false;
                        console.log("LOSE");
                        inactiveTetriminos = [];
                        activeTetriminos = [];
                        randomTetrimino();
                    }
                    if (this.x == ix && this.y + this.h == iy || this.x1 == ix && this.y1 + this.h == iy || this.x2 == ix && this.y2 + this.h == iy || this.x3 == ix && this.y3 + this.h == iy){
                        //console.log("collision");
                        activeTetriminos = [];

                        inactiveTetriminos.push(new DrawInactive(this.x, this.y, this.w, this.h, this.color));
                        inactiveTetriminos.push(new DrawInactive(this.x1, this.y1, this.w, this.h, this.color));
                        inactiveTetriminos.push(new DrawInactive(this.x2, this.y2, this.w, this.h, this.color));
                        inactiveTetriminos.push(new DrawInactive(this.x3, this.y3, this.w, this.h, this.color));   
                        randomTetrimino();
                        go = false;
                        i = 0;
                    }
                }
            }
        }
       
        //COLLIISION WITH BOTTOM
        if (Math.round(this.y) == Math.round(gridY + (24 * this.h) - this.h) || Math.round(this.y1) == Math.round(gridY + (24 * this.h) - this.h) || Math.round(this.y2) == Math.round(gridY + (24 * this.h) - this.h) || Math.round(this.y3) == Math.round(gridY + (24 * this.h) - this.h)) {     
            activeTetriminos = [];
            randomTetrimino();
            inactiveTetriminos.push(new DrawInactive(this.x, this.y, this.w, this.h, this.color));
            inactiveTetriminos.push(new DrawInactive(this.x1, this.y1, this.w, this.h, this.color));
            inactiveTetriminos.push(new DrawInactive(this.x2, this.y2, this.w, this.h, this.color));
            inactiveTetriminos.push(new DrawInactive(this.x3, this.y3, this.w, this.h, this.color));        
        }
        
        if (this.y < (24*this.h) && this.y1 < (24*this.h) && this.y2 < (24*this.h) && this.y3 < (24*this.h)) {
            this.y += (this.dy * this.h); 
            this.y1 += (this.dy * this.h); 
            this.y2 += (this.dy * this.h); 
            this.y3 += (this.dy * this.h); 
        }
        this.draw();
    }
}


