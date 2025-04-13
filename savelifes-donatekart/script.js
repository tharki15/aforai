// Sample data for top 10 donors
const topDonors = [
    { name: "Rajesh Kumar", amount: 50000 },
    { name: "Priya Sharma", amount: 45000 },
    { name: "Amit Patel", amount: 40000 },
    { name: "Sneha Gupta", amount: 35000 },
    { name: "Vikram Singh", amount: 30000 },
    { name: "Anjali Mehta", amount: 25000 },
    { name: "Rahul Verma", amount: 20000 },
    { name: "Neha Joshi", amount: 15000 },
    { name: "Arun Kumar", amount: 10000 },
    { name: "Meera Desai", amount: 5000 }
];

// DOM Elements
const donationAmount = document.getElementById('donation-amount');
const qrPlaceholder = document.querySelector('.qr-placeholder');
const donateBtn = document.querySelector('.donate-btn');
const paymentBtns = document.querySelectorAll('.payment-btn');
const donorsList = document.querySelector('.donors-list');

// Track payment status
let paymentCompleted = false;
let currentDonorName = '';
let currentDonationAmount = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize top donors
    initializeTopDonors();
    
    // Load images
    loadImages();
    
    // Set initial progress
    updateProgress();
    
    // Initialize form handling
    const form = document.getElementById('donationForm');
    const donorNameInput = document.getElementById('donorName');
    const amountInput = document.getElementById('amount');
    const donateButton = document.querySelector('button[type="submit"]');
    
    // Initialize payment method selection
    handlePaymentMethodSelection();
    
    // Function to validate form inputs
    function validateForm() {
        const name = donorNameInput.value.trim();
        const amount = amountInput.value.trim();
        
        if (name && amount && !isNaN(amount) && parseFloat(amount) > 0) {
            donateButton.disabled = false;
        } else {
            donateButton.disabled = true;
        }
    }

    // Add input event listeners
    donorNameInput.addEventListener('input', validateForm);
    amountInput.addEventListener('input', validateForm);

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const donorName = donorNameInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());

        // Store current donor info for tracking
        currentDonorName = donorName;
        currentDonationAmount = amount;

        // Get selected payment method
        const selectedPaymentMethod = document.querySelector('.payment-btn.active');
        const paymentMethod = selectedPaymentMethod ? selectedPaymentMethod.textContent.toLowerCase() : 'upi';

        if (paymentMethod === 'upi') {
            // Generate UPI URL with proper encoding
            const upiUrl = `upi://pay?pa=ak5494678-1@okaxis&pn=${encodeURIComponent('DonateKart')}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Donation from ${donorName}`)}`;
            
            // Redirect to UPI app
            window.location.href = upiUrl;
            
            // Show payment tracking message after a short delay
            setTimeout(() => {
                showPaymentTrackingMessage();
            }, 500);
        } else if (paymentMethod === 'cards' || paymentMethod === 'net banking') {
            // Show bank account details
            showBankDetails(donorName);
        }
        
        // Reset form
        form.reset();
        donateButton.disabled = true;
    });
});

// Initialize top donors list
function initializeTopDonors() {
    const donorsList = document.querySelector('.donors-list');
    donorsList.innerHTML = '';
    
    topDonors.forEach((donor, index) => {
        const donorItem = document.createElement('div');
        donorItem.className = 'donor-item';
        donorItem.innerHTML = `
            <span>${index + 1}. ${donor.name}</span>
            <span>₹${donor.amount.toLocaleString()}</span>
        `;
        donorsList.appendChild(donorItem);
    });
}

// Load images from the images folder
function loadImages() {
    const imageScroll = document.querySelector('.image-scroll');
    const images = [
        'images/image1.webp',
        'images/image2.webp',
        'images/image3.webp'
    ];
    
    // Create image elements
    images.forEach(imagePath => {
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'Campaign Image';
        imageScroll.appendChild(img);
    });
    
    // Clone images for infinite scroll
    images.forEach(imagePath => {
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'Campaign Image';
        imageScroll.appendChild(img);
    });
}

// Update progress bar
function updateProgress() {
    const raised = 1480956;
    const total = 2000000;
    const percentage = (raised / total) * 100;
    
    const progressBar = document.querySelector('.progress');
    const amountRaised = document.querySelector('.amount-raised');
    const percentageText = document.querySelector('.percentage');
    
    // Animate progress bar
    progressBar.style.width = '0%';
    setTimeout(() => {
        progressBar.style.width = `${percentage}%`;
    }, 100);
    
    amountRaised.textContent = `₹${raised.toLocaleString()} raised out of ₹${total.toLocaleString()}`;
    percentageText.textContent = `${percentage.toFixed(2)}%`;
}

// Generate random impact points
function generateImpactPoints() {
    const impactPoints = [
        "Your donation will help provide essential medical supplies to patients in need",
        "Funds will be used to support emergency medical procedures for underprivileged children",
        "Your contribution will help cover hospital expenses for families in crisis",
        "Donations will be used to provide post-treatment care and rehabilitation support",
        "Your support will help maintain medical equipment and facilities for patient care"
    ];
    return impactPoints;
}

// Generate QR code with donor information
function generateDonorQRCode(donorName, amount) {
    // Create a data object with donor information
    const donorData = {
        name: donorName,
        amount: amount,
        date: new Date().toLocaleDateString(),
        organization: "DonateKart"
    };
    
    // Convert to JSON string
    const dataString = JSON.stringify(donorData);
    
    // Create a canvas element for the QR code
    const canvas = document.createElement('canvas');
    
    // Generate QR code
    QRCode.toCanvas(canvas, dataString, {
        width: 100,
        margin: 1,
        color: {
            dark: '#2E3192',
            light: '#ffffff'
        }
    });
    
    // Convert canvas to data URL
    const qrCodeDataUrl = canvas.toDataURL('image/png');
    
    // Return HTML with the QR code image
    return `<img src="${qrCodeDataUrl}" alt="Donation QR Code" style="width: 100px; height: 100px;">`;
}

// Show payment tracking message
function showPaymentTrackingMessage() {
    const trackingMessage = document.createElement('div');
    trackingMessage.className = 'payment-tracking-message';
    trackingMessage.innerHTML = `
        <div class="tracking-content">
            <h3>Payment Tracking</h3>
            <p>We're tracking your payment. Please complete the payment in your UPI app.</p>
            <p>Once payment is completed, click the button below to generate your receipt.</p>
            <button id="payment-complete-btn" class="payment-complete-btn">I've Completed the Payment</button>
        </div>
    `;
    
    document.body.appendChild(trackingMessage);
    
    // Add event listener to the payment complete button
    document.getElementById('payment-complete-btn').addEventListener('click', () => {
        paymentCompleted = true;
        document.body.removeChild(trackingMessage);
        
        // Show submit button for receipt generation
        showSubmitButton();
    });
}

// Show submit button for receipt generation
function showSubmitButton() {
    const submitButton = document.createElement('div');
    submitButton.className = 'submit-button-container';
    submitButton.innerHTML = `
        <button id="generate-receipt-btn" class="generate-receipt-btn">Generate Receipt</button>
    `;
    
    document.body.appendChild(submitButton);
    
    // Add event listener to the generate receipt button
    document.getElementById('generate-receipt-btn').addEventListener('click', () => {
        if (currentDonorName && currentDonationAmount > 0) {
            // Add donor to the top donors list if applicable
            addNewDonor(currentDonorName, currentDonationAmount);
            
            // Generate receipt
            generateReceipt(currentDonorName, currentDonationAmount);
            
            // Remove the submit button
            document.body.removeChild(submitButton);
            
            // Reset payment tracking
            paymentCompleted = false;
            currentDonorName = '';
            currentDonationAmount = 0;
        }
    });
}

// Generate PDF receipt with proper encoding
async function generateReceipt(donorName, amount) {
    const impactPoints = generateImpactPoints();
    const donorQRCode = generateDonorQRCode(donorName, amount);
    
    // Create receipt content with proper encoding
    const receiptContent = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <img src="logo.webp" alt="DonateKart Logo" style="width: 100px; height: auto;">
                <h1 style="text-align: center; color: #2E3192;">DonateKart</h1>
                <div style="width: 100px; text-align: center;">
                    <p style="font-size: 12px; margin-bottom: 5px;">Donation Verification</p>
                    ${donorQRCode}
                </div>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
                <h2>Donation Receipt</h2>
                <p>Thank you for your generous donation!</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <p><strong>Donor Name:</strong> ${donorName}</p>
                <p><strong>Amount Donated:</strong> &#8377;${amount.toLocaleString()}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3>How Your Donation Will Help:</h3>
                <ul>
                    ${impactPoints.map(point => `<li>${point}</li>`).join('')}
                </ul>
            </div>
            
            <div style="text-align: center; margin-top: 50px; font-style: italic;">
                <p style="font-size: 1.2em; font-family: 'Noto Sans', Arial, sans-serif;">वसुदेव कुटुम्बकम</p>
                <p>(The world is one family)</p>
            </div>
        </div>
    `;
    
    // Create a new window for the receipt
    const receiptWindow = window.open('', '_blank');
    receiptWindow.document.write(`
        <html>
            <head>
                <title>Donation Receipt</title>
                <meta charset="UTF-8">
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet">
                <style>
                    body { margin: 0; padding: 0; }
                    @media print {
                        @page { size: A4; margin: 0; }
                    }
                </style>
            </head>
            <body>
                ${receiptContent}
            </body>
        </html>
    `);
    receiptWindow.document.close();
}

// Handle payment method selection
function handlePaymentMethodSelection() {
    const paymentBtns = document.querySelectorAll('.payment-btn');
    
    paymentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            paymentBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get selected payment method
            const paymentMethod = btn.textContent.toLowerCase();
            
            // Show relevant payment details based on selected method
            if (paymentMethod === 'upi') {
                showQRCode();
            } else if (paymentMethod === 'cards' || paymentMethod === 'net banking') {
                // Show bank details placeholder
                const qrSection = document.querySelector('.qr-section');
                qrSection.innerHTML = '<div class="bank-details-placeholder">Please enter your details and click Donate Now to see bank account information.</div>';
                qrSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Handle donation amount input
donationAmount.addEventListener('input', (e) => {
    const amount = e.target.value;
    if (amount > 0) {
        // Enable donate button
        donateBtn.disabled = false;
    } else {
        donateBtn.disabled = true;
    }
});

// Handle QR code click
function handleQRCodeClick() {
    const amount = donationAmount.value;
    if (amount > 0) {
        // Create UPI URL with the entered amount
        const upiUrl = `upi://pay?pa=ak5494678-1@okaxis&pn=Recipient&am=${amount}&cu=INR`;
        
        // Redirect to UPI URL
        window.location.href = upiUrl;
        
        // Show payment tracking message
        showPaymentTrackingMessage();
    } else {
        alert('Please enter a valid amount');
    }
}

// Show bank account details
function showBankDetails(donorName) {
    const bankDetails = `
        <div class="bank-details">
            <h4>Bank Account Details</h4>
            <p><strong>Account Number:</strong> 55430100007350</p>
            <p><strong>IFSC Code:</strong> BARB0AKHABA</p>
            <p><strong>MICR Code:</strong> 380012111</p>
            <p class="bank-instruction">Please transfer the amount to the above account details.</p>
            <p class="bank-instruction">After completing the transfer, click the button below to generate your receipt.</p>
            <button id="bank-transfer-complete-btn" class="payment-complete-btn">I've Completed the Transfer</button>
        </div>
    `;
    
    // Replace QR code section with bank details
    const qrSection = document.querySelector('.qr-section');
    qrSection.innerHTML = bankDetails;
    
    // Add event listener to the bank transfer complete button
    document.getElementById('bank-transfer-complete-btn').addEventListener('click', () => {
        paymentCompleted = true;
        
        // Add donor to the top donors list if applicable
        addNewDonor(currentDonorName, currentDonationAmount);
        
        // Generate receipt
        generateReceipt(currentDonorName, currentDonationAmount);
        
        // Reset payment tracking
        paymentCompleted = false;
        currentDonorName = '';
        currentDonationAmount = 0;
    });
    
    // Scroll to bank details
    qrSection.scrollIntoView({ behavior: 'smooth' });
}

// Show QR code
function showQRCode() {
    const qrSection = document.querySelector('.qr-section');
    qrSection.innerHTML = `
        <div class="qr-placeholder">
            <img src="qr-code.png" alt="UPI QR Code" id="qr-code-image">
            <p class="placeholder-text">Click on the QR code to pay</p>
        </div>
        <p class="qr-instruction">Scan this QR code with any UPI app to make your donation</p>
    `;
    
    // Add click event listener to QR code
    const qrCodeImage = document.getElementById('qr-code-image');
    qrCodeImage.addEventListener('click', function() {
        const amount = document.getElementById('amount').value;
        const donorName = document.getElementById('donorName').value.trim();
        
        if (amount && donorName) {
            const upiUrl = `upi://pay?pa=ak5494678-1@okaxis&pn=${encodeURIComponent('DonateKart')}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Donation from ${donorName}`)}`;
            window.location.href = upiUrl;
        } else {
            alert('Please enter your name and donation amount first');
        }
    });
    
    qrSection.scrollIntoView({ behavior: 'smooth' });
}

// Add new donor to the list
function addNewDonor(donorName, amount) {
    // Find the position where the new donor should be inserted
    let insertIndex = topDonors.findIndex(donor => amount > donor.amount);
    
    // If the new amount is higher than any existing donor
    if (insertIndex !== -1) {
        // Insert the new donor at the appropriate position
        topDonors.splice(insertIndex, 0, { name: donorName, amount: amount });
        
        // Keep only the top 10 donors
        if (topDonors.length > 10) {
            topDonors.pop();
        }
        
        // Update the donors list in the UI
        updateDonorsList();
        
        // Show a notification
        showDonorNotification(donorName, amount, insertIndex + 1);
    }
}

// Show notification for new top donor
function showDonorNotification(donorName, amount, position) {
    const notification = document.createElement('div');
    notification.className = 'donor-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-trophy"></i>
            <p>Congratulations ${donorName}! Your donation of ₹${amount.toLocaleString()} has placed you at #${position} on our top donors list!</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 5000);
}

// Update donors list in the UI
function updateDonorsList() {
    donorsList.innerHTML = '';
    topDonors.forEach((donor, index) => {
        const donorItem = document.createElement('div');
        donorItem.className = 'donor-item';
        donorItem.innerHTML = `
            <span>${index + 1}. ${donor.name}</span>
            <span>₹${donor.amount.toLocaleString()}</span>
        `;
        donorsList.appendChild(donorItem);
    });
}

// Function to handle UPI payment
function handleUPIPayment(amount, donorName) {
    const upiId = 'ak5494678-1@okaxis';
    const upiUrl = `upi://pay?pa=${upiId}&pn=DonateKart&am=${amount}&tn=Donation from ${donorName}`;
    
    // Open UPI payment URL
    window.location.href = upiUrl;
    
    // Set a timeout to check if payment was completed
    setTimeout(() => {
        // This is a simplified check - in a real implementation, you would need to 
        // integrate with a payment gateway or backend service to verify the payment
        const paymentCompleted = confirm('Did you complete the payment?');
        
        if (paymentCompleted) {
            // Generate receipt and update UI
            generateReceipt(donorName, amount);
            updateProgress(amount);
            updateTopDonors(donorName, amount);
        } else {
            alert('Payment was not completed. Please try again.');
        }
    }, 5000); // 5 second delay to allow for payment completion
}

// Update the donate button click handler
donateBtn.addEventListener('click', () => {
    const amount = parseFloat(donationAmount.value);
    const donorName = document.getElementById('donor-name').value.trim();
    
    if (!donorName) {
        alert('Please enter your name');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    // Handle UPI payment
    handleUPIPayment(amount, donorName);
});

// Update progress bar
function updateProgressBar(raised, total) {
    const percentage = (raised / total) * 100;
    const progressBar = document.querySelector('.progress');
    const amountRaised = document.querySelector('.amount-raised');
    const percentageText = document.querySelector('.percentage');
    
    progressBar.style.width = `${percentage}%`;
    amountRaised.textContent = `₹${raised.toLocaleString()} raised out of ₹${total.toLocaleString()}`;
    percentageText.textContent = `${percentage.toFixed(2)}%`;
}

// Update top donors list
function updateTopDonors(donorName, amount) {
    // Find the position where the new donor should be inserted
    let insertIndex = topDonors.findIndex(donor => amount > donor.amount);
    
    // If the new amount is higher than any existing donor
    if (insertIndex !== -1) {
        // Insert the new donor at the appropriate position
        topDonors.splice(insertIndex, 0, { name: donorName, amount: amount });
        
        // Keep only the top 10 donors
        if (topDonors.length > 10) {
            topDonors.pop();
        }
        
        // Update the donors list in the UI
        updateDonorsList();
        
        // Show a notification
        showDonorNotification(donorName, amount, insertIndex + 1);
    }
} 