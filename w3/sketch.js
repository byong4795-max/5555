let noiseOffset = 0;
let stems = [];
let clownfish = [];
let clownfishImg;
let bubbles = [];
let particles = [];
let popSound;

function preload() {
  clownfishImg = loadImage('1000042507.png');
  popSound = loadSound('pop.mp3');
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('canvasContainer');
  clear();
  noFill();
  frameRate(60);
  initStems();
  initClownfish();
  initBubbles();
}

function initStems() {
  stems = [];

  // 底部海葵（向上生長）
  for (let i = 0; i < 35; i++) {
    let sizeClass = random() < 0.5 ? "large" : "small";
    let thickness = sizeClass === "large" ? random(44, 55) : random(30, 37);
    let length = sizeClass === "large" ? height * 0.28 : height * 0.2;
    let x = map(i, 0, 34, width * 0.1, width * 0.9) + random(-18, 18);
    let colorChoice = floor(random(3));
    let colorClass = colorChoice === 0 ? "orange" : (colorChoice === 1 ? "pink" : "lime");
    stems.push({x, thickness, length, baseY: height, offset: random(1000), colorClass, direction: "up"});
  }
}

function initClownfish() {
  clownfish = [];
  for (let i = 0; i < 14; i++) {
    let speed = random(1, 2.2);
    let dir = random() < 0.5 ? -1 : 1;
    // 2:1 尺寸比例，3 為現有大小、1.6 為中型、1 為小型
    let r = random();
    let sizeScale = r < 0.4 ? 3 : (r < 0.8 ? 1.6 : 1);

    clownfish.push({
      x: random(width * 0.1, width * 0.9),
      y: random(height * 0.68, height * 0.85),
      vx: dir * speed,
      vy: 0,
      angle: 0,
      sizeScale
    });
  }
}

function initBubbles() {
  bubbles = [];
  for (let i = 0; i < 20; i++) {
    bubbles.push({
      x: random(width),
      y: random(height * 0.8, height),
      vx: random(-0.5, 0.5),
      vy: random(-1, -0.5),
      size: random(20, 40)
    });
  }
}

function draw() {
  clear();

  drawGround();

  // 畫海草
  for (let s of stems) {
    drawWavingStem(s);
  }

  // 畫氣泡
  updateBubbles();
  drawBubbles();

  // 畫小丑魚
  for (let f of clownfish) {
    updateClownfish(f);
    drawClownfish(f);
  }

  // 畫顆粒
  updateParticles();
  drawParticles();

  noiseOffset += 0.013;
}

function drawETBackground() {
  // 參考 https://www.et.tku.edu.tw/ 配色
  for (let y = 0; y < height; y++) {
    let t = map(y, 0, height, 0, 1);
    let c = lerpColor(color(7, 74, 151), color(17, 125, 213), t);
    stroke(c);
    line(0, y, width, y);
  }

  // 模擬頁首方塊
  noStroke();
  fill(255);
  rect(0, 0, width, 80);
  fill(7, 74, 151);
  textSize(24);
  textAlign(LEFT, CENTER);
  text('TKU ET - 模擬背景', 20, 40);

  // 模擬導航橫條
  fill(7, 74, 151, 180);
  rect(0, 80, width, 32);

  // 模擬角落圖層裝飾
  fill(255, 255, 255, 40);
  ellipse(width * 0.8, 100, 120, 120);
}


function drawGround() {
  noStroke();
  fill(10, 18, 25);
  rect(0, height * 0.82, width, height * 0.18);
}

function drawWavingStem(stem) {
  let {x, thickness, length, baseY, offset, colorClass} = stem;
  let swayBase = sin((frameCount * 0.025) + offset) * 15;

  // 選擇顏色組合
  let outerColor, innerColor;
  if (colorClass === "orange") {
    outerColor = [255, 140, 0, 190];
    innerColor = [255, 200, 128, 220];
  } else if (colorClass === "pink") {
    outerColor = [255, 20, 147, 190];
    innerColor = [255, 105, 180, 220];
  } else {
    outerColor = [50, 255, 50, 190];
    innerColor = [144, 238, 144, 220];
  }

  strokeWeight(thickness * 1.05);
  stroke(...outerColor);
  beginShape();
  for (let t = 0; t <= 1; t += 0.03) {
    let y = baseY - t * length;
    let sway = sin((t * PI * 2) + frameCount * 0.02 + offset) * 20 * (1 - t) + swayBase;
    curveVertex(x + sway, y);
  }
  endShape();

  strokeWeight(thickness * 0.82);
  stroke(...innerColor);
  beginShape();
  for (let t = 0; t <= 1; t += 0.03) {
    let y = baseY - t * length;
    let sway = sin((t * PI * 2) + frameCount * 0.02 + offset) * 18 * (1 - t) + swayBase;
    curveVertex(x + sway, y);
  }
  endShape();
}

function updateClownfish(f) {
  f.x += f.vx;
  f.vy = 0; // 確保沒有上下移動
  
  // 角度根據水平方向決定
  f.angle = f.vx > 0 ? 0 : PI; // 向右為 0，向左為 PI
  
  // 左右邊界反彈
  if (f.x < 0 || f.x > width) {
    f.vx *= -1;
  }

  // 半海葵區域上下維持固定
  const minY = height * 0.68;
  const maxY = height * 0.85;
  f.y = constrain(f.y, minY, maxY);

  // 保持左右在邊界內
  f.x = constrain(f.x, 0, width);
}

function drawWavingStem(stem) {
  let {x, thickness, length, baseY, offset, colorClass} = stem;
  let swayBase = sin((frameCount * 0.025) + offset) * 15;

  // 選擇顏色組合：橘、杏粉、豆綠
  let outerColor, innerColor;
  if (colorClass === "orange") {
    outerColor = [255, 140, 0, 190];
    innerColor = [255, 200, 128, 220];
  } else if (colorClass === "pink") {
    outerColor = [255, 192, 203, 190];  // 杏粉色
    innerColor = [255, 220, 230, 220];
  } else {
    outerColor = [107, 142, 35, 190];   // 豆綠色
    innerColor = [139, 180, 60, 220];
  }

  strokeWeight(thickness * 1.05);
  stroke(...outerColor);
  beginShape();
  for (let t = 0; t <= 1; t += 0.03) {
    let y = baseY - t * length;
    let sway = sin((t * PI * 2) + frameCount * 0.02 + offset) * 20 * (1 - t) + swayBase;
    curveVertex(x + sway, y);
  }
  endShape();

  strokeWeight(thickness * 0.82);
  stroke(...innerColor);
  beginShape();
  for (let t = 0; t <= 1; t += 0.03) {
    let y = baseY - t * length;
    let sway = sin((t * PI * 2) + frameCount * 0.02 + offset) * 18 * (1 - t) + swayBase;
    curveVertex(x + sway, y);
  }
  endShape();
}

function drawClownfish(f) {
  push();
  translate(f.x, f.y);

  // 2:1 比例，sizeScale 3 或 1
  let w = 60 * f.sizeScale;
  let h = 40 * f.sizeScale;

  // 右向鏡像，左向正常（顛倒現有行為）
  if (f.vx > 0) {
    scale(-1, 1);
  }

  if (clownfishImg) {
    imageMode(CENTER);
    image(clownfishImg, 0, 0, w, h);
  }

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initStems();
  initClownfish();
  initBubbles();
}

function updateBubbles() {
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    b.x += b.vx;
    b.y += b.vy;

    // 檢查與魚的碰撞
    let collided = false;
    for (let f of clownfish) {
      let fishSize = 60 * f.sizeScale;
      let dist = sqrt((b.x - f.x) ** 2 + (b.y - f.y) ** 2);
      if (dist < b.size / 2 + fishSize / 2) {
        collided = true;
        break;
      }
    }

    if (collided) {
      // 播放音效
      if (popSound) {
        popSound.play();
      }
      // 破掉成小顆粒
      for (let j = 0; j < 5; j++) {
        particles.push({
          x: b.x + random(-b.size / 2, b.size / 2),
          y: b.y + random(-b.size / 2, b.size / 2),
          vx: random(-1, 1),
          vy: random(-1, 1),
          size: b.size / 15,
          life: 300 // 5秒 at 60fps
        });
      }
      bubbles.splice(i, 1);
      // 補充新的泡泡
      bubbles.push({
        x: random(width),
        y: height + random(20, 40),
        vx: random(-0.5, 0.5),
        vy: random(-1, -0.5),
        size: random(20, 40)
      });
    } else if (b.y < -b.size) {
      // 重新生成
      b.x = random(width);
      b.y = height + b.size;
    }
  }
}

function drawBubbles() {
  for (let b of bubbles) {
    // 氣泡
    fill(255, 255, 255, 102); // 40/100 alpha
    noStroke();
    ellipse(b.x, b.y, b.size);

    // 反光小圓
    fill(255, 255, 255, 140); // 55/100 alpha
    ellipse(b.x - b.size / 4, b.y - b.size / 4, b.size / 4);
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {
  fill(255, 255, 255, 100);
  noStroke();
  for (let p of particles) {
    ellipse(p.x, p.y, p.size);
  }
}




