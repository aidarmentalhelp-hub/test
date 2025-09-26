class ModalManager {
    constructor() {
        this.modals = new Map();
        this.currentModal = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAccessibility();
    }

    setupEventListeners() {
        // Закрытие по клику на overlay
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeCurrentModal();
            }
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeCurrentModal();
            }
        });
    }

    setupAccessibility() {
        // Базовые ARIA-атрибуты
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.setAttribute('aria-haspopup', 'dialog');
        });
    }

    registerModal(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) return false;

        const config = {
            closeOnOverlayClick: true,
            closeOnEsc: true,
            ...options
        };

        this.modals.set(modalId, {
            element: modal,
            config: config
        });

        // Находим кнопки закрытия внутри модального окна
        const closeButtons = modal.querySelectorAll('[data-close-modal]');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => this.closeModal(modalId));
        });

        return true;
    }

    openModal(modalId) {
        const modalData = this.modals.get(modalId);
        if (!modalData) return false;

        // Закрываем текущее модальное окно, если есть
        if (this.currentModal) {
            this.closeModal(this.currentModal);
        }

        const modal = modalData.element;
        modal.style.display = 'block';
        
        // Ждем следующего frame для анимации
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        this.currentModal = modalId;

        // Блокируем скролл body
        document.body.style.overflow = 'hidden';

        // Фокусируемся на первом интерактивном элементе
        this.focusFirstInteractiveElement(modal);

        // Событие открытия
        modal.dispatchEvent(new CustomEvent('modalOpened', { detail: { modalId } }));

        return true;
    }

    closeModal(modalId) {
        const modalData = this.modals.get(modalId);
        if (!modalData) return false;

        const modal = modalData.element;
        modal.classList.remove('active');

        // Ждем завершения анимации перед скрытием
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Должно совпадать с длительностью CSS-анимации

        this.currentModal = null;

        // Разблокируем скролл body
        document.body.style.overflow = '';

        // Событие закрытия
        modal.dispatchEvent(new CustomEvent('modalClosed', { detail: { modalId } }));

        return true;
    }

    closeCurrentModal() {
        if (this.currentModal) {
            this.closeModal(this.currentModal);
        }
    }

    focusFirstInteractiveElement(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    // Публичные методы
    isModalOpen(modalId) {
        return this.currentModal === modalId;
    }

    getOpenModal() {
        return this.currentModal;
    }
}

// Создаем и экспортируем экземпляр менеджера
const modalManager = new ModalManager();
export default modalManager;