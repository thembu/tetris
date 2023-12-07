
const rows = 20;
const cols =  10;
const blocksize = 30;
let grid;
let tetromino;
let keyDown = false;
let score = 0;
let speed = 10;

function setup () {
  stroke(128,128,128); 
  grid  = createEmptyGrid();
  createCanvas(600,700);
  tetromino = new Pieces() 
  tetromino.spawnTetromino()
  

}


function draw() {
  background(0)
  drawGrid()
  tetromino.drawTetromino()
  tetromino.update()

}


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
  
  


function Pieces() {
  this.tetrominoes = [
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



  this.currentTetromino;
  this.currentRow;
  this.currentCol;
  this.width;
  
  
  this.drawTetromino = function (params) {
    if(this.currentTetromino) {
    
      for (let i = 0; i < this.currentTetromino.length; i++) {
          for (let j = 0; j < this.currentTetromino[i].length; j++) {
         
             if(this.currentTetromino[i][j] != 0) {
              rect(
                (this.currentCol + j) * blocksize,
                (this.currentRow+ i) *blocksize,
                blocksize,
                blocksize
                )
             }
  
             this.width = (this.currentCol + j) * blocksize;
  
  
         }      
      }
  
  
    }
  }


  this.spawnTetromino = function() {
    let  color = getRandomColor()


    fill(color)
  
    const randomIndex = floor(random(this.tetrominoes.length))
    this.currentTetromino = this.tetrominoes[randomIndex];
  
  
    //set initial position
  
    this.currentRow  = 0 ;
  
    this.currentCol = floor(cols/2) - floor(this.currentTetromino[0].length/2)

  
  }


  this.collides = function() {
    for (let i = 0; i < this.currentTetromino.length; i++) {
      for (let j = 0; j < this.currentTetromino[i].length; j++) {
          // Check if the current cell of the Tetris piece is filled (not equal to 0)
          if (
              this.currentTetromino[i][j] !== 0 &&
              (grid[this.currentRow + i] && grid[this.currentRow + i][this.currentCol + j] !== 0)
          ) {
              return true; // Collision detected
          }
      }
  }
  return false; // No collision
  }


  this.canMoveDown = function() {
    for (let i = 0; i < this.currentTetromino.length; i++) {
      for (let j = 0; j < this.currentTetromino[i].length; j++) {
          if (
              this.currentTetromino[i][j] !== 0 &&
              (this.currentRow + i + 1 >= rows || grid[this.currentRow + i + 1] && grid[this.currentRow + i + 1][this.currentCol + j] !== 0)
          ) {
              return false; // Cannot move down
          }
      }
  }
  return true; // Can move down

  }

  this.canMoveRight = function() {
    for (let i = 0; i < this.currentTetromino.length; i++) {
      for (let j = 0; j < this.currentTetromino[i].length; j++) {
          if (
              this.currentTetromino[i][j] !== 0 &&
              (this.currentCol + j + 1 >= cols || grid[this.currentRow + i ] && grid[this.currentRow + i][this.currentCol + j + 1] !== 0)
          ) {
              return false; // Cannot move down
          }
      }
  }
  return true; // Can move down


  }

  this.canMoveLeft = function() {

    for (let i = 0; i < this.currentTetromino.length; i++) {
      for (let j = 0; j < this.currentTetromino[i].length; j++) {
          if (
              this.currentTetromino[i][j] !== 0 &&
              (this.currentCol + j - 1 < 0 || grid[this.currentRow + i] && grid[this.currentRow + i][this.currentCol + j - 1] !== 0)
          ) {
              return false; // Cannot move down
          }
      }
  }
  return true; // Can move down

  }


  this.rotateMatrix = function(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = Array.from({ length: cols }, () => Array(rows).fill(0));
  
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            result[j][rows - 1 - i] = matrix[i][j];
        }
        const originalShape = this.currentTetromino; 
        this.currentTetromino = result;
        if(this.collides()) {
          this.currentTetromino = originalShape
        }
    }
  
  }


  this.canRotate = function() {
    const rotatedShape = this.rotateMatrix(this.currentTetromino);
    for (let i = 0; i < rotatedShape.length; i++) {
        for (let j = 0; j < rotatedShape[i].length; j++) {
            if (
                rotatedShape[i][j] !== 0 &&
                (this.currentCol + j < 0 ||
                    this.currentCol + j >= cols ||
                    this.currentRow + i >= rows ||
                    grid[this.currentRow + i] && grid[this.currentRow + i][this.currentCol + j] !== 0)
            ) {
                return false; // Cannot rotate
            }
        }
    }
    return true; // Can rotate

  }

  this.moveLeft = function() {
    this.currentCol--;
    if(this.collides()) {
      this.currentCol++;
    }
  
  }

  this.moveRight = function() {
    this.currentCol++;

    if(this.collides()) {
      this.currentCol--;
    }
  
  }

  this.moveDown = function() {
    if(this.canMoveDown()) {
      this.currentRow++;
      return true
      }
      
      return false;
    
   }

   this.addToGrid = function() {
      // Add the Tetromino to the grid
  for (let i = 0; i < this.currentTetromino.length; i++) {
    for (let j = 0; j < this.currentTetromino[i].length; j++) {
        if (this.currentTetromino[i][j] !== 0) {
            grid[this.currentRow + i][this.currentCol + j] = 1;
        }
    }
}
   }

this.clearRows = function() {
  for (let i = rows - 1; i >= 0; i--) {
      if (this.rowIsFull(i)) {
          this.clearRow(i);
          this.shiftRowsDown(i);
          score += 10;
          speed = floor(speed/1.2);
      }
  }
}


this.rowIsFull = function(row) {
  for (let j = 0; j < cols; j++) {
    if (grid[row][j] === 0) {
        return false;
    }
}
return true;

}

this.clearRow = function(row) {
    for (let j = 0; j < cols; j++) {
        grid[row][j] = 0;
    }
  
}

 this.shiftRowsDown = function(startRow) {
  for (let i = startRow; i >= 1; i--) {
      for (let j = 0; j < cols; j++) {
          grid[i][j] = grid[i - 1][j];
      }
  }
  grid[0] = Array(cols).fill(0);
}



  

this.isGameOver = function() {
  for (let i = 0; i < this.currentTetromino.length; i++) {
    for (let j = 0; j < this.currentTetromino[i].length; j++) {
        if (
            this.currentTetromino[i][j] !== 0 &&
            grid[this.currentRow + i] &&
            grid[this.currentRow + i][this.currentCol + j] !== 0
        ) {
            return true; // Game over
        }
    }
}

return false;

}

this.update = function() {
  textSize(20)

  text(` Score : ${score}` , 200, 30)

  if (frameCount % speed === 0 && !keyDown) {
    if (!this.moveDown()) {
        // If the Tetromino has landed, spawn a new one
        
        if(this.isGameOver()) {
          textSize(20)
          text('Game over press space ' , 30, 300)
          noLoop();
        } 

        else {
        this.addToGrid()
        this.clearRows()
        tetromino.spawnTetromino()

        }

    }


}

}
}

  
  function keyPressed() {


    if(keyCode == LEFT_ARROW && tetromino.canMoveLeft()) {
      tetromino.moveLeft()
    }
  
    else if(keyCode == RIGHT_ARROW && tetromino.canMoveRight()) {
      tetromino.moveRight()
    }
  
    else if (keyCode == DOWN_ARROW) {
      tetromino.moveDown();
      keyDown = true;
  
    }
  
    else if(keyCode == UP_ARROW && tetromino.canRotate()) {
      tetromino.rotateMatrix(tetromino.currentTetromino)
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
  