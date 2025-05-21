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

function drawPlat(platX,platY,plat0Width,plat0Height){
plat=canvas.getContext("2d");
plat.fillStyle="green";
	plat.fillRect(platX,platY,plat0Width,plat0Height);
}


var wPress;
var sPress;
var aPress;
var dPress;
var jPress;
var kPress;
var lPress;



function finit(){
	document.getElementById("d1").innerHTML="calling finit()";
	
	canvas=document.getElementById("canvas1");
	

	
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

	npc0Width=22;//20
	npc0Height=44;//40
	npc0=canvas.getContext("2d");
	npc0X=100;
	npc0Y=100;
	npc0Look=0;
	npc0JumpForce=80;
	npc0Crouch=false;
	npc0Speed=5;
	
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
	drawnpc0();
	drawPlat(plat0X,plat0Y,plat0Width,plat0Height);
}


function f2(){

setInterval(function(){
	
	   //time Counter
	   timeCounter++;
	   if(timeCounter%frameMultiplyer==0){
		updateSky();
		drawP1();
		drawGround();
		drawnpc0();
		drawPlat(plat0X,plat0Y,plat0Width,plat0Height);
	}
	   document.getElementById("timeCounter").innerHTML=aPress+sPress+dPress+wPress//timeCounter;
	   document.getElementById("d2").innerHTML=timeCounter;
	   document.getElementById("d3").innerHTML=p1X;
	   document.getElementById("d4").innerHTML=p1Y;
	   document.getElementById("d5").innerHTML=gun0X;
	   document.getElementById("d6").innerHTML=gun0Y;
	   document.getElementById("d7").innerHTML=p1Look;
		drawGround();
		p1Control();
		npc0Control();
		bulletControl();

},1000/fps);
	
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
	//p1.fillStyle=p1Col;
	//p1.fillRect(p1X,p1Y,pWidth,pHeight);
	img0 = new Image();   
	if(p1Look==0){
		img0.src = 'pngs/clerk0.png';
	}  else if(p1Look==1){
		img0.src = 'pngs/clerk1.png';
	}else if(p1Look==2){
		img0.src = 'pngs/sk2.png';
	}else if (p1Look==3) {
		img0.src = 'pngs/npcfire3.png';
	}else if (p1Look==4) {
		img0.src = 'pngs/npcfire4.png';
	}
	else if (p1Look==5) {
		img0.src = 'pngs/npcfire5.png';
	}
  	
  	img0.onload = function(){
    p1.drawImage(img0,p1X,p1Y);
  }
  drawGun0();
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
  

function npc0Control(){ 
	var npc0actionrange =100;
	var npc0actionfactor=100 ;//bigger number less decisions
	var npc0MovementRange=1;
	npc0input=Math.floor(Math.random() * npc0actionrange);
	if(npc0input%npc0actionfactor==0){
		for(let i=0;i<npc0MovementRange;i++){
			npc0Look=1;
		movenpc0Right();
	}
	}
	if(npc0input%npc0actionfactor==1){
		for(let i=0;i<npc0MovementRange;i++){
			movenpc0Left();
			npc0Look=2;
		}
		
	}
	if(npc0input%npc0actionfactor==3 && npc0Grounded){
		npc0Jump();
		npc0Look=0;
	}
	
	checknpc0Grounding();
	//addnpc0Gravity();
	checknpc0Limits();
	if(npc0Grounded==true){
		document.getElementById("info3").innerHTML="npc0 grounded";
	}else{
		erasenpc0();
		document.getElementById("info3").innerHTML="npc0 not grounded";
		addnpc0Gravity();
		drawnpc0();
	}
	}


function addnpc0Gravity(){
	erasenpc0();
	npc0Y=npc0Y+gravity;
	drawnpc0();
	}
	
function checknpc0Grounding(){
	if (npc0Y+npc0Height>=canvasHeight-groundHeight){//is npc0Y etc lower than ground or ground level
		npc0Y=canvasHeight-npc0Height-groundHeight;
		npc0Grounded=true;
	}else if(npc0Y+npc0Height<canvasHeight-groundHeight){ //is npc0Y etc higher than ground
		if(npc0X+npc0Width>plat0X && npc0X<plat0X+plat0Width && npc0Y+npc0Height>plat0Y &&npc0Y+npc0Height<plat0Y+plat0Height){//is npc0 inside plat0--
		npc0Grounded=true;
		}else if(npc0X+npc0Width>p1X && npc0X<p1X+p1Width && npc0Y+npc0Height>p1Y &&npc0Y+npc0Height<p1Y+p1Height){//is npc0 inside P1--
			npc0Grounded=true;
		}else npc0Grounded=false;
	}
	}
	function checknpc0Limits(){
		if (npc0X+npc0Width>canvasWidth){
			npc0X=canvasWidth-npc0Width;
		}
		if (npc0X<0){
			npc0X=0;
		}
	}
function drawnpc0(){
	//p1.fillStyle=p1Col;
	//p1.fillRect(p1X,p1Y,pWidth,pHeight);
	img1 = new Image();   
	if(npc0Look==0){
		img1.src = 'pngs/npcwater0.png';
	}  else if(npc0Look==1){
		img1.src = 'pngs/npcwater1.png';
	}else if(npc0Look==2){
		img1.src = 'pngs/npcwater2.png';
	}else if (npc0Look==3) {
		img1.src = 'pngs/npc3.png';
	}else if (npc0Look==4) {
		img1.src = 'pngs/npc4.png';
	}else if (npc0Look==5) {
		img1.src = 'pngs/npc5.png';
	}
  	img1.onload = function(){
	npc0.drawImage(img1,npc0X,npc0Y);
  }
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
	gun0Y=p1Y+(p1Height/2);
	img3 = new Image();   
	if(p1Look==0){
		img3.src = 'pngs/gun0.png';
		gun0X=p1X+p1Width;
	}  else if(p1Look==1){
		img3.src = 'pngs/sniper1.png';
		gun0X=p1X;
	}else if(p1Look==2){
		img3.src = 'pngs/sniper2.png';
		gun0X=p1X-gun0Width;
	}else if (p1Look==3) {
		img3.src = 'pngs/gun0.png';
		gun0X=p1X+p1Width;
	}else if (p1Look==4) {
		img3.src = 'pngs/sniper1.png';
		gun0X=p1X+p1Width/3;
	}else if (p1Look==5) {
		img3.src = 'pngs/sniper2.png';
		gun0X=p1X-gun0Width;
	}
	img3.onload = function(){
		gun0.drawImage(img3,gun0X,gun0Y);
	  }
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
function fire(){
	document.getElementById("info2").innerHTML="fire";
	if (p1Look==1||p1Look==4){
		bulletLook==1;
	}
	if (p1Look==2||p1Look==5){
		bulletLook==2;
	}
	bulletExists=true;
	bulletX=gun0X;
	bulletY=gun0Y;
}
function bulletControl(){
	if (bulletExists==true){
		bulletTravel();
	}else{
		document.getElementById("info2").innerHTML="bullet not existing";
	}
}
function bulletTravel(){
	if (bulletX<0||bulletX>canvasWidth){
		bulletExists=false;
		document.getElementById("info2").innerHTML="bullet stopped existing";
	} else {
		if(bulletLook==1){
			moveBulletRight();
			document.getElementById("info3").innerHTML=bulletX;
		}
		if(bulletLook==2){
			moveBulletLeft();
			document.getElementById("info3").innerHTML=bulletX;
		}
	}
}
function moveBulletLeft(){
	eraseBullet();
	bulletX=bulletX-bulletSpeed;
	drawBullet();
}
function moveBulletRight(){
	eraseBullet();
	bulletX=bulletX+bulletSpeed;
	drawBullet();
}


//________________________________________________________MISC

function updateSky(){
	sky=canvas.getContext("2d");
	sky.fillStyle=canvasColor;
	sky.fillRect(0,0,canvasWidth,canvasHeight);
	drawPlat(plat0X,plat0Y,plat0Width,plat0Height);
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



