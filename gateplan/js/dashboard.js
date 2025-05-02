// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'index.html';
}

// Display user name
document.getElementById('userName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// GATE 2026 exam date
const examDate = new Date('2026-02-01');

// Update countdown
function updateCountdown() {
    const now = new Date();
    const timeLeft = examDate - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('countdown').textContent = `${days} days, ${hours} hours, ${minutes} minutes`;
}

// Update countdown every minute
updateCountdown();
setInterval(updateCountdown, 60000);

// Navigation tabs
const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');

navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        navTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// GATE CSE Subjects with their details
const subjects = [
    {
      name: "DBMS ( marks : 175 )",
      subtopics: [
        { title: "Database Design & ER Model", questions: 13, importance: "Moderate 🔶" },
        { title: "Functional Dependency & Normalization", questions: 33, importance: "High 🔷" },
        { title: "Transaction & Concurrency Control", questions: 35, importance: "Very High 🟣" },
        { title: "Relational Algebra, SQL, TRC", questions: 71, importance: "Critical 🟢" },
        { title: "File Organization & Indexing", questions: 23, importance: "Moderate 🔶" }
      ]
    },
    {
      name: "Operating Systems ( marks : 196)",
      subtopics: [
        { title: "Process Management & CPU Scheduling", questions: 49, importance: "Very High 🟣" },
        { title: "Process Synchronization", questions: 44, importance: "Very High 🟣" },
        { title: "Deadlock", questions: 23, importance: "Moderate 🔶" },
        { title: "Memory Management", questions: 57, importance: "Critical 🟢" },
        { title: "File System & Disk Management", questions: 23, importance: "Moderate 🔶" }
      ]
    },
    {
      name: "Computer Networks ( marks : 167 )",
      subtopics: [
        { title: "Basics & IPv4 Addressing", questions: 32, importance: "High 🔷" },
        { title: "Data Link Layer", questions: 40, importance: "Very High 🟣" },
        { title: "MAC Sublayer", questions: 16, importance: "Low 🟡" },
        { title: "Network Layer", questions: 16, importance: "Low 🟡" },
        { title: "Transport Layer", questions: 37, importance: "High 🔷" },
        { title: "Application Layer", questions: 26, importance: "Moderate 🔶" }
      ]
    },
    {
      name: "Computer Organization & Architecture ( marks : 151)",
      subtopics: [
        { title: "Machine Instruction & Addressing Mode", questions: 41, importance: "Very High 🟣" },
        { title: "ALU & Control Unit", questions: 14, importance: "Low 🟡" },
        { title: "Instruction Pipelining", questions: 52, importance: "Critical 🟢" },
        { title: "Memory Hierarchy", questions: 38, importance: "High 🔷" },
        { title: "I/O Interface", questions: 6, importance: "Low 🟡" }
      ]
    },
    {
      name: "Programming & Data Structures ( marks : 226 )",
      subtopics: [
        { title: "Data Types & Operators", questions: 5, importance: "Low 🟡" },
        { title: "Control Flow Statements", questions: 26, importance: "Moderate 🔶" },
        { title: "Function & Storage", questions: 41, importance: "Very High 🟣" },
        { title: "Pointers & Strings", questions: 42, importance: "Very High 🟣" },
        { title: "Array & Linked List", questions: 13, importance: "Low 🟡" },
        { title: "Stacks & Queues", questions: 19, importance: "Moderate 🔶" },
        { title: "Trees", questions: 60, importance: "Critical 🟢" },
        { title: "Hashing", questions: 20, importance: "Moderate 🔶" }
      ]
    },
    {
      name: "Algorithms ( marks : 198 )",
      subtopics: [
        { title: "Asymptotic Analysis", questions: 39, importance: "High 🔷" },
        { title: "Divide & Conquer", questions: 43, importance: "Very High 🟣" },
        { title: "Greedy Techniques", questions: 24, importance: "Moderate 🔶" },
        { title: "Graph Algorithms", questions: 34, importance: "High 🔷" },
        { title: "Dynamic Programming", questions: 30, importance: "High 🔷" },
        { title: "Miscellaneous Topics", questions: 28, importance: "Moderate 🔶" }
      ]
    },
    {
      name: "Compiler Design ( marks : 108 )",
      subtopics: [
        { title: "Introduction to Compiler", questions: 6, importance: "Low 🟡" },
        { title: "Lexical Analysis", questions: 6, importance: "Low 🟡" },
        { title: "Syntax Analysis", questions: 27, importance: "Moderate 🔶" },
        { title: "Syntax Directed Translation", questions: 24, importance: "Moderate 🔶" },
        { title: "Intermediate Code Generation", questions: 11, importance: "Low 🟡" },
        { title: "Code Optimization", questions: 21, importance: "Moderate 🔶" },
        { title: "Runtime Environment", questions: 13, importance: "Low 🟡" }
      ]
    },
    {
      name: "Theory of Computation ( marks : 199 )",
      subtopics: [
        { title: "Finite Automata & Transducers", questions: 40, importance: "High 🔷" },
        { title: "Regular Expressions", questions: 23, importance: "Moderate 🔶" },
        { title: "Regular Languages & Grammars", questions: 20, importance: "Moderate 🔶" },
        { title: "CFL & CFG", questions: 60, importance: "Critical 🟢" },
        { title: "Turing Machines", questions: 29, importance: "High 🔷" },
        { title: "Undecidability & Reducibility", questions: 27, importance: "Moderate 🔶" }
      ]
    },
    {
      name: "Digital Logic ( marks : 132 )",
      subtopics: [
        { title: "Number System & Binary", questions: 29, importance: "Moderate 🔶" },
        { title: "Boolean Algebra, Logic Gates, K-Map", questions: 43, importance: "Very High 🟣" },
        { title: "Combinational Circuits", questions: 34, importance: "High 🔷" },
        { title: "Sequential Circuits", questions: 26, importance: "Moderate 🔶" }
      ]
    },
    {
      name: "Discrete Mathematics ( marks : 162 )",
      subtopics: [
        { title: "Propositional Logic", questions: 41, importance: "High 🔷" },
        { title: "Sets, Relations & Functions", questions: 41, importance: "High 🔷" },
        { title: "Graph Theory", questions: 53, importance: "Critical 🟢" },
        { title: "Combinatorics", questions: 27, importance: "Moderate 🔶" }
      ]
    },
    {
      name: "Engineering Mathematics ( marks : 121 )",
      subtopics: [
        { title: "Linear Algebra", questions: 40, importance: "High 🔷" },
        { title: "Basic Calculus", questions: 37, importance: "High 🔷" },
        { title: "Probability", questions: 44, importance: "Very High 🟣" }
      ]
    }
];

// Load subjects
function loadSubjects() {
    const subjectsContainer = document.querySelector('.subjects-container');
    subjectsContainer.innerHTML = '';

    subjects.forEach(subject => {
        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-card';
        subjectCard.innerHTML = `
            <h3>${subject.name}</h3>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${getSubjectProgress(subject.name)}%"></div>
            </div>
            <p>Progress: ${getSubjectProgress(subject.name)}%</p>
        `;
        subjectCard.addEventListener('click', () => showSubjectDetails(subject));
        subjectsContainer.appendChild(subjectCard);
    });
}

// Get subject progress from localStorage
function getSubjectProgress(subject) {
    const progress = JSON.parse(localStorage.getItem(`progress_${subject}`)) || 0;
    return progress;
}

// Show subject details in modal
function showSubjectDetails(subject) {
    const modal = document.getElementById('subjectModal');
    const modalSubjectName = document.getElementById('modalSubjectName');
    const subjectDetails = document.querySelector('.subject-details');

    modalSubjectName.textContent = subject.name;
    
    // Create subtopics HTML with progress tracking
    const subtopicsHTML = subject.subtopics.map(subtopic => {
        const progress = getSubtopicProgress(subject.name, subtopic.title);
        return `
            <div class="subtopic-item">
                <h4>${subtopic.title}</h4>
                <div class="subtopic-details">
                    <p><strong>Questions (2008-2023):</strong> ${subtopic.questions}</p>
                    <p><strong>Importance:</strong> ${subtopic.importance}</p>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${progress}%"></div>
                    </div>
                    <p>Progress: ${progress}%</p>
                </div>
                <div class="subtopic-tasks">
                    <label class="task-item">
                        <input type="checkbox" class="task-checkbox" 
                            ${progress >= 20 ? 'checked' : ''} 
                            onchange="updateSubtopicProgress('${subject.name}', '${subtopic.title}', this)">
                        <span>Video Lectures</span>
                    </label>
                    <label class="task-item">
                        <input type="checkbox" class="task-checkbox" 
                            ${progress >= 40 ? 'checked' : ''} 
                            onchange="updateSubtopicProgress('${subject.name}', '${subtopic.title}', this)">
                        <span>Notes Making</span>
                    </label>
                    <label class="task-item">
                        <input type="checkbox" class="task-checkbox" 
                            ${progress >= 60 ? 'checked' : ''} 
                            onchange="updateSubtopicProgress('${subject.name}', '${subtopic.title}', this)">
                        <span>Practice Problems</span>
                    </label>
                    <label class="task-item">
                        <input type="checkbox" class="task-checkbox" 
                            ${progress >= 80 ? 'checked' : ''} 
                            onchange="updateSubtopicProgress('${subject.name}', '${subtopic.title}', this)">
                        <span>Previous Year Questions</span>
                    </label>
                    <label class="task-item">
                        <input type="checkbox" class="task-checkbox" 
                            ${progress >= 100 ? 'checked' : ''} 
                            onchange="updateSubtopicProgress('${subject.name}', '${subtopic.title}', this)">
                        <span>Revision</span>
                    </label>
                </div>
            </div>
        `;
    }).join('');
    
    subjectDetails.innerHTML = `
        <div class="subject-info">
            <h3>Subtopics</h3>
            <div class="subtopics-container">
                ${subtopicsHTML}
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// Get subtopic progress from localStorage
function getSubtopicProgress(subject, subtopic) {
    const progress = JSON.parse(localStorage.getItem(`progress_${subject}_${subtopic}`)) || 0;
    return progress;
}

// Update subtopic progress
function updateSubtopicProgress(subject, subtopic, checkbox) {
    const currentProgress = getSubtopicProgress(subject, subtopic);
    const taskIndex = Array.from(checkbox.parentElement.parentElement.children).indexOf(checkbox.parentElement);
    const progressPerTask = 20; // 5 tasks, each worth 20%
    
    let newProgress;
    if (checkbox.checked) {
        newProgress = Math.min(100, currentProgress + progressPerTask);
    } else {
        newProgress = Math.max(0, currentProgress - progressPerTask);
    }
    
    localStorage.setItem(`progress_${subject}_${subtopic}`, newProgress);
    
    // Update subject progress
    const subjectProgress = calculateSubjectProgress(subject);
    localStorage.setItem(`progress_${subject}`, subjectProgress);
    
    // Refresh the display
    showSubjectDetails(subjects.find(s => s.name === subject));
    loadSubjects();
}

// Calculate overall subject progress based on subtopics
function calculateSubjectProgress(subject) {
    const subjectData = subjects.find(s => s.name === subject);
    if (!subjectData) return 0;
    
    const totalProgress = subjectData.subtopics.reduce((acc, subtopic) => {
        return acc + getSubtopicProgress(subject, subtopic.title);
    }, 0);
    
    return Math.round(totalProgress / subjectData.subtopics.length);
}

// Close modal
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('subjectModal').style.display = 'none';
});

// Get current day and date
function getCurrentDayAndDate() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    return `${day}, ${date} ${month} ${year}`;
}

// Check if current day is weekend
function isWeekend() {
    const now = new Date();
    const day = now.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

// Make functions globally accessible
window.updateSubtopicProgress = updateSubtopicProgress;
window.editScheduleItem = editScheduleItem;
window.addScheduleItem = addScheduleItem;
window.toggleScheduleStatus = toggleScheduleStatus;

// Load study plan
function loadStudyPlan() {
    const weekdayPlan = document.querySelector('.weekday-plan');
    const weekendPlan = document.querySelector('.weekend-plan');
    
    // Update day and date
    const currentDayAndDate = getCurrentDayAndDate();
    weekdayPlan.querySelector('h3').textContent = `Weekday Plan (${currentDayAndDate})`;
    weekendPlan.querySelector('h3').textContent = `Weekend Plan (${currentDayAndDate})`;
    
    // Show/hide plans based on current day
    if (isWeekend()) {
        weekdayPlan.style.display = 'none';
        weekendPlan.style.display = 'block';
    } else {
        weekdayPlan.style.display = 'block';
        weekendPlan.style.display = 'none';
    }
    
    const weekdayScheduleContainer = document.querySelector('.weekday-plan .schedule-container');
    const weekendScheduleContainer = document.querySelector('.weekend-plan .schedule-container');

    // Get saved schedules from localStorage or use defaults
    const savedWeekdaySchedule = JSON.parse(localStorage.getItem('weekdaySchedule')) || [
        { time: '7:30 AM - 1:30 PM', task: 'Video Lectures' },
        { time: '1:30 PM - 3:00 PM', task: 'Notes Making' },
        { time: '3:00 PM - 5:00 PM', task: 'DPPs' },
        { time: '5:00 PM - 7:00 PM', task: 'Revision' }
    ];
    
    const savedWeekendSchedule = JSON.parse(localStorage.getItem('weekendSchedule')) || [
        { time: '8:30 AM - 2:30 PM', task: 'PYQs from 3 subjects' },
        { time: '2:30 PM - 8:30 PM', task: 'Revision' }
    ];

    // Render weekday schedule
    weekdayScheduleContainer.innerHTML = savedWeekdaySchedule.map((item, index) => `
        <div class="schedule-item">
            <span class="schedule-time">${item.time}</span>
            <span class="schedule-task">${item.task}</span>
            <div class="schedule-status pending" onclick="toggleScheduleStatus(this)"></div>
            <button type="button" class="edit-schedule-btn" onclick="editScheduleItem('weekday', ${index})">
                <i class="fas fa-edit"></i> Edit
            </button>
        </div>
    `).join('');

    // Render weekend schedule
    weekendScheduleContainer.innerHTML = savedWeekendSchedule.map((item, index) => `
        <div class="schedule-item">
            <span class="schedule-time">${item.time}</span>
            <span class="schedule-task">${item.task}</span>
            <div class="schedule-status pending" onclick="toggleScheduleStatus(this)"></div>
            <button type="button" class="edit-schedule-btn" onclick="editScheduleItem('weekend', ${index})">
                <i class="fas fa-edit"></i> Edit
            </button>
        </div>
    `).join('');
    
    // Add "Add New" buttons
    weekdayScheduleContainer.innerHTML += `
        <div class="add-schedule-item">
            <button type="button" class="btn-add" onclick="addScheduleItem('weekday')">
                <i class="fas fa-plus"></i> Add New Task
            </button>
        </div>
    `;
    
    weekendScheduleContainer.innerHTML += `
        <div class="add-schedule-item">
            <button type="button" class="btn-add" onclick="addScheduleItem('weekend')">
                <i class="fas fa-plus"></i> Add New Task
            </button>
        </div>
    `;
}

// Edit schedule item
function editScheduleItem(type, index) {
    const schedules = {
        weekday: JSON.parse(localStorage.getItem('weekdaySchedule')) || [],
        weekend: JSON.parse(localStorage.getItem('weekendSchedule')) || []
    };

    const item = schedules[type][index];

    // Check if the item exists
    if (!item) {
        alert('Schedule item not found!');
        return;
    }

    // Remove any existing modals
    const existingModals = document.querySelectorAll('.edit-modal');
    existingModals.forEach(modal => modal.remove());

    // Create edit modal
    const editModal = document.createElement('div');
    editModal.className = 'modal edit-modal';
    editModal.style.display = 'block';
    editModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Edit Schedule Item</h2>
            <form id="editScheduleForm">
                <div class="form-group">
                    <label for="editTime">Time</label>
                    <input type="text" id="editTime" value="${item.time}" required>
                </div>
                <div class="form-group">
                    <label for="editTask">Task</label>
                    <input type="text" id="editTask" value="${item.task}" required>
                </div>
                <button type="submit" class="btn-add">Save Changes</button>
            </form>
        </div>
    `;

    document.body.appendChild(editModal);

    // Handle close button
    const closeBtn = editModal.querySelector('.close-modal');
    closeBtn.onclick = function () {
        editModal.remove();
    };

    // Handle form submission
    const form = editModal.querySelector('#editScheduleForm');
    form.onsubmit = function (e) {
        e.preventDefault();

        const newTime = document.getElementById('editTime').value.trim();
        const newTask = document.getElementById('editTask').value.trim();

        if (!newTime || !newTask) {
            alert('Both fields are required!');
            return;
        }

        // Update the schedule item
        schedules[type][index] = { time: newTime, task: newTask };
        localStorage.setItem(`${type}Schedule`, JSON.stringify(schedules[type]));

        // Remove the modal and reload the study plan
        editModal.remove();
        loadStudyPlan();
    };
}

// Add new schedule item
function addScheduleItem(type) {
    // Remove any existing modals
    const existingModals = document.querySelectorAll('.edit-modal');
    existingModals.forEach(modal => modal.remove());
    
    // Create add modal
    const addModal = document.createElement('div');
    addModal.className = 'modal edit-modal';
    addModal.style.display = 'block';
    addModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Add New Schedule Item</h2>
            <form id="addScheduleForm">
                <div class="form-group">
                    <label>Time</label>
                    <input type="text" id="addTime" placeholder="e.g., 7:30 AM - 1:30 PM" required>
                </div>
                <div class="form-group">
                    <label>Task</label>
                    <input type="text" id="addTask" placeholder="e.g., Video Lectures" required>
                </div>
                <button type="submit" class="btn-add">Add Task</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(addModal);
    
    // Handle close button
    const closeBtn = addModal.querySelector('.close-modal');
    closeBtn.onclick = function() {
        addModal.remove();
    };
    
    // Handle form submission
    const form = addModal.querySelector('#addScheduleForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const newTime = document.getElementById('addTime').value;
        const newTask = document.getElementById('addTask').value;
        
        const schedules = JSON.parse(localStorage.getItem(`${type}Schedule`)) || [];
        schedules.push({ time: newTime, task: newTask });
        localStorage.setItem(`${type}Schedule`, JSON.stringify(schedules));
        
        addModal.remove();
        loadStudyPlan();
    };
}

// Toggle schedule status
function toggleScheduleStatus(element) {
    element.classList.toggle('completed');
    element.classList.toggle('pending');
}

// Load progress
function loadProgress() {
    const progressChart = document.querySelector('.progress-chart');
    const subjectProgressList = document.querySelector('.subject-progress-list');

    // Calculate overall progress
    const overallProgress = subjects.reduce((acc, subject) => {
        return acc + getSubjectProgress(subject.name);
    }, 0) / subjects.length;

    // Render overall progress
    progressChart.innerHTML = `
        <div class="progress-bar">
            <div class="progress-bar-fill" style="width: ${overallProgress}%"></div>
        </div>
        <p>Overall Progress: ${overallProgress.toFixed(2)}%</p>
    `;

    // Render subject-wise progress
    subjectProgressList.innerHTML = subjects.map(subject => `
        <div class="subject-progress-item">
            <h4>${subject.name}</h4>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${getSubjectProgress(subject.name)}%"></div>
            </div>
            <p>${getSubjectProgress(subject.name)}%</p>
        </div>
    `).join('');
}

function loadTargets() {
    const weeklyContainer = document.querySelector('.weekly-targets');
    const monthlyContainer = document.querySelector('.monthly-targets');

    const weeklyTargets = JSON.parse(localStorage.getItem('weeklyTargets')) || [];
    const monthlyTargets = JSON.parse(localStorage.getItem('monthlyTargets')) || [];

    function renderTargets(container, targets, type) {
        container.innerHTML = targets.map((target, index) => `
            <div class="target-item">
                <input type="checkbox" ${target.completed ? 'checked' : ''} onchange="toggleTargetStatus('${type}', ${index})">
                <span>${target.task}</span>
                <button onclick="editTarget('${type}', ${index})">✏️</button>
            </div>
        `).join('') + `
            <div class="add-target">
                <button onclick="addTarget('${type}')">➕ Add ${type === 'weekly' ? 'Weekly' : 'Monthly'} Target</button>
            </div>
        `;
    }

    renderTargets(weeklyContainer, weeklyTargets, 'weekly');
    renderTargets(monthlyContainer, monthlyTargets, 'monthly');
}

function addTarget(type) {
    const task = prompt(`Enter new ${type} target:`);
    if (!task) return;
    const key = `${type}Targets`;
    const targets = JSON.parse(localStorage.getItem(key)) || [];
    targets.push({ task, completed: false });
    localStorage.setItem(key, JSON.stringify(targets));
    loadTargets();
}

function editTarget(type, index) {
    const key = `${type}Targets`;
    const targets = JSON.parse(localStorage.getItem(key)) || [];
    const newTask = prompt('Edit target:', targets[index].task);
    if (!newTask) return;
    targets[index].task = newTask;
    localStorage.setItem(key, JSON.stringify(targets));
    loadTargets();
}

function toggleTargetStatus(type, index) {
    const key = `${type}Targets`;
    const targets = JSON.parse(localStorage.getItem(key)) || [];
    targets[index].completed = !targets[index].completed;
    localStorage.setItem(key, JSON.stringify(targets));
    loadTargets();
}

// Add this at the bottom to initialize everything
loadSubjects();
loadStudyPlan();
loadProgress();
loadTargets();
