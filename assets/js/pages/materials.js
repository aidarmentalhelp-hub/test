import Utils from '../utils.js';

class MaterialsPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.trackMaterialViews();
        console.log('Materials page initialized');
    }

    setupEventListeners() {
        // Отслеживание кликов по карточкам
        document.querySelectorAll('.material-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.trackMaterialClick(card.href);
            });
        });

        // Анимация при наведении
        this.setupHoverEffects();
    }

    setupHoverEffects() {
        const cards = document.querySelectorAll('.material-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            });
        });
    }

    trackMaterialClick(url) {
        console.log('Переход к материалу:', url);
        // Здесь можно добавить analytics.track()
    }

    trackMaterialViews() {
        console.log('Просмотр страницы материалов');
        // Можно добавить статистику просмотров
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.materialsPage = new MaterialsPage();
});

export default MaterialsPage;