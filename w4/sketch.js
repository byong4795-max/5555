let path = [];
let gameState = "start"; 

let octopusImg, knifeImg;
let octopusLoaded = false, knifeLoaded = false;

let octopusSize = 160; 
let octopusX, octopusY;

let roadWidth;
let knives = [];
let level = 1;

// 狀態
let dragging = false;
let runaway = false;

// 臨時訊息
let tempMsg = null;
let tempMsgTime = 0;

function preload() {
  octopusImg = loadImage("章魚.png",
    () => { octopusLoaded = true; },
    () => { octopusLoaded = false; console.log("章魚.png 無法載入"); }
  );
  knifeImg = loadImage("刀.png",
    () => { knifeLoaded = true; },
    () => { knifeLoaded = false; console.log("刀.png 無法載入"); }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  roadWidth = (octopusSize * 3) / 3; 
  generateMaze();
}

function draw() {
  background(255, 182, 193);
  drawMazeBackground();
  drawPathSmooth();
  drawKnives();

  if (gameState === "start") { drawStartScreen(); return; }
  if (gameState === "win") { showText("成功過關！\n點擊開始下一關", color(0,255,0)); return; }

  // 控制章魚或亂跑
  if (dragging) {
    octopusX = mouseX;
    octopusY = mouseY;
  } else if (runaway) {
    // 大幅度亂跑
    octopusX += random(-20,20);
    octopusY += random(-20,20);
  }

  drawOctopus(octopusX, octopusY);
  checkCollision(); // 碰到牆壁就立即抱走
  checkWin();

  // 臨時訊息
  if(tempMsg && millis() < tempMsgTime){
    fill(255,0,0);
    textSize(60);
    textAlign(CENTER,CENTER);
    text(tempMsg,width/2,height/2);
  } else {
    tempMsg = null;
  }
}

function generateMaze() {
  path = [];
  knives = [];
  let margin = 100;
  path.push({x: margin, y: margin});
  let numSegments = 8 + level*2;
  let lastKnife = null;

  for (let i = 1; i <= numSegments; i++) {
    let x = map(i, 1, numSegments+1, margin, width - margin) + random(-50, 50);
    let y = random(margin, height - margin);
    path.push({x, y});

    let offsetDir = random([-1, 1]);
    let offsetDist = roadWidth/2 + random(20,50);
    let kx = x + (offsetDir * offsetDist);
    let ky = y + (offsetDir * offsetDist);
    let angle = random([0,30,45,60,90,120,135,150]);

    if(!lastKnife || dist(kx,ky,lastKnife.x,lastKnife.y)>100){
      knives.push({x:kx, y:ky, w:30*4*3, h:10*4*3, angle});
      lastKnife = {x:kx, y:ky};
    }
  }
  path.push({x: width - margin, y: height - margin});
}

function drawMazeBackground() {
  noStroke();
  fill(255, 182, 193);
  rect(0, 0, width, height);
  for (let i = 0; i < 1000; i++) {
    fill(255, 105, 180, 100);
    ellipse(random(width), random(height), 2, 2);
  }
}

function drawPathSmooth() {
  noFill();
  stroke(255);
  strokeWeight(roadWidth);
  beginShape();
  curveVertex(path[0].x, path[0].y);
  for(let p of path) curveVertex(p.x, p.y);
  curveVertex(path[path.length-1].x, path[path.length-1].y);
  endShape();
  noStroke();
  fill(0, 255, 0); ellipse(path[0].x, path[0].y, 20); 
  fill(255,0,0); ellipse(path[path.length-1].x, path[path.length-1].y, 40); 
}

function drawKnives() {
  for (let k of knives) {
    push();
    translate(k.x, k.y);
    rotate(radians(k.angle));
    if (knifeLoaded) { imageMode(CENTER); image(knifeImg, 0,0,k.w,k.h); }
    else { fill(0,100,0); rectMode(CENTER); rect(0,0,k.w,k.h); }
    pop();
  }
}

function drawOctopus(x,y) {
  push();
  translate(x,y);
  imageMode(CENTER);
  if (octopusLoaded) image(octopusImg,0,0,octopusSize,octopusSize);
  else { fill(255,255,0); ellipse(0,0,octopusSize,octopusSize); }
  pop();
}

function drawStartScreen() {
  fill(255); textAlign(CENTER,CENTER); textSize(40); text("章魚電流急急棒", width/2, height/2-50);
  fill(100,200,255); rectMode(CENTER); rect(width/2,height/2+50,220,60,10);
  fill(0); textSize(24); text("開始遊戲", width/2, height/2+50);
}

function mousePressed() {
  if (gameState==="start") {
    if (mouseX>width/2-110 && mouseX<width/2+110 && mouseY>height/2+20 && mouseY<height/2+80){
      gameState="playing"; 
      let start = path[0]; 
      octopusX=start.x; 
      octopusY=start.y; 
      runaway=false;
      dragging=false;
    }
  } else if(gameState==="playing") {
    let d = dist(mouseX, mouseY, octopusX, octopusY);
    if(d < octopusSize/2) {
      dragging = true; // 玩家再次抓取章魚時控制權回來
      runaway = false;
    }
  } else {
    if(gameState==="win") level++; else level=1;
    generateMaze(); gameState="start";
  }
}

function mouseReleased(){ dragging=false; }

function checkCollision() {
  let distanceToRoad = distToPath(octopusX, octopusY);

  // 碰到牆壁立即被抱走、亂跑幅度更大
  if(distanceToRoad > roadWidth/8){ 
    runaway = true; 
    dragging = false; // 立刻取消控制
  } 

  // 刀子事件
  for(let i=knives.length-1;i>=0;i--){
    let k = knives[i];
    let dx = abs(octopusX - k.x);
    let dy = abs(octopusY - k.y);
    let halfW = (k.w/2)/4; 
    let halfH = (k.h/2)/4; 
    if(dx < halfW && dy < halfH){
      tempMsg = "哈哈";
      tempMsgTime = millis()+2000;
      knives.splice(i,1);
    }
  }
}

function checkWin() {
  let end=path[path.length-1];
  if(dist(octopusX,octopusY,end.x,end.y)<roadWidth/2) gameState="win";
}

function distToPath(px,py){
  let minD=Infinity;
  for(let i=0;i<path.length-1;i++){
    let a=path[i],b=path[i+1];
    minD=min(minD, distToSegment(px,py,a.x,a.y,b.x,b.y));
  }
  return minD;
}

function distToSegment(px,py,x1,y1,x2,y2){
  let A=px-x1,B=py-y1,C=x2-x1,D=y2-y1;
  let dot=A*C+B*D,len_sq=C*C+D*D,param=dot/len_sq,xx,yy;
  if(param<0){ xx=x1; yy=y1; }
  else if(param>1){ xx=x2; yy=y2; }
  else { xx=x1+param*C; yy=y1+param*D; }
  return dist(px,py,xx,yy);
}

function showText(msg,col){ fill(col); textSize(36); textAlign(CENTER,CENTER); text(msg,width/2,height/2); }

function windowResized(){ resizeCanvas(windowWidth,windowHeight); }