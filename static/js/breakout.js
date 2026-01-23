// Breakout Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const gameOverDiv = document.getElementById('gameOver');
const gameWinDiv = document.getElementById('gameWin');
const finalScoreElement = document.getElementById('finalScore');
const winScoreElement = document.getElementById('winScore');

let gameRunning = false;
let gamePaused = false;
let gameLoop;

// Paddle
const paddle = {
    x: canvas.width / 2 - 75,
    y: canvas.height - 30,
    width: 150,
    height: 20,
    speed: 8
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 4,
    dy: -4,
    speed: 4
};

// Blocks
let blocks = [];
const blockRows = 5;
const blockCols = 10;
const blockWidth = 70;
const blockHeight = 25;
const blockPadding = 5;
const blockOffsetTop = 50;
const blockOffsetLeft = 35;

let score = 0;
let lives = 3;
let rightPressed = false;
let leftPressed = false;

function createBlocks() {
    blocks = [];
    for (let r = 0; r < blockRows; r++) {
        blocks[r] = [];
        for (let c = 0; c < blockCols; c++) {
            blocks[r][c] = {
                x: c * (blockWidth + blockPadding) + blockOffsetLeft,
                y: r * (blockHeight + blockPadding) + blockOffsetTop,
                status: 1
            };
        }
    }
}

function drawPaddle() {
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ec4899';
    ctx.fill();
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function drawBlocks() {
    for (let r = 0; r < blockRows; r++) {
        for (let c = 0; c < blockCols; c++) {
            if (blocks[r][c].status === 1) {
                const x = blocks[r][c].x;
                const y = blocks[r][c].y;
                
                ctx.fillStyle = `hsl(${r * 60}, 70%, 50%)`;
                ctx.fillRect(x, y, blockWidth, blockHeight);
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, blockWidth, blockHeight);
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBlocks();
    drawPaddle();
    drawBall();
    drawScore();
}

function drawScore() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
}

function collisionDetection() {
    for (let r = 0; r < blockRows; r++) {
        for (let c = 0; c < blockCols; c++) {
            const b = blocks[r][c];
            if (b.status === 1) {
                if (ball.x > b.x && ball.x < b.x + blockWidth &&
                    ball.y > b.y && ball.y < b.y + blockHeight) {
                    b.status = 0;
                    ball.dy = -ball.dy;
                    score += 10;
                    
                    // Check if all blocks are destroyed
                    let allDestroyed = true;
                    for (let row of blocks) {
                        for (let block of row) {
                            if (block.status === 1) {
                                allDestroyed = false;
                                break;
                            }
                        }
                        if (!allDestroyed) break;
                    }
                    
                    if (allDestroyed) {
                        gameWin();
                        return;
                    }
                }
            }
        }
    }
}

function movePaddle() {
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.speed;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Wall collision
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    
    // Paddle collision
    if (ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.dy;
        // Add spin based on where ball hits paddle
        const hitPos = (ball.x - paddle.x) / paddle.width;
        ball.dx = (hitPos - 0.5) * 6;
    }
    
    // Bottom collision - lose life
    if (ball.y + ball.radius > canvas.height) {
        lives--;
        if (lives <= 0) {
            gameOver();
            return;
        }
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -4;
}

function gameOver() {
    gameRunning = false;
    gamePaused = false;
    clearInterval(gameLoop);
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    finalScoreElement.textContent = score;
    gameOverDiv.style.display = 'block';
    
    // Save score if user is logged in
    if (typeof saveGameScore === 'function') {
        saveGameScore('breakout', score);
    }
}

function gameWin() {
    gameRunning = false;
    gamePaused = false;
    clearInterval(gameLoop);
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    winScoreElement.textContent = score;
    gameWinDiv.style.display = 'block';
    
    // Save score if user is logged in
    if (typeof saveGameScore === 'function') {
        saveGameScore('breakout', score);
    }
}

function togglePause() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
    }
}

function startGame() {
    score = 0;
    lives = 3;
    gameRunning = true;
    gamePaused = false;
    gameOverDiv.style.display = 'none';
    gameWinDiv.style.display = 'none';
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    
    paddle.x = canvas.width / 2 - 75;
    resetBall();
    createBlocks();
    draw();
    
    gameLoop = setInterval(() => {
        if (!gamePaused && gameRunning) {
            movePaddle();
            moveBall();
            collisionDetection();
            draw();
        }
    }, 16);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const keyCode = e.keyCode || e.which;
    
    // Arrow keys or WASD
    if (keyCode === 39 || keyCode === 68 || key === 'd') { // Right/D
        rightPressed = true;
        e.preventDefault();
    } else if (keyCode === 37 || keyCode === 65 || key === 'a') { // Left/A
        leftPressed = true;
        e.preventDefault();
    }
    
    if (keyCode === 32) { // Spacebar to pause
        e.preventDefault();
        togglePause();
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    const keyCode = e.keyCode || e.which;
    
    if (keyCode === 39 || keyCode === 68 || key === 'd') {
        rightPressed = false;
    } else if (keyCode === 37 || keyCode === 65 || key === 'a') {
        leftPressed = false;
    }
});

