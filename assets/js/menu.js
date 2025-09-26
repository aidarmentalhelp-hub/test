import Utils from './utils.js';

class MenuManager {
    constructor() {
        this.menus = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAccessibility();
    }

    setupEventListeners() {
        // Обработчик для кнопки меню в шапке
        const headerMenuButton = document.querySelector('.header-menu-button');
        const headerDropdown = document.querySelector('.header-dropdown');

        if (headerMenuButton && headerDropdown) {
            headerMenuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu(headerDropdown);
            });

            this.menus.push(headerDropdown);
        }

        // Обработчик для плавающего меню
        const floatingMenuButton = document.querySelector('.menu-button');
        const floatingDropdown = document.querySelector('.dropdown-content');

        if (floatingMenuButton && floatingDropdown) {
            floatingMenuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu(floatingDropdown);
            });

            this.menus.push(floatingDropdown);
        }

        // Закрытие меню при клике вне их
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.header-menu') && !e.target.closest('.floating-menu')) {
                this.closeAllMenus();
            }
        });

        // Закрытие меню при нажатии Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllMenus();
            }
        });

        // Адаптивное поведение для мобильных устройств
        if (Utils.isMobile()) {
            this.setupMobileBehavior();
        }
    }

    toggleMenu(menu) {
        const isOpen = menu.classList.contains('show');
        
        // Сначала закрываем все меню
        this.closeAllMenus();
        
        // Если меню было закрыто - открываем его
        if (!isOpen) {
            menu.classList.add('show');
            this.focusFirstMenuItem(menu);
        }
    }

    closeAllMenus() {
        this.menus.forEach(menu => {
            menu.classList.remove('show');
        });
    }

    focusFirstMenuItem(menu) {
        const firstMenuItem = menu.querySelector('a');
        if (firstMenuItem) {
            firstMenuItem.focus();
        }
    }

    setupAccessibility() {
        // Добавляем ARIA-атрибуты для доступности
        this.menus.forEach(menu => {
            const button = menu.previousElementSibling;
            if (button && button.classList.contains('menu-button')) {
                button.setAttribute('aria-haspopup', 'true');
                button.setAttribute('aria-expanded', 'false');
            }
        });

        // Обновляем ARIA-атрибуты при открытии/закрытии
        document.addEventListener('click', (e) => {
            if (e.target.closest('.menu-button')) {
                const button = e.target.closest('.menu-button');
                const menu = button.nextElementSibling;
                const isExpanded = menu.classList.contains('show');
                button.setAttribute('aria-expanded', isExpanded.toString());
            }
        });
    }

    setupMobileBehavior() {
        // Дополнительное поведение для мобильных устройств
        console.log('Mobile menu behavior initialized');
        
        // Можно добавить свайпы или другие жесты
    }

    // Публичные методы для внешнего использования
    openMenu(menuId) {
        const menu = document.getElementById(menuId);
        if (menu) {
            this.toggleMenu(menu);
        }
    }

    closeMenu(menuId) {
        const menu = document.getElementById(menuId);
        if (menu) {
            menu.classList.remove('show');
        }
    }
}

// Создаем и экспортируем экземпляр менеджера
const menuManager = new MenuManager();
export default menuManager;