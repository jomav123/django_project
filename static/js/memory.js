// Memory Game
const gameBoard = document.getElementById('gameBoard');
const movesElement = document.getElementById('moves');
const pairsElement = document.getElementById('pairs');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const gameWinDiv = document.getElementById('gameWin');
const finalMovesElement = document.getElementById('finalMoves');

const emojis = ['🎮', '🎯', '🎲', '🎨', '🎪', '🎭', '🎸', '🎺'];
let cards = [];
let flippedCards = [];
let moves = 0;
let pairsFound = 0;
let gameStarted = false;

function createCards() {
    const cardPairs = [...emojis, ...emojis];
    // Shuffle
    for (let i = cardPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }
    return cardPairs;
}

function createCard(emoji, index) {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.index = index;
    card.dataset.emoji = emoji;
    card.innerHTML = '<div class="card-front">?</div><div class="card-back">' + emoji + '</div>';
    card.addEventListener('click', () => flipCard(card));
    return card;
}

function flipCard(card) {
    if (!gameStarted || card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) {
        return;
    }
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
        movesElement.textContent = moves;
        
        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        pairsFound++;
        pairsElement.textContent = `${pairsFound} / 8`;
        
        if (pairsFound === 8) {
            gameWin();
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    
    flippedCards = [];
}

function gameWin() {
    gameStarted = false;
    finalMovesElement.textContent = moves;
    gameWinDiv.style.display = 'block';
    restartBtn.style.display = 'inline-block';
    
    // Save score if user is logged in (lower moves = better score)
    if (typeof saveGameScore === 'function') {
        // Convert moves to score (fewer moves = higher score)
        const score = Math.max(0, 1000 - (moves * 10));
        saveGameScore('memory', score);
    }
}

function startGame() {
    gameBoard.innerHTML = '';
    cards = createCards();
    flippedCards = [];
    moves = 0;
    pairsFound = 0;
    gameStarted = true;
    movesElement.textContent = '0';
    pairsElement.textContent = '0 / 8';
    gameWinDiv.style.display = 'none';
    startBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    
    cards.forEach((emoji, index) => {
        const card = createCard(emoji, index);
        gameBoard.appendChild(card);
    });
}

// Add CSS for memory cards
const style = document.createElement('style');
style.textContent = `
    .memory-card {
        aspect-ratio: 1;
        position: relative;
        cursor: pointer;
        transform-style: preserve-3d;
        transition: transform 0.6s;
    }
    
    .memory-card.flipped {
        transform: rotateY(180deg);
    }
    
    .memory-card.matched {
        opacity: 0.5;
        cursor: default;
    }
    
    .card-front, .card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        font-size: 3rem;
        border: 2px solid var(--border-color);
    }
    
    .card-front {
        background: var(--bg-hover);
        color: var(--text-primary);
    }
    
    .card-back {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        transform: rotateY(180deg);
        color: white;
    }
    
    .memory-card.matched .card-back {
        background: linear-gradient(135deg, var(--success-color), #059669);
    }
`;
document.head.appendChild(style);

