// Popup Elements
const popupEl = document.getElementById('popup');
const gameMessageEl = document.getElementById('gameMessage');
const scoreEl = document.getElementById('score');
const resetBtn = document.getElementById('resetBtn');

// Minesweeper
const minesweeperEl = document.getElementById('minesweeper');
const difficultyEl = document.getElementById('difficulty');

let difficulty;
let flagRemaining;
let time;
let rows;

const difficulties = {
  // Also add box sizes in pixel
  easy: {
    rowCount: 8,
    colCount: 10,
    mineCount: 10,
    squareSize: 60, // px
  },
  medium: {
    rowCount: 14,
    colCount: 18,
    mineCount: 40,
    squareSize: 45, // px
  },
  hard: {
    rowCount: 20,
    colCount: 24,
    mineCount: 100,
    squareSize: 33, // px
  },
};

const [WON, CONTINUE, LOST] = ['won', 'continue', 'lost'];

// Game
function initializeGame() {
  difficulty = difficulties[difficultyEl.value];
  flagRemaining = difficulty.mineCount;
  time = 0;

  fillBoard();
}

function fillBoard() {
  const { rowCount, colCount, squareSize } = difficulty;
  minesweeperEl.innerHTML = ''; // clear board first
  for (let i = 0; i < rowCount; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let j = 0; j < colCount; j++) {
      const square = document.createElement('div');
      square.className = 'square';
      square.style.height = `${squareSize}px`;
      square.style.width = `${squareSize}px`;
      row.appendChild(square);
    }

    minesweeperEl.appendChild(row);
  }
}

function update() {
  if (gameStatus === CONTINUE) {
  } else {
    showEndGame();
  }
}

function showEndGame() {
  gameMessageEl.innerText = `You ${gameStatus}!`;
  scoreEl.innerText = score;
  popupEl.classList.remove('hide');
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case RIGHT:
      player.dx = player.speed;
      break;
    case LEFT:
      player.dx = -player.speed;
      break;
  }
});

document.addEventListener('keyup', (e) => {
  player.dx = 0;
});

resetBtn.addEventListener('click', () => {
  popupEl.classList.add('hide');
  initializeGame();
});

difficultyEl.addEventListener('change', initializeGame);

initializeGame();
