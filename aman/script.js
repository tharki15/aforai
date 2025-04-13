// UPI ID
const UPI_ID = 'ak5494678-1@okaxis';

// Initialize top donors from localStorage or with default data
let topDonors = JSON.parse(localStorage.getItem('topDonors')) || [
    { name: 'Ankit Doyal', amount: 1901, message: 'Small support from my side beta' },
    { name: 'pankaj Sharma', amount: 1701, message: 'Keep up the coding beta' },
    { name: 'Khaleel ahmad', amount: 1500, message: 'Happy to help dear' },
    { name: 'Sara Pandey', amount: 1450, message: 'Thanks dear for always fixing my code' },
    { name: 'Rohit Shah', amount: 1111, message: 'Proud of you beta, keep shining' },
{ name: 'Anjali Verma', amount: 1101, message: 'Your hard work inspires me, best wishes!' },
{ name: 'Farhan Qureshi', amount: 1001, message: 'Just a small token of appreciation' },
{ name: 'Neha', amount: 999, message: 'You’ve got this! Keep building amazing stuff' },
{ name: 'Rajeev Thakur', amount: 749, message: 'Glad to support your journey' },
{ name: 'Deepika Rawal', amount: 500, message: 'Your dedication deserves every bit of support' },

    
];

// Array of thank you messages
const thankYouMessages = [
    "Your contribution means the world to us!",
    "Together we can create a better future!",
    "Your support fuels our mission!",
    "You're making dreams come true!",
    "Your kindness inspires us!",
    "You're helping us change lives!",
    "Your generosity knows no bounds!",
    "You're making a real difference!",
    "Your support is invaluable to us!",
    "You're helping us build a brighter tomorrow!"
];

// Function to generate random receipt number
function generateReceiptNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

// Function to create QR code data
function createQRData(name, mobile, amount) {
    return JSON.stringify({
        name: name,
        mobile: mobile,
        amount: amount
    });
}

// Function to update top donors list
function updateTopDonors(newDonor) {
    topDonors.push(newDonor);
    topDonors.sort((a, b) => b.amount - a.amount);
    topDonors = topDonors.slice(0, 10);
    localStorage.setItem('topDonors', JSON.stringify(topDonors));
    displayTopDonors();
}

// Function to display top donors
function displayTopDonors() {
    const donorsList = document.getElementById('donorsList');
    donorsList.innerHTML = '';
    
    topDonors.forEach((donor, index) => {
        const donorItem = document.createElement('div');
        donorItem.className = 'donor-item';
        donorItem.innerHTML = `
            <h3>${index + 1}. ${donor.name}</h3>
            <p>Amount: ₹${donor.amount}</p>
            <p>Message: ${donor.message}</p>
        `;
        donorsList.appendChild(donorItem);
    });
}

// Function to get random thank you message
function getRandomThankYouMessage() {
    return thankYouMessages[Math.floor(Math.random() * thankYouMessages.length)];
}

// Function to generate and download receipt
function generateReceipt(name, mobile, amount) {
    const receipt = document.getElementById('receipt');
    const receiptNumber = generateReceiptNumber();
    const currentDate = new Date().toLocaleString();
    
    // Update receipt content
    receipt.querySelector('.receipt-date').textContent = currentDate;
    receipt.querySelector('.receipt-number').textContent = receiptNumber;
    receipt.querySelector('.donor-name').textContent = name;
    receipt.querySelector('.donor-mobile').textContent = mobile;
    receipt.querySelector('.donor-amount').textContent = amount;
    receipt.querySelector('.receipt-messages').textContent = getRandomThankYouMessage();

    // Generate QR code with all user details
    const qrData = JSON.stringify({
        receiptNo: receiptNumber,
        name: name,
        mobile: mobile,
        amount: amount,
        date: currentDate
    });
    
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=100x100&color=FFFFFF&bgcolor=000000`;
    
    // Create image element for QR code
    const qrImg = document.createElement('img');
    qrImg.src = qrCode;
    qrImg.alt = 'QR Code';
    
    // Wait for QR code to load before generating PDF
    qrImg.onload = () => {
        receipt.querySelector('.receipt-qr').innerHTML = '';
        receipt.querySelector('.receipt-qr').appendChild(qrImg);
        
        // Show receipt
        receipt.style.display = 'flex';
        
        // Generate PDF with proper settings
        const element = receipt.querySelector('.receipt-content');
        const opt = {
            margin: 0,
            filename: `AFORAI_receipt_${receiptNumber}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { 
                scale: 4,
                useCORS: true,
                logging: true,
                letterRendering: true,
                width: 795, // A4 width in pixels at 96 DPI
                height: 1123 // A4 height in pixels at 96 DPI
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait'
            }
        };

        // Generate PDF with delay to ensure proper rendering
        setTimeout(() => {
            html2pdf().set(opt).from(element).save().then(() => {
                receipt.style.display = 'none';
            });
        }, 500);
    };
}

// Handle form submission
document.getElementById('donationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('donorName').value;
    const mobile = document.getElementById('mobileNumber').value;
    const amount = parseFloat(document.getElementById('donationAmount').value);
    const message = document.getElementById('donorMessage').value;

    // Create UPI payment URL
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=AFORAI&am=${amount}&tn=Donation&cu=INR`;
    
    // Open UPI payment
    window.location.href = upiUrl;

    // Wait for 12 seconds and then automatically process the donation
    setTimeout(() => {
        // Update top donors if amount is higher than the lowest
        if (amount > topDonors[topDonors.length - 1].amount) {
            updateTopDonors({ name, amount, message });
        }
        
        // Generate receipt
        generateReceipt(name, mobile, amount);
        
        // Clear form
        e.target.reset();
    }, 12000); // 12 seconds delay
});

// Initialize top donors display
displayTopDonors(); 