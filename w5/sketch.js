// p5.js 全螢幕「找指定圖片」遊戲（升級版 sketch.js）

let baseNames = [
  "281482_0",
  "281483_0",
  "281484_0",
  "281485_0",
  "281495_0",
  "281500_0"
];

let images = [];
let targetImg;
let gridImg;

// 🔥 格子數量增加（約 2 倍）
let cols = 16;
let rows = 10;

let cellW, cellH;
let treasureCell;
let revealed = [];

let gameOver = false;
let win = false;

// ⏱️ 倒數計時
let timeLeft = 20;
let timer;

function preload() {
  for (let name of baseNames) {
    loadWithFallback(name);
  }
}

function loadWithFallback(name) {
  loadImage(name + ".png",
    img => images.push(img),
    () => {
      loadImage(name + ".jpg",
        img2 => images.push(img2),
        () => console.log("載入失敗:", name)
      );
    }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  initGame();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initGame();
}

function initGame() {
  if (images.length < 2) return;

  cellW = width / cols;
  cellH = height / rows;

  let a = floor(random(images.length));
  let b;
  do {
    b = floor(random(images.length));
  } while (b === a);

  targetImg = images[a];
  gridImg = images[b];

  treasureCell = {
    x: floor(random(cols)),
    y: floor(random(rows))
  };

  revealed = [];
  for (let i = 0; i < cols; i++) {
    revealed[i] = [];
    for (let j = 0; j < rows; j++) {
      revealed[i][j] = false;
    }
  }

  gameOver = false;
  win = false;

  // ⏱️ 重設計時
  timeLeft = 20;
  clearInterval(timer);
  timer = setInterval(() => {
    if (gameOver) {
      clearInterval(timer);
      return;
    }

    timeLeft--;

    if (timeLeft <= 0) {
      gameOver = true;
      win = false;
      clearInterval(timer);
    }
  }, 1000);
}

function draw() {
  background(0);

  if (!targetImg || !gridImg) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("圖片載入中或失敗...", width/2, height/2);
    return;
  }

  // 🎯 右上角（拉遠一點）
  image(targetImg, width - 160, 40, 120, 120);

  fill(255);
  textSize(18);
  textAlign(RIGHT);
  text("找這張！", width - 40, 180);

  // ⏱️ 顯示時間
  textAlign(LEFT);
  text("時間：" + timeLeft, 40, 50);

  // 已翻開
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (revealed[i][j]) {
        drawCell(i, j);
      }
    }
  }

  // hover
  if (!gameOver) {
    let i = floor(mouseX / cellW);
    let j = floor(mouseY / cellH);

    if (i >= 0 && i < cols && j >= 0 && j < rows) {
      drawCell(i, j);
    }
  }

  // 🏁 結束畫面
  if (gameOver) {
    fill(0, 220);
    rect(0, 0, width, height);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);

    if (win) {
      text("🎉 找到了！", width / 2, height / 2 - 80);
    } else {
      text("💀 失敗了...", width / 2, height / 2 - 80);
    }

    // ⭐ 顯示寶藏圖片（不論輸贏）
    image(targetImg, width/2 - 60, height/2 - 40, 120, 120);

    textSize(20);
    text("按 R 重玩", width / 2, height / 2 + 80);

    // ⭐ 顯示寶藏位置（放在最下方）
    text(
      "寶藏位置：(" + treasureCell.x + ", " + treasureCell.y + ")",
      width / 2,
      height / 2 + 120
    );

    return;
  }

  // ⭐ 若遊戲結束，高亮寶藏格子
  if (gameOver) {
    stroke(255, 255, 0);
    strokeWeight(5);
    noFill();
    rect(
      treasureCell.x * cellW,
      treasureCell.y * cellH,
      cellW,
      cellH
    );
  }

  // 格線
  stroke(255);
  strokeWeight(2);
  noFill();

  for (let i = 0; i <= cols; i++) {
    line(i * cellW, 0, i * cellW, height);
  }
  for (let j = 0; j <= rows; j++) {
    line(0, j * cellH, width, j * cellH);
  }
}

function drawCell(i, j) {
  if (i === treasureCell.x && j === treasureCell.y) {
    image(targetImg, i * cellW, j * cellH, cellW, cellH);
  } else {
    image(gridImg, i * cellW, j * cellH, cellW, cellH);
  }
}

function mousePressed() {
  if (gameOver) return;

  let i = floor(mouseX / cellW);
  let j = floor(mouseY / cellH);

  if (i < 0 || i >= cols || j < 0 || j >= rows) return;

  revealed[i][j] = true;

  if (i === treasureCell.x && j === treasureCell.y) {
    gameOver = true;
    win = true;
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    initGame();
  }
}
