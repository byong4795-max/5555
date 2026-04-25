let inputBox;
let chars = [];
let cellSize = 60;

let colorPickers = [];
let colors = [];
let defaultColors = ["#ffc8dc","#ffffff","#c8ffc8"];

let resetButton;

// 新增文字大小滑桿
let sizeSlider;
let textSizeValue = 28;

let mode = 0;

function setup() {
  createCanvas(windowWidth,windowHeight);

  // ===== 右上角輸入框 =====
  inputBox = createInput("❤️");
  inputBox.size(500,60);
  inputBox.style("font-size","32px");
  inputBox.style("border-radius","20px");
  inputBox.style("padding","10px");
  inputBox.style("font-family","Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Arial Rounded MT Bold, sans-serif");
  inputBox.position(windowWidth - inputBox.width - 20,20);
  inputBox.input(updateChars);
  updateChars();

  // ===== 調色盤 =====
  for(let i=0;i<3;i++){
    let picker = createColorPicker(defaultColors[i]);
    picker.position(20 + i*70,20);
    picker.size(60,40);
    picker.input(updateColors);
    colorPickers.push(picker);
    colors.push(color(defaultColors[i]));
  }

  // ===== Reset按鈕 =====
  resetButton = createButton("Reset Colors");
  resetButton.position(20,70);
  resetButton.size(200,40);
  resetButton.style("font-size","18px");
  resetButton.mousePressed(resetColors);

  // ===== 文字大小滑桿 =====
  sizeSlider = createSlider(15,80,textSizeValue,1);
  sizeSlider.position(240, 30); // 在調色盤右方
  sizeSlider.style('width','200px');

  textAlign(CENTER,CENTER);
  textSize(textSizeValue);
  textFont("Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Arial Rounded MT Bold, sans-serif");
}

function draw(){
  background(255,250,200);

  // ===== 文字大小更新 =====
  textSizeValue = sizeSlider.value();
  textSize(textSizeValue);

  let cols = floor(width/cellSize);
  let rows = floor(height/cellSize);
  let index = 0;

  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      let char = chars[index % chars.length];

      let baseX = x*cellSize + cellSize/2;
      let baseY = y*cellSize + cellSize/2;

      let posX = baseX;
      let posY = baseY;

      // ===== 文字運動模式 =====
      if(mode === 0){
        posY = baseY + sin(frameCount*0.1 + index)*10;
      } else if(mode === 1){
        posX = baseX + cos(frameCount*0.05 + index)*10;
        posY = baseY + sin(frameCount*0.05 + index)*10;
      } else if(mode === 2){
        posY = baseY + sin(frameCount*0.15 + x*0.5)*15;
      }

      let r = (x*31 + y*17)%3;
      fill(colors[r]);
      text(char,posX,posY);
      index++;
    }
  }

  drawButtons();
}

function drawButtons(){
  let y = height/2;
  let spacing = 220;

  let x1 = width/2 - spacing;
  let x2 = width/2;
  let x3 = width/2 + spacing;

  drawCircleButton(x1,y,"教科系",color("#FFA94D"),color("#C25A00"));
  drawCircleButton(x2,y,"大學",color("#6FA8FF"),color("#1F4DB3"));
  drawCircleButton(x3,y,"變換",color("#7EDC9A"),color("#2E8B57"));
}

function drawCircleButton(x,y,label,baseColor,textColor){
  let r = 60;

  // 陰影
  noStroke();
  fill(0,40);
  circle(x+6,y+8,r*2);

  // 按鈕本體
  fill(baseColor);
  circle(x,y,r*2);

  // 亮面
  fill(255,80);
  circle(x-10,y-10,r*1.2);

  // 外框
  stroke(255,120);
  strokeWeight(2);
  noFill();
  circle(x,y,r*2);

  // 文字
  noStroke();
  fill(textColor);
  textSize(22);
  text(label,x,y);
}

function mousePressed(){
  let y = height/2;
  let spacing = 220;

  let x1 = width/2 - spacing;
  let x2 = width/2;
  let x3 = width/2 + spacing;

  if(dist(mouseX,mouseY,x1,y) < 60){
    window.open("https://www.et.tku.edu.tw/","_blank");
  } else if(dist(mouseX,mouseY,x2,y) < 60){
    window.open("https://www.tku.edu.tw/","_blank");
  } else if(dist(mouseX,mouseY,x3,y) < 60){
    mode++;
    if(mode>2) mode=0;
  }
}

function updateChars(){
  let str = inputBox.value();
  chars = str.length ? str.split("") : [" "];
}

function updateColors(){
  for(let i=0;i<3;i++){
    colors[i] = color(colorPickers[i].value());
  }
}

function resetColors(){
  for(let i=0;i<3;i++){
    colorPickers[i].value(defaultColors[i]);
    colors[i] = color(defaultColors[i]);
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
  inputBox.position(windowWidth - inputBox.width - 20,20);
}