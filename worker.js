const createGrid = (rows, cols) => {
  const grid = new Array(rows);
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols).fill(false);
  }
  return grid;
};

const countNeighbors = (grid, x, y) => {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const xi = (x + i + rows) % rows;
      const yj = (y + j + cols) % cols;
      count += grid[xi][yj];
    }
  }
  return count;
};

const updateGrid = (grid) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = createGrid(rows, cols);

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      const aliveNeighbors = countNeighbors(grid, x, y);
      const cell = grid[x][y];
      if (cell === 1 && (aliveNeighbors === 2 || aliveNeighbors === 3)) {
        newGrid[x][y] = true;
      } else if (cell === 0 && aliveNeighbors === 3) {
        newGrid[x][y] = true;
      } else {
        newGrid[x][y] = false;
      }
    }
  }
  return newGrid;
};
self.onmessage = function (e) {
  const grid = e.data.grid;
  // Assuming updateGrid function is defined here similar to the above implementation
  const newGrid = updateGrid(grid);
  self.postMessage({ newGrid });
};
