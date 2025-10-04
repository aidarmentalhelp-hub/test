// Основной JavaScript файл для анимаций и интерактивности

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех функций
    initHeaderAnimation();
    initScrollAnimations();
    initFireAnimation();
    initVideoBackground();
    initMobileMenu();
    initSmoothScrolling();
});

// Анимация появления хедера
function initHeaderAnimation() {
    const header = document.querySelector('.tilda-header');
    
    // Показываем хедер с небольшой задержкой
    setTimeout(() => {
        header.classList.add('visible');
    }, 500);
}

// Анимации при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Для элементов с задержкой (stagger)
                if (entry.target.classList.contains('stagger-element')) {
                    const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100;
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми анимируемыми элементами
    const animatedElements = document.querySelectorAll(
        '.hero-element, .fade-in-element, .slide-in-left, .slide-in-right, .scale-in, .stagger-element'
    );
    
    animatedElements.forEach(el => observer.observe(el));
    
    // Анимация основного контента
    const mainContent = document.querySelector('.main-content');
    const mainContentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    if (mainContent) {
        mainContentObserver.observe(mainContent);
    }
}

// Анимация огня для заголовка
function initFireAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    
    if (heroTitle) {
        // Добавляем анимацию огня с задержкой
        setTimeout(() => {
            heroTitle.classList.add('fire-animation');
        }, 1000);
    }
}

// Управление видео-фоном
function initVideoBackground() {
    const video = document.querySelector('.hero-video');
    
    if (video) {
        // Убедимся, что видео загружено и воспроизводится
        video.addEventListener('loadeddata', function() {
            video.play().catch(error => {
                console.log('Автовоспроизведение видео заблокировано:', error);
            });
        });
        
        // Обработка ошибок загрузки видео
        video.addEventListener('error', function() {
            console.log('Ошибка загрузки видео');
            // Можно добавить fallback изображение
            const videoContainer = document.querySelector('.video-container');
            if (videoContainer) {
                videoContainer.style.backgroundImage = 'url("assets/images/hero-fallback.jpg")';
                videoContainer.style.backgroundSize = 'cover';
                videoContainer.style.backgroundPosition = 'center';
            }
        });
    }
}

// Мобильное меню
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const headerNav = document.querySelector('.header-nav');
    
    if (mobileMenuBtn && headerNav) {
        mobileMenuBtn.addEventListener('click', function() {
            headerNav.style.display = headerNav.style.display === 'flex' ? 'none' : 'flex';
            
            // Анимация для мобильного меню
            if (headerNav.style.display === 'flex') {
                headerNav.style.flexDirection = 'column';
                headerNav.style.position = 'absolute';
                headerNav.style.top = '100%';
                headerNav.style.left = '0';
                headerNav.style.right = '0';
                headerNav.style.background = 'rgba(245, 245, 221, 0.98)';
                headerNav.style.backdropFilter = 'blur(10px)';
                headerNav.style.padding = '20px';
                headerNav.style.gap = '1rem';
                headerNav.style.borderTop = '1px solid var(--border-color)';
            }
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = headerNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    headerNav.style.display = 'none';
                }
            });
        });
        
        // Закрытие меню при изменении размера окна
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                headerNav.style.display = 'flex';
                headerNav.style.flexDirection = 'row';
                headerNav.style.position = 'static';
                headerNav.style.background = 'transparent';
                headerNav.style.padding = '0';
            } else {
                headerNav.style.display = 'none';
            }
        });
    }
}

// Плавная прокрутка для якорных ссылок
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.querySelector('.tilda-header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Дополнительные утилиты
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Оптимизация производительности при скролле
window.addEventListener('scroll', debounce(function() {
    // Можно добавить дополнительную логику для скролла
}, 10));