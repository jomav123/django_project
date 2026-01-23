// Snake Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const gameOverDiv = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop;

highScoreElement.textContent = highScore;

function randomFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function drawGame() {
    clearCanvas();
    drawSnake();
    drawFood();
    drawScore();
}

function clearCanvas() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = '#6366f1';
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#8b5cf6';
        } else {
            ctx.fillStyle = '#6366f1';
        }
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function drawScore() {
    scoreElement.textContent = score;
}

function moveSnake() {
    // Don't move if no direction is set
    if (dx === 0 && dy === 0) {
        return;
    }

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Check self collision (skip the head itself, check only body segments)
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        randomFood();
        // Make sure food doesn't spawn on snake
        while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            randomFood();
        }
    } else {
        snake.pop();
    }
}

function gameOver() {
    gameRunning = false;
    gamePaused = false;
    clearInterval(gameLoop);
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreElement.textContent = highScore;
    }
    
    // Save score if user is logged in
    if (typeof saveGameScore === 'function') {
        saveGameScore('snake', score);
    }
    
    finalScoreElement.textContent = score;
    gameOverDiv.style.display = 'block';
}

function startGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    gameRunning = true;
    gamePaused = false;
    gameOverDiv.style.display = 'none';
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    
    randomFood();
    // Make sure food doesn't spawn on snake
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        randomFood();
    }
    
    drawGame();
    
    // Don't start moving until player presses a key
    gameLoop = setInterval(() => {
        if (!gamePaused && (dx !== 0 || dy !== 0)) {
            moveSnake();
            drawGame();
        }
    }, 150);
}

function togglePause() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
    }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
    // WASD keys
    const KEY_A = 65;
    const KEY_W = 87;
    const KEY_D = 68;
    const KEY_S = 83;
    
    const keyPressed = e.keyCode || e.which;
    const key = e.key.toLowerCase();
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;
    
    // Arrow keys or WASD - Left/A
    if ((keyPressed === LEFT_KEY || keyPressed === KEY_A || key === 'a') && !goingRight) {
        dx = -1;
        dy = 0;
        e.preventDefault();
    }
    // Arrow keys or WASD - Up/W
    if ((keyPressed === UP_KEY || keyPressed === KEY_W || key === 'w') && !goingDown) {
        dx = 0;
        dy = -1;
        e.preventDefault();
    }
    // Arrow keys or WASD - Right/D
    if ((keyPressed === RIGHT_KEY || keyPressed === KEY_D || key === 'd') && !goingLeft) {
        dx = 1;
        dy = 0;
        e.preventDefault();
    }
    // Arrow keys or WASD - Down/S
    if ((keyPressed === DOWN_KEY || keyPressed === KEY_S || key === 's') && !goingUp) {
        dx = 0;
        dy = 1;
        e.preventDefault();
    }
    
    if (keyPressed === 32) { // Spacebar to pause
        e.preventDefault();
        togglePause();
    }
});

