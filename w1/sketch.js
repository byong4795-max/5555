 function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  noStroke();
}

function draw() {
  background(0);
  
  // 圓形的直徑和半徑
  let circleSize = 30;
  let radius = circleSize / 2;
  
  // 區域的中心
  let centerX = width / 2;
  let centerY = height / 2;
  let fillRadius = max(width, height) * 0.6;
  
  // 用六邊形堆積方式排列圓形（更緊密）
  let yOffset = 0;
  for(let y = 0; y < height + circleSize; y += circleSize * 0.866) {
    let xOffset = (yOffset % 2) * (circleSize / 2);
    
    for(let x = -circleSize; x < width + circleSize; x += circleSize) {
      let currentX = x + xOffset;
      let currentY = y;
      
      // 計算到中心的距離
      let dist = sqrt(sq(currentX - centerX) + sq(currentY - centerY));
      
      // 只在填充範圍內繪製圓形
      if(dist < fillRadius) {
        // 色相基於位置和時間滾動
        let hue = (dist * 0.5 + frameCount * 2) % 360;
        fill(hue, 100, 100);
        
        circle(currentX, currentY, circleSize);
      }
    }
    
    yOffset++;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}