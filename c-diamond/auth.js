document.addEventListener('DOMContentLoaded', function() {
    // Toggle between different forms
    const loginToggle = document.getElementById('login-toggle');
    const signupToggle = document.getElementById('signup-toggle');
    const forgetToggle = document.getElementById('forget-toggle');
    
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgetForm = document.getElementById('forget-form');
    const resetForm = document.getElementById('reset-form');
    
    // Set active form toggle
    function setActiveToggle(toggle) {
        loginToggle.classList.remove('active');
        signupToggle.classList.remove('active');
        forgetToggle.classList.remove('active');
        toggle.classList.add('active');
    }
    
    // Hide all forms and show the selected one
    function showForm(form) {
        loginForm.classList.add('hidden');
        signupForm.classList.add('hidden');
        forgetForm.classList.add('hidden');
        resetForm.classList.add('hidden');
        form.classList.remove('hidden');
    }
    
    // Form toggle event listeners
    loginToggle.addEventListener('click', function() {
        setActiveToggle(loginToggle);
        showForm(loginForm);
    });
    
    signupToggle.addEventListener('click', function() {
        setActiveToggle(signupToggle);
        showForm(signupForm);
    });
    
    forgetToggle.addEventListener('click', function() {
        setActiveToggle(forgetToggle);
        showForm(forgetForm);
    });
    
    // Form submission handlers
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const mobile = document.getElementById('login-mobile').value;
        const password = document.getElementById('login-password').value;
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Find user with matching mobile and password
        const user = users.find(u => u.mobile === mobile && u.password === password);
        
        if (user) {
            // Save current user in localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Initialize wallet if not already done
            if (!localStorage.getItem('walletBalance')) {
                localStorage.setItem('walletBalance', '100'); // Initial bonus
            }
            
            // Redirect to game page
            window.location.href = 'game.html';
        } else {
            alert('Invalid mobile number or password');
        }
    });
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const mobile = document.getElementById('signup-mobile').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        
        // Validate form
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if user already exists
        const existingUser = users.find(u => u.mobile === mobile || u.email === email);
        
        if (existingUser) {
            alert('User with this mobile number or email already exists');
            return;
        }
        
        // Create new user
        const newUser = {
            name,
            email,
            mobile,
            password
        };
        
        // Add user to localStorage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success message and switch to login
        alert('Account created successfully. Please login.');
        loginToggle.click();
    });
    
    forgetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('forget-email').value;
        const mobile = document.getElementById('forget-mobile').value;
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Find user with matching email and mobile
        const user = users.find(u => u.email === email && u.mobile === mobile);
        
        if (user) {
            // Store the user being reset for later use
            localStorage.setItem('resetUser', JSON.stringify(user));
            
            // Show reset password form
            showForm(resetForm);
        } else {
            alert('No account found with these details');
        }
    });
    
    resetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;
        
        // Validate passwords match
        if (newPassword !== confirmNewPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Get the user being reset
        const resetUser = JSON.parse(localStorage.getItem('resetUser'));
        if (!resetUser) {
            alert('Session expired. Please try again.');
            forgetToggle.click();
            return;
        }
        
        // Get all users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Find and update the user
        const updatedUsers = users.map(user => {
            if (user.email === resetUser.email && user.mobile === resetUser.mobile) {
                return { ...user, password: newPassword };
            }
            return user;
        });
        
        // Save updated users
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Clear reset user
        localStorage.removeItem('resetUser');
        
        // Show success message and switch to login
        alert('Password updated successfully. Please login with your new password.');
        loginToggle.click();
    });
}); 