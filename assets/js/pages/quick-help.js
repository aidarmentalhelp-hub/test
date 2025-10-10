import Utils from '../utils.js';

class QuickHelpPage {
    constructor() {
        this.timers = {};
        this.colors = ['красных', 'оранжевых', 'желтых', 'зеленых', 'голубых', 'синих', 'фиолетовых', 
                      'розовых', 'коричневых', 'черных', 'белых', 'серых'];
        this.objects = ['предметов', 'вещей', 'объектов', 'деталей', 'элементов', 'изделий', 'аксессуаров'];
        this.init();
    }

    init() {
        this.setupEventListeners();
        console.log('Quick Help page initialized');
    }

    setupEventListeners() {
        // Обработчики уже есть в HTML через onclick, но можно добавить и здесь
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('timer-btn')) {
                const type = e.target.getAttribute('data-timer-type');
                if (type && e.target.textContent.includes('Запустить')) {
                    this.startTimer(type);
                } else if (type) {
                    this.stopTimer(type);
                }
            }
        });
    }

    startTimer(type) {
        if (this.timers[type]) {
            clearInterval(this.timers[type]);
        }
        
        const timerDisplay = document.getElementById(`${type}-timer`);
        if (!timerDisplay) return;
        
        let seconds = 5 * 60; // 5 минут
        
        timerDisplay.style.color = '#e74c3c';
        
        this.timers[type] = setInterval(() => {
            seconds--;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            
            timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            
            if (seconds <= 0) {
                clearInterval(this.timers[type]);
                timerDisplay.textContent = "00:00";
                timerDisplay.style.color = '#2ecc71';
                
                // Воспроизводим звук или показываем уведомление
                this.showTimerCompleteNotification(type);
            }
        }, 1000);
    }

    stopTimer(type) {
        if (this.timers[type]) {
            clearInterval(this.timers[type]);
            this.timers[type] = null;
        }
        
        const timerDisplay = document.getElementById(`${type}-timer`);
        if (timerDisplay) {
            timerDisplay.textContent = "05:00";
            timerDisplay.style.color = '#2c3e50';
        }
    }

    showTimerCompleteNotification(type) {
        // Можно добавить звук или браузерные уведомления
        if (Notification.permission === 'granted') {
            new Notification('Таймер завершен!', {
                body: `Таймер ${type} завершил работу`,
                icon: '/assets/images/icon.png'
            });
        }
        
        // Или просто alert для простоты
        alert(`Таймер "${this.getTimerName(type)}" завершил работу!`);
    }

    getTimerName(type) {
        const names = {
            'breath': 'Дыхание 4-7-8',
            'worry': 'Метод "Позвольте себе потревожиться"'
        };
        return names[type] || type;
    }

    generateTask() {
        const randomNumber = Math.floor(Math.random() * 7) + 4; // от 4 до 10
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        const randomObject = this.objects[Math.floor(Math.random() * this.objects.length)];
        
        const taskText = `Найди ${randomNumber} ${randomColor} ${randomObject} в комнате`;
        
        // Показываем элементы
        const taskDisplay = document.getElementById('task-display');
        const helpControls = document.getElementById('help-controls');
        
        if (taskDisplay && helpControls) {
            taskDisplay.textContent = taskText;
            taskDisplay.style.display = 'flex';
            helpControls.style.display = 'flex';
        }
    }

    resetHelp() {
        // Скрываем элементы
        const taskDisplay = document.getElementById('task-display');
        const helpControls = document.getElementById('help-controls');
        
        if (taskDisplay && helpControls) {
            taskDisplay.style.display = 'none';
            helpControls.style.display = 'none';
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.quickHelpPage = new QuickHelpPage();
    
    // Делаем функции глобальными для HTML onclick
    window.startTimer = function(type) { window.quickHelpPage.startTimer(type); };
    window.stopTimer = function(type) { window.quickHelpPage.stopTimer(type); };
    window.generateTask = function() { window.quickHelpPage.generateTask(); };
    window.resetHelp = function() { window.quickHelpPage.resetHelp(); };
});