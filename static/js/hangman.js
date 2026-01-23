// Hangman Game
const canvas = document.getElementById('hangmanCanvas');
const ctx = canvas.getContext('2d');
const wordDisplay = document.getElementById('wordDisplay');
const keyboard = document.getElementById('keyboard');
const wrongGuessesElement = document.getElementById('wrongGuesses');
const scoreElement = document.getElementById('score');
const gameResultDiv = document.getElementById('gameResult');
const resultTextElement = document.getElementById('resultText');
const wordRevealElement = document.getElementById('wordReveal');

const words = [
    'JAVASCRIPT', 'PYTHON', 'COMPUTER', 'PROGRAMMING', 'ALGORITHM',
    'DEVELOPER', 'SOFTWARE', 'HARDWARE', 'INTERNET', 'KEYBOARD',
    'MOUSE', 'MONITOR', 'LAPTOP', 'TABLET', 'SMARTPHONE',
    'GAMING', 'NETWORK', 'DATABASE', 'SECURITY', 'ENCRYPTION',
    'FUNCTION', 'VARIABLE', 'ARRAY', 'OBJECT', 'CLASS',
    'METHOD', 'LOOP', 'CONDITION', 'STRING', 'NUMBER'
];

let currentWord = '';
let guessedLetters = [];
let wrongGuesses = 0;
let score = 0;
let gameActive = true;
const maxWrongGuesses = 6;

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function drawHangman() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 4;
    
    // Base
    if (wrongGuesses >= 1) {
        ctx.beginPath();
        ctx.moveTo(50, 350);
        ctx.lineTo(150, 350);
        ctx.stroke();
    }
    
    // Pole
    if (wrongGuesses >= 2) {
        ctx.beginPath();
        ctx.moveTo(100, 350);
        ctx.lineTo(100, 50);
        ctx.stroke();
    }
    
    // Top
    if (wrongGuesses >= 3) {
        ctx.beginPath();
        ctx.moveTo(100, 50);
        ctx.lineTo(200, 50);
        ctx.stroke();
    }
    
    // Rope
    if (wrongGuesses >= 4) {
        ctx.beginPath();
        ctx.moveTo(200, 50);
        ctx.lineTo(200, 100);
        ctx.stroke();
    }
    
    // Head
    if (wrongGuesses >= 5) {
        ctx.beginPath();
        ctx.arc(200, 130, 30, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Body
    if (wrongGuesses >= 6) {
        ctx.beginPath();
        ctx.moveTo(200, 160);
        ctx.lineTo(200, 280);
        ctx.stroke();
        
        // Arms
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.lineTo(170, 240);
        ctx.moveTo(200, 200);
        ctx.lineTo(230, 240);
        ctx.stroke();
        
        // Legs
        ctx.beginPath();
        ctx.moveTo(200, 280);
        ctx.lineTo(170, 320);
        ctx.moveTo(200, 280);
        ctx.lineTo(230, 320);
        ctx.stroke();
    }
}

function createKeyboard() {
    keyboard.innerHTML = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    letters.forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.className = 'hangman-key';
        button.onclick = () => guessLetter(letter);
        button.disabled = guessedLetters.includes(letter);
        keyboard.appendChild(button);
    });
}

function displayWord() {
    let display = '';
    for (let letter of currentWord) {
        if (guessedLetters.includes(letter)) {
            display += letter + ' ';
        } else {
            display += '_ ';
        }
    }
    wordDisplay.textContent = display.trim();
    return !display.includes('_');
}

function guessLetter(letter) {
    if (!gameActive || guessedLetters.includes(letter)) return;
    
    guessedLetters.push(letter);
    
    if (currentWord.includes(letter)) {
        if (displayWord()) {
            gameWin();
        }
    } else {
        wrongGuesses++;
        wrongGuessesElement.textContent = `${wrongGuesses} / ${maxWrongGuesses}`;
        drawHangman();
        
        if (wrongGuesses >= maxWrongGuesses) {
            gameOver();
        }
    }
    
    updateKeyboard();
}

function updateKeyboard() {
    const buttons = keyboard.querySelectorAll('button');
    buttons.forEach(button => {
        const letter = button.textContent;
        button.disabled = guessedLetters.includes(letter);
    });
}

function gameWin() {
    gameActive = false;
    score += 10;
    scoreElement.textContent = score;
    resultTextElement.textContent = '🎉 You Win! 🎉';
    resultTextElement.style.color = 'var(--success-color)';
    wordRevealElement.textContent = `The word was: ${currentWord}`;
    gameResultDiv.style.display = 'block';
    
    // Save score if user is logged in
    if (typeof saveGameScore === 'function') {
        saveGameScore('hangman', score);
    }
}

function gameOver() {
    gameActive = false;
    resultTextElement.textContent = '😔 Game Over!';
    resultTextElement.style.color = 'var(--error-color)';
    wordRevealElement.textContent = `The word was: ${currentWord}`;
    gameResultDiv.style.display = 'block';
}

function startNewGame() {
    currentWord = getRandomWord();
    guessedLetters = [];
    wrongGuesses = 0;
    gameActive = true;
    gameResultDiv.style.display = 'none';
    
    wrongGuessesElement.textContent = '0 / 6';
    displayWord();
    createKeyboard();
    drawHangman();
}

// Keyboard input
document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    
    const key = e.key.toUpperCase();
    if (key.match(/[A-Z]/) && !guessedLetters.includes(key)) {
        guessLetter(key);
    }
});

// Add CSS for keyboard buttons
const style = document.createElement('style');
style.textContent = `
    .hangman-key {
        padding: 0.75rem;
        background: var(--bg-hover);
        border: 2px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .hangman-key:hover:not(:disabled) {
        background: var(--primary-color);
        transform: scale(1.1);
    }
    
    .hangman-key:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    @media (max-width: 768px) {
        #keyboard {
            grid-template-columns: repeat(9, 1fr) !important;
        }
    }
`;
document.head.appendChild(style);

// Initialize game
startNewGame();

