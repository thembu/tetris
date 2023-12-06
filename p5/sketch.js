
const rows = 20;
const cols =  10;
const blocksize = 30;
let nextPiece;
let grid;
let nextGrid;
let nextsRows = 14;
let nextsCols = 5;
let keyDown = false;
let score = 0;
let speed = 10;


const tetrominoes = [
  // I-shaped Tetromino
  [
      [1, 1, 1, 1]
  ],

  // J-shaped Tetromino
  [
      [1, 0, 0],
      [1, 1, 1]
  ],

  // L-shaped Tetromino
  [
      [0, 0, 1],
      [1, 1, 1]
  ],

  // O-shaped Tetromino
  [
      [1, 1],
      [1, 1]
  ],

  // T-shaped Tetromino
  [
      [0, 1, 0],
      [1, 1, 1]
  ],

  // S-shaped Tetromino
  [
      [0, 1, 1],
      [1, 1, 0]
  ],

  // Z-shaped Tetromino
  [
      [1, 1, 0],
      [0, 1, 1]
  ]
];

//current tetromino
let currentTetromino;
let currentRow;
let currentCol;
let width;


function setup(params) {
  stroke(128,128,128); // Set stroke color to grey

  createCanvas(600,700);
  grid  = createEmptyGrid();
  nextGrid = createEmptyGrid();
  let  color = getRandomColor()

  fill(color);

  spawnTetromino()

}





//initializes a new zero matrix

function createEmptyGrid() {
  return Array.from({ length: rows }, () => Array(cols).fill(0));

}




function drawGrid(params) {


//renders current state of the game grid

stroke(128,128,128); // Set stroke color to grey
    // Draw horizontal lines
    for (let i = 0; i <= rows; i++) {
        line(0, i * blocksize, cols * blocksize, i * blocksize);
    }

    // Draw vertical lines
    for (let j = 0; j <= cols; j++) {
        line(j * blocksize, 0, j * blocksize, rows * blocksize);
    }

  for (let i = 0; i < rows; i++) {
    
    for (let j = 0; j < cols; j++) {
      if(grid[i][j] !== 0) {
        rect(j*blocksize , i * blocksize , blocksize, blocksize)
      }
    }
  }


}






function getRandomColor() {
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',  '#FFA500'];
  return random(colors);
}





function drawTetromino(params) {


  if(currentTetromino) {
    
    for (let i = 0; i < currentTetromino.length; i++) {
        for (let j = 0; j < currentTetromino[i].length; j++) {
       
           if(currentTetromino[i][j] != 0) {
            rect(
              (currentCol + j) * blocksize,
              (currentRow+ i) *blocksize,
              blocksize,
              blocksize
              )
           }

           width = (currentCol + j) * blocksize;


       }      
    }


  }
  
}


function spawnTetromino(params) {

  //select a rando tetromino
  let  color = getRandomColor()


  fill(color)

  const randomIndex = floor(random(tetrominoes.length))
  nextPiece = tetrominoes[randomIndex]
  currentTetromino = tetrominoes[randomIndex];


  //set initial position

  currentRow  = 0 ;

  currentCol = floor(cols/2) - floor(currentTetromino[0].length/2)

}



function drawNextPieceGrid() {
  // Draw the next Tetromino grid
  fill(200);
  rect(cols * blocksize, 0, cols * blocksize, rows * blocksize);

  // Draw the next Tetromino in the grid
  for (let i = 0; i < nextPiece.length; i++) {
      for (let j = 0; j < nextPiece[i].length; j++) {
          if (nextPiece[i][j] !== 0) {
              rect(
                  cols * blocksize + j * blocksize,
                  i * blocksize,
                  blocksize,
                  blocksize
              );
          }
      }
  }
}


function collides() {
  for (let i = 0; i < currentTetromino.length; i++) {
      for (let j = 0; j < currentTetromino[i].length; j++) {
          // Check if the current cell of the Tetris piece is filled (not equal to 0)
          if (
              currentTetromino[i][j] !== 0 &&
              (grid[currentRow + i] && grid[currentRow + i][currentCol + j] !== 0)
          ) {
              return true; // Collision detected
          }
      }
  }
  return false; // No collision
}


function canMoveDown() {
  for (let i = 0; i < currentTetromino.length; i++) {
      for (let j = 0; j < currentTetromino[i].length; j++) {
          if (
              currentTetromino[i][j] !== 0 &&
              (currentRow + i + 1 >= rows || grid[currentRow + i + 1] && grid[currentRow + i + 1][currentCol + j] !== 0)
          ) {
              return false; // Cannot move down
          }
      }
  }
  return true; // Can move down
}



function canMoveRight() {
  for (let i = 0; i < currentTetromino.length; i++) {
      for (let j = 0; j < currentTetromino[i].length; j++) {
          if (
              currentTetromino[i][j] !== 0 &&
              (currentCol + j + 1 >= cols || grid[currentRow + i] && grid[currentRow + i][currentCol + j + 1] !== 0)
          ) {
              return false; // Cannot move right
          }
      }
  }
  return true; // Can move right
}

function canMoveLeft() {
  for (let i = 0; i < currentTetromino.length; i++) {
      for (let j = 0; j < currentTetromino[i].length; j++) {
          if (
              currentTetromino[i][j] !== 0 &&
              (currentCol + j - 1 < 0 || grid[currentRow + i] && grid[currentRow + i][currentCol + j - 1] !== 0)
          ) {
              return false; // Cannot move left
          }
      }
  }
  return true; // Can move left
}



function rotateMatrix(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = Array.from({ length: cols }, () => Array(rows).fill(0));

  for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
          result[j][rows - 1 - i] = matrix[i][j];
      }
      const originalShape = currentTetromino; 
      currentTetromino = result;
      if(collides()) {
        currentTetromino = originalShape
      }
  }

}


function canRotate() {
  const rotatedShape = rotateMatrix(currentTetromino);
  for (let i = 0; i < rotatedShape.length; i++) {
      for (let j = 0; j < rotatedShape[i].length; j++) {
          if (
              rotatedShape[i][j] !== 0 &&
              (currentCol + j < 0 ||
                  currentCol + j >= cols ||
                  currentRow + i >= rows ||
                  grid[currentRow + i] && grid[currentRow + i][currentCol + j] !== 0)
          ) {
              return false; // Cannot rotate
          }
      }
  }
  return true; // Can rotate
}




function moveLeft( ) {

  currentCol--;
  if(collides()) {
    currentCol++;
  }

}



function moveRight(params) {
 
  currentCol++;

  if(collides()) {
    currentCol--;
  }
  

}



function moveDown() {

  if(canMoveDown()) {
  currentRow++;
  return true
  }
  
  return false;
}






function keyPressed() {


  if(keyCode == LEFT_ARROW && canMoveLeft()) {
    moveLeft()
  }

  else if(keyCode == RIGHT_ARROW && canMoveRight()) {
    moveRight()
  }

  else if (keyCode == DOWN_ARROW) {
    moveDown();
    keyDown = true;

  }

  else if(keyCode == UP_ARROW && canRotate()) {
    rotateMatrix(currentTetromino)
  }

  else if(keyCode == 32) {
    grid = createEmptyGrid()
    score = 0;
    speed = 10
    loop();
  }

}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
      keyDown = false;
  }
}


function addToGrid() {
  // Add the Tetromino to the grid
  for (let i = 0; i < currentTetromino.length; i++) {
      for (let j = 0; j < currentTetromino[i].length; j++) {
          if (currentTetromino[i][j] !== 0) {
              grid[currentRow + i][currentCol + j] = 1;
          }
      }
  }
}



function clearRows() {
  for (let i = rows - 1; i >= 0; i--) {
      if (rowIsFull(i)) {
          clearRow(i);
          shiftRowsDown(i);
          score += 10;
          speed = floor(speed/1.2);
      }
  }
}

function rowIsFull(row) {
  for (let j = 0; j < cols; j++) {
      if (grid[row][j] === 0) {
          return false;
      }
  }
  return true;
}



function clearRow(row) {
  for (let j = 0; j < cols; j++) {
      grid[row][j] = 0;
  }
}

function shiftRowsDown(startRow) {
  for (let i = startRow; i >= 1; i--) {
      for (let j = 0; j < cols; j++) {
          grid[i][j] = grid[i - 1][j];
      }
  }
  grid[0] = Array(cols).fill(0);
}


function isGameOver() {
  // Check if the new Tetromino immediately collides with existing blocks
  for (let i = 0; i < currentTetromino.length; i++) {
      for (let j = 0; j < currentTetromino[i].length; j++) {
          if (
              currentTetromino[i][j] !== 0 &&
              grid[currentRow + i] &&
              grid[currentRow + i][currentCol + j] !== 0
          ) {
              return true; // Game over
          }
      }
  }

  return false;
}


function draw(params) {
  background(0)
  drawGrid();
  drawTetromino();
  textSize(20)

  text(` Score : ${score}` , 200, 30)

  if (frameCount % speed === 0 && !keyDown) {
    if (!moveDown()) {
        // If the Tetromino has landed, spawn a new one

        if(isGameOver()) {
          textSize(20)
          text('Game over press space ' , 30, 300)
          noLoop();
        } 

        else {
        addToGrid()
        clearRows()
        spawnTetromino()
        }
    }

    console.log(isGameOver())

}
 
}
