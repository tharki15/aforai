let currentQuestionIndex = 0;
const totalQuestions = 35;
const imageExtensions = ['jpg', 'jpeg', 'png'];

const questionImageElement = document.getElementById('question-image');
const currentQuestionElement = document.getElementById('current-question');
const timerElement = document.getElementById('timer');
const questionGrid = document.getElementById('question-grid');
const notVisitedElement = document.getElementById('not-visited');
const notAnsweredElement = document.getElementById('not-answered');
const answeredElement = document.getElementById('answered');
const markedReviewElement = document.getElementById('marked-review');

// Track question status
const questionStatus = Array(totalQuestions).fill('not-visited'); // 'not-visited', 'not-answered', 'answered', 'marked-review'
let notVisitedCount = totalQuestions;
let notAnsweredCount = totalQuestions;
let answeredCount = 0;
let markedReviewCount = 0;

// Track time spent on each question
const timeSpent = Array(totalQuestions).fill(0); // Time in seconds
const visitCount = Array(totalQuestions).fill(0); // Number of visits
let questionTimers = Array(totalQuestions).fill(null); // Timers for each question

// Main timer variables
let mainTimerInterval;
let mainTimerTime = 2700; // 2 hours, 59 minutes, 59 seconds in seconds

// Load question image
function loadQuestion() {
    const questionNumber = currentQuestionIndex + 1;
    let imageFound = false;

    for (let ext of imageExtensions) {
        const testSrc = `images/question${questionNumber}.${ext}`;
        const img = new Image();
        img.src = testSrc;
        img.onload = () => {
            if (!imageFound) {
                imageFound = true;
                questionImageElement.src = testSrc;
                currentQuestionElement.textContent = questionNumber;
            }
        };
    }

    // Update question status if not visited
    if (questionStatus[currentQuestionIndex] === 'not-visited') {
        questionStatus[currentQuestionIndex] = 'not-answered';
        notVisitedCount--;
        notVisitedElement.textContent = notVisitedCount;
    }

    // Start timer for the current question
    startQuestionTimer(currentQuestionIndex);

    // Increment visit count
    visitCount[currentQuestionIndex]++;
    console.log(`Visited Question ${questionNumber} ${visitCount[currentQuestionIndex]} times`);

    // Update grid colors
    updateGridColors();
}

// Start timer for a question
function startQuestionTimer(questionIndex) {
    if (questionTimers[questionIndex] === null) {
        questionTimers[questionIndex] = setInterval(() => {
            timeSpent[questionIndex]++;
        }, 1000);
    }
}

// Pause timer for a question
function pauseQuestionTimer(questionIndex) {
    if (questionTimers[questionIndex] !== null) {
        clearInterval(questionTimers[questionIndex]);
        questionTimers[questionIndex] = null;
    }
}

// Update grid colors based on question status
function updateGridColors() {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach((item, index) => {
        switch (questionStatus[index]) {
            case 'answered':
                item.style.backgroundColor = 'green';
                break;
            case 'marked-review':
                item.style.backgroundColor = 'blue';
                break;
            case 'not-answered':
                item.style.backgroundColor = 'red';
                break;
            default:
                item.style.backgroundColor = '#f4f4f4';
        }
    });
}

// Handle "Save & Next" button click
document.getElementById('save-next').addEventListener('click', () => {
    if (questionStatus[currentQuestionIndex] !== 'answered') {
        questionStatus[currentQuestionIndex] = 'answered';
        answeredCount++;
        notAnsweredCount--;
        answeredElement.textContent = answeredCount;
        notAnsweredElement.textContent = notAnsweredCount;
    }
    if (currentQuestionIndex < totalQuestions - 1) {
        pauseQuestionTimer(currentQuestionIndex);
        currentQuestionIndex++;
        loadQuestion();
    }
});

// Handle "Mark for Review & Next" button click
document.getElementById('mark-review').addEventListener('click', () => {
    if (questionStatus[currentQuestionIndex] !== 'marked-review') {
        questionStatus[currentQuestionIndex] = 'marked-review';
        markedReviewCount++;
        markedReviewElement.textContent = markedReviewCount;
        if (questionStatus[currentQuestionIndex] === 'not-answered') {
            notAnsweredCount--;
            notAnsweredElement.textContent = notAnsweredCount;
        }
    }
    if (currentQuestionIndex < totalQuestions - 1) {
        pauseQuestionTimer(currentQuestionIndex);
        currentQuestionIndex++;
        loadQuestion();
    }
});

// Handle "Previous" button click
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        pauseQuestionTimer(currentQuestionIndex);
        currentQuestionIndex--;
        loadQuestion();
    }
});

// Handle "Next" button click
document.getElementById('next-btn').addEventListener('click', () => {
    if (currentQuestionIndex < totalQuestions - 1) {
        pauseQuestionTimer(currentQuestionIndex);
        currentQuestionIndex++;
        loadQuestion();
    }
});

// Start the main timer
function startMainTimer() {
    mainTimerInterval = setInterval(() => {
        const hours = Math.floor(mainTimerTime / 3600);
        const minutes = Math.floor((mainTimerTime % 3600) / 60);
        const seconds = mainTimerTime % 60;
        timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        mainTimerTime--;
    }, 1000);
}

// Stop the main timer
function stopMainTimer() {
    clearInterval(mainTimerInterval);
}

// Handle "Submit" button click
document.getElementById('submit-btn').addEventListener('click', () => {
    // Pause all timers
    questionTimers.forEach((timer, index) => {
        if (timer !== null) {
            clearInterval(timer);
        }
    });

    // Stop the main timer
    stopMainTimer();

    // Generate result.txt content
    let resultContent = "Question\tTime Spent (s)\tVisits\n";
    timeSpent.forEach((time, index) => {
        resultContent += `Question ${index + 1}\t${time}\t${visitCount[index]}\n`;
    });

    // Add main timer time to the result file
    resultContent += `\nTotal Time Remaining: ${timerElement.textContent}`;

    // Download result.txt
    const blob = new Blob([resultContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result.txt';
    a.click();
    URL.revokeObjectURL(url);
});

// Initialize question grid
function initializeQuestionGrid() {
    for (let i = 1; i <= totalQuestions; i++) {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.textContent = i < 10 ? `0${i}` : i;
        gridItem.addEventListener('click', () => {
            pauseQuestionTimer(currentQuestionIndex);
            currentQuestionIndex = i - 1;
            loadQuestion();
        });
        questionGrid.appendChild(gridItem);
    }
}

// Initialize
initializeQuestionGrid();
startMainTimer(); // Start the main timer
loadQuestion();
