// Quiz Game
const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const scoreElement = document.getElementById('score');
const questionNumElement = document.getElementById('questionNum');
const resultDiv = document.getElementById('result');
const resultTextElement = document.getElementById('resultText');
const nextBtn = document.getElementById('nextBtn');
const startBtn = document.getElementById('startBtn');
const quizCompleteDiv = document.getElementById('quizComplete');
const finalScoreElement = document.getElementById('finalScore');
const percentageElement = document.getElementById('percentage');

const questions = [
    {
        question: "What is the capital of France?",
        answers: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
    },
    {
        question: "What is 2 + 2?",
        answers: ["3", "4", "5", "6"],
        correct: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        answers: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correct: 2
    },
    {
        question: "What is the largest ocean on Earth?",
        answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correct: 3
    },
    {
        question: "How many continents are there?",
        answers: ["5", "6", "7", "8"],
        correct: 2
    },
    {
        question: "What is the chemical symbol for gold?",
        answers: ["Go", "Gd", "Au", "Ag"],
        correct: 2
    },
    {
        question: "Which year did World War II end?",
        answers: ["1943", "1944", "1945", "1946"],
        correct: 2
    },
    {
        question: "What is the smallest prime number?",
        answers: ["0", "1", "2", "3"],
        correct: 2
    },
    {
        question: "What is the speed of light in vacuum?",
        answers: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;
let quizStarted = false;
let answered = false;

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    quizStarted = true;
    answered = false;
    scoreElement.textContent = '0';
    questionNumElement.textContent = '0 / 10';
    quizCompleteDiv.style.display = 'none';
    startBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    resultDiv.style.display = 'none';
    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= questions.length) {
        completeQuiz();
        return;
    }
    
    const question = questions[currentQuestion];
    questionElement.textContent = question.question;
    questionNumElement.textContent = `${currentQuestion + 1} / ${questions.length}`;
    answersElement.innerHTML = '';
    resultDiv.style.display = 'none';
    nextBtn.style.display = 'none';
    answered = false;
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'btn btn-secondary';
        button.style.width = '100%';
        button.style.padding = '1rem';
        button.style.marginBottom = '0.5rem';
        button.textContent = answer;
        button.onclick = () => selectAnswer(index);
        answersElement.appendChild(button);
    });
}

function selectAnswer(index) {
    if (answered) return;
    
    answered = true;
    const question = questions[currentQuestion];
    const buttons = answersElement.querySelectorAll('button');
    
    buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === question.correct) {
            btn.style.background = 'linear-gradient(135deg, var(--success-color), #059669)';
        } else if (i === index && i !== question.correct) {
            btn.style.background = 'linear-gradient(135deg, var(--error-color), #dc2626)';
        }
    });
    
    if (index === question.correct) {
        score++;
        scoreElement.textContent = score;
        resultTextElement.textContent = '✅ Correct!';
        resultTextElement.style.color = 'var(--success-color)';
    } else {
        resultTextElement.textContent = '❌ Wrong! The correct answer is: ' + question.answers[question.correct];
        resultTextElement.style.color = 'var(--error-color)';
    }
    
    resultDiv.style.display = 'block';
    nextBtn.style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

function completeQuiz() {
    quizStarted = false;
    const percentage = Math.round((score / questions.length) * 100);
    finalScoreElement.textContent = score;
    percentageElement.textContent = `You got ${percentage}% correct!`;
    quizCompleteDiv.style.display = 'block';
    startBtn.style.display = 'inline-block';
    
    // Save score if user is logged in
    if (typeof saveGameScore === 'function') {
        saveGameScore('quiz', score);
    }
}

