/**
 * Premium Electrician Lead Generation Funnel
 * Frontend Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Activity Ticker
    const activityMessages = [
        "⚡ 3 Emergency Requests Received Today",
        "⚡ Technicians Currently Serving Nearby Areas",
        "⚡ Same-Day Service Available",
        "⚡ 1 Technician Just Finished a Job in DHA",
        "⚡ Average Dispatch Time Today: 15 Minutes"
    ];
    let activityIndex = 0;
    const dynamicActivity = document.getElementById('dynamicActivity');
    
    if (dynamicActivity) {
        setInterval(() => {
            activityIndex = (activityIndex + 1) % activityMessages.length;
            dynamicActivity.style.opacity = 0;
            setTimeout(() => {
                dynamicActivity.innerText = activityMessages[activityIndex];
                dynamicActivity.style.opacity = 1;
            }, 300); // fade transition
        }, 4000);
    }

    // Initialize intlTelInput on all phone inputs
    const phoneInputs = document.querySelectorAll('.phone-input');
    const itis = [];
    if (window.intlTelInput) {
        phoneInputs.forEach(input => {
            const iti = window.intlTelInput(input, {
                initialCountry: "pk",
                separateDialCode: true,
                utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
            });
            itis.push({ input: input, iti: iti });
        });
    }

    // 2. Form Interception for Demo Purposes
    const demoForms = document.querySelectorAll('.demo-form, #contactForm');
    demoForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual submission
            
            // Validate Phone Number
            const phoneInput = form.querySelector('.phone-input');
            if (phoneInput) {
                // Remove non-digit characters to check length
                const val = phoneInput.value.replace(/\D/g, '');
                // We expect exactly 10 digits for local Pakistani numbers after +92
                if (val.length !== 10) {
                    openModal('phoneErrorModal');
                    return; // Stop form submission
                }
            }

            // Close any open modals
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            
            // Open Success Modal
            openModal('successModal');
            
            // Optional: reset form
            form.reset();
        });
    });

    // 3. Exit Intent Popup
    let exitIntentTriggered = false;
    document.addEventListener('mouseleave', (e) => {
        // If mouse leaves the top of the viewport
        if (e.clientY < 0 && !exitIntentTriggered) {
            exitIntentTriggered = true;
            openModal('exitModal');
        }
    });

    // Close modals on clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    // 4. FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            
            if (answer.classList.contains('hidden')) {
                answer.classList.remove('hidden');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                answer.classList.add('hidden');
                icon.classList.add('fa-chevron-down');
                icon.classList.remove('fa-chevron-up');
            }
        });
    });
});

/**
 * Testimonial Slider Logic
 */
let currentTestimonial = 0;
function toggleTestimonial() {
    const slides = document.querySelectorAll('.testimonial-slide');
    if (slides.length === 0) return;
    
    slides[currentTestimonial].classList.remove('active');
    slides[currentTestimonial].classList.add('hidden');
    
    currentTestimonial = (currentTestimonial + 1) % slides.length;
    
    slides[currentTestimonial].classList.remove('hidden');
    // slight delay for transition effect
    setTimeout(() => {
        slides[currentTestimonial].classList.add('active');
    }, 50);
}

/**
 * Modal Handling
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

/**
 * Quote Estimator Logic
 */
function calculateQuote() {
    const serviceVal = parseFloat(document.getElementById('estService').value);
    const propertyMultiplier = parseFloat(document.getElementById('estProperty').value);
    
    const basePrice = serviceVal * propertyMultiplier;
    
    // Create a range (-15% to +15%)
    const lowRange = Math.floor(basePrice * 0.85);
    const highRange = Math.ceil(basePrice * 1.15);
    
    const resultDiv = document.getElementById('estimatorResult');
    const priceSpan = document.getElementById('priceValue');
    
    priceSpan.innerText = `$${lowRange} - $${highRange}`;
    resultDiv.classList.remove('hidden');
}
