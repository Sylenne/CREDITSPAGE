// Neue Montreal Bold Italic by PangramPangram
// https://pangrampangram.com/products/neue-montreal?variant=8853413593130

let font, numPoints, mid
let points = []
let lines = []
const loopDuration = 4 * 60

function preload() {
  font = loadFont('Eurostile.ttf')
}

function setup() {
  createCanvas(500, 500, WEBGL)

  rectMode(CENTER)
  colorMode(HSL, 360, 100, 100, 1)
  noiseSeed(20)
  smooth()

  // get font points
  points = font.textToPoints('0',0,0, 1000, {
    sampleFactor: 0.05,
    simplifyThreshold: 0
  })

  // calculate midpoints of text
  let px = []
  let py = []
  points.forEach(p => {
    px.push(p.x)
    py.push(p.y)
  })
  let midX = (min(px) + max(px)) / 2
  let midY = (min(py) + max(py)) / 2
  mid = createVector(midX, midY)

  numPoints = points.length
  setLines(40)
}

function draw() {
  ortho(-width / 2, width / 2, -height / 2, height / 2, -5000, 5000)

  background(0)
  
  // Lines
  push()
    translate(170, 0, 0)
    rotateY(0.7)
    push()
      blendMode(SCREEN)
      lines.forEach(line => {
        line.display()
      })
    pop()
  pop()

  blendMode(BLEND)

  // Random particles


  push()
    noStroke()
    fill(0, 0, 0, 0.05)
    translate(0, 0, 10)
    rect(0, 0, width, height * 2)
  pop()
}

function setLines(_count) {
  for (let i = 0; i < _count; i++) {
    lines[i] = new Line(i, _count)
  }
}

class Line {
  constructor(_i, _count) {
    this.i = _i // line index
    this.count = _count // total number of lines
    this.gap = 1 // fixed gap per line
    this.start = (this.i * this.gap) + floor(random(10)) // fixed gap plus random gap
    
    this.j = 0 // j will increment each frame to move through the points
    this.steps = floor(numPoints / 2) // number of points to cover by each moving line
    this.n = numPoints
    
    this.zPad = 20 // 2 // spacing between lines
    this.speed = 1 // number of points to skip when drawing line
    this.f = 5 // noise factor

    this.w = map(this.i, 0, this.count - 1, 4, 4) // line stroke weight
    this.rot = (TWO_PI / this.count) * this.i // line rotation

    this.p = points

    this.z = 0
    
    this.colors = ['rgba(255, 0, 0, 0.9)', 'rgba(0, 255, 0, 0.9)', 'rgba(0, 0, 255, 0.9)']
  }

  display() {
    let currentFrame = frameCount % loopDuration
    let t = currentFrame / loopDuration
    let u = map(easeInOutQuad(t), 0, 1, 0, TWO_PI)

    // Move line along
    this.j += 1

    noFill()
    strokeWeight(this.w)

    push()
    translate(0, 0, this.i * -this.zPad + this.z)
    
    // Draw vertex for each color (RGB)
    // Vertex noise and distortion unique per color
    for (let c = 0; c < this.colors.length; c++) {
      stroke(this.colors[c])
      beginShape()
      for (let i = 0; i < this.steps; i++) {
        let k = (i + this.j + this.start) % this.n
        let x = this.p[k].x - mid.x
        let y = this.p[k].y - mid.y
        let n = map(noise(c * 2, this.i * 0.1, frameCount * 0.05), 0, 1, -this.f, this.f)
        let dx = tan(u / 2) * n * ((this.count / 2) - this.i) * 0.1 + random(-1, 1)
        let dy = tan(u / 3) * n * ((this.count / 2) - this.i) * 0.1 + random(-1, 1)
        if (k % this.speed === 0) {
          vertex(x + n + dx, y + n + dx + dy)
        }
      }
      endShape()

      // Draw stars at start of lines
      push()
        let k = (this.steps + this.j + this.start) % this.n
        let x0 = this.p[k].x - mid.x
        let y0 = this.p[k].y - mid.y
        noStroke()
        fill(255)
        translate(x0, y0)
        rotateZ(PI / 4+ this.j * 1)
        star(0, 0, 4, 9, 4);
      pop()
    }
    pop()
  }
}

// Star function
// https://p5js.org/examples/form-star.html
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints
  let halfAngle = angle / 2.0
  beginShape()
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2
    let sy = y + sin(a) * radius2
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1
    sy = y + sin(a + halfAngle) * radius1
    vertex(sx, sy)
  }
  endShape(CLOSE)
}