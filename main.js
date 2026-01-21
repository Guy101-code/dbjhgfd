// Rate limiting for form submissions
const submissionTimes = [];
const RATE_LIMIT_WINDOW = 60000; // 60 seconds
const MAX_SUBMISSIONS = 3;

function checkRateLimit() {
    const now = Date.now();
    // Remove old submissions outside the window
    submissionTimes = submissionTimes.filter(time => now - time < RATE_LIMIT_WINDOW);
    
    if (submissionTimes.length >= MAX_SUBMISSIONS) {
        alert('Too many submissions. Please wait before submitting again.');
        return false;
    }
    submissionTimes.push(now);
    return true;
}

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('Message').value.trim();
    
    // Validate name
    if (name.length < 2 || name.length > 100) {
        alert('Name must be between 2 and 100 characters');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    // Validate message
    if (message.length < 5 || message.length > 5000) {
        alert('Message must be between 5 and 5000 characters');
        return false;
    }
    
    // Check for suspicious patterns (XSS attempts)
    const suspiciousPatterns = /<script|javascript:|onerror|onclick|<iframe/gi;
    if (suspiciousPatterns.test(name) || suspiciousPatterns.test(message)) {
        alert('Invalid characters detected');
        return false;
    }
    
    return true;
}

function validateCaptcha() {
    const response = grecaptcha.getResponse();
    if (response.length === 0) {
        alert('Please complete the captcha');
        return false;
    }
    return true;
}

window.onload = function () {
    window.addEventListener('scroll', function (e){
        if(window.pageYOffset > 100) {
            document.querySelector("header").classList.add('is-scrolling')
        } else {
            document.querySelector("header").classList.remove('is-scrolling')
        }
    });
    
    // Attach form validation
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            if (!checkRateLimit() || !validateForm() || !validateCaptcha()) {
                e.preventDefault();
            }
        });
    }
}

