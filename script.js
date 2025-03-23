let currentQuestionIndex = 0;
const totalQuestions = 25;
const imageExtensions = ['jpg', 'jpeg', 'png'];

const questionImageElement = document.getElementById('question-image');
const currentQuestionElement = document.getElementById('current-question');
const timerElement = document.getElementById('timer');
const questionGrid = document.getElementById('question-grid');
const notVisitedElement = document.getElementById('not-visited');
const notAnsweredElement = document.getElementById('not-answered');
const answeredElement = document.getElementById('answered');
const markedReviewElement = document.getElementById('marked-review');

// Add canvas element for pie chart (add this to your HTML as well)
const pieChartCanvas = document.createElement('canvas');
pieChartCanvas.id = 'pieChart';
document.body.appendChild(pieChartCanvas);

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
let mainTimerTime = 4799; // 2 hours, 59 minutes, 59 seconds in seconds

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

    if (questionStatus[currentQuestionIndex] === 'not-visited') {
        questionStatus[currentQuestionIndex] = 'not-answered';
        notVisitedCount--;
        notVisitedElement.textContent = notVisitedCount;
    }

    startQuestionTimer(currentQuestionIndex);
    visitCount[currentQuestionIndex]++;
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

// Handle button clicks (unchanged)
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

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        pauseQuestionTimer(currentQuestionIndex);
        currentQuestionIndex--;
        loadQuestion();
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentQuestionIndex < totalQuestions - 1) {
        pauseQuestionTimer(currentQuestionIndex);
        currentQuestionIndex++;
        loadQuestion();
    }
});

// Main timer functions (unchanged)
function startMainTimer() {
    mainTimerInterval = setInterval(() => {
        const hours = Math.floor(mainTimerTime / 3600);
        const minutes = Math.floor((mainTimerTime % 3600) / 60);
        const seconds = mainTimerTime % 60;
        timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        mainTimerTime--;
    }, 1000);
}

function stopMainTimer() {
    clearInterval(mainTimerInterval);
}

// Create pie chart
function createPieChart() {
    const ctx = pieChartCanvas.getContext('2d');
    const attempted = questionStatus.filter(status => status === 'answered').length;
    const unattempted = questionStatus.filter(status => status === 'not-answered' || status === 'not-visited').length;
    const marked = questionStatus.filter(status => status === 'marked-review').length;

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Attempted', 'Unattempted', 'Marked for Review'],
            datasets: [{
                data: [attempted, unattempted, marked],
                backgroundColor: ['green', 'red', 'blue'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Question Status Distribution'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            label += `${value} (${percentage}%)`;
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// Modified submit handler
document.getElementById('submit-btn').addEventListener('click', () => {
    questionTimers.forEach((timer, index) => {
        if (timer !== null) {
            clearInterval(timer);
        }
    });
    stopMainTimer();

    // Enhanced result.txt content
    let resultContent = "Question\tTime Spent (s)\tVisits\tStatus\n";
    timeSpent.forEach((time, index) => {
        let status = questionStatus[index];
        if (status === 'not-visited') status = 'Unattempted';
        else if (status === 'not-answered') status = 'Unattempted';
        else if (status === 'answered') status = 'Attempted';
        else if (status === 'marked-review') status = 'Marked for Review';
        
        resultContent += `Question ${index + 1}\t${time}\t${visitCount[index]}\t${status}\n`;
    });

    resultContent += `\nTotal Time Remaining: ${timerElement.textContent}`;

    // Download result.txt
    const blob = new Blob([resultContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result.txt';
    a.click();
    URL.revokeObjectURL(url);

    // Create pie chart after submission
    createPieChart();
});

// Initialize (unchanged)
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

initializeQuestionGrid();
startMainTimer();
loadQuestion();