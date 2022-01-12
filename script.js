// Popup Elements
const popupEl = document.getElementById('popup');
const gameMessageEl = document.getElementById('gameMessage');
const scoreEl = document.getElementById('score');
const resetBtn = document.getElementById('resetBtn');

// Minesweeper
const minesweeperEl = document.getElementById('minesweeper');
const difficultyEl = document.getElementById('difficulty');
const flagCountEl = document.getElementById('flagCount');
const clockEl = document.getElementById('clock');
const flagHtml = '<i class="fas fa-flag fa-2x"></i>';
const tick = 1000; // ms

let difficulty;
let gameActive;
let flagRemaining;
let interval;
let time;
let rows;

const difficulties = {
  // Also add box sizes in pixel
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
    squareSize: 45, // px
    fontSize: 18, //px
  },
  hard: {
    rowCount: 20,
    colCount: 24,
    mineCount: 100,
    squareSize: 33, // px
    fontSize: 13, //px
  },
};

const [WON, CONTINUE, LOST] = ['won', 'continue', 'lost'];

// Game
function initializeGame() {
  difficulty = difficulties[difficultyEl.value];
  gameActive = false;
  flagRemaining = difficulty.mineCount;
  clearInterval(interval);
  time = 0;

  fillBoard();
}

function clickSquare(e) {
  const square = e.target.tagName === 'DIV' ? e.target : e.target.parentNode;
  if (square.classList.contains('active') || square.innerHTML !== '') return;

  const row = parseInt(square.getAttribute('row'));
  const col = parseInt(square.getAttribute('col'));
  square.classList.add('active');

  if (!gameActive) {
    gameActive = true;
    placeMines();
  }

  checkGameStatus();
}

function placeFlag(e) {
  e.preventDefault();
  const square = e.target.tagName === 'DIV' ? e.target : e.target.parentNode;
  if (square.classList.contains('active')) return;

  const row = parseInt(square.getAttribute('row'));
  const col = parseInt(square.getAttribute('col'));
  if (square.innerHTML === '') {
    // place flag
    square.innerHTML = flagHtml;
    flagRemaining--;
  } else {
    // remove flag
    square.innerHTML = '';
    flagRemaining++;
  }

  flagCountEl.innerText = flagRemaining;
  checkGameStatus();
}

function placeMines() {
  interval = setInterval(() => {
    time += tick;
    updateClock();
  }, tick);
  console.log('placed mines');
}

function checkGameStatus() {
  console.log('test');
}

function updateClock() {
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

      row.appendChild(square);
    }
    minesweeperEl.appendChild(row);
  }
  rows = minesweeperEl.querySelectorAll('.row');
}

function showEndGame() {
  gameMessageEl.innerText = `You ${gameStatus}!`;
  scoreEl.innerText = score;
  popupEl.classList.remove('hide');
}

minesweeperEl.addEventListener('click', clickSquare); // left click
minesweeperEl.addEventListener('contextmenu', placeFlag); // right click
difficultyEl.addEventListener('change', initializeGame); // change difficulty and reset game

resetBtn.addEventListener('click', () => {
  popupEl.classList.add('hide');
  initializeGame();
});

initializeGame();
