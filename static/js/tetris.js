// Tetris Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const linesElement = document.getElementById('lines');
const levelElement = document.getElementById('level');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const gameOverDiv = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const finalLinesElement = document.getElementById('finalLines');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let lines = 0;
let level = 1;
let gameRunning = false;
let gamePaused = false;
let dropTime = 0;
let lastTime = 0;
let dropInterval = 1000;

// Tetris pieces as 2D matrices
const PIECES = [
    // I piece (vertical and horizontal)
    [
        [[1], [1], [1], [1]],
        [[1, 1, 1, 1]]
    ],
    // T piece
    [
        [[0, 1, 0], [1, 1, 1]],
        [[1, 0], [1, 1], [1, 0]],
        [[1, 1, 1], [0, 1, 0]],
        [[0, 1], [1, 1], [0, 1]]
    ],
    // L piece
    [
        [[1, 0], [1, 0], [1, 1]],
        [[1, 1, 1], [1, 0, 0]],
        [[1, 1], [0, 1], [0, 1]],
        [[0, 0, 1], [1, 1, 1]]
    ],
    // O piece (square)
    [
        [[1, 1], [1, 1]]
    ],
    // S piece
    [
        [[0, 1, 1], [1, 1, 0]],
        [[1, 0], [1, 1], [0, 1]]
    ],
    // Z piece
    [
        [[1, 1, 0], [0, 1, 1]],
        [[0, 1], [1, 1], [1, 0]]
    ],
    // J piece
    [
        [[0, 1], [0, 1], [1, 1]],
        [[1, 0, 0], [1, 1, 1]],
        [[1, 1], [1, 0], [1, 0]],
        [[1, 1, 1], [0, 0, 1]]
    ]
];

const COLORS = [
    '#00f0f0', '#0000f0', '#f0a000', '#f0f000', '#00f000', '#f00000', '#a000f0'
];

function createBoard() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
}

function createPiece() {
    const type = Math.floor(Math.random() * PIECES.length);
    const rotations = PIECES[type];
    const matrix = rotations[0].map(row => [...row]);
    const color = COLORS[type];
    
    return {
        matrix: matrix,
        x: Math.floor(COLS / 2) - Math.floor(matrix[0].length / 2),
        y: 0,
        color: color,
        type: type,
        rotation: 0
    };
}

function drawBlock(x, y, color, ctx, size = BLOCK_SIZE) {
    ctx.fillStyle = color;
    ctx.fillRect(x * size, y * size, size - 2, size - 2);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(x * size, y * size, size - 2, size - 2);
    
    // Add highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(x * size, y * size, size - 2, (size - 2) / 3);
}

function drawBoard() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * BLOCK_SIZE, 0);
        ctx.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * BLOCK_SIZE);
        ctx.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
        ctx.stroke();
    }
    
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                drawBlock(x, y, board[y][x], ctx);
            }
        }
    }
}

function drawPiece(piece, ctx, size = BLOCK_SIZE, offsetX = 0, offsetY = 0) {
    const matrix = piece.matrix;
    
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x]) {
                const drawX = (piece.x + x + offsetX) * size;
                const drawY = (piece.y + y + offsetY) * size;
                ctx.fillStyle = piece.color;
                ctx.fillRect(drawX, drawY, size - 2, size - 2);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.strokeRect(drawX, drawY, size - 2, size - 2);
                
                // Add highlight
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(drawX, drawY, size - 2, (size - 2) / 3);
            }
        }
    }
}

function drawNextPiece() {
    nextCtx.fillStyle = '#1e293b';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (nextPiece) {
        const matrix = nextPiece.matrix;
        const scale = 15;
        const offsetX = (nextCanvas.width / scale - matrix[0].length) / 2;
        const offsetY = (nextCanvas.height / scale - matrix.length) / 2;
        
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                if (matrix[y][x]) {
                    drawBlock(x + offsetX, y + offsetY, nextPiece.color, nextCtx, scale);
                }
            }
        }
    }
}

function validMove(piece, dx, dy, newMatrix = null) {
    const matrix = newMatrix || piece.matrix;
    const testX = piece.x + dx;
    const testY = piece.y + dy;
    
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x]) {
                const boardX = testX + x;
                const boardY = testY + y;
                
                if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
                    return false;
                }
                if (boardY >= 0 && board[boardY][boardX]) {
                    return false;
                }
            }
        }
    }
    
    return true;
}

function rotatePiece(piece) {
    const rotations = PIECES[piece.type];
    const nextRotation = (piece.rotation + 1) % rotations.length;
    const newMatrix = rotations[nextRotation].map(row => [...row]);
    
    if (validMove(piece, 0, 0, newMatrix)) {
        piece.matrix = newMatrix;
        piece.rotation = nextRotation;
        return true;
    }
    
    // Try wall kicks
    for (let offset of [-1, 1, -2, 2]) {
        if (validMove(piece, offset, 0, newMatrix)) {
            piece.matrix = newMatrix;
            piece.rotation = nextRotation;
            piece.x += offset;
            return true;
        }
    }
    
    return false;
}

function placePiece() {
    const matrix = currentPiece.matrix;
    
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x]) {
                const boardX = currentPiece.x + x;
                const boardY = currentPiece.y + y;
                if (boardY >= 0) {
                    board[boardY][boardX] = currentPiece.color;
                }
            }
        }
    }
    
    clearLines();
    currentPiece = nextPiece;
    nextPiece = createPiece();
    drawNextPiece();
    
    if (!validMove(currentPiece, 0, 0)) {
        gameOver();
    }
}

function clearLines() {
    let linesCleared = 0;
    
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            y++;
        }
    }
    
    if (linesCleared > 0) {
        lines += linesCleared;
        score += linesCleared * 100 * level;
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(100, 1000 - (level - 1) * 100);
        updateDisplay();
    }
}

function dropPiece() {
    if (validMove(currentPiece, 0, 1)) {
        currentPiece.y++;
    } else {
        placePiece();
    }
}

function updateDisplay() {
    scoreElement.textContent = score;
    linesElement.textContent = lines;
    levelElement.textContent = level;
}

function gameOver() {
    gameRunning = false;
    gamePaused = false;
    cancelAnimationFrame(gameLoop);
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    finalScoreElement.textContent = score;
    finalLinesElement.textContent = lines;
    gameOverDiv.style.display = 'block';
    
    // Save score if user is logged in
    if (typeof saveGameScore === 'function') {
        saveGameScore('tetris', score);
    }
}

function togglePause() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
    }
}

function startGame() {
    createBoard();
    score = 0;
    lines = 0;
    level = 1;
    dropInterval = 1000;
    gameRunning = true;
    gamePaused = false;
    gameOverDiv.style.display = 'none';
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    
    currentPiece = createPiece();
    nextPiece = createPiece();
    drawNextPiece();
    updateDisplay();
    
    lastTime = performance.now();
    gameLoop = requestAnimationFrame(animate);
}

function animate(time) {
    if (!gameRunning) return;
    
    const deltaTime = time - lastTime;
    lastTime = time;
    
    if (!gamePaused) {
        dropTime += deltaTime;
        
        if (dropTime > dropInterval) {
            dropPiece();
            dropTime = 0;
        }
        
        drawBoard();
        drawPiece(currentPiece, ctx);
    }
    
    gameLoop = requestAnimationFrame(animate);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) return;
    
    const key = e.key.toLowerCase();
    const keyCode = e.keyCode || e.which;
    
    // Left/A
    if ((keyCode === 37 || keyCode === 65 || key === 'a') && validMove(currentPiece, -1, 0)) {
        currentPiece.x--;
        e.preventDefault();
    }
    // Right/D
    if ((keyCode === 39 || keyCode === 68 || key === 'd') && validMove(currentPiece, 1, 0)) {
        currentPiece.x++;
        e.preventDefault();
    }
    // Down/S
    if ((keyCode === 40 || keyCode === 83 || key === 's') && validMove(currentPiece, 0, 1)) {
        currentPiece.y++;
        e.preventDefault();
    }
    // Rotate (Up/W or Space)
    if (keyCode === 38 || keyCode === 87 || key === 'w' || keyCode === 32) {
        rotatePiece(currentPiece);
        e.preventDefault();
    }
    
    // Hard drop (Shift)
    if (keyCode === 16) {
        while (validMove(currentPiece, 0, 1)) {
            currentPiece.y++;
        }
        placePiece();
        e.preventDefault();
    }
    
    // Pause
    if (keyCode === 80 || key === 'p') {
        togglePause();
        e.preventDefault();
    }
});

// Initialize
createBoard();
