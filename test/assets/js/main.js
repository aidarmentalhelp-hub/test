// Анимация появления элементов при скролле
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Плавная прокрутка для якорных ссылок
document.addEventListener('DOMContentLoaded', function() {
    // Анимация при загрузке
    animateOnScroll();
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Добавляем классы fade-in для анимации
    const sections = document.querySelectorAll('.disclaimer, .welcome-section, .burnout-info, .test-section, .footer-section');
    sections.forEach((section, index) => {
        section.classList.add('fade-in');
        section.style.transitionDelay = `${index * 0.1}s`;
    });
});

// Анимация при загрузке страницы
window.addEventListener('load', function() {
    setTimeout(() => {
        const elements = document.querySelectorAll('.fade-in');
        elements.forEach((element, index) => {
            setTimeout(() => {
                if (element.getBoundingClientRect().top < window.innerHeight) {
                    element.classList.add('visible');
                }
            }, index * 100);
        });
    }, 300);
});