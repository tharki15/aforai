document.addEventListener('DOMContentLoaded', () => {
    // Function to generate a referral code
    function generateReferralCode(name) {
        const upperName = name.toUpperCase().replace(/\s+/g, '');
        const randomNum = Math.floor(Math.random() * 900) + 100; // 100-999
        return upperName + randomNum;
    }

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize user wallet data if not already done
    if (!currentUser.walletDetails) {
        currentUser.walletDetails = {
            topupBalance: 0,
            winningsBalance: 0,
            totalBalance: currentUser.walletBalance || 50
        };
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Initialize user bet tracking
    if (!currentUser.betTracking) {
        currentUser.betTracking = {
            dailyBetsRemaining: 12,
            extraBetsPurchased: 0,
            lastBetDate: new Date().toDateString()
        };
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Initialize daily spin tracking
    if (!currentUser.spinTracking) {
        currentUser.spinTracking = {
            spinsRemaining: 2,
            lastSpinDate: new Date().toDateString(),
            nextSpinTime: null
        };
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Generate user referral code if not exists
    if (!currentUser.referralCode) {
        currentUser.referralCode = generateReferralCode(currentUser.name);
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Reset daily bets if it's a new day
    const today = new Date().toDateString();
    if (currentUser.betTracking.lastBetDate !== today) {
        currentUser.betTracking.dailyBetsRemaining = 12;
        currentUser.betTracking.lastBetDate = today;
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Reset daily spins if it's a new day or past 12am
    if (currentUser.spinTracking.lastSpinDate !== today) {
        currentUser.spinTracking.spinsRemaining = 2;
        currentUser.spinTracking.lastSpinDate = today;
        currentUser.spinTracking.nextSpinTime = null;
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Check if user is logged in
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
        // First-time user, show the tour
        startTour();
        // Mark that the user has seen the tour
        localStorage.setItem('hasSeenTour', 'true');
    }

    // Set up C-Coin animation rotation
    setupCCoinAnimations();

    // Set greeting based on time
    const greeting = document.getElementById('greeting');
    const hour = new Date().getHours();
    let greetingText = 'Good ';
    if (hour < 12) greetingText += 'Morning';
    else if (hour < 18) greetingText += 'Afternoon';
    else greetingText += 'Evening';
    greeting.textContent = `${greetingText}, ${currentUser.name}`;

    // Initialize chart
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    // Check if user is on mobile
    const isMobile = window.innerWidth <= 768;
    
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Price',
                data: [],
                borderColor: '#4CAF50',
                borderWidth: isMobile ? 1.5 : 2,
                pointRadius: 0,
                tension: 0.3,
                fill: false,
                borderColor: function(context) {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    
                    if (!chartArea) {
                        return;
                    }
                    
                    // Create gradient for line color (green to red)
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(76, 175, 80, 1)');    // Green at top
                    gradient.addColorStop(1, 'rgba(255, 99, 132, 1)');   // Red at bottom
                    return gradient;
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.08)'
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        color: '#fff',
                        font: {
                            size: isMobile ? 8 : 10
                        },
                        callback: function(value) {
                            return '₹' + value.toFixed(2);
                        },
                        maxTicksLimit: isMobile ? 6 : 8
                    },
                    position: 'right'
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.08)'
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        color: '#fff',
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(30, 30, 30, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return '₹' + context.raw.toFixed(2);
                        }
                    }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    },
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy'
                    }
                }
            },
            animation: {
                duration: 0
            },
            elements: {
                line: {
                    cubicInterpolationMode: 'monotone'
                }
            },
            hover: {
                mode: 'nearest',
                intersect: false
            }
        }
    });

    // Initialize chart with random data
    const initialPrice = 1000;
    const priceData = [];
    const timeLabels = [];
    
    // Generate initial data points (past data)
    for (let i = 0; i < 60; i++) {
        const randomChange = (Math.random() - 0.5) * 2;
        const lastPrice = priceData.length > 0 ? priceData[priceData.length - 1] : initialPrice;
        const newPrice = lastPrice + randomChange;
        priceData.push(newPrice);
        timeLabels.push('');
    }
    
    chart.data.labels = timeLabels;
    chart.data.datasets[0].data = priceData;
    chart.update();
    
    // Set up continuous price updates
    let chartUpdateInterval = setInterval(() => {
        updatePrice();
    }, 1000);
    
    function updatePrice() {
        const lastPrice = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
        const randomChange = (Math.random() - 0.5) * 1;
        const newPrice = lastPrice + randomChange;
        
        chart.data.labels.push('');
        chart.data.datasets[0].data.push(newPrice);
        
        // Keep a fixed window of data points
        if (chart.data.labels.length > 60) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        
        chart.update();
        
        // Update reference line position if a game is in progress
        if (gameState.isGameRunning && gameState.referenceLine) {
            updateReferenceLine();
        }
    }

    // Game state
    let gameState = {
        selectedTime: null,
        selectedDirection: null,
        selectedMultiplier: null,
        isGameRunning: false,
        startPrice: 0,
        referencePrice: 0,
        consecutiveLosses: 0,
        referenceLine: null,
        referenceLabel: null,
        betAmount: 50
    };

    // Reference line functionality
    function addReferenceLine(price) {
        // Remove existing reference line if any
        if (gameState.referenceLine) {
            gameState.referenceLine.remove();
        }
        if (gameState.referenceLabel) {
            gameState.referenceLabel.remove();
        }
        
        const chartContainer = document.querySelector('.chart-container');
        const chartHeight = chartContainer.clientHeight - 40;
        
        // Calculate the exact position based on the current min/max values
        const minValue = Math.min(...chart.data.datasets[0].data);
        const maxValue = Math.max(...chart.data.datasets[0].data);
        const range = maxValue - minValue;
        
        // Calculate vertical position where higher prices are higher on the canvas (inverted)
        const percentage = 1 - ((price - minValue) / range);
        const linePosition = percentage * chartHeight;
        
        // Create reference line
        const line = document.createElement('div');
        line.className = 'reference-line';
        line.style.top = `${linePosition + 20}px`;
        chartContainer.appendChild(line);
        
        // Create reference price label
        const label = document.createElement('div');
        label.className = 'reference-price';
        label.textContent = `₹${price.toFixed(2)}`;
        label.style.top = `${linePosition + 20 - 10}px`;
        chartContainer.appendChild(label);
        
        // Store elements for later removal
        gameState.referenceLine = line;
        gameState.referenceLabel = label;
        gameState.referencePrice = price;
    }
    
    // Update reference line position when chart changes
    function updateReferenceLine() {
        if (!gameState.referenceLine || !gameState.referenceLabel) return;
        
        const chartContainer = document.querySelector('.chart-container');
        const chartHeight = chartContainer.clientHeight - 40;
        
        // Calculate the exact position based on the current min/max values
        const minValue = Math.min(...chart.data.datasets[0].data);
        const maxValue = Math.max(...chart.data.datasets[0].data);
        const range = maxValue - minValue;
        
        // Calculate vertical position
        const percentage = 1 - ((gameState.referencePrice - minValue) / range);
        const linePosition = percentage * chartHeight;
        
        // Update reference line position
        gameState.referenceLine.style.top = `${linePosition + 20}px`;
        gameState.referenceLabel.style.top = `${linePosition + 20 - 10}px`;
    }

    // Update wallet balance display
    function updateWalletBalance() {
        const walletBalance = document.getElementById('walletBalance');
        const mainWalletBalance = document.getElementById('mainWalletBalance');
        
        // Display the combined balance to the user
        const totalBalance = currentUser.walletDetails.totalBalance;
        walletBalance.textContent = `Wallet Balance: ₹${totalBalance.toFixed(2)}`;
        mainWalletBalance.textContent = `Wallet: ₹${totalBalance.toFixed(2)}`;
        
        // Update the reference to the user's referral code
        if (document.getElementById('userReferralCode')) {
            document.getElementById('userReferralCode').textContent = currentUser.referralCode || '-';
        }
        
        // Update user data in localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            userData.walletBalance = totalBalance;
            localStorage.setItem('userData', JSON.stringify(userData));
        }
        
        // Update current user in localStorage
        currentUser.walletBalance = totalBalance; // Keep for backwards compatibility
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // Initialize wallet balance
    updateWalletBalance();

    // Time selection
    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (gameState.isGameRunning) return;
            
            timeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            gameState.selectedTime = parseInt(button.dataset.time);
        });
    });

    // Direction selection
    const directionButtons = document.querySelectorAll('.direction-btn');
    directionButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (gameState.isGameRunning) return;
            
            directionButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            gameState.selectedDirection = button.dataset.direction;
        });
    });

    // Multiplier selection
    const multiplierButtons = document.querySelectorAll('.multiplier-btn');
    multiplierButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (gameState.isGameRunning) return;
            
            multiplierButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            gameState.selectedMultiplier = parseFloat(button.dataset.multiplier);
        });
    });

    // Start game
    function startGame() {
        // Prevent starting multiple games
        if (gameState.isGameRunning) {
            alert('A bet is already in progress. Please wait for it to complete.');
            return;
        }

        if (!gameState.selectedTime || !gameState.selectedDirection || !gameState.selectedMultiplier) {
            alert('Please select time, direction, and multiplier!');
            return;
        }

        // Hide previous bet result if visible
        document.getElementById('bet-result').style.display = 'none';

        // Get custom bet amount
        const betAmountInput = document.getElementById('bet-amount');
        const betAmount = parseFloat(betAmountInput.value);
        
        // Validate bet amount
        if (isNaN(betAmount) || betAmount <= 0) {
            alert('Please enter a valid bet amount.');
            return;
        }
        
        // Check minimum bet amount
        if (betAmount < 35) {
            alert('Minimum bet amount is ₹35.');
            return;
        }
        
        // Check if user has enough balance
        if (currentUser.walletDetails.totalBalance < betAmount) {
            alert('Insufficient balance! Please add funds to your wallet.');
            return;
        }
        
        // Store the bet amount
        gameState.betAmount = betAmount;
        
        // Check if potential loss would make balance negative
        const potentialLoss = betAmount;
        if (currentUser.walletDetails.totalBalance - potentialLoss < 0) {
            alert('Warning: This bet could result in a negative balance. Please reduce your bet amount or add more funds.');
            return;
        }

        gameState.isGameRunning = true;
        
        // Get the current price at the start of the bet
        gameState.startPrice = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
        gameState.referencePrice = gameState.startPrice; // Set reference price
        
        // Add reference line at the current price
        addReferenceLine(gameState.startPrice);
        
        // Deduct bet amount
        currentUser.walletDetails.totalBalance -= betAmount;
        updateWalletBalance();

        // Start timer
        let timeLeft = gameState.selectedTime;
        const timer = document.getElementById('timer');
        timer.textContent = timeLeft;

        const timerInterval = setInterval(() => {
            timeLeft--;
            timer.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);

        // Store interval for cleanup
        gameState.timerInterval = timerInterval;
    }

    // End game
    function endGame() {
        clearInterval(gameState.timerInterval);
        
        // Get final price
        let finalPrice = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
        
        // Determine win based on direction and price
        let isWin = false;
        
        // UP: if final price is higher than reference line
        if (gameState.selectedDirection === 'up' && finalPrice > gameState.referencePrice) {
            isWin = true;
        } 
        // DOWN: if final price is lower than reference line
        else if (gameState.selectedDirection === 'down' && finalPrice < gameState.referencePrice) {
            isWin = true;
        }

        // Determine winning chance based on wallet balance
        let winChance = 0;
        const balance = currentUser.walletDetails.totalBalance;
        
        if (balance <= 50) {
            winChance = 75; // 75% win chance
        } else if (balance <= 110) {
            winChance = 55; // 55% win chance
        } else if (balance <= 300) {
            winChance = 25; // 25% win chance
        } else if (balance <= 400) {
            winChance = 12.5; // 12.5% win chance
        } else if (balance <= 450) {
            winChance = 5.5; // 5.5% win chance
        } else if (balance <= 500) {
            winChance = 1.25; // 1.25% win chance
        } else {
            winChance = 0.5; // 0.5% win chance for balances over 500
        }
        
        // Random number between 0-100
        const randomNum = Math.random() * 100;
        
        // Determine final win result based on probabilities
        // Always make the user win if their position is correct
        let finalWinResult = isWin;
        
        // But if they didn't legitimately win, give them a chance based on their balance
        if (!isWin && randomNum < winChance) {
            finalWinResult = true;
            
            // Manipulate the final price to make it look like they won
            if (gameState.selectedDirection === 'up') {
                finalPrice = gameState.referencePrice + (Math.random() * 0.5 + 0.1);
            } else {
                finalPrice = gameState.referencePrice - (Math.random() * 0.5 + 0.1);
            }
            
            // Update the chart with the new final price
            chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1] = finalPrice;
            chart.update();
        }
        // If they were going to lose, make it seem like a near miss 78% of the time
        else if (!finalWinResult && Math.random() < 0.78) {
            const nearMissAmount = Math.random() * 0.3 + 0.05;
            
            if (gameState.selectedDirection === 'up') {
                // Make it look like it almost went up enough
                finalPrice = gameState.referencePrice - nearMissAmount;
            } else {
                // Make it look like it almost went down enough
                finalPrice = gameState.referencePrice + nearMissAmount;
            }
            
            // Update the chart with the near miss
            chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1] = finalPrice;
            chart.update();
        }

        // Log detailed information for debugging
        console.log({
            direction: gameState.selectedDirection,
            referencePrice: gameState.referencePrice,
            finalPrice: finalPrice,
            difference: finalPrice - gameState.referencePrice,
            rawIsWin: isWin,
            finalWinResult: finalWinResult,
            balance: balance,
            winChance: winChance,
            betAmount: gameState.betAmount
        });
        
        // Display bet result
        const startPriceEl = document.getElementById('start-price');
        const endPriceEl = document.getElementById('end-price');
        const priceChangeEl = document.getElementById('price-change');
        const betResultEl = document.getElementById('bet-result');
        
        startPriceEl.textContent = `₹${gameState.referencePrice.toFixed(2)}`;
        endPriceEl.textContent = `₹${finalPrice.toFixed(2)}`;
        
        // Calculate price change
        const priceChange = finalPrice - gameState.referencePrice;
        const priceChangePercent = (priceChange / gameState.referencePrice) * 100;
        
        // Format price change with arrow and sign
        priceChangeEl.textContent = `${priceChange >= 0 ? '▲' : '▼'} ${Math.abs(priceChange).toFixed(2)} (${Math.abs(priceChangePercent).toFixed(2)}%)`;
        
        // Style based on price direction
        if (priceChange > 0) {
            endPriceEl.className = 'price-value up';
            priceChangeEl.className = 'price-change positive';
        } else if (priceChange < 0) {
            endPriceEl.className = 'price-value down';
            priceChangeEl.className = 'price-change negative';
        } else {
            endPriceEl.className = 'price-value';
            priceChangeEl.className = 'price-change';
        }
        
        // Show the bet result container
        betResultEl.style.display = 'block';

        // Add a visual indicator about what happened
        const winLossMessage = document.createElement('div');
        winLossMessage.style.marginTop = '10px';
        winLossMessage.style.fontWeight = 'bold';
        
        if (finalWinResult) {
            winLossMessage.textContent = "Position: Win";
            winLossMessage.style.color = "#4CAF50";
        } else {
            winLossMessage.textContent = "Position: Loss";
            winLossMessage.style.color = "#f44336";
        }
        
        // Append to bet result
        betResultEl.appendChild(winLossMessage);

        if (finalWinResult) {
            // User wins, add winnings to balance
            const winnings = gameState.betAmount * gameState.selectedMultiplier;
            
            // Add to winnings balance (not topup balance)
            currentUser.walletDetails.winningsBalance += winnings;
            currentUser.walletDetails.totalBalance += winnings;
            
            showNotification(`Congratulations! You won ₹${winnings.toFixed(2)}`, "success");
            
            // Check if user should be added to leaderboard
            checkUserForLeaderboard(winnings);
        } else {
            // User already had bet amount deducted when starting
            showNotification('Sorry, you lost this round.', "error");
        }

        updateWalletBalance();

        // Remove reference line after a short delay to let user see final position
        setTimeout(() => {
            if (gameState.referenceLine) {
                gameState.referenceLine.remove();
                gameState.referenceLine = null;
            }
            if (gameState.referenceLabel) {
                gameState.referenceLabel.remove();
                gameState.referenceLabel = null;
            }
            
            // Reset game state
            gameState.isGameRunning = false;
            gameState.selectedTime = null;
            gameState.selectedDirection = null;
            gameState.selectedMultiplier = null;
            gameState.betAmount = 50; // Reset to default bet amount
            
            // Reset input field to default value
            document.getElementById('bet-amount').value = '50';
            
            timeButtons.forEach(btn => btn.classList.remove('active'));
            directionButtons.forEach(btn => btn.classList.remove('active'));
            multiplierButtons.forEach(btn => btn.classList.remove('active'));
            
            // Hide bet result after a delay
            setTimeout(() => {
                betResultEl.style.display = 'none';
                // Remove the win/loss message for next bet
                if (betResultEl.lastChild === winLossMessage) {
                    betResultEl.removeChild(winLossMessage);
                }
            }, 5000);
        }, 2000);
        
        // Clear timer interval
        clearInterval(gameState.timerInterval);
    }

    // Wallet functionality
    const walletModal = document.getElementById('walletModal');
    const walletBtn = document.getElementById('walletBtn');
    const closeWallet = document.getElementById('closeWallet');

    walletBtn.addEventListener('click', () => {
        walletModal.style.display = 'block';
    });

    closeWallet.addEventListener('click', () => {
        walletModal.style.display = 'none';
    });

    // Bank transfer
    const bankTransferModal = document.getElementById('bankTransferModal');
    const bankTransferBtn = document.getElementById('bankTransferBtn');
    const closeBankTransfer = document.getElementById('closeBankTransfer');
    const bankTransferForm = document.getElementById('bankTransferForm');
    const processingOverlay = document.getElementById('processingOverlay');

    bankTransferBtn.addEventListener('click', () => {
        // Check if user has enough winnings balance
        if (currentUser.walletDetails.winningsBalance < 500) {
            alert('Minimum withdrawal amount is ₹500 and you can only withdraw your winnings. Your current winnings balance is ₹' + 
                  currentUser.walletDetails.winningsBalance.toFixed(2) + '. Play more to increase your winnings!');
            return;
        }
        
        walletModal.style.display = 'none';
        bankTransferModal.style.display = 'block';
    });

    closeBankTransfer.addEventListener('click', () => {
        bankTransferModal.style.display = 'none';
    });

    bankTransferForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const accountDetails = {
            accountNumber: document.getElementById('accountNumber').value,
            ifscCode: document.getElementById('ifscCode').value,
            accountName: document.getElementById('accountName').value
        };
        
        bankTransferModal.style.display = 'none';
        
        // Show processing overlay with queue
        showProcessingOverlay('bank', accountDetails);
    });

    // UPI transfer
    const upiModal = document.getElementById('upiModal');
    const upiBtn = document.getElementById('upiBtn');
    const closeUpi = document.getElementById('closeUpi');
    const upiForm = document.getElementById('upiForm');

    upiBtn.addEventListener('click', () => {
        // Check if user has enough winnings balance
        if (currentUser.walletDetails.winningsBalance < 500) {
            alert('Minimum withdrawal amount is ₹500 and you can only withdraw your winnings. Your current winnings balance is ₹' + 
                  currentUser.walletDetails.winningsBalance.toFixed(2) + '. Play more to increase your winnings!');
            return;
        }
        
        walletModal.style.display = 'none';
        upiModal.style.display = 'block';
    });

    closeUpi.addEventListener('click', () => {
        upiModal.style.display = 'none';
    });

    upiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const upiDetails = {
            upiId: document.getElementById('upiId').value
        };
        
        upiModal.style.display = 'none';
        
        // Show processing overlay with queue
        showProcessingOverlay('upi', upiDetails);
    });

    // Function to show processing overlay with queue
    function showProcessingOverlay(type, details) {
        processingOverlay.style.display = 'flex';
        document.getElementById('processingMessage').textContent = 'Processing your withdrawal...';
        
        // Generate random queue number (not more than 3000)
        const queueNumber = Math.floor(Math.random() * 3000) + 1;
        document.getElementById('queuePosition').textContent = queueNumber;
        
        // Decrease queue number slowly
        let currentQueue = queueNumber;
        const queueInterval = setInterval(() => {
            currentQueue -= Math.floor(Math.random() * 5) + 1;
            
            if (currentQueue <= 0) {
                clearInterval(queueInterval);
                currentQueue = 0;
                
                // Show okay button
                document.getElementById('processingMessage').textContent = 'Your withdrawal request has been received!';
                document.getElementById('queueMessage').textContent = 'Your money will be transferred within 24 hours.';
                document.getElementById('processingOkayBtn').style.display = 'block';
                
                // Open WhatsApp
                const whatsappNumber = '919408692305';
                const message = `I'm ${currentUser.name} and I have won ₹${currentUser.walletDetails.winningsBalance.toFixed(2)}. Please transfer it to my ${type === 'bank' ? 'bank account' : 'UPI ID'}: ${type === 'bank' ? details.accountNumber + ' (IFSC: ' + details.ifscCode + ', Name: ' + details.accountName + ')' : details.upiId}`;
                
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            }
            
            document.getElementById('queuePosition').textContent = currentQueue;
        }, 300);
        
        // Store the interval for cleanup
        processingOverlay.dataset.queueInterval = queueInterval;
        
        // Store details for receipt generation
        processingOverlay.dataset.withdrawalType = type;
        processingOverlay.dataset.withdrawalDetails = JSON.stringify(details);
    }
    
    // Okay button in processing overlay
    document.getElementById('processingOkayBtn').addEventListener('click', () => {
        // Clear interval
        clearInterval(processingOverlay.dataset.queueInterval);
        
        // Generate and download receipt
        const type = processingOverlay.dataset.withdrawalType;
        const details = JSON.parse(processingOverlay.dataset.withdrawalDetails);
        
        generateReceipt(type, details);
        
        // Hide overlay
        processingOverlay.style.display = 'none';
        document.getElementById('processingOkayBtn').style.display = 'none';
    });

    // Generate receipt
    function generateReceipt(type, details) {
        const receiptContainer = document.getElementById('receiptContainer');
        receiptContainer.innerHTML = '';
        
        // Create receipt element
        const receipt = document.createElement('div');
        receipt.className = 'receipt';
        
        const date = new Date().toLocaleString();
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        
        // QR Code data
        const qrData = JSON.stringify({
            name: currentUser.name,
            amount: currentUser.walletDetails.winningsBalance,
            mobile: currentUser.mobile
        });
        
        receipt.innerHTML = `
            <div class="receipt-header">
                <div id="qrCode"></div>
                <div style="text-align: right;">${date}</div>
            </div>
            <div class="receipt-title">C-Coin</div>
            <div class="receipt-details">
                <p><strong>Name:</strong> ${currentUser.name}</p>
                <p><strong>Mobile:</strong> ${currentUser.mobile}</p>
                <p><strong>Email:</strong> ${userData.email || 'N/A'}</p>
                ${type === 'bank' ? `
                    <p><strong>Account Number:</strong> ${details.accountNumber}</p>
                    <p><strong>IFSC Code:</strong> ${details.ifscCode}</p>
                    <p><strong>Account Holder Name:</strong> ${details.accountName}</p>
                ` : `
                    <p><strong>UPI ID:</strong> ${details.upiId}</p>
                `}
                <p><strong>Withdrawal Amount:</strong> ₹${currentUser.walletDetails.winningsBalance.toFixed(2)}</p>
            </div>
            <div class="receipt-footer">
                Thank you from Pradeep Yadav
            </div>
        `;
        
        receiptContainer.appendChild(receipt);
        
        // Make receipt visible for HTML2Canvas to capture it properly
        receiptContainer.style.display = 'block';
        receiptContainer.style.position = 'fixed';
        receiptContainer.style.top = '-9999px';
        
        // Generate QR code
        try {
            QRCode.toCanvas(
                document.getElementById('qrCode'), 
                qrData, 
                {
                    width: 100,
                    margin: 1,
                    color: {
                        dark: '#000',
                        light: '#FFF'
                    }
                },
                function(error) {
                    if (error) {
                        console.error('QR Code generation error:', error);
                    }
                    
                    // Wait a moment for the QR code to render
                    setTimeout(() => {
                        // Take screenshot and download
                        html2canvas(receipt, {
                            allowTaint: true,
                            useCORS: true,
                            scale: 2
                        }).then(canvas => {
                            const img = canvas.toDataURL('image/png');
                            const link = document.createElement('a');
                            link.href = img;
                            link.download = 'c-coin-receipt.png';
                            link.click();
                            
                            // Clean up and hide receipt container
                            setTimeout(() => {
                                receiptContainer.style.display = 'none';
                                
                                // Reset winnings balance after withdrawal
                                const withdrawalAmount = currentUser.walletDetails.winningsBalance;
                                currentUser.walletDetails.winningsBalance = 0;
                                currentUser.walletDetails.totalBalance -= withdrawalAmount;
                                updateWalletBalance();
                                
                                // Alert user
                                showNotification('Receipt downloaded. Money will be transferred within 24 hours.', "success");
                            }, 500);
                        }).catch(err => {
                            console.error('Error generating receipt image:', err);
                            alert('There was an error generating the receipt. Please try again.');
                        });
                    }, 500);
                }
            );
        } catch (error) {
            console.error('QRCode error:', error);
            alert('Error generating QR code. Please try again.');
            receiptContainer.style.display = 'none';
        }
    }

    // Start game when all selections are made
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('time-btn') || 
            e.target.classList.contains('direction-btn') || 
            e.target.classList.contains('multiplier-btn')) {
            
            
            if (gameState.selectedTime && gameState.selectedDirection && gameState.selectedMultiplier) {
                startGame();
            }
        }
    });

    // Handle window resize events for responsive design
    window.addEventListener('resize', function() {
        // Update chart options for responsive design
        const isMobile = window.innerWidth <= 768;
        
        chart.options.scales.y.ticks.font.size = isMobile ? 8 : 10;
        chart.options.scales.y.ticks.maxTicksLimit = isMobile ? 6 : 8;
        chart.data.datasets[0].borderWidth = isMobile ? 1.5 : 2;
        
        chart.update();
        
        // Update reference line if it exists
        if (gameState.referenceLine) {
            updateReferenceLine();
        }
    });

    // Virtual Tour functionality
    function startTour() {
        const tourOverlay = document.getElementById('tourOverlay');
        const tourSteps = document.querySelectorAll('.tour-step');
        const prevStepBtn = document.getElementById('prevStep');
        const nextStepBtn = document.getElementById('nextStep');
        const skipTourBtn = document.getElementById('skipTour');
        const tourProgress = document.getElementById('tourProgress');
        const tourPointer = document.getElementById('tourPointer');
        
        let currentStep = 1;
        const totalSteps = tourSteps.length;
        
        // Create progress dots
        for (let i = 1; i <= totalSteps; i++) {
            const dot = document.createElement('div');
            dot.className = 'tour-dot' + (i === 1 ? ' active' : '');
            tourProgress.appendChild(dot);
        }
        
        // Show the tour overlay
        tourOverlay.style.display = 'flex';
        
        // Show the first step
        showStep(currentStep);
        
        // Add event listeners
        prevStepBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
        
        nextStepBtn.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
            } else {
                // End of tour
                endTour();
            }
        });
        
        skipTourBtn.addEventListener('click', endTour);
        
        // Show a specific step
        function showStep(step) {
            // Hide all steps
            tourSteps.forEach(stepEl => stepEl.classList.remove('active'));
            
            // Show current step
            const currentStepEl = document.querySelector(`.tour-step[data-step="${step}"]`);
            currentStepEl.classList.add('active');
            
            // Update buttons
            prevStepBtn.disabled = step === 1;
            nextStepBtn.textContent = step === totalSteps ? 'Finish' : 'Next';
            
            // Update progress dots
            const dots = tourProgress.querySelectorAll('.tour-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index + 1 === step);
            });
            
            // Position pointer based on current step
            positionPointer(step);
        }
        
        // Position the animated pointer to highlight different elements
        function positionPointer(step) {
            let targetElement = null;
            
            // Get the element to highlight based on the step
            switch(step) {
                case 2:
                    targetElement = document.querySelector('.chart-container');
                    break;
                case 3:
                    targetElement = document.querySelector('.time-options');
                    break;
                case 4:
                    targetElement = document.querySelector('.direction-options');
                    break;
                case 5:
                    targetElement = document.querySelector('.multiplier-options');
                    break;
                case 6:
                    targetElement = document.querySelector('.bet-amount-container');
                    break;
                case 7:
                    // Just point to the chart for reference line explanation
                    targetElement = document.querySelector('.chart-container');
                    break;
                case 8:
                    targetElement = document.getElementById('walletBtn');
                    break;
                default:
                    // Hide pointer for intro and conclusion slides
                    tourPointer.style.display = 'none';
                    return;
            }
            
            if (targetElement) {
                // Get position of the target element
                const rect = targetElement.getBoundingClientRect();
                
                // Position the pointer near the element
                tourPointer.style.top = `${rect.top + rect.height / 2 - 15}px`;
                tourPointer.style.left = `${rect.left + rect.width / 2 - 15}px`;
                tourPointer.style.display = 'flex';
            }
        }
        
        // End the tour
        function endTour() {
            tourOverlay.style.display = 'none';
            tourPointer.style.display = 'none';
        }
    }

    // Initialize the leaderboard with tracking for current user
    initializeLeaderboard();
    
    // Set up event listeners for the game
    setupEventListeners();

    // Top up functionality
    const topupButtons = document.querySelectorAll('.topup-btn');
    const transactionIdModal = document.getElementById('transactionIdModal');
    const transactionForm = document.getElementById('transactionForm');
    
    topupButtons.forEach(button => {
        button.addEventListener('click', () => {
            const amount = parseInt(button.dataset.amount);
            const bonus = parseInt(button.dataset.bonus);
            const upiId = 'ak5494678-1@okaxis';
            
            // Open UPI app
            window.open(`upi://pay?pa=${upiId}&pn=Pradeep%20Yadav&am=${amount}&cu=INR`, '_blank');
            
            // Show transaction ID modal
            transactionIdModal.style.display = 'block';
            
            // Store the amount and bonus in the form for later use
            transactionForm.dataset.amount = amount;
            transactionForm.dataset.bonus = bonus;
        });
    });
    
    // Handle transaction ID submission
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const transactionIdInput = document.getElementById('transactionId');
        const transactionId = transactionIdInput.value;
        const errorElement = document.getElementById('transactionIdError');
        
        // Validate transaction ID (must be 12 digits starting with 5)
        const transactionIdPattern = /^5[0-9]{11}$/;
        
        if (!transactionIdPattern.test(transactionId)) {
            errorElement.style.display = 'block';
            transactionIdInput.focus();
            return;
        }
        
        // Hide error message if validation passes
        errorElement.style.display = 'none';
        
        const amount = parseInt(transactionForm.dataset.amount);
        const bonus = parseInt(transactionForm.dataset.bonus);
        const whatsappNumber = '919408692305';
        const message = `Hi it's ${currentUser.name}, I've done payment of ₹${amount} and my reference/transaction id for payment is ${transactionId}`;
        
        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        const whatsappWindow = window.open(whatsappUrl, '_blank');
        
        // Add a delay to make sure the WhatsApp window opens
        setTimeout(() => {
            // Add to topup balance, not winnings balance
            currentUser.walletDetails.topupBalance += bonus;
            currentUser.walletDetails.totalBalance += bonus;
            updateWalletBalance();
            
            // If we have extra bets data, process it
            if (transactionForm.dataset.extraBets) {
                const extraBets = parseInt(transactionForm.dataset.extraBets);
                
                // Add the extra bets to the user
                currentUser.betTracking.extraBetsPurchased += extraBets;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Show notification about extra bets
                setTimeout(() => {
                    showNotification(`You've received ${extraBets} extra bets!`, "success");
                }, 1500);
                
                // Remove the extraBets data to avoid reprocessing
                delete transactionForm.dataset.extraBets;
            }
            
            // Close the transaction ID modal
            transactionIdModal.style.display = 'none';
            
            // Reset the form
            document.getElementById('transactionId').value = '';
            
            showNotification(`₹${bonus} added to your wallet successfully!`, "success");
        }, 1000);
    });

    // Extra bets functionality
    const extraBetsButtons = document.querySelectorAll('.extra-bets-btn');
    const closeExtraBets = document.getElementById('closeExtraBets');
    const extraBetsModal = document.getElementById('extraBetsModal');
    
    extraBetsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const amount = parseInt(button.dataset.amount);
            const bonus = parseInt(button.dataset.bonus);
            const extraBets = parseInt(button.dataset.bets);
            const upiId = 'ak5494678-1@okaxis';
            
            // Open UPI app
            window.open(`upi://pay?pa=${upiId}&pn=Pradeep%20Yadav&am=${amount}&cu=INR`, '_blank');
            
            // Hide extra bets modal
            extraBetsModal.style.display = 'none';
            
            // Show transaction ID modal
            transactionIdModal.style.display = 'block';
            
            // Store the details in the form for later use
            transactionForm.dataset.amount = amount;
            transactionForm.dataset.bonus = bonus;
            transactionForm.dataset.extraBets = extraBets;
        });
    });
    
    closeExtraBets.addEventListener('click', () => {
        extraBetsModal.style.display = 'none';
    });

    // Spin wheel functionality
    const spinButton = document.getElementById('spinButton');
    const spinWheel = document.getElementById('spinWheel');
    const spinCountdown = document.getElementById('spinCountdown');
    const spinTimer = document.getElementById('spinTimer');
    
    // Check if spin timer should be displayed
    if (currentUser.spinTracking.spinsRemaining <= 0 && currentUser.spinTracking.nextSpinTime) {
        // Show countdown
        spinButton.disabled = true;
        spinCountdown.style.display = 'block';
        
        // Start countdown
        updateSpinCountdown();
        const countdown = setInterval(updateSpinCountdown, 1000);
        
        // Store countdown interval for cleanup
        spinButton.dataset.countdownInterval = countdown;
    }
    
    // Function to update spin countdown
    function updateSpinCountdown() {
        const now = new Date().getTime();
        const nextSpinTime = new Date(currentUser.spinTracking.nextSpinTime).getTime();
        
        // Calculate the time difference
        const timeDiff = nextSpinTime - now;
        
        if (timeDiff <= 0) {
            // Reset spin count
            clearInterval(spinButton.dataset.countdownInterval);
            currentUser.spinTracking.spinsRemaining = 2;
            currentUser.spinTracking.nextSpinTime = null;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            spinButton.disabled = false;
            spinCountdown.style.display = 'none';
            
            showNotification('You have 2 spins available now!', "info");
        } else {
            // Calculate hours, minutes, seconds
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            // Update timer display
            spinTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    // Spin button click event
    spinButton.addEventListener('click', () => {
        // Check if spins are available
        if (currentUser.spinTracking.spinsRemaining <= 0) {
            showNotification('No spins available. Wait for the countdown to finish.', "warning");
            return;
        }
        
        // Disable button during spin
        spinButton.disabled = true;
        
        // Determine the result based on the probability
        // 70% chance of better luck next time, 18% chance of ₹10, 8% chance of ₹20, 4% chance of ₹30
        const random = Math.random() * 100;
        let prize;
        let degrees;
        
        if (random < 70) {
            // Better luck next time (sectors 0, 2, 4)
            const betterLuckSectors = [0, 2, 4];
            const randomSector = betterLuckSectors[Math.floor(Math.random() * betterLuckSectors.length)];
            prize = "better-luck";
            degrees = randomSector * 60 + Math.random() * 50 + 5; // Random degree within the sector
        } else if (random < 88) {
            // ₹10 bonus (sector 1)
            prize = "rs10";
            degrees = 1 * 60 + Math.random() * 50 + 5;
        } else if (random < 96) {
            // ₹20 bonus (sector 3)
            prize = "rs20";
            degrees = 3 * 60 + Math.random() * 50 + 5;
        } else {
            // ₹30 bonus (sector 5)
            prize = "rs30";
            degrees = 5 * 60 + Math.random() * 50 + 5;
        }
        
        // Add extra rotations (5 full rotations)
        degrees += 360 * 5;
        
        // Apply rotation
        spinWheel.style.transition = 'transform 3s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
        spinWheel.style.transform = `rotate(${degrees}deg)`;
        
        // Process the result after spin animation
        setTimeout(() => {
            // Decrement available spins
            currentUser.spinTracking.spinsRemaining--;
            
            // If no spins left, set the next spin time to 24 hours from now
            if (currentUser.spinTracking.spinsRemaining <= 0) {
                // Set next spin time to next midnight
                const tomorrow = new Date();
                tomorrow.setHours(24, 0, 0, 0);
                currentUser.spinTracking.nextSpinTime = tomorrow.toISOString();
                
                // Show countdown
                spinCountdown.style.display = 'block';
                updateSpinCountdown();
                const countdown = setInterval(updateSpinCountdown, 1000);
                spinButton.dataset.countdownInterval = countdown;
            }
            
            // Save to localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Process prize
            let prizeAmount = 0;
            let message = '';
            
            if (prize === "rs10") {
                prizeAmount = 10;
                message = 'Congratulations! You won ₹10 bonus!';
            } else if (prize === "rs20") {
                prizeAmount = 20;
                message = 'Congratulations! You won ₹20 bonus!';
            } else if (prize === "rs30") {
                prizeAmount = 30;
                message = 'Congratulations! You won ₹30 bonus!';
            } else {
                message = 'Better luck next time!';
            }
            
            // Add prize to user's balance if they won
            if (prizeAmount > 0) {
                currentUser.walletDetails.winningsBalance += prizeAmount;
                currentUser.walletDetails.totalBalance += prizeAmount;
                updateWalletBalance();
            }
            
            // Show notification
            showNotification(message, prizeAmount > 0 ? "success" : "info");
            
            // Re-enable button if spins are still available
            spinButton.disabled = currentUser.spinTracking.spinsRemaining <= 0;
        }, 3000);
    });

    // Referral system functionality
    const copyReferralBtn = document.getElementById('copyReferral');
    const shareWhatsAppBtn = document.getElementById('shareWhatsApp');
    const shareInstagramBtn = document.getElementById('shareInstagram');
    const submitReferralBtn = document.getElementById('submitReferral');
    const referralCodeInput = document.getElementById('referralCodeInput');
    
    // Update user referral code display
    document.getElementById('userReferralCode').textContent = currentUser.referralCode || '-';
    
    // Copy referral code
    copyReferralBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentUser.referralCode)
            .then(() => {
                showNotification('Referral code copied to clipboard!', "success");
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
                showNotification('Failed to copy. Please try again.', "error");
            });
    });
    
    // Share on WhatsApp
    shareWhatsAppBtn.addEventListener('click', () => {
        const message = `Join C-Coin and get great rewards! Use my referral code ${currentUser.referralCode} to get ₹100 bonus! Play Now at https://aforai.xyz/c-coin/index.html`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    });
    
    // Share on Instagram (opens Instagram app)
    shareInstagramBtn.addEventListener('click', () => {
        alert('Open Instagram app and share the following referral code: ' + currentUser.referralCode);
        // This just leads to Instagram, actual sharing would need to be done by the user
        window.open('https://www.instagram.com/', '_blank');
    });
    
    // Submit referral code
    submitReferralBtn.addEventListener('click', () => {
        const referralCode = referralCodeInput.value.trim();
        
        // Check if referral code is valid (NAME in caps followed by 3 digits)
        const referralPattern = /^[A-Z]+\d{3}$/;
        
        if (!referralPattern.test(referralCode)) {
            showNotification('Invalid referral code format.', "error");
            return;
        }
        
        // Check if user has already used a referral code
        if (currentUser.usedReferralCode) {
            showNotification('You have already used a referral code.', "warning");
            return;
        }
        
        // Don't allow using own referral code
        if (referralCode === currentUser.referralCode) {
            showNotification('You cannot use your own referral code.', "error");
            return;
        }
        
        // Add referral bonus
        currentUser.walletDetails.winningsBalance += 100;
        currentUser.walletDetails.totalBalance += 100;
        currentUser.usedReferralCode = referralCode;
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update wallet balance
        updateWalletBalance();
        
        // Clear input
        referralCodeInput.value = '';
        
        // Show notification
        showNotification('Referral code applied! ₹100 bonus added to your wallet.', "success");
    });
});

function setupEventListeners() {
    // Add event listener for the refresh leaderboard button
    document.getElementById('refreshLeaderboard').addEventListener('click', function() {
        showNotification("Refreshing leaderboard...", "info");
        updateLeaderboard();
    });
    
    // Minimum bet amount enforcement
    const betAmountInput = document.getElementById('bet-amount');
    betAmountInput.addEventListener('change', function() {
        const value = parseFloat(this.value);
        if (value < 35) {
            this.value = 35;
            showNotification("Minimum bet amount is ₹35", "warning");
        }
    });
    
    // Validate transaction ID input with the pattern
    const transactionIdInput = document.getElementById('transactionId');
    transactionIdInput.addEventListener('input', function() {
        const errorElement = document.getElementById('transactionIdError');
        const transactionIdPattern = /^5[0-9]{11}$/;
        
        if (this.value && !transactionIdPattern.test(this.value)) {
            errorElement.style.display = 'block';
        } else {
            errorElement.style.display = 'none';
        }
    });
}

function initializeLeaderboard() {
    // Check if we have stored leaderboard data
    let leaderboardData = JSON.parse(localStorage.getItem('leaderboardData'));
    
    // If no stored data, create default leaderboard
    if (!leaderboardData) {
        leaderboardData = [
            { name: "Hindu_Trader", profit: 9580, displayProfit: "₹4,580.00", winRate: "78%", verified: true },
            { name: "CryptoKing", profit: 5290, displayProfit: "₹3,290.00", winRate: "65%", verified: true },
            { name: "HarshadBull", profit: 3456, displayProfit: "₹2,456.00", winRate: "71%", verified: true },
            { name: "WaveRider", profit: 1985, displayProfit: "₹1,985.00", winRate: "62%", verified: true },
            { name: "Prashant Yadav", profit: 1740, displayProfit: "₹1,190.00", winRate: "59%", verified: true }
        ];
        
        // Store initial leaderboard
        localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
    }
    
    renderLeaderboard(leaderboardData);
}

function renderLeaderboard(leaderboardData) {
    const leaderboardList = document.getElementById('leaderboardList');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    leaderboardList.innerHTML = '';
    
    // Render each trader in the leaderboard
    leaderboardData.forEach((trader, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'leaderboard-item';
        
        // Check if this is the current user
        const isCurrentUser = trader.name === currentUser.name;
        if (isCurrentUser) {
            listItem.classList.add('current-user');
        }
        
        listItem.innerHTML = `
            <div class="leaderboard-user">
                <div class="leaderboard-rank">${index + 1}</div>
                <div class="leaderboard-name">${trader.name}${isCurrentUser ? ' (You)' : ''}${trader.verified ? '<span class="verified-badge">✓</span>' : ''}</div>
            </div>
            <div class="leaderboard-stats">
                <div class="leaderboard-profit">${trader.displayProfit}</div>
                <div class="leaderboard-winrate">Win: ${trader.winRate}</div>
            </div>
        `;
        
        leaderboardList.appendChild(listItem);
    });
}

function updateLeaderboard() {
    // Get current leaderboard data
    let leaderboardData = JSON.parse(localStorage.getItem('leaderboardData'));
    
    // Simulate fetching updated data
    leaderboardList.style.opacity = '0.5';
    
    setTimeout(() => {
        // Shuffle positions slightly to simulate real-time updates
        leaderboardData.sort((a, b) => (Math.random() > 0.7 ? 1 : -1) * (a.profit - b.profit));
        
        // Update display profits after sorting
        leaderboardData.forEach(trader => {
            trader.displayProfit = `₹${trader.profit.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        });
        
        // Store updated leaderboard
        localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
        
        // Render updated leaderboard
        renderLeaderboard(leaderboardData);
        
        leaderboardList.style.opacity = '1';
    }, 1500);
}

// Function to check if the current user should be in the leaderboard
function checkUserForLeaderboard(winAmount) {
    // Only consider significant wins
    if (winAmount < 500) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let leaderboardData = JSON.parse(localStorage.getItem('leaderboardData'));
    
    // Find if user already exists in leaderboard
    let userInLeaderboard = leaderboardData.find(trader => trader.name === currentUser.name);
    
    // Get user's profit from their wallet balance or create entry
    if (userInLeaderboard) {
        // Update existing user's profit
        userInLeaderboard.profit += winAmount;
        userInLeaderboard.displayProfit = `₹${userInLeaderboard.profit.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        
        // Update win rate (simulated)
        const newWinRate = parseInt(userInLeaderboard.winRate) + Math.floor(Math.random() * 3);
        userInLeaderboard.winRate = `${Math.min(newWinRate, 95)}%`;
    } else {
        // Add user to leaderboard with their current balance
        const userProfit = Math.round(currentUser.walletDetails.winningsBalance);
        leaderboardData.push({
            name: currentUser.name,
            profit: userProfit,
            displayProfit: `₹${userProfit.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
            winRate: `${50 + Math.floor(Math.random() * 15)}%`,
            verified: false
        });
    }
    
    // Sort leaderboard by profit
    leaderboardData.sort((a, b) => b.profit - a.profit);
    
    // Keep only top 5
    if (leaderboardData.length > 5) {
        leaderboardData = leaderboardData.slice(0, 5);
    }
    
    // Save updated leaderboard
    localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
    
    // Render the updated leaderboard
    renderLeaderboard(leaderboardData);
    
    // If user made it to the top 5, show a notification
    if (leaderboardData.some(trader => trader.name === currentUser.name)) {
        showNotification("Congratulations! You've made it to the leaderboard! 🏆", "success");
    }
}

// C-Coin Animation Functions
function setupCCoinAnimations() {
    const titleElement = document.querySelector('.title');
    const animations = ['pulse', 'bounce', 'glowing', 'rotate', 'shake'];
    let currentAnimation = 0;
    
    // Apply first animation
    titleElement.classList.add(animations[currentAnimation]);
    
    // Change animation every 3 seconds
    setInterval(() => {
        // Remove current animation
        titleElement.classList.remove(animations[currentAnimation]);
        
        // Move to next animation
        currentAnimation = (currentAnimation + 1) % animations.length;
        
        // Apply next animation
        titleElement.classList.add(animations[currentAnimation]);
    }, 3000);
}

// Function to show notifications
function showNotification(message, type = "info") {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    
    // Set message and type
    text.textContent = message;
    
    // Apply appropriate styles based on notification type
    notification.className = 'notification'; // Reset class
    notification.classList.add(`notification-${type}`);
    
    // Show notification
    notification.style.display = 'flex';
    
    // Animate in
    notification.style.transform = 'translateY(0)';
    notification.style.opacity = '1';
    
    // Hide after delay
    setTimeout(() => {
        notification.style.transform = 'translateY(-20px)';
        notification.style.opacity = '0';
        
        // After animation completes, set display to none
        setTimeout(() => {
            notification.style.display = 'none';
        }, 500);
    }, 4000);
} 
