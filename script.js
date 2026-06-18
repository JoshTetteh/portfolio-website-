document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer to fade in content sections
    // Made the margin larger and threshold smaller for softer, earlier fade-ins
    const observerOptions = {
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation to elements
    document.querySelectorAll('.project-card, .service-card, .about-content, .testimonial-box').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)'; // softer translation
        el.style.transition = `opacity 0.8s ease, transform 0.8s ease`; // slower, smoother transition
        el.style.transitionDelay = `${(index % 3) * 0.15}s`; 
        observer.observe(el);
    });

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(249, 247, 243, 0.98)';
                navLinks.style.padding = '2rem';
                navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
            }
        });
    }

    // Contact Form AJAX Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Check if we are running locally
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            
            const showSuccess = () => {
                contactForm.reset();
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                
                // Remove existing status message if any
                const existingMsg = contactForm.querySelector('.form-status-msg');
                if (existingMsg) existingMsg.remove();
                
                const msgDiv = document.createElement('div');
                msgDiv.className = 'form-status-msg';
                msgDiv.style.marginTop = '1.5rem';
                msgDiv.style.color = 'var(--sage)';
                msgDiv.style.fontSize = '0.95rem';
                msgDiv.style.textAlign = 'center';
                msgDiv.style.fontWeight = '400';
                msgDiv.style.animation = 'fadeIn 0.5s ease';
                msgDiv.textContent = 'Thank you! Your request has been sent. I will get back to you within 24 hours.';
                
                contactForm.appendChild(msgDiv);
                
                setTimeout(() => {
                    msgDiv.remove();
                }, 8000);
            };
            
            if (isLocal) {
                // Simulate local submission success after a brief delay
                setTimeout(() => {
                    showSuccess();
                }, 1000);
            } else {
                // Production submission to Netlify Forms
                fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                })
                .then(response => {
                    if (response.ok) {
                        showSuccess();
                    } else {
                        throw new Error('Form submission failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    submitButton.textContent = 'Error. Try again';
                    submitButton.disabled = false;
                    setTimeout(() => {
                        submitButton.textContent = originalButtonText;
                    }, 3000);
                });
            }
        });
    }

});
