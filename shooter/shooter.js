var fps;
var timeCounter;

var canvas;
var canvasWidth;
var canvasHeight;
var canvasColor;

var groundHeight;

var gravity;

var p1;
var p1X;
var p1Y;
var p1Width;
var p1Height;
var p1Speed;
var p1JumpForce;
var p1Look;
var p1Grounded;
var p1Crouch;

var npc0;
var npc0X;
var npc0Y;
var npc0Width;
var npc0Height;
var npc0Speed;
var npc0JumpForce;
var npc0Look;
var npc0Grounded;
var npc0Crouch;

var npc1;
var npc1X;
var npc1Y;
var npc1Width;
var npc1Height;
var npc1Speed;
var npc1JumpForce;
var npc1Look;
var npc1Grounded;
var npc1Crouch;

var npc2;
var npc2X;
var npc2Y;
var npc2Width;
var npc2Height;
var npc2Speed;
var npc2JumpForce;
var npc2Look;
var npc2Grounded;
var npc2Crouch;

var npc3;
var npc3X;
var npc3Y;
var npc3Width;
var npc3Height;
var npc3Speed;
var npc3JumpForce;
var npc3Look;
var npc3Grounded;
var npc3Crouch;

var plat;
var plat0;
var plat0X;
var plat0Y;
var plat0Width;
var plat0Height;

var gun0;
var gun0X;
var gun0Y;
var gun0Width;
var gun0Height;

var bullet;
var bulletX;
var bulletY;
var bulletLook;
var bulletWidth;
var bulletHeight;
var bulletExists;
var bulletSpeed;

var p1Image;
var npc0Image;
var npc1Image;
var npc2Image;
var npc3Image;
var gun0Image;

// NPC Class definition
class NPC {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 22;
        this.height = 44;
        this.speed = 5;
        this.jumpForce = 80;
        this.look = 0;
        this.grounded = false;
        this.crouch = false;
        this.ctx = canvas.getContext("2d");
        this.image = new Image();
        this.health = 100;
        this.isAlive = true;
        this.loadImage();
    }

    loadImage() {
        switch(this.type) {
            case 'water':
                this.image.src = 'pngs/npcwater0.png';
                break;
            case 'fire':
                this.image.src = 'pngs/npcfire0.png';
                break;
            case 'regular':
                this.image.src = 'pngs/npc0.png';
                break;
            case 'sk':
                this.image.src = 'pngs/sk0.png';
                break;
        }
    }

    draw() {
        this.ctx = canvas.getContext("2d");
        let imagePath = '';
        
        switch(this.type) {
            case 'water':
                if(this.look == 0) imagePath = 'pngs/npcwater0.png';
                else if(this.look == 1) imagePath = 'pngs/npcwater1.png';
                else if(this.look == 2) imagePath = 'pngs/npcwater2.png';
                else if(this.look == 3) imagePath = 'pngs/npcwater3.png';
                else if(this.look == 4) imagePath = 'pngs/npcwater4.png';
                else if(this.look == 5) imagePath = 'pngs/npcwater5.png';
                break;
            case 'fire':
                if(this.look == 0) imagePath = 'pngs/npcfire0.png';
                else if(this.look == 1) imagePath = 'pngs/npcfire1.png';
                else if(this.look == 2) imagePath = 'pngs/npcfire2.png';
                else if(this.look == 3) imagePath = 'pngs/npcfire3.png';
                else if(this.look == 4) imagePath = 'pngs/npcfire4.png';
                else if(this.look == 5) imagePath = 'pngs/npcfire5.png';
                break;
            case 'regular':
                if(this.look == 0) imagePath = 'pngs/npc0.png';
                else if(this.look == 1) imagePath = 'pngs/npc1.png';
                else if(this.look == 2) imagePath = 'pngs/npc2.png';
                else if(this.look == 3) imagePath = 'pngs/npc3.png';
                else if(this.look == 4) imagePath = 'pngs/npc4.png';
                else if(this.look == 5) imagePath = 'pngs/npc5.png';
                break;
            case 'sk':
                if(this.look == 0) imagePath = 'pngs/sk0.png';
                else if(this.look == 1) imagePath = 'pngs/sk1.png';
                else if(this.look == 2) imagePath = 'pngs/sk2.png';
                else if(this.look == 3) imagePath = 'pngs/sk3.png';
                else if(this.look == 4) imagePath = 'pngs/sk4.png';
                else if(this.look == 5) imagePath = 'pngs/sk5.png';
                break;
        }

        if (imagePath) {
            this.image.src = imagePath;
            this.ctx.drawImage(this.image, this.x, this.y);
        }
    }

    erase() {
        this.ctx.fillStyle = canvasColor;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    moveLeft() {
        this.x -= this.speed;
        this.look = 2;
    }

    moveRight() {
        this.x += this.speed;
        this.look = 1;
    }

    jump() {
        if (this.grounded) {
            this.y -= this.jumpForce;
            this.look = 0;
            this.grounded = false;
        }
    }

    addGravity() {
        if (!this.grounded) {
            this.y += gravity;
        }
    }

    checkGrounding() {
        if (this.y + this.height >= canvasHeight - groundHeight) {
            this.y = canvasHeight - this.height - groundHeight;
            this.grounded = true;
        } else if (this.y + this.height < canvasHeight - groundHeight) {
            if (this.x + this.width > plat0X && this.x < plat0X + plat0Width && 
                this.y + this.height > plat0Y && this.y + this.height < plat0Y + plat0Height) {
                this.grounded = true;
            } else if (this.x + this.width > p1X && this.x < p1X + p1Width && 
                      this.y + this.height > p1Y && this.y + this.height < p1Y + p1Height) {
                this.grounded = true;
            } else {
                this.grounded = false;
            }
        }
    }

    checkLimits() {
        if (this.x + this.width > canvasWidth) {
            this.x = canvasWidth - this.width;
        }
        if (this.x < 0) {
            this.x = 0;
        }
    }

    update() {
        // Apply gravity first
        this.addGravity();
        
        // Check grounding after gravity
        this.checkGrounding();
        
        // Check movement limits
        this.checkLimits();
        
        // Random movement
        const actionRange = 100;
        const actionFactor = 100;
        const movementRange = 1;
        const input = Math.floor(Math.random() * actionRange);

        if (input % actionFactor == 0) {
            for (let i = 0; i < movementRange; i++) {
                this.moveRight();
            }
        }
        if (input % actionFactor == 1) {
            for (let i = 0; i < movementRange; i++) {
                this.moveLeft();
            }
        }
        if (input % actionFactor == 3 && this.grounded) {
            this.jump();
        }
    }
}

// NPC instances
var npcs = [];

var wPress;
var sPress;
var aPress;
var dPress;
var jPress;
var kPress;
var lPress;

// Add player health
var p1Health = 100;

// Bullet Class
class Bullet {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 2;
        this.speed = 15;
        this.direction = direction; // 0 for up, 1 for right, 2 for left
        this.exists = true;
        this.ctx = canvas.getContext("2d");
    }

    draw() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    erase() {
        this.ctx.fillStyle = canvasColor;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        this.erase();
        switch(this.direction) {
            case 0: // Up
                this.y -= this.speed;
                break;
            case 1: // Right
                this.x += this.speed;
                break;
            case 2: // Left
                this.x -= this.speed;
                break;
        }
        this.draw();
    }

    checkCollision() {
        // Check if bullet is out of bounds
        if (this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight) {
            this.exists = false;
            return;
        }

        // Check collision with NPCs
        npcs.forEach((npc, index) => {
            if (npc.isAlive && 
                this.x + this.width > npc.x && 
                this.x < npc.x + npc.width &&
                this.y + this.height > npc.y && 
                this.y < npc.y + npc.height) {
                
                // NPC takes damage
                npc.health -= 50;
                
                // Check if NPC dies
                if (npc.health <= 0) {
                    npc.isAlive = false;
                    npcs.splice(index, 1);
                }
                
                // Bullet disappears after hit
                this.exists = false;
            }
        });
    }

    update() {
        if (this.exists) {
            this.move();
            this.checkCollision();
        }
    }
}

// Array to store active bullets
var bullets = [];

function finit(){
	document.getElementById("d1").innerHTML="calling finit()";
	
	canvas=document.getElementById("canvas1");
	
	// Preload images
	p1Image = new Image();
	p1Image.src = 'pngs/clerk0.png';
	
	npc0Image = new Image();
	npc0Image.src = 'pngs/npcwater0.png';
	
	npc1Image = new Image();
	npc1Image.src = 'pngs/npcfire0.png';
	
	npc2Image = new Image();
	npc2Image.src = 'pngs/npc0.png';
	
	npc3Image = new Image();
	npc3Image.src = 'pngs/sk0.png';
	
	gun0Image = new Image();
	gun0Image.src = 'pngs/gun0.png';
	
	canvasWidth=document.getElementById("canvas1").width;
	canvasHeight=document.getElementById("canvas1").height;
	canvasColor="cyan";

	groundHeight=15;

	gravity=2;

	fps=30;//recomended 60
	timeCounter=0;
	frameMultiplyer=fps/10
	
	p1Width=20;//20
	p1Height=40;//40
	p1=canvas.getContext("2d");
	p1X=0;
	p1Y=(canvasHeight/2)-(p1Height/2);
	p1Look=0;
	p1JumpForce=80;
	p1Crouch=false;
	p1Speed=5;

	// Initialize player health
	p1Health = 100;
	
	// Initialize NPCs
	npcs = [
		new NPC('water', 100, 100),
		new NPC('fire', 200, 100),
		new NPC('regular', 300, 100),
		new NPC('sk', 400, 100)
	];
	
	plat = canvas.getContext("2d"); //this is called in drawPlat()
	plat0X = 90;//canvasWidth/2-canvasWidth/8;
    plat0Y = canvasHeight/2+canvasHeight/4;
    plat0Width=canvasWidth/4;
    plat0Height = groundHeight;

	gun0 =canvas.getContext("2d");
	gun0X=p1X+p1Width;
	gun0Y=p1Y+(p1Height/2);
	gun0Width=13;
	gun0Height=10;

	bullet=canvas.getContext("2d");
	bulletWidth=5;
	bulletHeight=2;
    bulletX=gun0X;
	bulletY=gun0Y;
    bulletLook=1;
	bulletExists=false;
	bulletSpeed=3;



    wPress=false;
    sPress=false;
    dPress=false;
    aPress=false;
	jPress=false;
	kPress=false;
	lPress=false;
	
	//fColorChange();
	//image loader
    //const context=canvas.getContext('2d');
    //loadImage('./npc1.png').then(image => {})
    //const image = loadImage('./pngs/logo.png')
    //context.drawImage(image, 0, 0,10, 10)

	drawP1();
	drawPlat(plat0X,plat0Y,plat0Width,plat0Height);

    // Initialize bullets array
    bullets = [];
}


function f2(){
    setInterval(function(){
        timeCounter++;
        
        // Clear canvas and update sky
        updateSky();
        
        // Update physics and positions
        p1Control();
        
        // Update NPCs
        npcs.forEach(npc => {
            if (!npc.isAlive) return; // Skip dead NPCs
            
            // Apply gravity
            if (!npc.grounded) {
                npc.y += gravity;
            }
            
            // Check grounding
            if (npc.y + npc.height >= canvasHeight - groundHeight) {
                npc.y = canvasHeight - npc.height - groundHeight;
                npc.grounded = true;
            } else if (npc.y + npc.height < canvasHeight - groundHeight) {
                if (npc.x + npc.width > plat0X && npc.x < plat0X + plat0Width && 
                    npc.y + npc.height > plat0Y && npc.y + npc.height < plat0Y + plat0Height) {
                    npc.grounded = true;
                } else {
                    npc.grounded = false;
                }
            }
            
            // Random movement
            const input = Math.floor(Math.random() * 100);
            if (input === 0) {
                npc.x += npc.speed;
                npc.look = 1;
            }
            if (input === 1) {
                npc.x -= npc.speed;
                npc.look = 2;
            }
            if (input === 3 && npc.grounded) {
                npc.y -= npc.jumpForce;
                npc.look = 0;
                npc.grounded = false;
            }
            
            // Check screen limits
            if (npc.x + npc.width > canvasWidth) {
                npc.x = canvasWidth - npc.width;
            }
            if (npc.x < 0) {
                npc.x = 0;
            }
        });
        
        // Draw everything
        drawPlat(plat0X, plat0Y, plat0Width, plat0Height);
        drawGround();
        drawP1();
        npcs.forEach(npc => {
            if (npc.isAlive) {
                npc.draw();
                // Draw health bar for each NPC
                npc.ctx.fillStyle = "red";
                npc.ctx.fillRect(npc.x, npc.y - 10, (npc.width * npc.health) / 100, 5);
            }
        });
        
        // Update and draw bullets
        bulletControl();
        
        // Update UI
        document.getElementById("timeCounter").innerHTML = aPress + sPress + dPress + wPress;
        document.getElementById("d2").innerHTML = timeCounter;
        document.getElementById("d3").innerHTML = p1X;
        document.getElementById("d4").innerHTML = p1Y;
        document.getElementById("d5").innerHTML = gun0X;
        document.getElementById("d6").innerHTML = gun0Y;
        document.getElementById("d7").innerHTML = p1Look;
    }, 1000/fps);
}
function p1Control(){ 
	if(wPress==true)
	{
	if(p1Crouch==true){
		p1Crouch=false;
		p1Y=p1Y+60
	}else {
	if(p1Grounded==true){
		p1Jump();
		p1Height=40;
	}
	else {
		p1Look=0;
		p1Height=40;
	}
	}
	}

if(sPress==true){
	moveP1Down();
	p1Look=3;
	p1Height=20;
	p1Crouch=true;}

if(aPress==true){
	if(p1Crouch==false){
		moveP1Left();
		p1Look=2;
		p1Height=40;
	}else{
		moveP1Left();
		p1Look=5;
		p1Height=20;
	}
}
if(dPress==true){
	if(p1Crouch==false){
		moveP1Right();
		p1Look=1;
		p1Height=40;
	}else{
		moveP1Right();
		p1Look=4;
		p1Height=20;
	}
}
if(kPress==true){
	fire();
}
checkPlayerGrounding();
checkPlayerLimits();
	if(p1Grounded==true){
		document.getElementById("info1").innerHTML="grounded";
	}else{
		eraseP1();
		document.getElementById("info1").innerHTML="not grounded";
		addP1Gravity();
		drawP1();
	}
	//drawP1();
}





function drawGround(){

	ground=canvas.getContext("2d");
	ground.fillStyle="green";
	ground.fillRect(0,canvasHeight-15,canvasWidth,groundHeight);

}




//________________________________________________________P1


function addP1Gravity(){
	p1Y=p1Y+gravity;
}

function checkPlayerGrounding(){
	if (p1Y+p1Height>=canvasHeight-groundHeight){//is p1Y etc lower than ground or ground level
		p1Y=canvasHeight-p1Height-groundHeight;
		p1Grounded=true;
	}else if(p1Y+p1Height<canvasHeight-groundHeight){ //is p1Y etc higher than ground
		if(p1X+p1Width>plat0X && p1X<plat0X+plat0Width && p1Y+p1Height>plat0Y &&p1Y+p1Height<plat0Y+plat0Height){//is p1 inside plat --
		p1Grounded=true;
		}else if(p1X+p1Width>npc0X && p1X<npc0X+npc0Width && p1Y+p1Height>npc0Y &&p1Y+p1Height<npc0Y+npc0Height){//is p1 inside npc0--
			p1Grounded=true;
		}else p1Grounded=false;
	}
}
function checkPlayerLimits(){
	if (p1X+p1Width>canvasWidth){
		p1X=canvasWidth-p1Width;
	}
	if (p1X<0){
		p1X=0;
	}
}
function drawP1(){
	p1=canvas.getContext("2d");
	if(p1Look==0){
		p1Image.src = 'pngs/clerk0.png';
	}  else if(p1Look==1){
		p1Image.src = 'pngs/clerk1.png';
	}else if(p1Look==2){
		p1Image.src = 'pngs/clerk2.png';
	}else if (p1Look==3) {
		p1Image.src = 'pngs/clerk3.png';
	}else if (p1Look==4) {
		p1Image.src = 'pngs/clerk4.png';
	}
	else if (p1Look==5) {
		p1Image.src = 'pngs/clerk5.png';
	}
	
	p1.drawImage(p1Image, p1X, p1Y);
	drawGun0();
	
	// Draw health bar
	p1.fillStyle = "red";
	p1.fillRect(p1X, p1Y - 10, (p1Width * p1Health) / 100, 5);
}
function eraseP1(){
	p1.fillStyle=canvasColor;
	p1.fillRect(p1X,p1Y,p1Width,p1Height);
}
function moveP1Up(){
	eraseP1();
	p1Y=p1Y-(p1Speed);
	drawP1();
}function p1Jump(){
	eraseP1();
	p1Y=p1Y-p1JumpForce;
	drawP1();
}
function moveP1Down(){
	eraseP1();
	p1Y=p1Y+(p1Speed);
	drawP1();
}
function moveP1Left(){
	eraseP1();
	p1X=p1X-(p1Speed);
	drawP1();
}
function moveP1Right(){
	eraseP1();
	p1X=p1X+(p1Speed);
	drawP1();
}


//________________________________________________________NPC0
  

function drawnpc0(){
	npc0=canvas.getContext("2d");
	if(npc0Look==0){
		npc0Image.src = 'pngs/npcwater0.png';
	}  else if(npc0Look==1){
		npc0Image.src = 'pngs/npcwater1.png';
	}else if(npc0Look==2){
		npc0Image.src = 'pngs/npcwater2.png';
	}else if (npc0Look==3) {
		npc0Image.src = 'pngs/npc3.png';
	}else if (npc0Look==4) {
		npc0Image.src = 'pngs/npc4.png';
	}else if (npc0Look==5) {
		npc0Image.src = 'pngs/npc5.png';
	}
	
	npc0.drawImage(npc0Image, npc0X, npc0Y);
}
function erasenpc0(){
	npc0.fillStyle=canvasColor;
	npc0.fillRect(npc0X,npc0Y,npc0Width,npc0Height);
}
function movenpc0Up(){
	erasenpc0();
	npc0Y=npc0Y-(npc0Speed);
	drawnpc0();
}function npc0Jump(){
	erasenpc0();
	//for(let i=0;i <npc0JumpForce;i++){qd
	//npc0Y=npc0Y-1;
	//drawnpc0();
	//}
	npc0Y=npc0Y-npc0JumpForce;
	drawnpc0();
}
function movenpc0Down(){
	erasenpc0();
	npc0Y=npc0Y+(npc0Speed);
	drawnpc0();
}
function movenpc0Left(){
	erasenpc0();
	npc0X=npc0X-(npc0Speed);
	drawnpc0();
}
function movenpc0Right(){
	erasenpc0();
	npc0X=npc0X+(npc0Speed);
	drawnpc0();
}
//________________________________________________________gun
function drawGun0(){
	gun0=canvas.getContext("2d");
	gun0Y=p1Y+(p1Height/2);
	if(p1Look==0){
		gun0Image.src = 'pngs/gun0.png';
		gun0X=p1X+p1Width;
	}  else if(p1Look==1){
		gun0Image.src = 'pngs/sniper1.png';
		gun0X=p1X;
	}else if(p1Look==2){
		gun0Image.src = 'pngs/sniper2.png';
		gun0X=p1X-gun0Width;
	}else if (p1Look==3) {
		gun0Image.src = 'pngs/gun0.png';
		gun0X=p1X+p1Width;
	}else if (p1Look==4) {
		gun0Image.src = 'pngs/sniper1.png';
		gun0X=p1X+p1Width/3;
	}else if (p1Look==5) {
		gun0Image.src = 'pngs/sniper2.png';
		gun0X=p1X-gun0Width;
	}
	
	gun0.drawImage(gun0Image, gun0X, gun0Y);
}
//________________________________________________________bullet
//1 y 4 right, 2 y 5 left
function drawBullet(){
	bullet=canvas.getContext("2d");
	bullet.fillStyle="black";
	bullet.fillRect(bulletX,bulletY,bulletWidth,bulletHeight);
}
function eraseBullet(){
	bullet.fillStyle=canvasColor;
	bullet.fillRect(bulletX,bulletY,bulletWidth,bulletHeight);
}
function fire() {
    let direction;
    switch(p1Look) {
        case 0: // Looking up
            direction = 0;
            break;
        case 1:
        case 4: // Looking right
            direction = 1;
            break;
        case 2:
        case 5: // Looking left
            direction = 2;
            break;
        default:
            direction = 1; // Default to right
    }
    
    // Adjust bullet position based on direction
    let bulletX = gun0X;
    let bulletY = gun0Y;
    
    if (direction === 0) { // Up
        bulletX = p1X + (p1Width / 2) - 2.5; // Center the bullet
        bulletY = p1Y; // Start from top of player
    }
    
    const bullet = new Bullet(bulletX, bulletY, direction);
    bullets.push(bullet);
}
function bulletControl(){
    // Update all bullets
    bullets = bullets.filter(bullet => {
        bullet.update();
        return bullet.exists;
    });
}


//________________________________________________________MISC

function updateSky(){
	sky=canvas.getContext("2d");
	sky.fillStyle=canvasColor;
	sky.fillRect(0,0,canvasWidth,canvasHeight);
}

function fReset(){
	document.getElementById("info2").innerHTML="reset";
	textEraser.fillStyle="black";
	textEraser.fillRect(goTextX,goTextY-25,630,35);
	
}



window.addEventListener('keypress',function(event){
var x=event.key;
if(x=="z"||x=="Z"||x=="w"||x=="W"){wPress=true;}
if(x=="s"||x=="S"){sPress=true;}
if(x=="q"||x=="Q"||x=="a"||x=="A"){aPress=true;}
if(x=="d"||x=="D"){dPress=true;}//else if
if(x=="j"||x=="J"){jPress=true;}
if(x=="k"||x=="K"){kPress=true;}
if(x=="l"||x=="L"){lPress=true;}
if(x=="g"||x=="G"){f1();}
if(x=="h"||x=="H"){f2();}
if(x=="t"||x=="T"){fReset();}
},false);
window.addEventListener('keyup',function(event){
var x=event.key;
if(x=="z"||x=="Z"||x=="w"||x=="W"){wPress=false;}
if(x=="s"||x=="S"){sPress=false;}
if(x=="q"||x=="Q"||x=="a"||x=="A"){aPress=false;}
if(x=="d"||x=="D"){dPress=false;}//else if
if(x=="j"||x=="J"){jPress=false;}
if(x=="k"||x=="K"){kPress=false;}
if(x=="l"||x=="L"){lPress=false;}
},false);

function drawnpc1(){
	npc1=canvas.getContext("2d");
	if(npc1Look==0){
		npc1Image.src = 'pngs/npcfire0.png';
	}  else if(npc1Look==1){
		npc1Image.src = 'pngs/npcfire1.png';
	}else if(npc1Look==2){
		npc1Image.src = 'pngs/npcfire2.png';
	}else if (npc1Look==3) {
		npc1Image.src = 'pngs/npcfire3.png';
	}else if (npc1Look==4) {
		npc1Image.src = 'pngs/npcfire4.png';
	}else if (npc1Look==5) {
		npc1Image.src = 'pngs/npcfire5.png';
	}
	
	npc1.drawImage(npc1Image, npc1X, npc1Y);
}

function drawnpc2(){
	npc2=canvas.getContext("2d");
	if(npc2Look==0){
		npc2Image.src = 'pngs/npc0.png';
	}  else if(npc2Look==1){
		npc2Image.src = 'pngs/npc1.png';
	}else if(npc2Look==2){
		npc2Image.src = 'pngs/npc2.png';
	}else if (npc2Look==3) {
		npc2Image.src = 'pngs/npc3.png';
	}else if (npc2Look==4) {
		npc2Image.src = 'pngs/npc4.png';
	}else if (npc2Look==5) {
		npc2Image.src = 'pngs/npc5.png';
	}
	
	npc2.drawImage(npc2Image, npc2X, npc2Y);
}

function drawnpc3(){
	npc3=canvas.getContext("2d");
	if(npc3Look==0){
		npc3Image.src = 'pngs/sk0.png';
	}  else if(npc3Look==1){
		npc3Image.src = 'pngs/sk1.png';
	}else if(npc3Look==2){
		npc3Image.src = 'pngs/sk2.png';
	}else if (npc3Look==3) {
		npc3Image.src = 'pngs/sk3.png';
	}else if (npc3Look==4) {
		npc3Image.src = 'pngs/sk4.png';
	}else if (npc3Look==5) {
		npc3Image.src = 'pngs/sk5.png';
	}
	
	npc3.drawImage(npc3Image, npc3X, npc3Y);
}

function drawPlat(platX, platY, plat0Width, plat0Height) {
    plat = canvas.getContext("2d");
    plat.fillStyle = "green";
    plat.fillRect(platX, platY, plat0Width, plat0Height);
}



