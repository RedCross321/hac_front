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

class SafetyTestApp {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.questions = [];
        this.testStarted = false;
        this.testCompleted = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.testStarted && !this.testCompleted) {
                if (e.key >= '1' && e.key <= '4') {
                    const optionIndex = parseInt(e.key) - 1;
                    this.selectAnswer(optionIndex);
                } else if (e.key === 'Enter') {
                    this.nextQuestion();
                }
            }
        });
    }

    // startTest() {
    //     this.testStarted = true;
    //     this.currentQuestion = 0;
    //     this.answers = [];
        
    //     document.getElementById('startScreen').classList.add('hidden');
    //     document.getElementById('testProgress').classList.remove('hidden');
    //     document.getElementById('questionCard').classList.remove('hidden');
    //     document.getElementById('totalQuestion').textContent = this.questions.length;
        
    //     this.showQuestion();
    //     this.updateProgress();
    // }

    async startTest() {
    const startScreen = document.getElementById('startScreen');
    startScreen.innerHTML = '<p class="text-center text-lg">Загрузка вопросов...</p>';
    
    try {
        const response = await fetch('http://192.168.218.9:8000/api/tests/generate/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ questions_count: 10 })
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        this.questions = data.questions;

        if (!this.questions || this.questions.length === 0) {
            throw new Error('Сервер вернул пустой список вопросов');
        }

        this.testStarted = true;
        this.currentQuestion = 0;
        this.answers = [];

        startScreen.classList.add('hidden');
        document.getElementById('testProgress').classList.remove('hidden');
        document.getElementById('questionCard').classList.remove('hidden');
        document.getElementById('totalQuestion').textContent = this.questions.length;

        this.showQuestion();
        this.updateProgress();

    } catch (error) {
        console.error('Ошибка загрузки вопросов:', error);
        this.showNotification('Не удалось загрузить вопросы. Проверьте подключение.');
        startScreen.innerHTML = `
            <img class="hero-logo" src="../media/main-logo.png" alt="main-logo">
            <h1 class="main-text">Тестирование по охране труда</h1>
            <p class="text">Проверьте свои знания в области охраны труда.</p>
            <div class="desc-test">
                <div class="text-center">
                    <h1>10</h1>
                    <p>Вопросов</p>
                </div>
                <div class="text-center">
                    <h1>15 мин</h1>
                    <p>Время на тест</p>
                </div>
            </div>
            <div class="button-center">
                <button onclick="testApp.startTest()" class="px-8 py-4 rounded-full text-white font-semibold hover:opacity-90 transition-all transform hover:scale-105" style="background-color: var(--amber-accent);">
                    Начать тестирование
                </button>
            </div>
        `;
    }
}

    showQuestion() {
        const question = this.questions[this.currentQuestion];
        
        document.getElementById('questionNumber').textContent = `${this.currentQuestion + 1}.`;
        document.getElementById('questionText').textContent = question.question;
        
        const optionsContainer = document.getElementById('answerOptions');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'answer-option p-4 border-2 border-gray-200 rounded-lg';
            optionElement.innerHTML = `
                <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center mr-4 text-sm font-semibold">
                        ${String.fromCharCode(65 + index)}
                    </div>
                    <span>${option}</span>
                </div>
            `;
            
            optionElement.addEventListener('click', () => this.selectAnswer(index));
            optionsContainer.appendChild(optionElement);
        });
        
        // Update navigation buttons
        document.getElementById('prevBtn').disabled = this.currentQuestion === 0;
        document.getElementById('nextBtn').textContent = 
            this.currentQuestion === this.questions.length - 1 ? 'Завершить тест' : 'Следующий';
        
        // Animate question card
        anime({
            targets: '#questionCard',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 500,
            easing: 'easeOutQuad'
        });
    }

    selectAnswer(answerIndex) {
        // Remove previous selections
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Mark selected answer
        const selectedOption = document.querySelectorAll('.answer-option')[answerIndex];
        selectedOption.classList.add('selected');
        
        // Store answer
        this.answers[this.currentQuestion] = answerIndex;
    }

    nextQuestion() {
        if (this.answers[this.currentQuestion] === undefined) {
            this.showNotification('Пожалуйста, выберите ответ перед переходом к следующему вопросу.');
            return;
        }
        
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.showQuestion();
            this.updateProgress();
        } else {
            this.completeTest();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.showQuestion();
            this.updateProgress();
        }
    }

    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        document.getElementById('progressBar').value = this.currentQuestion;
        document.getElementById('currentQuestion').textContent = this.currentQuestion + 1;
        document.getElementById('totalQuestion').textContent = this.questions.length;
    }

    async completeTest() {
    this.testCompleted = true;

    let correctAnswers = 0;
    this.questions.forEach((question, index) => {
        if (this.answers[index] === question.correct) {
            correctAnswers++;
        }
    });

    const score = Math.round((correctAnswers / this.questions.length) * 100);

    // 👇 Отправляем данные о прохождении теста
    try {
        const analyticsResponse = await fetch('http://192.168.218.9:8000/api/analytics/tests/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questions_count: this.questions.length,
                correct_answers: correctAnswers
            })
        });

        if (!analyticsResponse.ok) {
            console.warn('Не удалось сохранить результат теста в аналитику');
            // Можно показать уведомление, но не останавливать отображение результатов
        }
    } catch (error) {
        console.error('Ошибка при отправке аналитики теста:', error);
        // Игнорируем ошибку, чтобы пользователь всё равно увидел результат
    }

    // 👇 Отображаем результаты
    document.getElementById('questionCard').classList.add('hidden');
    document.getElementById('testProgress').classList.add('hidden');
    document.getElementById('resultsCard').classList.remove('hidden');

    this.displayResults(score, correctAnswers);
}

    displayResults(score, correctAnswers) {
        const resultIcon = document.getElementById('resultIcon');
        const resultTitle = document.getElementById('resultTitle');
        const resultMessage = document.getElementById('resultMessage');
        const certificateBtn = document.getElementById('certificateBtn');

        document.getElementById('scoreDisplay').textContent = `${score}%`;
        document.getElementById('correctCount').textContent = `${correctAnswers}/${this.questions.length}`;
        
            anime({
                targets: '#resultsCard',
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 800,
                easing: 'easeOutQuad'
            });
        }
    toggleReview() {
    const reviewCard = document.getElementById('reviewCard');
    const reviewContent = document.getElementById('reviewContent');
    const button = event.currentTarget;

    if (reviewCard.classList.contains('hidden')) {
        // Показываем разбор
        reviewContent.innerHTML = '';

        this.questions.forEach((q, idx) => {
            const userAnswer = this.answers[idx];
            const isCorrect = userAnswer === q.correct;

            const questionDiv = document.createElement('div');
            questionDiv.className = 'glass-effect p-4 rounded-xl';

            questionDiv.innerHTML = `
                <div class="mb-2">
                    <strong>${idx + 1}. ${q.question}</strong>
                </div>
                <div class="ml-4 space-y-2">
                    ${q.options.map((opt, optIdx) => {
                        const isSelected = userAnswer === optIdx;
                        const isCorrectAnswer = optIdx === q.correct;
                        let optClass = 'p-2 rounded border';

                        if (isSelected && isCorrectAnswer) {
                            optClass += ' bg-green-200 border-green-500';
                        } else if (isSelected && !isCorrectAnswer) {
                            optClass += ' bg-red-200 border-red-500';
                        } else if (isCorrectAnswer) {
                            optClass += ' bg-green-100 border-green-400';
                        } else {
                            optClass += ' border-gray-200';
                        }

                        return `
                            <div class="${optClass}">
                                <span class="font-bold mr-2">${String.fromCharCode(65 + optIdx)}.</span>
                                <span>${opt}</span>
                                ${isCorrectAnswer ? '<span class="ml-2 text-green-700 font-semibold">✓ Правильно</span>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            reviewContent.appendChild(questionDiv);
        });

        reviewCard.classList.remove('hidden');
        button.textContent = 'Скрыть ответы';
    } else {
        // Скрываем разбор
        reviewCard.classList.add('hidden');
        button.textContent = 'Показать ответы';
    }
}

    restartTest() {
    this.testStarted = true;
    this.testCompleted = false;
    this.currentQuestion = 0;
    this.answers = []; // Сбрасываем только ответы

    document.getElementById('resultsCard').classList.add('hidden');
    document.getElementById('testProgress').classList.remove('hidden');
    document.getElementById('questionCard').classList.remove('hidden');

    this.showQuestion();
    this.updateProgress();
    }
    startNewTest() {
    this.testStarted = false;
    this.testCompleted = false;
    this.currentQuestion = 0;
    this.answers = [];
    this.questions = []; // Очищаем вопросы

    document.getElementById('resultsCard').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');

    // Теперь можно снова нажать «Начать тест» → вызовется startTest() → загрузятся новые вопросы
}

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
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
}

const testApp = new SafetyTestApp();