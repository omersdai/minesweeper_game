// Popup Elements
const popupEl = document.getElementById('popup');
const gameMessageEl = document.getElementById('gameMessage');
const timeScoreEl = document.getElementById('timeScore');
const mineScoreEl = document.getElementById('mineScore');
const resetBtn = document.getElementById('resetBtn');
const closeBtn = document.getElementById('closeBtn');

// Minesweeper
const minesweeperEl = document.getElementById('minesweeper');
const difficultyEl = document.getElementById('difficulty');
const flagCountEl = document.getElementById('flagCount');
const clockEl = document.getElementById('clock');

const flagHtml = '<i class="fas fa-flag fa-2x"></i>';
const mineHtml = '<i class="fas fa-bomb fa-2x"></i>';
const crossHtml = '<i class="fas fa-times fa-2x"></i>';
const tick = 1000; // ms

let difficulty;
let minePlaced;
let gameEnded;
let flagRemaining;
let interval;
let time;
let squares;
let squareCount;
let cleanSquares;
let activeSquares;
let flaggedSquares;
let minedSquares;

const difficulties = {
  easy: {
    rowCount: 8,
    colCount: 10,
    mineCount: 10,
    squareSize: 60, // px
    fontSize: 20, //px
  },
  medium: {
    rowCount: 14,
    colCount: 18,
    mineCount: 40,
    squareSize: 40, // px
    fontSize: 15, //px
  },
  hard: {
    rowCount: 18,
    colCount: 26,
    mineCount: 100,
    squareSize: 33, // px
    fontSize: 13, //px
  },
};

// Game
function initializeGame() {
  difficulty = difficulties[difficultyEl.value];
  minePlaced = false;
  gameEnded = false;
  flagRemaining = difficulty.mineCount;
  clearInterval(interval);
  time = 0;
  cleanSquares = new Set();
  activeSquares = new Set();
  flaggedSquares = new Set();
  minedSquares = new Set();

  flagCountEl.innerText = flagRemaining;
  clockEl.innerText = '0:00';

  fillBoard();
}

function clickSquare(e) {
  const square = e.target.tagName === 'DIV' ? e.target : e.target.parentNode;
  if (gameEnded || activeSquares.has(square) || square.innerHTML !== '') return;

  const row = parseInt(square.getAttribute('row'));
  const col = parseInt(square.getAttribute('col'));

  if (!minePlaced) {
    minePlaced = true;
    startGame(square);
  }

  if (minedSquares.has(square)) {
    endGame('lost');
  } else {
    activateSquare(square);
    if (activeSquares.size + difficulty.mineCount === squareCount) {
      endGame('won');
    }
  }
}

function placeFlag(e) {
  e.preventDefault();
  const square = e.target.tagName === 'DIV' ? e.target : e.target.parentNode;
  if (gameEnded || activeSquares.has(square)) return;

  const row = parseInt(square.getAttribute('row'));
  const col = parseInt(square.getAttribute('col'));
  if (square.innerHTML === '') {
    // place flag
    flagRemaining--;
    flaggedSquares.add(square);
    square.innerHTML = flagHtml;
  } else {
    // remove flag
    flagRemaining++;
    flaggedSquares.delete(square);
    square.innerHTML = '';
  }

  flagCountEl.innerText = flagRemaining;
}

function activateSquare(square) {
  if (gameEnded || activeSquares.has(square)) return;

  activeSquares.add(square);
  square.classList.add('active');
  const row = parseInt(square.getAttribute('row'));
  const col = parseInt(square.getAttribute('col'));

  const neighbors = getNeighbors(square);
  let mineCount = neighbors.reduce(
    (count, neighbor) => (minedSquares.has(neighbor) ? count + 1 : count),
    0
  );

  if (mineCount === 0) {
    neighbors.forEach((neighbor) => activateSquare(neighbor));
    square.innerHTML = '';
  } else {
    square.innerText = mineCount;
  }
}

function startGame(square) {
  //activate clock
  interval = setInterval(updateClock, tick);

  //place mines
  const { mineCount } = difficulty;
  getNeighbors(square).forEach((s) => cleanSquares.delete(s)); // first click cannot contain a mine

  for (let i = 0; i < mineCount; i++) {
    const square = getRandomSetElement(cleanSquares);
    cleanSquares.delete(square);
    minedSquares.add(square);
  }
}

function updateClock() {
  time += tick;
  const seconds = parseInt(time / 1000) % 60;
  const minutes = parseInt(time / (1000 * 60));
  clockEl.innerText = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function fillBoard() {
  const { rowCount, colCount, squareSize, fontSize } = difficulty;
  minesweeperEl.innerHTML = ''; // clear board first
  minesweeperEl.style.fontSize = `${fontSize}px`;
  for (let i = 0; i < rowCount; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let j = 0; j < colCount; j++) {
      const square = document.createElement('div');
      square.className = 'square';
      if ((i + j) % 2 === 1) square.classList.add('dark');
      square.style.height = `${squareSize}px`;
      square.style.width = `${squareSize}px`;
      square.setAttribute('row', i);
      square.setAttribute('col', j);

      cleanSquares.add(square);
      row.appendChild(square);
    }
    minesweeperEl.appendChild(row);
  }
  squares = Array.from(minesweeperEl.querySelectorAll('.row')).map((row) =>
    row.querySelectorAll('.square')
  );

  squareCount = rowCount * colCount;
}

function endGame(result) {
  gameEnded = true;
  clearInterval(interval); // stop clock
  for (square of minedSquares) {
    if (square.innerHTML === '') square.innerHTML = mineHtml;
  }
  let mineScore = 0;
  for (square of flaggedSquares) {
    if (!minedSquares.has(square)) square.innerHTML = crossHtml;
    else mineScore++;
  }

  gameMessageEl.innerText = `You ${result}!`;

  const seconds = parseInt(time / 1000) % 60;
  const minutes = parseInt(time / (1000 * 60));
  timeScoreEl.innerText = `${minutes}:${
    seconds < 10 ? '0' + seconds : seconds
  }`;

  mineScoreEl.innerText = `${
    result === 'won' ? difficulty.mineCount : mineScore
  }/${difficulty.mineCount}`;

  popupEl.classList.remove('hide');
}

function getNeighbors(square) {
  const { rowCount, colCount } = difficulty;
  const row = parseInt(square.getAttribute('row'));
  const col = parseInt(square.getAttribute('col'));
  const rowStart = Math.max(0, row - 1),
    rowEnd = Math.min(rowCount - 1, row + 1);
  const colStart = Math.max(0, col - 1),
    colEnd = Math.min(colCount - 1, col + 1);
  let neighbors = [];
  for (let i = rowStart; i <= rowEnd; i++) {
    for (let j = colStart; j <= colEnd; j++) {
      neighbors.push(squares[i][j]);
    }
  }

  return neighbors;
}

function getRandomSetElement(set) {
  const idx = Math.floor(Math.random() * set.size);
  let i = 0;
  for (let element of set) {
    if (idx === i++) return element;
  }
}

minesweeperEl.addEventListener('click', clickSquare); // left click
minesweeperEl.addEventListener('contextmenu', placeFlag); // right click
difficultyEl.addEventListener('change', initializeGame); // change difficulty and reset game
resetBtn.addEventListener('click', () => {
  popupEl.classList.add('hide');
  initializeGame();
});
closeBtn.addEventListener('click', () => popupEl.classList.add('hide'));

initializeGame();
