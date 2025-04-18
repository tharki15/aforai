document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show corresponding form
            forms.forEach(form => {
                if (form.id === `${tab}-form`) {
                    form.classList.remove('hidden');
                } else {
                    form.classList.add('hidden');
                }
            });
        });
    });

    // Forgot password link
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const backToLoginLink = document.querySelector('.back-to-login');
    
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('forgot-password-form').classList.remove('hidden');
    });
    
    backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('forgot-password-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    });

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');

    // Signup form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const mobile = document.getElementById('signup-mobile').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Store user data in localStorage
        const userData = {
            name,
            email,
            mobile,
            password,
            walletBalance: 50 // Initial bonus
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        alert('Signup successful! Please login.');
        document.querySelector('[data-tab="login"]').click();
    });

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const mobile = document.getElementById('login-mobile').value;
        const password = document.getElementById('login-password').value;

        const storedData = localStorage.getItem('userData');
        if (!storedData) {
            alert('No user found. Please sign up first.');
            return;
        }

        const userData = JSON.parse(storedData);
        if (userData.mobile === mobile && userData.password === password) {
            // Store current user session
            localStorage.setItem('currentUser', JSON.stringify({
                name: userData.name,
                mobile: userData.mobile,
                walletBalance: userData.walletBalance
            }));
            
            // Redirect to game page
            window.location.href = 'game.html';
        } else {
            alert('Invalid mobile number or password!');
        }
    });

    // Reset password form submission
    resetPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('reset-email').value;
        const mobile = document.getElementById('reset-mobile').value;
        const newPassword = document.getElementById('new-password').value;

        const storedData = localStorage.getItem('userData');
        if (!storedData) {
            alert('No user found with these details.');
            return;
        }

        const userData = JSON.parse(storedData);
        if (userData.email === email && userData.mobile === mobile) {
            userData.password = newPassword;
            localStorage.setItem('userData', JSON.stringify(userData));
            alert('Password reset successful! Please login with your new password.');
            document.getElementById('forgot-password-form').classList.add('hidden');
            document.getElementById('login-form').classList.remove('hidden');
        } else {
            alert('Email and mobile number do not match our records.');
        }
    });
}); 