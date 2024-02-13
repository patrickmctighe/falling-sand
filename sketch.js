function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows).fill(0);
  }
  return arr;
}

let wSlider, matrixSlider, hueSlider, nSlider;

let grid;
let w = 10;
let cols, rows;

let hueValue = 100;

function insideCols(i) {
  return i >= 0 && i <= cols - 1;
}

function insideRows(j) {
  return j >= 0 && j <= rows - 1;
}

function setup() {
  wSlider = select("#wSlider");

  wSlider.input(resizeGrid);

  matrixSlider = select("#matrixSlider");

  hueSlider = select("#hueSlider");

  nSlider = select("#nSlider");

  w = wSlider.value();
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  cols = Math.floor(width / w);
  rows = Math.floor(height / w);
  grid = make2DArray(cols, rows);

  for (let i = 0; i < cols; i++) {
    grid[i][0] = hueValue;
  }
}
function resizeGrid() {
  w = wSlider.value();
  cols = (width / w) >> 0;
  rows = (height / w) >> 0;
  grid = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    grid[i][0] = hueValue;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function mouseDragged() {
  let matrix = matrixSlider.value();
  let mouseCol = floor(mouseX / w);
  let mouseRow = floor(mouseY / w);

  let extent = floor(matrix / 2);
  for (let i = -extent; i <= extent; i++) {
    for (let j = -extent; j <= extent; j++) {
      if (random(1) < 0.5) {
        let col = mouseCol + i;
        let row = mouseRow + j;
        if (insideCols(col) && insideRows(row)) {
          grid[col][row] = hueValue;
        }
      }
    }
  }
  hueValue += hueSlider.value();
  if (hueValue > 360) {
    hueValue = 0;
  }
}

function draw() {
  background(0);
  w = wSlider.value();
  for (let i = 0; i < cols; i++) {
    grid[i][0 - 1] = hueValue;
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      noStroke();
      if (grid[i][j] > 0) {
        fill(grid[i][j], 225, 225);
        let x = i * w;
        let y = j * w;
        square(x, y, w);
      }
    }
  }
  for (let n = 0; n < nSlider.value(); n++) {
    let nextGrid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];
        if (state > 0) {
          let below = grid[i][j + 1];
          let dir = 1;
          if (random(1) < 0.5) {
            dir *= -1;
          }
          if (state > 0) {
            state--;
          }
          let belowA;
          let belowB;
          if (insideCols(i + dir)) {
            belowA = grid[i + dir][j + 1];
          }
          if (insideCols(i - dir)) {
            belowB = grid[i - dir][j + 1];
          }

          if (j === rows - 1) {
            nextGrid[i][j] = 1;
          } else if (below === 0) {
            nextGrid[i][j + 1] = state;
          } else if (belowA === 0) {
            nextGrid[i + dir][j + 1] = state;
          } else if (belowB === 0) {
            nextGrid[i - dir][j + 1] = state;
          } else nextGrid[i][j] = state;
          nextGrid[i][j] = state;
        }
      }
    }
    grid = nextGrid;
  }
}
