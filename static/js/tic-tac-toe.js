// Tic-Tac-Toe Game
const gameBoard = document.getElementById('gameBoard');
const currentPlayerElement = document.getElementById('currentPlayer');
const scoreElement = document.getElementById('score');
const resetBtn = document.getElementById('resetBtn');
const gameResultDiv = document.getElementById('gameResult');
const resultTextElement = document.getElementById('resultText');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let scores = { X: 0, O: 0, ties: 0 };

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

function createBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'ttt-cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        gameBoard.appendChild(cell);
    }
    updateDisplay();
}

function handleCellClick(index) {
    if (board[index] !== '' || !gameActive) return;
    
    board[index] = currentPlayer;
    updateBoard();
    
    if (checkWinner()) {
        gameActive = false;
        if (currentPlayer === 'X') {
            scores.X++;
            showResult('You Win! 🎉');
            // Save score if user is logged in
            if (typeof saveGameScore === 'function') {
                saveGameScore('tic-tac-toe', scores.X);
            }
        } else {
            scores.O++;
            showResult('Computer Wins! 😔');
        }
        updateScore();
        return;
    }
    
    if (checkTie()) {
        gameActive = false;
        scores.ties++;
        showResult('It\'s a Tie! 🤝');
        updateScore();
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateDisplay();
    
    // Computer move (simple AI)
    if (currentPlayer === 'O' && gameActive) {
        setTimeout(() => {
            makeComputerMove();
        }, 500);
    }
}

function makeComputerMove() {
    // Try to win
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkWinnerForPlayer('O')) {
                board[i] = 'O';
                updateBoard();
                gameActive = false;
                scores.O++;
                showResult('Computer Wins! 😔');
                updateScore();
                return;
            }
            board[i] = '';
        }
    }
    
    // Block player
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            if (checkWinnerForPlayer('X')) {
                board[i] = 'O';
                updateBoard();
                currentPlayer = 'X';
                updateDisplay();
                return;
            }
            board[i] = '';
        }
    }
    
    // Take center
    if (board[4] === '') {
        board[4] = 'O';
        updateBoard();
        currentPlayer = 'X';
        updateDisplay();
        return;
    }
    
    // Take corner
    const corners = [0, 2, 6, 8];
    for (let corner of corners) {
        if (board[corner] === '') {
            board[corner] = 'O';
            updateBoard();
            currentPlayer = 'X';
            updateDisplay();
            return;
        }
    }
    
    // Take any available
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            updateBoard();
            currentPlayer = 'X';
            updateDisplay();
            return;
        }
    }
}

function checkWinnerForPlayer(player) {
    return winningConditions.some(condition => {
        return condition.every(index => board[index] === player);
    });
}

function checkWinner() {
    return checkWinnerForPlayer(currentPlayer);
}

function checkTie() {
    return board.every(cell => cell !== '') && !checkWinner();
}

function updateBoard() {
    const cells = gameBoard.querySelectorAll('.ttt-cell');
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
        cell.style.pointerEvents = board[index] !== '' ? 'none' : 'auto';
    });
}

function updateDisplay() {
    currentPlayerElement.textContent = currentPlayer;
}

function updateScore() {
    scoreElement.textContent = `${scores.X} - ${scores.O}`;
}

function showResult(message) {
    resultTextElement.textContent = message;
    gameResultDiv.style.display = 'block';
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    gameResultDiv.style.display = 'none';
    createBoard();
}

// Add CSS for Tic-Tac-Toe cells
const style = document.createElement('style');
style.textContent = `
    .ttt-cell {
        width: 100px;
        height: 100px;
        background: var(--bg-hover);
        border: 2px solid var(--border-color);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
        color: var(--text-primary);
    }
    
    .ttt-cell:hover {
        background: var(--border-color);
        transform: scale(1.05);
    }
    
    .ttt-cell:active {
        transform: scale(0.95);
    }
    
    @media (max-width: 768px) {
        .ttt-cell {
            width: 80px;
            height: 80px;
            font-size: 2rem;
        }
    }
`;
document.head.appendChild(style);

// Initialize game
createBoard();

