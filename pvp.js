var canvas;

var fps;
var timeCounter;
var timeSinceGoal;

var winScore;

var pWidth;
var pHeight;

var canvasWidth;
var canvasHeight;


var p1;
var p1X;
var p1Y;
var p1Col;
var p1Score;
var p1Name;

var p2;
var p2X;
var p2Y;
var p2Col;
var p2Score;
var p2Name;

var goText;
var textEraser;
var goTextX;
var goTextY;


var ball;
var bSize;
var bX;
var bY;
var bCol;

var bStartX;
var bStartY;

var ySpeed;
var xSpeed;
var padSpeed;

var wPress;
var sPress;
var oPress;
var lPress;



function finit(){
	document.getElementById("info2").innerHTML="javascript working";
	
	canvas=document.getElementById("canvas1");
	
	pWidth=10;
	pHeight=60;//recomended 50
	
	canvasWidth=document.getElementById("canvas1").width;
	canvasHeight=document.getElementById("canvas1").height;
	
	fps=90;//recomended 60
	timeCounter=0;
	timeSinceGoal=0;
	
	//winScore=1;
	winScore=Math.floor(Math.random()*7)+1;
	
	p1=canvas.getContext("2d");
	p1X=0;
	p1Y=(canvasHeight/2)-(pHeight/2);
	p1Col="red";
	p1Name=document.getElementById("p1NameInput").value;
	
	p2=canvas.getContext("2d");
	p2X=canvasWidth-pWidth;
	p2Y=(canvasHeight/2)-(pHeight/2);//100
	p2Col="blue";
	p2Name=document.getElementById("p2NameInput").value;
	
	goTextX=250;
	goTextY=50;
	goText=canvas.getContext("2d");
	goText.font="30px Arial";
	textEraser=canvas.getContext("2d");
	
	
	ball=canvas.getContext("2d");
	bSize=10;//recomended 10
	bStartX=((canvasWidth-bSize)/(2));//240;
	bStartY=((canvasHeight-bSize)/(2));//140;
	bX=bStartX;
	bY=bStartY;
	bCol="white";
	
    xSpeed=Math.floor(Math.random()*3)+5;//recomended 5
    ySpeed=-5; // recomended -5
    
	padSpeed=5;
	
    p1Score=0;
    p2Score=0;
	
    wPress=false;
    sPress=false;
    oPress=false;
    lPress=false;
	
	fColorChange();
	
}
function f1(){
drawB();
drawP1();
drawP2();
document.getElementById("info1").innerHTML="win score is: "+winScore;
document.getElementById("info3").innerHTML="ball horizontal speed is: "+xSpeed;
document.getElementById("info2").innerHTML="starting game";
//fColorChange();
}
function f2(){
setInterval(function(){
	if(timeSinceGoal>0&&timeSinceGoal<30&&(p1Score<winScore&&p2Score<winScore)){
		goText.fillStyle="red";
		goText.fillText("3",goTextX,goTextY);
	}
	if(timeSinceGoal==30&&(p1Score<winScore&&p2Score<winScore)){
		textEraser.fillStyle="black";
		textEraser.fillRect(goTextX,goTextY-25,63,25);
	}
	if(timeSinceGoal>30&&timeSinceGoal<60&&(p1Score<winScore&&p2Score<winScore)){
		goText.fillStyle="orange";
		goText.fillText("2",goTextX,goTextY);
	}
	if(timeSinceGoal==60&&(p1Score<winScore&&p2Score<winScore)){
		textEraser.fillStyle="black";
		textEraser.fillRect(goTextX,goTextY-25,63,25);
	}
	if(timeSinceGoal>60&&timeSinceGoal<90&&(p1Score<winScore&&p2Score<winScore)){
		goText.fillStyle="yellow";
		goText.fillText("1",goTextX,goTextY);
	}
	if(timeSinceGoal==90&&(p1Score<winScore&&p2Score<winScore)){
		textEraser.fillStyle="black";
		textEraser.fillRect(goTextX,goTextY-25,63,25);
	}
	if(timeSinceGoal>90&&timeSinceGoal<100&&(p1Score<winScore&&p2Score<winScore)){
		goText.fillStyle="green";
		goText.fillText("GO!!",goTextX,goTextY);
	}
	if(timeSinceGoal==100&&(p1Score<winScore&&p2Score<winScore)){
		textEraser.fillStyle="black";
		textEraser.fillRect(goTextX,goTextY-25,63,25);
	}
	if(timeSinceGoal>100)
	{
    if(bY>=canvasHeight-bSize){ySpeed=-ySpeed;}//
    if(bY<=0){ySpeed=-ySpeed;}
    if(bX>=((canvasWidth)-(bSize+pWidth))){
        if((bY+bSize)>=p2Y&&bY<=p2Y+pHeight){xSpeed=-xSpeed;//if(bY>=p2Y&&bY<=p2Y+pHeight){xSpeed=-xSpeed;
			ySpeed=(((bY+bSize/2)-(p2Y+pHeight/2))/6);}
        else{p1Score++;timeSinceGoal=0;eraseB();bX=bStartX;bY=bStartY;xSpeed=-xSpeed;//bX=240;bY=140;
			document.getElementById("d3").innerHTML=p1Score;}
    }
    if(bX<=(pWidth)){
        if(bY+bSize>=p1Y&&bY<=p1Y+pHeight){xSpeed=-xSpeed;
			ySpeed=(((bY+bSize/2)-(p1Y+pHeight/2))/6);}
        else{p2Score++;timeSinceGoal=0;eraseB();bX=bStartX;bY=bStartY;xSpeed=-xSpeed;
        document.getElementById("d5").innerHTML=p2Score;}
    }
    if(p1Score<winScore&&p2Score<winScore){moveB();}
    else if(p1Score>=winScore){p1Wins();}
    else if(p2Score>=winScore){p2Wins();}
	}
    
    if(wPress==true){moveP1Up();}
	 if(sPress==true){moveP1Down();}
	  if(oPress==true){moveP2Up();}
	   if(lPress==true){moveP2Down();}
	   
	   //time Counter
	   timeCounter++;
	   document.getElementById("timeCounter").innerHTML=timeCounter;
	   timeSinceGoal++;
	   document.getElementById("goalTimeCounter").innerHTML=timeSinceGoal;
	   
    
},1000/fps);
	
}
function fColorChange(){
	p1Col=document.getElementById("color1Input").value;
	p2Col=document.getElementById("color2Input").value;
	p1Name=document.getElementById("p1NameInput").value;
	p2Name=document.getElementById("p2NameInput").value;
	
}
function p1Wins(){
	document.getElementById("d1").innerHTML="p1 wins";
	goText.fillStyle=p1Col;
	goText.fillText(p1Name + " Wins",goTextX,goTextY);
	
}
function p2Wins(){
	document.getElementById("d1").innerHTML="p2 wins";
		goText.fillStyle=p2Col;
	goText.fillText(p2Name+" Wins",goTextX,goTextY);
}
function moveB(){
    eraseB();
    bX=bX+xSpeed;
    bY=bY+ySpeed;
    drawB();
}
function drawB(){
	ball.fillStyle=bCol;
	ball.fillRect(bX,bY,bSize,bSize);
}
function eraseB(){
	ball.fillStyle="black";
	ball.fillRect(bX,bY,bSize,bSize);
}
function drawP1(){
	p1.fillStyle=p1Col;
	p1.fillRect(p1X,p1Y,pWidth,pHeight);
}
function eraseP1(){
	p1.fillStyle="black";
	p1.fillRect(p1X,p1Y,pWidth,pHeight);
}
function drawP2(){
	p2.fillStyle=p2Col;
	p2.fillRect(p2X,p2Y,pWidth,pHeight);
}
function eraseP2(){
		p2.fillStyle="black";
	p2.fillRect(p2X,p2Y,pWidth,pHeight);
}
function moveP1Up(){
	eraseP1();
	p1Y=p1Y-(padSpeed);
	drawP1();
}
function moveP1Down(){
	eraseP1();
	p1Y=p1Y+(padSpeed);
	drawP1();
}
function moveP2Up(){
	eraseP2();
	p2Y=p2Y-(padSpeed);
	drawP2();
}
function moveP2Down(){
	eraseP2();
	p2Y=p2Y+(padSpeed);
	drawP2();
}
function fReset(){
	document.getElementById("info2").innerHTML="reset";
	textEraser.fillStyle="black";
	textEraser.fillRect(goTextX,goTextY-25,630,35);
	p1Score=0;
	p2Score=0;
	document.getElementById("d3").innerHTML=p1Score;
	document.getElementById("d5").innerHTML=p2Score;
	timeCounter=0;
	timeSinceGoal=0;
	
	
	
}
window.addEventListener('keypress',function(event){
var x=event.key;
if(x=="w"||x=="W"){wPress=true;}
 if(x=="s"||x=="S"){sPress=true;}

    
if(x=="o"||x=="O"){oPress=true;}
else if(x=="l"||x=="L"){lPress=true;}


if(x=="g"||x=="G"){f1();}
if(x=="h"||x=="H"){f2();}
if(x=="t"||x=="T"){fReset();}

},false);
window.addEventListener('keyup',function(event){
var x=event.key;
if(x=="w"||x=="W"){wPress=false;}
 if(x=="s"||x=="S"){sPress=false;}

    
if(x=="o"||x=="O"){oPress=false;}
else if(x=="l"||x=="L"){lPress=false;}

},false);




