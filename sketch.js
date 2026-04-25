let bg;
let catImg;
let cats = [];

// ===== 狀態 =====
let gameState = "start";

// ===== 打地鼠 =====
let moles = [];
let score = 0;
let targetScore = 4;

let currentMole = -1;
let moleTimer = 0;
let moleDuration = 60; // 1秒
let moleCooldown = 0;

// ===== 草地 =====
let grassDots = [];
let flowers = [];

// ===== 貓畫面 =====
let catTimer = 0;
let catStayTime = 120; // ⭐ 2秒


// ===== 🔴 在這裡修改說明內容 🔴 =====
let instructionText = `
在這裡輸入你的說明內容！

例如：
1. 打地鼠打到4分即可進入貓咪畫面
2. 點擊貓咪可以開啟內容
3. 在貓咪畫面停留後會隨機回到打地鼠
4.這個作品的靈感是貓與老鼠，開頭的小遊戲是用來彌補展示面板可玩性的不足，讓觀眾在玩樂中進入貓咪畫面，增加趣味性。
`;
// =====================================


function preload() {
  bg = loadImage("1000043027.png");
  catImg = loadImage("1000042900.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // ===== 貓 =====
  let data = [
    [width * 0.2, height * 0.2, "w1", "w1/index.html"],
    [width * 0.5, height * 0.3, "w2", "w2/index.html"],
    [width * 0.8, height * 0.4, "w3", "w3/index.html"],
    [width * 0.3, height * 0.7, "w4", "w4/index.html"],
    [width * 0.7, height * 0.8, "w5", "w5/index.html"],
    [width * 0.5, height * 0.5, "說明", "instruction"]
  ];

  for (let d of data) {
    cats.push(new Cat(d[0], d[1], d[2], d[3]));
  }

  // ===== 地鼠 =====
  let positions = [
    [width * 0.2, height * 0.5],
    [width * 0.4, height * 0.5],
    [width * 0.6, height * 0.5],
    [width * 0.8, height * 0.5],
    [width * 0.5, height * 0.7]
  ];

  for (let p of positions) {
    moles.push({ x: p[0], y: p[1] });
  }

  // ===== 草地點點（固定）=====
  for (let i = 0; i < 400; i++) {
    grassDots.push({
      x: random(width),
      y: random(height),
      size: random(5, 12),
      g: random(120, 200)
    });
  }

  // ===== 花（固定位置）=====
  for (let i = 0; i < 20; i++) {
    flowers.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  if (gameState === "start") drawStart();
  else if (gameState === "whack") drawWhack();
  else if (gameState === "cats") drawCats();
}

// ===== 開始畫面 =====
function drawStart() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("期中挑戰", width / 2, height / 2);
  textSize(20);
  text("點擊開始", width / 2, height / 2 + 60);
}

// ===== 草地 =====
function drawGrass() {
  background(120, 200, 120);

  noStroke();

  // 點點（固定）
  for (let d of grassDots) {
    fill(50, d.g, 50, 150);
    ellipse(d.x, d.y, d.size);
  }

  // 🌼 花（圓形花瓣）
  for (let f of flowers) {
    push();
    translate(f.x, f.y);
    rotate(f.angle);

    // 花瓣（圓）
    fill("#FFF0AC");
    let petalCount = 8;
    let radius = 12;
    let size = 10;

    for (let i = 0; i < petalCount; i++) {
      let angle = TWO_PI / petalCount * i;
      let px = cos(angle) * radius;
      let py = sin(angle) * radius;
      ellipse(px, py, size, size);
    }

    // 花心（粉色）
    fill("#FFECF5");
    ellipse(0, 0, 12, 12);

    pop();

    // 旋轉
    f.angle += 0.02;
  }
}

// ===== 地鼠 =====
function drawMole(x, y) {
  push();
  translate(x, y - 40);

  fill(120, 80, 50);
  ellipse(0, 0, 70, 70);

  fill(255, 150, 150);
  ellipse(0, 10, 15, 10);

  fill(0);
  ellipse(-10, -5, 8, 8);
  ellipse(10, -5, 8, 8);

  pop();
}

// ===== 打地鼠 =====
function drawWhack() {
  drawGrass();

  fill(0);
  textSize(32);
  text("分數: " + score, 100, 50);

  if (currentMole === -1) {
    moleCooldown++;
    if (moleCooldown > 12) {
      currentMole = floor(random(moles.length));
      moleTimer = 0;
      moleCooldown = 0;
    }
  } else {
    moleTimer++;
    if (moleTimer > moleDuration) {
      currentMole = -1;
    }
  }

  for (let i = 0; i < moles.length; i++) {
    let m = moles[i];

    fill(60, 40, 20);
    ellipse(m.x, m.y, 120, 80);

    if (i === currentMole) {
      drawMole(m.x, m.y);
    }
  }

  if (score >= targetScore) {
    gameState = "cats";
    catTimer = 0;
  }
}

// ===== 貓畫面 =====
function drawCats() {
  background(200);

  imageMode(CORNER);
  if (bg) image(bg, 0, 0, width, height);

  for (let cat of cats) {
    cat.update();
    cat.display();
  }

  catTimer++;

  if (catTimer > catStayTime) {
    gameState = "whack";
    score = 0;
  }
}

// ===== 貓 =====
class Cat {
  constructor(x, y, label, link) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.label = label;
    this.link = link;
    this.t = random(100);
  }

  update() {
    this.t += 0.02;
    this.x = this.baseX + sin(this.t) * 20;
    this.y = this.baseY + cos(this.t) * 15;
  }

  display() {
    push();
    imageMode(CENTER);

    if (catImg) {
      image(catImg, this.x, this.y, 250, 250);
    }

    textAlign(CENTER, CENTER);
    textSize(24);
    fill(0);
    text(this.label, this.x, this.y + 60);
    pop();
  }

  clicked() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < 125) {

      // ⭐ 說明
      if (this.link === "instruction") {
        alert(instructionText);
        return;
      }

      window.open(this.link, "_blank");
    }
  }
}

// ===== 點擊 =====
function mousePressed() {

  if (gameState === "start") {
    gameState = "whack";
    return;
  }

  if (gameState === "whack") {
    if (currentMole !== -1) {
      let m = moles[currentMole];
      let d = dist(mouseX, mouseY, m.x, m.y - 40);

      if (d < 50) {
        score++;
        currentMole = -1;
      }
    }
  }

  else if (gameState === "cats") {
    for (let cat of cats) {
      cat.clicked();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
