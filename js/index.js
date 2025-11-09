const sidebar = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');
const overlay = document.getElementById('overlay');

function openSidebar() {
    if (sidebar.classList=="open") {
        sidebar.classList.add('dddd');
    }
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', openSidebar);
overlay.addEventListener('click', closeSidebar);

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeSidebar();
    }
});

class SafetyInstructorApp {
    constructor() {
        this.isRecording = false;
        this.recognition = null;
        this.heroHidden = false;
        this.messageHistory = [];
        this.currentResponse = '';
        this.safetyData = this.initializeSafetyData();
        this.init(); // Инициализируем приложение при создании экземпляра
    }

    init() {
        this.setupVoiceRecognition(); // Устанавливаем голосовое распознавание
        this.setupEventListeners(); // Устанавливаем обработчики событий
        this.animateStatistics();
        this.loadMessageHistory();
    }

    initializeSafetyData() {
        return {
            'СИЗ': {
                response: 'Согласно Трудовому кодексу РФ, работодатель обязан обеспечить работников средствами индивидуальной защиты (СИЗ) бесплатно. Основные требования: соответствие характеру и условиям труда, сертификация, бесплатная выдача, обязательное обучение правилам использования.',
                reference: 'Трудовой кодекс РФ, ст. 221',
                document: 'Приказ Минтруда №125н'
            },
            'оборудование': {
                response: 'Перед началом работы необходимо выполнить предрейсовый осмотр оборудования: проверить исправность механизмов, наличие защитных ограждений, состояние электропроводки, работоспособность систем безопасности. Все проверки должны быть задокументированы.',
                reference: 'ГОСТ 12.1.004-2024',
                document: 'Инструкция по эксплуатации оборудования'
            },
            'авария': {
                response: 'При аварийной ситуации: 1) немедленно прекратить работу, 2) обесточить оборудование, 3) оказать первую помощь пострадавшим, 4) сообщить руководству, 5) задокументировать происшествие. Не приступать к работе без разрешения руководства.',
                reference: 'Правила охраны труда, п. 45-52',
                document: 'План мероприятий по ЧС'
            }
        };
    }

    setupVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error('Web Speech API не поддерживается в вашем браузере.');
            const voiceBtn = document.getElementById('voiceBtn');
            if (voiceBtn) {
                voiceBtn.disabled = true;
                voiceBtn.title = 'Голосовой ввод не поддерживается';
                voiceBtn.style.opacity = '0.5';
                voiceBtn.style.cursor = 'not-allowed';
            }
            return;
        }

        try {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'ru-RU';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onstart = () => {
                console.log('Распознавание речи началось.');
                this.isRecording = true;
                this.updateVoiceButton();
                this.showRecordingIndicator();
            };

            // Событие получения результата
            this.recognition.onresult = (event) => {
                console.log('Результат получен:', event);
                const transcript = event.results[0][0].transcript; // Получаем текст из результата
                console.log('Распознанный текст:', transcript);
                console.log('Распознанный текст:', JSON.stringify(transcript));
                if (!transcript) {
                    console.warn('Пустой результат распознавания');
                    return;
                }
                const messageInput = document.getElementById('messageInput');
                if (messageInput) {
                    messageInput.value = transcript; // Вставляем распознанный текст в поле ввода
                }
                this.sendMessage(transcript);
            };

            this.recognition.onend = () => {
                console.log('Распознавание речи завершено.');
                this.isRecording = false;
                this.updateVoiceButton();
                this.hideRecordingIndicator();
            };

            this.recognition.onerror = (event) => {
                console.error('Ошибка распознавания речи:', event.error, event.message);
                this.isRecording = false;
                this.updateVoiceButton();
                this.hideRecordingIndicator();

                let errorMessage = 'Ошибка распознавания речи.';
                if (event.error === 'no-speech') {
                    errorMessage = 'Не удалось распознать речь. Пожалуйста, говорите четче.';
                } else if (event.error === 'audio-capture') {
                    errorMessage = 'Ошибка захвата аудио. Проверьте настройки микрофона.';
                } else if (event.error === 'not-allowed') {
                     errorMessage = 'Доступ к микрофону запрещен. Пожалуйста, разрешите доступ к микрофону в настройках браузера.';
                } else if (event.error === 'service-not-allowed') {
                     errorMessage = 'Сервис распознавания речи недоступен. Проверьте настройки браузера.';
                }
                this.showError(errorMessage);
            };
        } catch (e) {
            console.error('Ошибка при инициализации SpeechRecognition:', e);
            this.showError('Не удалось инициализировать голосовой ввод.');
        }
    }

    setupEventListeners() {
        const voiceBtn = document.getElementById('voiceBtn');
        const messageInput = document.getElementById('messageInput');

        if (voiceBtn) {
            // Обработчик нажатия мыши на кнопку голоса
            voiceBtn.addEventListener('mousedown', (e) => {
                e.preventDefault(); // Предотвращаем потерю фокуса с других элементов
                this.startRecording();
            });

            // Обработчик отпускания мыши на кнопке голоса
            voiceBtn.addEventListener('mouseup', () => {
                this.stopRecording();
            });

            // Обработчик, если мышь ушла с кнопки (чтобы остановить, если кнопка отпущена вне её области)
            voiceBtn.addEventListener('mouseleave', () => {
                if (this.isRecording) {
                    this.stopRecording();
                }
            });

            // Touch-события для мобильных устройств
            voiceBtn.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Предотвращаем стандартные жесты
                this.startRecording();
            });

            voiceBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.stopRecording();
            });

            // Обработчик, если палец ушел за пределы кнопки
            voiceBtn.addEventListener('touchcancel', () => {
                if (this.isRecording) {
                    this.stopRecording();
                }
            });
        }

        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            messageInput.addEventListener('input', () => {
                this.autoResizeTextarea(messageInput);
            });
        }
    }

    startRecording() {
        if (this.recognition && !this.isRecording) {
            try {
                this.recognition.start();
                console.log('Запрос на доступ к микрофону отправлен.');
            } catch (error) {
                console.error('Ошибка запуска распознавания:', error);
                this.showError('Не удалось запустить голосовой ввод. Проверьте разрешения браузера.');
            }
        }
    }

    stopRecording() {
        if (this.recognition && this.isRecording) {
            // Останавливаем распознавание
            this.recognition.stop();
            console.log('Остановка распознавания по запросу.');
        }
    }


    updateVoiceButton() {
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            if (this.isRecording) {
                voiceBtn.classList.add('voice-pulse');
                voiceBtn.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                `;
            } else {
                voiceBtn.classList.remove('voice-pulse');
                voiceBtn.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                    </svg>
                `;
            }
        }
    }

    showRecordingIndicator() {
        const voiceStatus = document.getElementById('voiceStatus');
        if (voiceStatus) {
            voiceStatus.innerHTML = `
                <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span>Идет запись...</span>
            `;
        }
    }

    hideRecordingIndicator() {
        const voiceStatus = document.getElementById('voiceStatus');
        if (voiceStatus) {
            voiceStatus.innerHTML = `
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Голосовой ввод активен</span>
            `;
        }
    }
    hideHeroSection() {
    if (this.heroHidden) return; // Уже скрыто

    const heroLogo = document.querySelector('.hero-logo');
    const slogan = document.querySelector('.slogan');
    const chatContainer = document.getElementById('chatMessages');

    if (heroLogo) heroLogo.style.display = 'none';
    if (slogan) slogan.style.display = 'none';
    if (chatContainer) chatContainer.style.display = 'block';

    this.heroHidden = true;
}
    async sendMessage(messageText = null) {

    this.hideHeroSection();
    const messageInput = document.getElementById('messageInput');
    const text = messageText || messageInput.value.trim();

    if (!text) return;

    // Add user message to chat
    this.addMessageToChat(text, 'user');

    if (messageInput) {
        messageInput.value = '';
        this.autoResizeTextarea(messageInput);
    }

    this.showTypingIndicator();

    try {
        const response = await fetch('http://192.168.218.9:8000/api/consultation/ask/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: text })
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();

        // Извлекаем основной ответ
        const botReply = data.response || 'Ответ не получен.';

        // Опционально: формируем блок с источниками
        let sourcesText = '';
        if (data.sources && data.sources.length > 0) {
            const uniqueSources = [...new Map(data.sources.map(s => [s.title, s])).values()]; // убираем дубли по названию
            sourcesText = '\n\n📚 Источники:\n' + uniqueSources
                .map((src, i) => `${i + 1}. ${src.title} (${src.year})`)
                .join('\n');
        }

        const fullResponse = botReply + sourcesText;
        this.hideTypingIndicator();
        this.currentResponse = fullResponse;
        this.addMessageToChat(fullResponse, 'bot');

    } catch (error) {
        console.error('Ошибка при запросе к API:', error);
        this.hideTypingIndicator();
        const errorMsg = '❌ Не удалось получить ответ от сервера. Проверьте подключение.';
        this.addMessageToChat(errorMsg, 'bot');
        this.showError('Ошибка подключения к серверу');
    }
}

    addMessageToChat(message, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message-bubble ${sender}`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="flex-1">
                    <div class="bg-blue-100 rounded-lg px-4 py-3 ml-auto max-w-xs">
                        <p class="text-gray-800">${this.escapeHtml(message)}</p>
                    </div>
                </div>
                <div style="max-width:70%" class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                    Я
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <img src="../media/main-logo.png" alt="Бот" class="w-8 h-8 rounded-full" style="width:80px; height:80px">
                <div class="flex-1">
                    <div class="bg-gray-100 rounded-lg px-4 py-3 max-w-xs">
                        <p class="text-gray-800">${this.escapeHtml(message)}</p>
                    </div>
                    <div class="flex items-center space-x-2 mt-2">
                        <button onclick="app.rateResponse(true)" class="text-green-600 hover:text-green-700">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 009.22 17.5h5.744a2 2 0 001.622-.783l3.55-4.957a2 2 0 000-2.826l-3.55-4.957a2 2 0 00-1.622-.783H9.22a4 4 0 01-1.17-1.475l-.05-.025A2 2 0 006 10.333z"></path>
                            </svg>
                        </button>
                        <button onclick="app.rateResponse(false)" class="text-red-600 hover:text-red-700">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0010.78 2.5H5.036a2 2 0 00-1.622.783l-3.55 4.957a2 2 0 000 2.826l3.55 4.957a2 2 0 001.622.783H9.22a4 4 0 011.17 1.475l.05.025A2 2 0 0014 9.667z"></path>
                            </svg>
                        </button>
                        <button onclick="app.copyResponse()" class="text-gray-500 hover:text-gray-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Store in history
        this.messageHistory.push({
            message: message,
            sender: sender,
            timestamp: new Date()
        });
        
        this.saveMessageHistory();
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'message-bubble flex items-start space-x-3';
        typingDiv.innerHTML = `
            <img src="../media/main-logo.png" alt="Бот" class="w-8 h-8 rounded-full" style="width:80px; height:80px">
            <p style="display:inline-block; margin-bottom:-30px; margin-top:50px">Думает</p>
        `;

        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    askQuickQuestion(question) {
        document.getElementById('messageInput').value = question;
        this.sendMessage(question);
    }

    copyResponse() {
        if (this.currentResponse) {
            navigator.clipboard.writeText(this.currentResponse).then(() => {
                this.showNotification('Ответ скопирован в буфер обмена!');
            }).catch(() => {
                this.showNotification('Не удалось скопировать ответ.');
            });
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = message;
        document.body.appendChild(notification);

        anime({
            targets: notification,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad',
            complete: () => {
                setTimeout(() => {
                    anime({
                        targets: notification,
                        translateX: [0, 300],
                        opacity: [1, 0],
                        duration: 300,
                        easing: 'easeInQuad',
                        complete: () => notification.remove()
                    });
                }, 2000);
            }
        });
    }

    showError(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    animateStatistics() {
        const stats = document.querySelectorAll('.font-semibold');
        stats.forEach((stat, index) => {
            anime({
                targets: stat,
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 800,
                delay: index * 200,
                easing: 'easeOutElastic(1, .8)'
            });
        });
    }

    saveMessageHistory() {
        localStorage.setItem('safetyChatHistory', JSON.stringify(this.messageHistory));
    }

    loadMessageHistory() {
        const saved = localStorage.getItem('safetyChatHistory');
        if (saved) {
            this.messageHistory = JSON.parse(saved);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
// Global functions for HTML onclick handlers
function startVoiceChat() {
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn && !voiceBtn.disabled) { // Проверяем, что кнопка не отключена
        voiceBtn.click();
    } else {
        app.showError('Голосовой ввод недоступен.');
    }
}

function focusTextInput() {
    document.getElementById('messageInput').focus();
}

function sendMessage() {
    app.sendMessage();
}

function askQuickQuestion(question) {
    app.askQuickQuestion(question);
}

// Initialize the application *after* the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SafetyInstructorApp(); // Делаем app глобальным, чтобы функции onclick могли к нему обращаться
});

// PWA service worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}