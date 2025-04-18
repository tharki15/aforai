document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

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
        walletBalance.textContent = `Wallet Balance: ₹${currentUser.walletBalance.toFixed(2)}`;
        mainWalletBalance.textContent = `Wallet: ₹${currentUser.walletBalance.toFixed(2)}`;
        
        // Update user data in localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            userData.walletBalance = currentUser.walletBalance;
            localStorage.setItem('userData', JSON.stringify(userData));
        }
        
        // Update current user in localStorage
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
        
        // Check if user has enough balance
        if (currentUser.walletBalance < betAmount) {
            alert('Insufficient balance! Please add funds to your wallet.');
            return;
        }
        
        // Store the bet amount
        gameState.betAmount = betAmount;
        
        // Check if potential loss would make balance negative
        const potentialLoss = betAmount;
        if (currentUser.walletBalance - potentialLoss < 0) {
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
        currentUser.walletBalance -= betAmount;
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
        const finalPrice = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
        
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

        // Log detailed information for debugging
        console.log({
            direction: gameState.selectedDirection,
            referencePrice: gameState.referencePrice,
            finalPrice: finalPrice,
            difference: finalPrice - gameState.referencePrice,
            rawIsWin: isWin,
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

        // Always make the user win if their position is correct
        let finalWinResult = isWin;
        let riggedReason = "";

        // COMMENTING OUT THE RIGGING LOGIC
        // Calculate potential win amount
        /*
        const winAmount = gameState.betAmount * gameState.selectedMultiplier;

        // Check if user is close to 300 and should lose
        const potentialBalance = currentUser.walletBalance + winAmount;
        if (potentialBalance >= 300) {
            finalWinResult = false;
            riggedReason = "Balance limit reached (₹300)";
            console.log("Forcing loss due to balance cap");
            gameState.consecutiveLosses = 0;
        }
        // Force 3 consecutive losses randomly only if not overriding a legitimate win
        else if (gameState.consecutiveLosses < 3 && Math.random() < 0.3) {
            finalWinResult = false;
            riggedReason = "Random outcome";
            console.log("Forcing random loss");
            gameState.consecutiveLosses++;
        } else {
            // If user legitimately won based on chart, let them win
            finalWinResult = isWin;
            gameState.consecutiveLosses = 0;
        }
        */

        // Add a visual indicator about what happened
        const winLossMessage = document.createElement('div');
        winLossMessage.style.marginTop = '10px';
        winLossMessage.style.fontWeight = 'bold';
        
        if (isWin) {
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
            currentUser.walletBalance += winnings;
            alert(`Congratulations! You won ₹${winnings.toFixed(2)}`);
        } else {
            // User already had bet amount deducted when starting
            if (riggedReason) {
                alert(`Sorry, you lost this round. (Reason: ${riggedReason})`);
            } else {
                alert('Sorry, you lost this round.');
            }
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

    bankTransferBtn.addEventListener('click', () => {
        if (currentUser.walletBalance < 300) {
            alert('Minimum withdrawal amount is ₹300');
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
        
        alert('Money will be credited within 24 hours.');
        generateReceipt('bank', accountDetails);
        bankTransferModal.style.display = 'none';
    });

    // UPI transfer
    const upiModal = document.getElementById('upiModal');
    const upiBtn = document.getElementById('upiBtn');
    const closeUpi = document.getElementById('closeUpi');
    const upiForm = document.getElementById('upiForm');

    upiBtn.addEventListener('click', () => {
        if (currentUser.walletBalance < 300) {
            alert('Minimum withdrawal amount is ₹300');
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
        
        alert('Money will be credited within 24 hours.');
        generateReceipt('upi', upiDetails);
        upiModal.style.display = 'none';
    });

    // Transaction ID modal
    const transactionIdModal = document.getElementById('transactionIdModal');
    const transactionForm = document.getElementById('transactionForm');
    
    // Top up functionality
    const topupButtons = document.querySelectorAll('.topup-btn');
    topupButtons.forEach(button => {
        button.addEventListener('click', () => {
            const amount = parseInt(button.dataset.amount);
            const upiId = 'ak5494678-1@okaxis';
            
            // Open UPI app
            window.open(`upi://pay?pa=${upiId}&pn=Pradeep%20Yadav&am=${amount}&cu=INR`, '_blank');
            
            // Show transaction ID modal
            transactionIdModal.style.display = 'block';
            
            // Store the amount in the form for later use
            transactionForm.dataset.amount = amount;
        });
    });
    
    // Handle transaction ID submission
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const transactionId = document.getElementById('transactionId').value;
        const amount = parseInt(transactionForm.dataset.amount);
        const whatsappNumber = '919408692305';
        const message = `Hi it's ${currentUser.name}, I've done payment of ₹${amount} and my reference/transaction id for payment is ${transactionId}`;
        
        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        const whatsappWindow = window.open(whatsappUrl, '_blank');
        
        // Update wallet balance based on amount
        let bonus = 0;
        if (amount === 50) bonus = 100;
        else if (amount === 100) bonus = 250;
        else if (amount === 200) bonus = 500;
        
        // Add a delay to make sure the WhatsApp window opens
        setTimeout(() => {
            currentUser.walletBalance += bonus;
            updateWalletBalance();
            
            // Close the transaction ID modal
            transactionIdModal.style.display = 'none';
            
            // Reset the form
            document.getElementById('transactionId').value = '';
            
            alert(`₹${bonus} added to your wallet successfully!`);
        }, 1000);
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
            amount: currentUser.walletBalance,
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
                <p><strong>Amount:</strong> ₹${currentUser.walletBalance}</p>
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
                                
                                // Reset wallet balance after withdrawal
                                currentUser.walletBalance = 0;
                                updateWalletBalance();
                                
                                // Alert user
                                alert('Receipt downloaded. Money will be credited within 24 hours.');
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
}); 