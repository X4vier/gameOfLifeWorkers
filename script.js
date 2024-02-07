const size = 12000;

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

const noWorkerStartTime = Date.now();
let grid = createGrid(size, size);
grid = updateGrid(grid);
console.log(`without worker it took: ${Date.now() - noWorkerStartTime}ms`);

const withWorkersStartTime = Date.now();

let workerGrid = createGrid(size, size);

const worker1 = new Worker("worker.js");
const worker2 = new Worker("worker.js");

let numWorkersFinished = 0;

const subgrid1 = grid.slice(0, size / 2);
worker1.onmessage = function (e) {
  const newGrid = e.data.newGrid;
  console.log("Worker done!");
  numWorkersFinished += 1;

  if (numWorkersFinished == 2) {
    console.log(
      `With workers, it took: ${Date.now() - withWorkersStartTime}ms`
    );
  }
};
worker1.postMessage({ grid: subgrid1 });
console.log("Posted message to worker 1");

const subgrid2 = grid.slice(0, size / 2);
worker2.onmessage = function (e) {
  const newGrid = e.data.newGrid;
  console.log("Worker done!");
  numWorkersFinished += 1;

  if (numWorkersFinished == 2) {
    console.log(
      `With workers, it took: ${Date.now() - withWorkersStartTime}ms`
    );
  }
};
worker2.postMessage({ grid: subgrid2 });
console.log("Posted message to worker 2");
