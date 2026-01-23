// 2048 Game
const gameBoard = document.getElementById('gameBoard');
const scoreElement = document.getElementById('score');
const bestElement = document.getElementById('best');
const gameWinDiv = document.getElementById('gameWin');
const gameOverDiv = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

let board = [];
let previousBoard = [];
let score = 0;
let best = localStorage.getItem('2048best') || 0;
let gameWon = false;
let gameOver = false;
let isAnimating = false;

bestElement.textContent = best;

function initBoard() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    gameWon = false;
    gameOver = false;
    gameWinDiv.style.display = 'none';
    gameOverDiv.style.display = 'none';
    addRandomTile();
    addRandomTile();
    updateDisplay();
}

function addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) {
                emptyCells.push({ r, c });
            }
        }
    }
    
    if (emptyCells.length > 0) {
        const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function moveLeft() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
        const row = board[r].filter(val => val !== 0);
        const newRow = [];
        
        for (let i = 0; i < row.length; i++) {
            if (i < row.length - 1 && row[i] === row[i + 1]) {
                newRow.push(row[i] * 2);
                score += row[i] * 2;
                i++;
                moved = true;
            } else {
                newRow.push(row[i]);
            }
        }
        
        while (newRow.length < 4) {
            newRow.push(0);
        }
        
        if (JSON.stringify(board[r]) !== JSON.stringify(newRow)) {
            moved = true;
        }
        
        board[r] = newRow;
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
        const row = board[r].filter(val => val !== 0);
        const newRow = [];
        
        for (let i = row.length - 1; i >= 0; i--) {
            if (i > 0 && row[i] === row[i - 1]) {
                newRow.unshift(row[i] * 2);
                score += row[i] * 2;
                i--;
                moved = true;
            } else {
                newRow.unshift(row[i]);
            }
        }
        
        while (newRow.length < 4) {
            newRow.unshift(0);
        }
        
        if (JSON.stringify(board[r]) !== JSON.stringify(newRow)) {
            moved = true;
        }
        
        board[r] = newRow;
    }
    return moved;
}

function moveUp() {
    let moved = false;
    for (let c = 0; c < 4; c++) {
        const column = [];
        for (let r = 0; r < 4; r++) {
            if (board[r][c] !== 0) {
                column.push(board[r][c]);
            }
        }
        
        const newColumn = [];
        for (let i = 0; i < column.length; i++) {
            if (i < column.length - 1 && column[i] === column[i + 1]) {
                newColumn.push(column[i] * 2);
                score += column[i] * 2;
                i++;
                moved = true;
            } else {
                newColumn.push(column[i]);
            }
        }
        
        while (newColumn.length < 4) {
            newColumn.push(0);
        }
        
        for (let r = 0; r < 4; r++) {
            if (board[r][c] !== newColumn[r]) {
                moved = true;
            }
            board[r][c] = newColumn[r];
        }
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let c = 0; c < 4; c++) {
        const column = [];
        for (let r = 0; r < 4; r++) {
            if (board[r][c] !== 0) {
                column.push(board[r][c]);
            }
        }
        
        const newColumn = [];
        for (let i = column.length - 1; i >= 0; i--) {
            if (i > 0 && column[i] === column[i - 1]) {
                newColumn.unshift(column[i] * 2);
                score += column[i] * 2;
                i--;
                moved = true;
            } else {
                newColumn.unshift(column[i]);
            }
        }
        
        while (newColumn.length < 4) {
            newColumn.unshift(0);
        }
        
        for (let r = 0; r < 4; r++) {
            if (board[r][c] !== newColumn[r]) {
                moved = true;
            }
            board[r][c] = newColumn[r];
        }
    }
    return moved;
}

function checkWin() {
    if (!gameWon) {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === 2048) {
                    gameWon = true;
                    gameWinDiv.style.display = 'block';
                    return;
                }
            }
        }
    }
}

function checkGameOver() {
    // Check for empty cells
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) {
                return false;
            }
        }
    }
    
    // Check for possible merges
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const current = board[r][c];
            if ((r < 3 && board[r + 1][c] === current) ||
                (c < 3 && board[r][c + 1] === current)) {
                return false;
            }
        }
    }
    
    return true;
}

function move(direction) {
    if (gameOver || isAnimating) return;
    
    // Save previous board for animation
    previousBoard = board.map(row => [...row]);
    
    let moved = false;
    switch(direction) {
        case 'left':
            moved = moveLeft();
            break;
        case 'right':
            moved = moveRight();
            break;
        case 'up':
            moved = moveUp();
            break;
        case 'down':
            moved = moveDown();
            break;
    }
    
    if (moved) {
        isAnimating = true;
        updateDisplayWithAnimation();
        
        setTimeout(() => {
            addRandomTile();
            updateDisplay();
            isAnimating = false;
            checkWin();
            
        if (checkGameOver()) {
            gameOver = true;
            finalScoreElement.textContent = score;
            gameOverDiv.style.display = 'block';
            
            // Save score if user is logged in
            if (typeof saveGameScore === 'function') {
                saveGameScore('2048', score);
            }
        }
        }, 200);
    }
}

function updateDisplay() {
    scoreElement.textContent = score;
    if (score > best) {
        best = score;
        bestElement.textContent = best;
        localStorage.setItem('2048best', best);
    }
    
    gameBoard.innerHTML = '';
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell-2048';
            const value = board[r][c];
            cell.textContent = value || '';
            cell.style.backgroundColor = getTileColor(value);
            cell.style.color = value > 4 ? '#fff' : '#000';
            
            if (value > 0) {
                cell.classList.add('tile-appear');
            }
            
            gameBoard.appendChild(cell);
        }
    }
}

function updateDisplayWithAnimation() {
    scoreElement.textContent = score;
    if (score > best) {
        best = score;
        bestElement.textContent = best;
        localStorage.setItem('2048best', best);
    }
    
    gameBoard.innerHTML = '';
    
    // Create cells with animation tracking
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell-2048';
            const value = board[r][c];
            const prevValue = previousBoard[r] ? previousBoard[r][c] : 0;
            
            cell.textContent = value || '';
            cell.style.backgroundColor = getTileColor(value);
            cell.style.color = value > 4 ? '#fff' : '#000';
            
            // Check if this is a new tile or merged tile
            if (value > 0 && prevValue === 0) {
                cell.classList.add('tile-new');
            } else if (value > prevValue && prevValue > 0) {
                cell.classList.add('tile-merge');
            } else if (value > 0) {
                cell.classList.add('tile-move');
            }
            
            gameBoard.appendChild(cell);
        }
    }
}

function getTileColor(value) {
    const colors = {
        0: '#cdc1b4',
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e'
    };
    return colors[value] || '#3c3a32';
}

function startNewGame() {
    initBoard();
}

function continueGame() {
    gameWinDiv.style.display = 'none';
    gameWon = true;
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const keyCode = e.keyCode || e.which;
    
    // Arrow keys or WASD
    if (keyCode === 37 || keyCode === 65 || key === 'a') { // Left/A
        move('left');
        e.preventDefault();
    } else if (keyCode === 39 || keyCode === 68 || key === 'd') { // Right/D
        move('right');
        e.preventDefault();
    } else if (keyCode === 38 || keyCode === 87 || key === 'w') { // Up/W
        move('up');
        e.preventDefault();
    } else if (keyCode === 40 || keyCode === 83 || key === 's') { // Down/S
        move('down');
        e.preventDefault();
    }
});

// Add CSS
const style = document.createElement('style');
style.textContent = `
    .cell-2048 {
        width: 80px;
        height: 80px;
        background: #cdc1b4;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
        transition: transform 0.15s ease-in-out, background-color 0.15s ease-in-out;
        position: relative;
    }
    
    .cell-2048.tile-new {
        animation: tileAppear 0.2s ease-out;
    }
    
    .cell-2048.tile-merge {
        animation: tileMerge 0.2s ease-out;
    }
    
    .cell-2048.tile-move {
        animation: tileMove 0.15s ease-out;
    }
    
    @keyframes tileAppear {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes tileMerge {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
    
    @keyframes tileMove {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(0.95);
        }
        100% {
            transform: scale(1);
        }
    }
    
    @media (max-width: 768px) {
        .cell-2048 {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
        }
    }
`;
document.head.appendChild(style);

// Initialize
startNewGame();

