const game = document.querySelector('#mosaic-game-grid');
const colorInput = document.querySelector('#block-background-color');
const borderInput = document.querySelector('#border-color');
const startGame = document.querySelector('#new-game-btn');
const blockNumberWrapper = document.querySelector('.blocks-number');

const MAXROWS = 400;
const MAXCOLS = 256;
const MIN_NUMBER_BLOCKS = 9;
const MAX_NUMBER_BLOCKS = 40000;
const MAX_WIDTH = 3;
const MAX_HEIGHT = 3;

const _arr = [];
let countBlocks = 0;
let gridParm = [];

const BITS_IN_FOUR_BYTES = 32;

const setRact = (startRow, startCol, finishRow, finishCol) => {
  for (let i = startRow; i <= finishRow; i++) {
    for (let j = startCol; j <= finishCol; j++) {
      set(i, j);
    }
  }
}

const initArr = () => {
  for (let i = 0; i < MAXROWS; i++) {
    _arr[i] = [0, 0, 0, 0, 0, 0, 0, 0];
  }
  gridParm = [];
  countBlocks = 0;
}

const get = (i, j) => {
  if (i >= MAXROWS || j >= MAXCOLS) {
    return 1;
  }

  const row = _arr[i];
  const byteNum = Math.floor(j / BITS_IN_FOUR_BYTES);
  const byte = row[byteNum];
  const offset = j % BITS_IN_FOUR_BYTES;
  const shifted = byte >> offset;
  return shifted & 1;
}

const set = (i, j) => {
  if (i >= MAXROWS || j >= MAXCOLS) {
    return;
  }
  const byteNum = Math.floor(j / BITS_IN_FOUR_BYTES);
  const offset = j % BITS_IN_FOUR_BYTES;
  const comp = 1 << offset;
  _arr[i][byteNum] = _arr[i][byteNum] | comp;
}

const randomIntFromInterval= (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const nextOccupiedCol = (row, col) => {
  for (let j = col + 1; j < MAXCOLS; j++) {
    if (get(row, j) === 1) {
      return j;
    }
  }
  return MAXCOLS-1;
}

const nextRandomCol = (row, col) => {
  const nextCol = nextOccupiedCol(row, col);
  let randomCol = randomIntFromInterval(col + 1, nextCol);
  while (randomCol - col > MAXCOLS / MAX_WIDTH) {
    randomCol = randomIntFromInterval(col + 1, nextCol);
  }
  return randomCol;
}

const nextOccupiedRow = (row, col, nextCol) => {
  for (let i = row + 1; row < MAXROWS; row++) {
    for (let j = col; j <= nextCol; j++) {
      if (get(i, j) === 1) {
        return i;
      }
    }
  }
  return MAXROWS;
}

const nextRandomRow = (row, col, nextCol) => {
  const nextRow = nextOccupiedRow(row, col, nextCol);
  let randomRow = randomIntFromInterval(row + 1, nextRow);
  while (randomRow - row > MAXROWS / MAX_HEIGHT) {
    randomRow = randomIntFromInterval(row + 1, nextRow);
  }
  return randomRow;
}

const makeDiv = (rowStart, columnStart, rowEnd, columnEnd) => {
  countBlocks++;
  setRact(rowStart, columnStart, rowEnd, columnEnd);
  gridParm.push({
    columnStart: columnStart + 1,
    columnEnd: columnEnd + 1,
    rowStart: rowStart + 1,
    rowEnd: rowEnd + 1
  });
}

const play = () => {
  for (let i = 0; i < MAXROWS-1; i++) {
    for (let j = 0; j < MAXCOLS-1; j++) {
      if (get(i, j) === 0) {
        const nextCol = nextRandomCol(i, j);
        const nextRow = nextRandomRow(i, j, nextCol);
        makeDiv(
          i, j,
          nextRow, nextCol
        );
      }
    }
  }
  if (countBlocks < MIN_NUMBER_BLOCKS || countBlocks > MAX_NUMBER_BLOCKS) {
    play();
  }
}

window.addEventListener('load', playMosaic);
startGame.addEventListener('click', playMosaic);

function playMosaic() {
  initArr();
  play();

  while (game.firstChild) {
    game.removeChild(game.firstChild);
  }
  blockNumberWrapper.innerText = `Blocks number: ${countBlocks}`;
  game.style['grid-template-rows'] = `repeat(${MAXROWS}, 1fr)`;
  game.style['grid-template-columns'] = `repeat(${MAXCOLS}, 1fr)`;
  game.style['place-items'] = 'stretch';
  gridParm.forEach( grid => {
    const div = document.createElement('div');
    div.className = 'block';
    div.style['grid-column-start'] = grid.columnStart;
    div.style['grid-column-end'] = grid.columnEnd;
    div.style['grid-row-start'] = grid.rowStart
    div.style['grid-row-end'] = grid.rowEnd;
    game.append(div);
  });
}

let selected;

game.addEventListener('click', e => {
  if (e.target.className === 'block' || e.target.className === 'block block-active') {
    e.target.classList.add('block-active');
    e.target.style.backgroundColor = colorInput.value;
    activeBlock(e.target);
  }
});

function activeBlock(block) {
  if (selected) {
    selected.classList.remove('block-active');
  }
  selected = block;
  selected.classList.add('block-active');
}

borderInput.addEventListener('change', () => {
  game.style.borderColor = borderInput.value;
});

colorInput.addEventListener('change', () => {
  if (selected) {
    selected.style.backgroundColor = colorInput.value;
  }
});