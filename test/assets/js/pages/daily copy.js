import Utils from '../utils.js';

class DailyPage {
    constructor() {
        this.timers = {};
        this.pomodoroCount = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPomodoroCount();
        console.log('Daily page initialized');
    }

    setupEventListeners() {
        // Обработчики для таймеров
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('timer-btn')) {
                const type = e.target.getAttribute('data-timer-type');
                const minutes = parseInt(e.target.getAttribute('data-minutes'));
                
                if (type && minutes && e.target.textContent.includes('Запустить')) {
                    this.startTimer(type, minutes);
                } else if (type && e.target.textContent.includes('Перерыв')) {
                    this.startTimer(type, minutes);
                } else if (type) {
                    this.stopTimer(type);
                }
            }
        });

        // Сохранение состояния при закрытии страницы
        window.addEventListener('beforeunload', () => {
            this.savePomodoroCount();
        });
    }

    startTimer(type, minutes) {
        if (this.timers[type]) {
            clearInterval(this.timers[type]);
        }
        
        const timerDisplay = document.getElementById(`${type}-timer`);
        if (!timerDisplay) return;
        
        let seconds = minutes * 60;
        
        timerDisplay.style.color = '#e74c3c';
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:00`;
        
        this.timers[type] = setInterval(() => {
            seconds--;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            
            timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            
            if (seconds <= 0) {
                clearInterval(this.timers[type]);
                timerDisplay.textContent = "00:00";
                timerDisplay.style.color = '#2ecc71';
                
                this.handleTimerComplete(type, minutes);
            }
        }, 1000);
    }

    handleTimerComplete(type, minutes) {
        if (type === 'pomodoro' && minutes === 25) {
            this.pomodoroCount++;
            this.updatePomodoroCounter();
            this.showNotification('🍅 Помидор завершен!', 'Время сделать перерыв 5 минут');
            
            // Автоматически запускаем перерыв через 2 секунды
            setTimeout(() => {
                this.startTimer('pomodoro', 5);
            }, 2000);
            
        } else if (type === 'pomodoro' && minutes === 5) {
            this.showNotification('🔄 Перерыв завершен', 'Готовы к следующему помидору?');
            
            // После 4 помидоров - длинный перерыв
            if (this.pomodoroCount % 4 === 0) {
                this.showNotification('🎉 4 помидора завершены!', 'Время для длинного перерыва 15-20 минут');
            }
            
        } else if (type === 'micro') {
            this.showNotification('⏱️ Микро-перерыв', 'Время встать, потянуться и сделать перерыв!');
        }
    }

    stopTimer(type) {
        if (this.timers[type]) {
            clearInterval(this.timers[type]);
            this.timers[type] = null;
        }
        
        const timerDisplay = document.getElementById(`${type}-timer`);
        if (timerDisplay) {
            if (type === 'micro') {
                timerDisplay.textContent = "60:00";
            } else if (type === 'pomodoro') {
                timerDisplay.textContent = "25:00";
            }
            timerDisplay.style.color = '#2c3e50';
        }
    }

    updatePomodoroCounter() {
        // Можно добавить визуальный счетчик помидоров
        const counterElement = document.getElementById('pomodoro-counter');
        if (counterElement) {
            counterElement.textContent = `Завершено помидоров: ${this.pomodoroCount}`;
        }
        
        // Сохраняем в localStorage
        this.savePomodoroCount();
    }

    savePomodoroCount() {
        Utils.saveToStorage('pomodoroCount', this.pomodoroCount);
    }

    loadPomodoroCount() {
        const savedCount = Utils.loadFromStorage('pomodoroCount');
        if (savedCount !== null) {
            this.pomodoroCount = savedCount;
            this.updatePomodoroCounter();
        }
    }

    showNotification(title, message) {
        // Браузерные уведомления
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/assets/images/icon.png'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, {
                        body: message,
                        icon: '/assets/images/icon.png'
                    });
                }
            });
        }
        
        // Также показываем alert для гарантии
        alert(`${title}\n${message}`);
    }

    // Публичные методы для вызова из HTML
    startMicroTimer(minutes) {
        this.startTimer('micro', minutes);
    }

    startPomodoroTimer(minutes) {
        this.startTimer('pomodoro', minutes);
    }

    stopMicroTimer() {
        this.stopTimer('micro');
    }

    stopPomodoroTimer() {
        this.stopTimer('pomodoro');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.dailyPage = new DailyPage();
    
    // Делаем функции глобальными для HTML onclick
    window.startTimer = function(type, minutes) { 
        if (type === 'micro') {
            window.dailyPage.startMicroTimer(minutes);
        } else if (type === 'pomodoro') {
            window.dailyPage.startPomodoroTimer(minutes);
        }
    };
    
    window.stopTimer = function(type) { 
        if (type === 'micro') {
            window.dailyPage.stopMicroTimer();
        } else if (type === 'pomodoro') {
            window.dailyPage.stopPomodoroTimer();
        }
    };
});

// Экспорт для тестирования
export default DailyPage;