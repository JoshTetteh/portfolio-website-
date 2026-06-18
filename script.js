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
                const formContainer = document.querySelector('.contact-form-container');
                formContainer.innerHTML = `
                    <div style="text-align: center; padding: 2rem 0; animation: fadeIn 0.5s ease;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" stroke-width="2" style="margin-bottom: 1.5rem; display: inline-block;">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <h3 style="font-family: var(--font-serif); font-size: 1.8rem; margin-bottom: 1rem;">Thank you!</h3>
                        <p style="color: var(--text-secondary); font-weight: 300;">Your strategic audit request has been sent. I will review your details and reach out within 24 hours.</p>
                    </div>
                `;
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
