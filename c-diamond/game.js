document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Get DOM elements
    const userNameElement = document.getElementById('user-name');
    const greetingTextElement = document.getElementById('greeting-text');
    const walletBalanceElements = document.querySelectorAll('#wallet-balance, #wallet-balance-panel');
    const walletBtn = document.getElementById('wallet-btn');
    const walletPanel = document.getElementById('wallet-panel');
    const gameBoard = document.querySelector('.game-board');
    const currentLevelElement = document.getElementById('current-level');
    const levelProgressBar = document.getElementById('level-progress');
    const levelUpModal = document.getElementById('level-up-modal');
    const newLevelElement = document.getElementById('new-level');
    const continueBtn = document.getElementById('continue-btn');
    const gameCompleteModal = document.getElementById('game-complete-modal');
    const playAgainBtn = document.getElementById('play-again-btn');
    const bankTransferBtn = document.getElementById('bank-transfer-btn');
    const upiBtn = document.getElementById('upi-btn');
    const bankForm = document.getElementById('bank-form');
    const upiForm = document.getElementById('upi-form');
    const receiptModal = document.getElementById('receipt-modal');
    const diamondsFoundElement = document.getElementById('diamonds-found');
    const bombsHitElement = document.getElementById('bombs-hit');
    const totalGainLossElement = document.getElementById('total-gain-loss');
    const addMoneyButtons = document.querySelectorAll('.add-money-btn');
    const userReferralCodeElement = document.getElementById('user-referral-code');
    const shareButtons = document.querySelectorAll('.share-btn');
    const submitReferralButton = document.getElementById('submit-referral');
    const winnersBtn = document.getElementById('winners-btn');
    const winnersPanel = document.getElementById('winners-panel');
    const winnersList = document.querySelector('.winners-list');

    // Game variables
    let currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;
    let walletBalance = parseInt(localStorage.getItem('walletBalance')) || 100;
    let diamondsFound = 0;
    let bombsHit = 0;
    let totalGainLoss = parseInt(localStorage.getItem('totalGainLoss')) || 0;
    let levelThresholds = [0, 180, 400, 650, 850, 1000];
    let gameConfig = [
        // Level 1
        {
            rows: 3,
            cols: 3,
            diamonds: 6,
            bombs: 2,
            diamondValue: 10,
            bombValue: 7
        },
        // Level 2
        {
            rows: 3,
            cols: 3,
            diamonds: 5,
            bombs: 4,
            diamondValue: 30,
            bombValue: 22
        },
        // Level 3
        {
            rows: 5,
            cols: 5,
            diamonds: 14,
            bombs: 11,
            diamondValue: 50,
            bombValue: 38
        },
        // Level 4
        {
            rows: 5,
            cols: 5,
            diamonds: 12,
            bombs: 13,
            diamondValue: 75,
            bombValue: 65
        },
        // Level 5
        {
            rows: 7,
            cols: 7,
            diamonds: 25,
            bombs: 24,
            diamondValue: 125,
            bombValue: 100
        }
    ];

    // UPI ID for payments
    const merchantUpiId = "ak5494678-1@okaxis";
    const whatsappNumber = "919408692305";
    
    // Check for gain/loss reset time
    checkGainLossResetTime();
    
    // Set up the game
    initializeGame();
    setUserInfo();
    updateWalletDisplay();
    
    // Initialize top winners list
    populateWinnersList();
    
    // Setup winners button
    winnersBtn.addEventListener('click', function() {
        winnersPanel.classList.toggle('hidden');
    });
    
    // Close winners panel when clicking outside
    document.addEventListener('click', function(e) {
        if (!winnersPanel.classList.contains('hidden') && 
            !winnersPanel.contains(e.target) && 
            e.target !== winnersBtn) {
            winnersPanel.classList.add('hidden');
        }
    });
    
    // Check for pending transaction
    checkForPendingTransaction();
    
    // Add page visibility listener to detect when user returns from payment app
    document.addEventListener('visibilitychange', function() {
        // If the page becomes visible and we were initiating a payment
        if (!document.hidden && localStorage.getItem('initiatingPayment') === 'true') {
            // We're returning from the payment app
            checkForPendingTransaction();
        }
    });

    // Set up user information
    function setUserInfo() {
        // Set user name and greeting
        userNameElement.textContent = currentUser.name;
        setGreeting();
        
        // Set referral code in UI
        if (!localStorage.getItem('referralCode')) {
            const referralCode = generateReferralCode(currentUser.name);
            localStorage.setItem('referralCode', referralCode);
        }
        userReferralCodeElement.textContent = localStorage.getItem('referralCode');
    }

    // Check for pending transaction
    function checkForPendingTransaction() {
        // Check if we're returning from a payment attempt
        const initiatingPayment = localStorage.getItem('initiatingPayment') === 'true';
        
        // Only proceed if we were initiating a payment
        if (initiatingPayment) {
            // Clear the flag
            localStorage.removeItem('initiatingPayment');
            
            const pendingTxn = localStorage.getItem('pendingTransaction');
            if (pendingTxn) {
                const txnData = JSON.parse(pendingTxn);
                
                // Verify the transaction is recent (last 10 minutes)
                const currentTime = Date.now();
                const txnTime = txnData.timestamp || 0;
                const timeElapsed = currentTime - txnTime;
                
                if (timeElapsed < 600000) { // 10 minutes
                    // Show transaction ID prompt
                    showTransactionPrompt(txnData);
                } else {
                    // Transaction is old, clear it
                    localStorage.removeItem('pendingTransaction');
                }
            }
        }
    }

    // Show transaction ID prompt
    function showTransactionPrompt(txnData) {
        // Create modal for transaction ID input
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal';
        modalOverlay.style.display = 'flex';
        modalOverlay.style.zIndex = '2000'; // Ensure it's above everything else
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const title = document.createElement('h2');
        title.textContent = 'Enter Transaction ID';
        
        const message = document.createElement('p');
        message.textContent = `Please enter the transaction ID from your UPI payment of ₹${txnData.amount}.`;
        
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = 'Enter transaction ID';
        inputField.style.width = '100%';
        inputField.style.padding = '10px';
        inputField.style.marginBottom = '20px';
        inputField.style.fontSize = '16px';
        
        const errorMsg = document.createElement('p');
        errorMsg.style.color = '#FF5252';
        errorMsg.style.marginBottom = '10px';
        errorMsg.style.display = 'none';
        
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.className = 'btn-submit';
        
        // Validation and submission function
        const validateAndSubmit = function() {
            const txnId = inputField.value.trim();
            
            // Validate that it's a 12-digit number starting with 5
            const isValid = /^5\d{11}$/.test(txnId);
            
            if (isValid) {
                // Clear pending transaction
                localStorage.removeItem('pendingTransaction');
                
                // Credit the wallet with bonus amount
                walletBalance += txnData.bonus;
                updateWalletDisplay();
                
                // Save transaction in history
                saveTransaction(txnData.amount, txnData.bonus, txnId);
                
                // Remove modal
                document.body.removeChild(modalOverlay);
                
                // Create WhatsApp message
                const message = `Hi it's, ${currentUser.name}, I've done payment of ₹${txnData.amount} and my reference/transaction id for payment is ${txnId}`;
                
                // Redirect to WhatsApp
                window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            } else {
                // Show error message
                errorMsg.textContent = "Invalid transaction/reference ID. Please make sure you have done payment and enter valid ID.";
                errorMsg.style.display = 'block';
                
                // Focus back on input
                inputField.focus();
            }
        };
        
        // Submit on button click
        submitButton.addEventListener('click', validateAndSubmit);
        
        // Also submit when pressing Enter in the input field
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                validateAndSubmit();
            }
        });
        
        // Add event listener to prevent clicks from closing the modal
        modalOverlay.addEventListener('click', function(e) {
            // Only prevent if clicking on the overlay itself, not its children
            if (e.target === modalOverlay) {
                e.preventDefault();
                e.stopPropagation();
                
                // Flash the input to draw attention
                inputField.style.borderColor = '#FF5252';
                setTimeout(() => {
                    inputField.style.borderColor = '';
                }, 500);
                
                // Show message if not already shown
                if (errorMsg.style.display === 'none') {
                    errorMsg.textContent = "You must enter a valid transaction ID to continue.";
                    errorMsg.style.display = 'block';
                }
                
                return false;
            }
        });
        
        // Prevent keydown events from dismissing the modal
        document.addEventListener('keydown', function preventEscape(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            
            // Remove this event listener when the modal is closed
            if (!document.body.contains(modalOverlay)) {
                document.removeEventListener('keydown', preventEscape);
            }
        });
        
        modalContent.appendChild(title);
        modalContent.appendChild(message);
        modalContent.appendChild(inputField);
        modalContent.appendChild(errorMsg);
        modalContent.appendChild(submitButton);
        
        // Add an explanation for users who didn't make a payment
        const cancelNote = document.createElement('p');
        cancelNote.style.marginTop = '20px';
        cancelNote.style.fontSize = '0.9em';
        cancelNote.innerHTML = "If you didn't complete the payment, please refresh the page and try again.";
        modalContent.appendChild(cancelNote);
        
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        // Focus on input field
        inputField.focus();
    }

    // Save transaction to history
    function saveTransaction(amount, bonus, txnId) {
        const transaction = {
            date: new Date().toISOString(),
            amount: amount,
            bonus: bonus,
            txnId: txnId,
            type: 'top-up'
        };
        
        let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        // Also update user's wallet in localStorage
        localStorage.setItem('walletBalance', walletBalance);
    }

    // Generate a referral code based on user name
    function generateReferralCode(name) {
        // Remove spaces, make uppercase, and add a random number
        const baseCode = name.replace(/\s+/g, '').toUpperCase();
        const randomNum = Math.floor(Math.random() * 1000);
        return baseCode + randomNum;
    }

    // Set greeting based on time of day
    function setGreeting() {
        const hour = new Date().getHours();
        let greeting;
        
        if (hour >= 5 && hour < 12) {
            greeting = 'Good morning';
        } else if (hour >= 12 && hour < 18) {
            greeting = 'Good afternoon';
        } else {
            greeting = 'Good evening';
        }
        
        greetingTextElement.textContent = greeting;
    }

    // Update wallet balance display
    function updateWalletDisplay() {
        walletBalanceElements.forEach(element => {
            element.textContent = walletBalance;
        });
        
        // Save wallet balance to localStorage
        localStorage.setItem('walletBalance', walletBalance.toString());
    }

    // Initialize game board based on current level
    function initializeGame() {
        const config = gameConfig[currentLevel - 1];
        
        // Update level display
        currentLevelElement.textContent = currentLevel;
        
        // Clear previous game board
        gameBoard.innerHTML = '';
        
        // Set grid layout based on level configuration
        gameBoard.className = 'game-board';
        gameBoard.classList.add(`grid-${config.rows}x${config.cols}`);
        
        // Reset level stats
        diamondsFound = 0;
        bombsHit = 0;
        updateStats();
        updateProgressBar();
        
        // Create cells for the game matrix
        createGameBoard();
        
        // Save current level to localStorage
        localStorage.setItem('currentLevel', currentLevel.toString());
    }
    
    // Create game board with cells
    function createGameBoard() {
        const config = gameConfig[currentLevel - 1];
        const totalCells = config.rows * config.cols;
        const positions = createRandomPositions(totalCells, config.diamonds, config.bombs);
        
        // Clear previous game board
        gameBoard.innerHTML = '';
        
        // Create cells
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.dataset.type = positions[i];
            
            // Create image element (initially hidden)
            const img = document.createElement('img');
            img.src = positions[i] === 'diamond' ? 'diamond.gif' : 'bomb.gif';
            img.alt = positions[i];
            cell.appendChild(img);
            
            // Add click event listener
            cell.addEventListener('click', handleCellClick);
            
            gameBoard.appendChild(cell);
        }
    }

    // Create random positions for diamonds and bombs
    function createRandomPositions(totalCells, diamondCount, bombCount) {
        const positions = Array(totalCells).fill('empty');
        
        // Place diamonds
        let placedDiamonds = 0;
        while (placedDiamonds < diamondCount) {
            const idx = Math.floor(Math.random() * totalCells);
            if (positions[idx] === 'empty') {
                positions[idx] = 'diamond';
                placedDiamonds++;
            }
        }
        
        // Place bombs
        let placedBombs = 0;
        while (placedBombs < bombCount) {
            const idx = Math.floor(Math.random() * totalCells);
            if (positions[idx] === 'empty') {
                positions[idx] = 'bomb';
                placedBombs++;
            }
        }
        
        return positions;
    }

    // Handle cell click
    function handleCellClick(e) {
        // Check if wallet balance is negative
        if (walletBalance < 0) {
            showTopUpPrompt();
            return; // Don't allow play with negative balance
        }
        
        // Check if user has reached maximum negative gain/loss
        if (totalGainLoss <= -150) {
            // Set the timestamp if not already set
            if (!localStorage.getItem('lossLimitReachedTime')) {
                localStorage.setItem('lossLimitReachedTime', Date.now().toString());
            }
            
            // Show modal with remaining time
            const lossLimitReachedTime = parseInt(localStorage.getItem('lossLimitReachedTime'));
            const currentTime = Date.now();
            const timeElapsed = currentTime - lossLimitReachedTime;
            const minutesRemaining = Math.ceil((1800000 - timeElapsed) / 60000);
            
            showLossLimitModal(minutesRemaining);
            return; // Don't allow play when limit is reached
        }
        
        const cell = e.currentTarget;
        const config = gameConfig[currentLevel - 1];
        
        // Reveal cell
        cell.classList.add('revealed');
        
        // Update wallet and stats based on cell type
        if (cell.dataset.type === 'diamond') {
            // Found a diamond
            walletBalance += config.diamondValue;
            diamondsFound++;
            totalGainLoss += config.diamondValue;
        } else {
            // Hit a bomb
            walletBalance -= config.bombValue;
            bombsHit++;
            totalGainLoss -= config.bombValue;
            
            // Check if user has reached the loss limit after this move
            if (totalGainLoss <= -150 && !localStorage.getItem('lossLimitReachedTime')) {
                localStorage.setItem('lossLimitReachedTime', Date.now().toString());
            }
        }
        
        // Update displays
        updateWalletDisplay();
        updateStats();
        updateProgressBar();
        
        // Save totalGainLoss to localStorage
        localStorage.setItem('totalGainLoss', totalGainLoss.toString());
        
        // Check if user now has negative balance after this click
        if (walletBalance < 0) {
            showTopUpPrompt();
        } else if (totalGainLoss <= -150) {
            // User has reached the loss limit
            showLossLimitModal(30); // Initially 30 minutes
        } else {
            // Check if level threshold is reached based on NET GAIN
            if (totalGainLoss >= levelThresholds[currentLevel]) {
                if (currentLevel < gameConfig.length) {
                    setTimeout(() => {
                        showLevelUpModal();
                    }, 1000);
                } else {
                    setTimeout(() => {
                        showGameCompleteModal();
                    }, 1000);
                }
            } else {
                // Add delay before reshuffling
                setTimeout(() => {
                    // Create new game board with reshuffled positions
                    createGameBoard();
                }, 1000);
            }
        }
    }

    // Show top-up prompt for negative balance
    function showTopUpPrompt() {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal';
        modalOverlay.style.display = 'flex';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const title = document.createElement('h2');
        title.textContent = 'Insufficient Balance';
        
        const message = document.createElement('p');
        message.textContent = `Your balance is ₹${walletBalance}. You need to add money to continue playing.`;
        
        const topUpButton = document.createElement('button');
        topUpButton.textContent = 'Add Money';
        topUpButton.className = 'btn-submit';
        topUpButton.style.marginRight = '10px';
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.className = 'btn-submit';
        closeButton.style.backgroundColor = '#666';
        
        topUpButton.addEventListener('click', function() {
            document.body.removeChild(modalOverlay);
            walletPanel.classList.remove('hidden');
            // Scroll to Add Money section
            const addMoneySection = document.querySelector('.add-money-section');
            if (addMoneySection) {
                addMoneySection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modalOverlay);
        });
        
        modalContent.appendChild(title);
        modalContent.appendChild(message);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '10px';
        buttonContainer.appendChild(topUpButton);
        buttonContainer.appendChild(closeButton);
        
        modalContent.appendChild(buttonContainer);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    }

    // Update game statistics
    function updateStats() {
        diamondsFoundElement.textContent = diamondsFound;
        bombsHitElement.textContent = bombsHit;
        
        // Format the total gain/loss with a plus sign for positive values
        if (totalGainLoss > 0) {
            totalGainLossElement.textContent = `+${totalGainLoss}`;
            totalGainLossElement.style.color = '#4CAF50'; // Green for gain
        } else if (totalGainLoss < 0) {
            totalGainLossElement.textContent = totalGainLoss; // Negative sign is automatically displayed
            totalGainLossElement.style.color = '#FF5252'; // Red for loss
        } else {
            totalGainLossElement.textContent = totalGainLoss;
            totalGainLossElement.style.color = '#fff'; // White for zero
        }
    }

    // Update progress bar
    function updateProgressBar() {
        const threshold = levelThresholds[currentLevel];
        // Only consider positive progress toward level completion
        const progress = Math.max(0, (totalGainLoss / threshold) * 100);
        levelProgressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    // Show level up modal
    function showLevelUpModal() {
        currentLevel++;
        localStorage.setItem('currentLevel', currentLevel.toString());
        newLevelElement.textContent = currentLevel;
        levelUpModal.classList.remove('hidden');
    }

    // Show game complete modal
    function showGameCompleteModal() {
        gameCompleteModal.classList.remove('hidden');
    }

    // Event listeners
    continueBtn.addEventListener('click', function() {
        levelUpModal.classList.add('hidden');
        initializeGame();
    });

    playAgainBtn.addEventListener('click', function() {
        gameCompleteModal.classList.add('hidden');
        currentLevel = 1;
        localStorage.setItem('currentLevel', '1');
        totalGainLoss = 0;
        localStorage.setItem('totalGainLoss', '0');
        initializeGame();
    });

    walletBtn.addEventListener('click', function() {
        walletPanel.classList.toggle('hidden');
    });

    // Close wallet panel when clicking outside
    document.addEventListener('click', function(e) {
        if (!walletPanel.classList.contains('hidden') && 
            !walletPanel.contains(e.target) && 
            e.target !== walletBtn) {
            walletPanel.classList.add('hidden');
        }
    });

    // Withdrawal options
    bankTransferBtn.addEventListener('click', function() {
        bankForm.classList.remove('hidden');
        upiForm.classList.add('hidden');
    });

    upiBtn.addEventListener('click', function() {
        upiForm.classList.remove('hidden');
        bankForm.classList.add('hidden');
    });

    // Bank transfer form submission
    bankForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (walletBalance >= 1000) {
            processWithdrawal('Bank Transfer');
        } else {
            alert('Minimum withdrawal amount is ₹1000. You need ₹' + (1000 - walletBalance) + ' more.');
        }
    });

    // UPI form submission
    upiForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (walletBalance >= 1000) {
            processWithdrawal('UPI');
        } else {
            alert('Minimum withdrawal amount is ₹1000. You need ₹' + (1000 - walletBalance) + ' more.');
        }
    });

    // Add money buttons
    addMoneyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const amount = parseInt(this.dataset.amount);
            const bonus = parseInt(this.dataset.bonus);
            
            // Save pending transaction
            const pendingTxn = {
                amount: amount,
                bonus: bonus,
                timestamp: Date.now()
            };
            localStorage.setItem('pendingTransaction', JSON.stringify(pendingTxn));
            
            // Set a flag that we're leaving to make a payment
            localStorage.setItem('initiatingPayment', 'true');
            
            // Create UPI payment link
            const upiUrl = createUpiPaymentUrl(amount, currentUser.name);
            
            // Set a flag that we're leaving to make a payment
            // Open UPI link - Using window.location.href directly to ensure redirect works
            window.location.href = upiUrl;
        });
    });
    
    // Create UPI payment URL
    function createUpiPaymentUrl(amount, userName) {
        // Create a unique transaction ID
        const txnId = 'CDIAMOND' + Date.now();
        
        // Properly encode all parameters
        const pa = encodeURIComponent(merchantUpiId);
        const pn = encodeURIComponent('C-Diamond');
        const tn = encodeURIComponent('Game Topup');
        const tr = encodeURIComponent(txnId);
        const am = amount.toString();
        const cu = 'INR';
        
        // UPI deep link with all required parameters
        return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}&tn=${tn}&tr=${tr}`;
    }

    // Share buttons
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const referralCode = localStorage.getItem('referralCode');
            const message = `Join C-Diamond game and get bonus! Use my referral code: ${referralCode}`;
            
            if (this.classList.contains('whatsapp')) {
                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
            } else if (this.classList.contains('instagram')) {
                // Typically would open Instagram with a pre-filled message, but direct sharing isn't supported
                // So we just copy to clipboard and notify the user
                copyToClipboard(message);
                alert('Referral code copied! You can paste it on Instagram.');
            } else if (this.classList.contains('copy')) {
                copyToClipboard(message);
                alert('Referral message copied to clipboard!');
            }
        });
    });

    // Copy to clipboard helper
    function copyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    // Submit referral code
    submitReferralButton.addEventListener('click', function() {
        const inputCode = document.getElementById('referral-code-input').value;
        
        // Check if user has already redeemed maximum referrals
        const redeemedReferrals = JSON.parse(localStorage.getItem('redeemedReferrals') || '[]');
        
        if (redeemedReferrals.length >= 2) {
            alert("You've already redeemed the maximum number of referral codes (2).");
            document.getElementById('referral-code-input').value = '';
            return;
        }
        
        // Check if user has already used this specific code
        if (redeemedReferrals.includes(inputCode)) {
            alert("You've already used this referral code.");
            document.getElementById('referral-code-input').value = '';
            return;
        }
        
        if (inputCode && inputCode !== localStorage.getItem('referralCode')) {
            // In a real app, you'd verify this against a database
            walletBalance += 50; // Give bonus for using referral
            updateWalletDisplay();
            
            // Add to redeemed referrals
            redeemedReferrals.push(inputCode);
            localStorage.setItem('redeemedReferrals', JSON.stringify(redeemedReferrals));
            
            alert('Referral code applied! You got ₹50 bonus!');
            document.getElementById('referral-code-input').value = '';
        } else if (inputCode === localStorage.getItem('referralCode')) {
            alert("You can't use your own referral code!");
        } else {
            alert('Please enter a valid referral code');
        }
    });

    // Process withdrawal
    function processWithdrawal(method) {
        // Generate random transaction ID
        const transactionId = 'TXN' + Math.floor(Math.random() * 1000000000);
        
        // Set receipt details
        document.getElementById('receipt-amount').textContent = walletBalance;
        document.getElementById('receipt-transaction-id').textContent = transactionId;
        document.getElementById('receipt-method').textContent = method;
        
        // Set receipt date
        const now = new Date();
        document.getElementById('receipt-date').textContent = now.toLocaleString();
        
        // Generate QR Code (simulated)
        const qrCode = document.getElementById('receipt-qr');
        qrCode.innerHTML = ""; // Clear previous content
        
        // Simple text-based QR code simulation
        for (let i = 0; i < 5; i++) {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.height = '20%';
            
            for (let j = 0; j < 5; j++) {
                const cell = document.createElement('div');
                cell.style.width = '20%';
                cell.style.backgroundColor = Math.random() > 0.5 ? 'black' : 'white';
                row.appendChild(cell);
            }
            
            qrCode.appendChild(row);
        }
        
        // Show receipt modal
        receiptModal.classList.remove('hidden');
        
        // Reset wallet balance to initial value after withdrawal
        walletBalance = 100;
        updateWalletDisplay();
        
        // Close forms
        walletPanel.classList.add('hidden');
        bankForm.classList.add('hidden');
        upiForm.classList.add('hidden');
        
        // Prepare receipt for download
        setTimeout(downloadReceipt, 2000);
    }

    // Download receipt
    function downloadReceipt() {
        // Create a blob link to download (simplified)
        const receiptHTML = `
            <html>
            <head>
                <title>Withdrawal Receipt</title>
                <style>
                    body { font-family: Arial; padding: 20px; }
                    .receipt { border: 1px solid #ccc; padding: 20px; max-width: 500px; margin: 0 auto; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                    .qr-code { width: 80px; height: 80px; background: #f0f0f0; }
                    h2 { text-align: center; }
                    .details { line-height: 1.6; }
                    .message { margin-top: 20px; font-weight: bold; color: green; }
                </style>
            </head>
            <body>
                <div class="receipt">
                    <div class="header">
                        <div class="qr-code">[QR Code]</div>
                        <div>${new Date().toLocaleString()}</div>
                    </div>
                    <h2>Withdrawal Receipt</h2>
                    <div class="details">
                        <p><strong>Amount:</strong> ₹${document.getElementById('receipt-amount').textContent}</p>
                        <p><strong>Transaction ID:</strong> ${document.getElementById('receipt-transaction-id').textContent}</p>
                        <p><strong>Payment Method:</strong> ${document.getElementById('receipt-method').textContent}</p>
                        <p><strong>Status:</strong> Processing</p>
                        <p class="message">Your money will be credited to your account within 24 hours.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        const blob = new Blob([receiptHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${document.getElementById('receipt-transaction-id').textContent}.html`;
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Close receipt modal after download
        setTimeout(() => {
            receiptModal.classList.add('hidden');
        }, 1000);
    }
    
    // Close receipt modal click
    receiptModal.addEventListener('click', function(e) {
        if (e.target === receiptModal) {
            receiptModal.classList.add('hidden');
        }
    });

    // Title animation
    const title = document.querySelector('.game-title');
    let animationIndex = 0;
    const animations = [
        'title-animation 7.5s linear infinite',
        'diamond-animation 2.5s ease-in-out infinite',
        'title-animation 5s ease-in-out infinite alternate'
    ];

    // Change title animation every 2.5 seconds
    setInterval(() => {
        animationIndex = (animationIndex + 1) % animations.length;
        title.style.animation = animations[animationIndex];
    }, 2500);

    // Check if gain/loss should be reset
    function checkGainLossResetTime() {
        // Get timestamp when loss limit was reached
        const lossLimitReachedTime = localStorage.getItem('lossLimitReachedTime');
        
        if (lossLimitReachedTime) {
            const currentTime = Date.now();
            const timeElapsed = currentTime - parseInt(lossLimitReachedTime);
            
            // If 30 minutes (1800000ms) have passed, reset the gain/loss
            if (timeElapsed >= 1800000) {
                totalGainLoss = 0;
                localStorage.setItem('totalGainLoss', '0');
                localStorage.removeItem('lossLimitReachedTime');
            } else if (totalGainLoss < -150) {
                // Still in timeout period
                showLossLimitModal(Math.ceil((1800000 - timeElapsed) / 60000));
            }
        }
    }
    
    // Show loss limit reached modal
    function showLossLimitModal(minutesRemaining) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal';
        modalOverlay.style.display = 'flex';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const title = document.createElement('h2');
        title.textContent = 'Loss Limit Reached';
        title.style.color = '#FF5252';
        
        const message = document.createElement('p');
        message.innerHTML = `You've reached the maximum loss limit of ₹150.<br>
                          Please wait <strong>${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}</strong> for your gain/loss to reset.`;
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Understood';
        closeButton.className = 'btn-submit';
        
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modalOverlay);
        });
        
        modalContent.appendChild(title);
        modalContent.appendChild(message);
        modalContent.appendChild(closeButton);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    }

    // Populate winners list
    function populateWinnersList() {
        // Top Indian names with states and amounts
        const topWinners = [
            { name: "Rajesh Kumar", location: "Maharashtra", amount: 15620, verified: true },
            { name: "Priya Sharma", location: "Delhi", amount: 12480, verified: true },
            { name: "Amit Patel", location: "Gujarat", amount: 10950, verified: true },
            { name: "Sneha Gupta", location: "Uttar Pradesh", amount: 9875, verified: true },
            { name: "Vikram Singh", location: "Punjab", amount: 8740, verified: true },
            { name: "Ananya Reddy", location: "Telangana", amount: 7650, verified: true },
            { name: "Prashant Yadav", location: "Uttar Pradesh", amount: 6520, verified: true }
        ];
        
        // Clear previous list
        winnersList.innerHTML = '';
        
        // Add animation delay increment
        let delay = 0;
        
        // Create winner items
        topWinners.forEach((winner, index) => {
            const winnerItem = document.createElement('div');
            winnerItem.className = 'winner-item';
            winnerItem.style.animationDelay = `${delay}s`;
            delay += 0.1;
            
            const rankElement = document.createElement('div');
            rankElement.className = `winner-rank rank-${index + 1}`;
            rankElement.textContent = index + 1;
            
            const detailsElement = document.createElement('div');
            detailsElement.className = 'winner-details';
            
            const nameElement = document.createElement('div');
            nameElement.className = 'winner-name';
            nameElement.textContent = winner.name;
            
            if (winner.verified) {
                const verifiedIcon = document.createElement('span');
                verifiedIcon.className = 'material-icons verified-icon';
                verifiedIcon.textContent = 'verified';
                nameElement.appendChild(verifiedIcon);
            }
            
            const locationElement = document.createElement('div');
            locationElement.className = 'winner-location';
            locationElement.textContent = winner.location;
            
            const amountElement = document.createElement('div');
            amountElement.className = 'winner-amount';
            amountElement.textContent = `₹${winner.amount.toLocaleString()}`;
            
            detailsElement.appendChild(nameElement);
            detailsElement.appendChild(locationElement);
            
            winnerItem.appendChild(rankElement);
            winnerItem.appendChild(detailsElement);
            winnerItem.appendChild(amountElement);
            
            winnersList.appendChild(winnerItem);
        });
    }
}); 