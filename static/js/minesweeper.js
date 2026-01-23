// Minesweeper Game
const gameBoard = document.getElementById('gameBoard');
const minesLeftElement = document.getElementById('minesLeft');
const timerElement = document.getElementById('timer');
const difficultySelect = document.getElementById('difficulty');
const gameResultDiv = document.getElementById('gameResult');
const resultTextElement = document.getElementById('resultText');

let board = [];
let revealed = [];
let flagged = [];
let gameActive = false;
let gameWon = false;
let timer = 0;
let timerInterval = null;

const difficulties = {
    easy: { rows: 8, cols: 8, mines: 10 },
    medium: { rows: 12, cols: 12, mines: 25 },
    hard: { rows: 16, cols: 16, mines: 40 }
};

let currentDifficulty = difficulties.medium;

function getDifficulty() {
    const diff = difficultySelect.value;
    return difficulties[diff];
}

function createBoard() {
    currentDifficulty = getDifficulty();
    const { rows, cols, mines } = currentDifficulty;
    
    board = Array(rows).fill().map(() => Array(cols).fill(0));
    revealed = Array(rows).fill().map(() => Array(cols).fill(false));
    flagged = Array(rows).fill().map(() => Array(cols).fill(false));
    
    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (board[row][col] !== -1) {
            board[row][col] = -1;
            minesPlaced++;
        }
    }
    
    // Calculate numbers
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] !== -1) {
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] === -1) {
                            count++;
                        }
                    }
                }
                board[r][c] = count;
            }
        }
    }
}

function createBoardHTML() {
    const { rows, cols } = currentDifficulty;
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gameBoard.innerHTML = '';
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.className = 'minesweeper-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', (e) => handleCellClick(r, c, e));
            cell.addEventListener('contextmenu', (e) => handleRightClick(r, c, e));
            gameBoard.appendChild(cell);
        }
    }
    updateDisplay();
}

function handleCellClick(row, col, e) {
    e.preventDefault();
    if (!gameActive || flagged[row][col] || revealed[row][col]) return;
    
    if (!gameActive) {
        startGame();
    }
    
    revealCell(row, col);
    updateDisplay();
    checkWin();
}

function handleRightClick(row, col, e) {
    e.preventDefault();
    if (!gameActive || revealed[row][col]) return;
    
    flagged[row][col] = !flagged[row][col];
    updateDisplay();
    checkWin();
}

function revealCell(row, col) {
    if (revealed[row][col] || flagged[row][col]) return;
    
    revealed[row][col] = true;
    
    if (board[row][col] === -1) {
        gameOver();
        return;
    }
    
    if (board[row][col] === 0) {
        const { rows, cols } = currentDifficulty;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !revealed[nr][nc]) {
                    revealCell(nr, nc);
                }
            }
        }
    }
}

function updateDisplay() {
    const { rows, cols, mines } = currentDifficulty;
    const cells = gameBoard.querySelectorAll('.minesweeper-cell');
    
    let flaggedCount = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (flagged[r][c]) flaggedCount++;
        }
    }
    
    minesLeftElement.textContent = mines - flaggedCount;
    
    cells.forEach((cell, index) => {
        const r = Math.floor(index / cols);
        const c = index % cols;
        
        cell.textContent = '';
        cell.className = 'minesweeper-cell';
        
        if (flagged[r][c]) {
            cell.textContent = '🚩';
            cell.classList.add('flagged');
        } else if (revealed[r][c]) {
            cell.classList.add('revealed');
            if (board[r][c] === -1) {
                cell.textContent = '💣';
                cell.classList.add('mine');
            } else if (board[r][c] > 0) {
                cell.textContent = board[r][c];
                cell.style.color = getNumberColor(board[r][c]);
            }
        }
    });
}

function getNumberColor(num) {
    const colors = [
        '', '#0000ff', '#008000', '#ff0000', '#000080',
        '#800000', '#008080', '#000000', '#808080'
    ];
    return colors[num] || '#000';
}

function checkWin() {
    const { rows, cols, mines } = currentDifficulty;
    let revealedCount = 0;
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (revealed[r][c]) revealedCount++;
        }
    }
    
    if (revealedCount === rows * cols - mines) {
        gameWon = true;
        gameActive = false;
        clearInterval(timerInterval);
        resultTextElement.textContent = `🎉 You Win! Time: ${timer}s`;
        resultTextElement.style.color = 'var(--success-color)';
        gameResultDiv.style.display = 'block';
        
        // Save score if user is logged in (lower time = higher score)
        if (typeof saveGameScore === 'function') {
            const score = Math.max(0, 10000 - (timer * 10));
            saveGameScore('minesweeper', score);
        }
    }
}

function gameOver() {
    gameActive = false;
    gameWon = false;
    clearInterval(timerInterval);
    
    // Reveal all mines
    const { rows, cols } = currentDifficulty;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === -1) {
                revealed[r][c] = true;
            }
        }
    }
    
    updateDisplay();
    resultTextElement.textContent = '💣 Game Over! You hit a mine!';
    resultTextElement.style.color = 'var(--error-color)';
    gameResultDiv.style.display = 'block';
}

function startTimer() {
    timer = 0;
    timerInterval = setInterval(() => {
        timer++;
        timerElement.textContent = timer;
    }, 1000);
}

function startNewGame() {
    gameActive = true;
    gameWon = false;
    timer = 0;
    clearInterval(timerInterval);
    gameResultDiv.style.display = 'none';
    
    createBoard();
    createBoardHTML();
    startTimer();
}

// Add CSS
const style = document.createElement('style');
style.textContent = `
    .minesweeper-cell {
        width: 30px;
        height: 30px;
        background: var(--bg-hover);
        border: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 0.9rem;
        cursor: pointer;
        user-select: none;
        transition: all 0.2s;
    }
    
    .minesweeper-cell:hover:not(.revealed):not(.flagged) {
        background: var(--border-color);
    }
    
    .minesweeper-cell.revealed {
        background: var(--bg-dark);
        cursor: default;
    }
    
    .minesweeper-cell.flagged {
        background: rgba(239, 68, 68, 0.2);
    }
    
    .minesweeper-cell.mine {
        background: rgba(239, 68, 68, 0.3);
    }
    
    @media (max-width: 768px) {
        .minesweeper-cell {
            width: 25px;
            height: 25px;
            font-size: 0.8rem;
        }
    }
`;
document.head.appendChild(style);

// Initialize
startNewGame();

