// DOM Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const forms = document.querySelectorAll('.form');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const backToLoginLink = document.querySelector('.back-to-login');

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        forms.forEach(f => f.classList.remove('active'));
        btn.classList.add('active');
        document.querySelector(`#${btn.dataset.tab}Form`).classList.add('active');
    });
});

// Forgot Password Link
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    forms.forEach(f => f.classList.remove('active'));
    forgotPasswordForm.classList.add('active');
    tabBtns.forEach(b => b.classList.remove('active'));
});

// Back to Login Link
backToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    forms.forEach(f => f.classList.remove('active'));
    loginForm.classList.add('active');
    tabBtns[0].classList.add('active');
});

// Sign Up Form Submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const dob = document.getElementById('dob').value;
    const mobile = document.getElementById('signupMobile').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (!/^\d{10}$/.test(mobile)) {
        alert('Please enter a valid 10-digit mobile number!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.mobile === mobile)) {
        alert('User with this mobile number already exists!');
        return;
    }

    const newUser = {
        firstName,
        lastName,
        dob,
        mobile,
        password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Sign up successful! Please login.');
    tabBtns.forEach(b => b.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    tabBtns[0].classList.add('active');
    loginForm.classList.add('active');
});

// Login Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mobile = document.getElementById('loginMobile').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.mobile === mobile && u.password === password);

    if (!user) {
        alert('Invalid mobile number or password!');
        return;
    }

    // Get login count and upi verification status from localStorage
    const loginCountData = JSON.parse(localStorage.getItem("loginCounts")) || {};
    const upiVerifiedData = JSON.parse(localStorage.getItem("upiVerifiedUsers")) || {};

    let loginCount = loginCountData[mobile] || 0;
    let isUpiVerified = upiVerifiedData[mobile] || false;

    if (loginCount >= 5 && !isUpiVerified) {
        const payNow = confirm("You've logged in 5 times already. Please pay ₹30 to continue.");
        if (payNow) {
            const upiLink = `upi://pay?pa=ak5494678-1@okaxis&pn=Login+Access&am=30&cu=INR`;
            window.open(upiLink, '_blank');

            setTimeout(() => {
                const refNo = prompt("Enter UPI Payment Reference Number:");
                if (refNo) {
                    const whatsappLink = `https://wa.me/917990983122?text=Payment+Done!+Ref:+${encodeURIComponent(refNo)}`;
                    window.open(whatsappLink, '_blank');

                    // Save UPI verification and allow login
                    upiVerifiedData[mobile] = true;
                    localStorage.setItem("upiVerifiedUsers", JSON.stringify(upiVerifiedData));

                    loginCountData[mobile] = loginCount + 1;
                    localStorage.setItem("loginCounts", JSON.stringify(loginCountData));

                    localStorage.setItem("currentUser", JSON.stringify(user));
                    alert("Payment verified. Logging in...");
                    window.location.href = "dashboard.html";
                } else {
                    alert("You must enter the reference number to proceed.");
                }
            }, 2000);
        }
        return;
    }

    // Update login count and allow login
    loginCountData[mobile] = loginCount + 1;
    localStorage.setItem("loginCounts", JSON.stringify(loginCountData));

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = 'dashboard.html';
});

// Forgot Password Form Submission
forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const mobile = document.getElementById('forgotMobile').value;
    const dob = document.getElementById('forgotDob').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.mobile === mobile && u.dob === dob);

    if (user) {
        const newPassword = prompt('Enter your new password:');
        if (newPassword) {
            user.password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Password updated successfully! Please login.');
            forms.forEach(f => f.classList.remove('active'));
            loginForm.classList.add('active');
            tabBtns[0].classList.add('active');
        }
    } else {
        alert('No user found with the provided mobile number and date of birth!');
    }
});

// Optional: Logout user on full browser close (not on tab change)
window.addEventListener("beforeunload", () => {
    sessionStorage.removeItem("currentUser");
});
