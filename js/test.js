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
        this.questions = this.generateQuestions();
        this.testStarted = false;
        this.testCompleted = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    generateQuestions() {
        return [
                // {
            //     question: "Какие требования предъявляются к средствам индивидуальной защиты (СИЗ)?",
            //     options: [
            //         "Должны быть модными и удобными",
            //         "Должны соответствовать характеру и условиям труда, иметь сертификацию",
            //         "Должны быть недорогими и доступными",
            //         "Должны нравиться работникам"
            //     ],
            //     correct: 1,
            //     explanation: "Согласно Трудовому кодексу РФ, СИЗ должны соответствовать характеру и условиям труда, иметь сертификаты соответствия."
            // },
            // {
            //     question: "Что необходимо проверить перед началом работы с оборудованием?",
            //     options: [
            //         "Только внешний вид оборудования",
            //         "Исправность механизмов, защитных ограждений, электропроводки, систем безопасности",
            //         "Только наличие масла и топлива",
            //         "Только чистоту оборудования"
            //     ],
            //     correct: 1,
            //     explanation: "Предрейсовый осмотр должен включать проверку всех критических систем оборудования для обеспечения безопасной работы."
            // },
            // {
            //     question: "Какие действия необходимо предпринять при аварийной ситуации?",
            //     options: [
            //         "Продолжить работу и сообщить руководству в конце смены",
            //         "Прекратить работу, обесточить оборудование, оказать помощь, сообщить руководству",
            //         "Уйти с рабочего места и ждать помощи",
            //         "Попытаться устранить неисправность самостоятельно"
            //     ],
            //     correct: 1,
            //     explanation: "При аварии необходимо немедленно прекратить работу, обесточить оборудование, оказать первую помощь и сообщить руководству."
            // },
            // {
            //     question: "Как часто должно проводиться обучение по охране труда?",
            //     options: [
            //         "Один раз при поступлении на работу",
            //         "Раз в год с проведением проверки знаний",
            //         "Только при смене должности",
            //         "По желанию работника"
            //     ],
            //     correct: 1,
            //     explanation: "Обучение по охране труда проводится регулярно, не реже 1 раза в год с обязательной проверкой знаний."
            // },
            // {
            //     question: "Что такое локаут/тагаут (LOTO)?",
            //     options: [
            //         "Метод ускорения работы",
            //         "Процедура блокировки энергии для безопасного обслуживания оборудования",
            //         "Система учета рабочего времени",
            //         "Метод контроля качества"
            //     ],
            //     correct: 1,
            //     explanation: "LOTO - это процедура контроля опасных энергий путем блокировки и маркировки оборудования во время обслуживания."
            // },
            // {
            //     question: "Какие требования к освещению рабочих мест?",
            //     options: [
            //         "Достаточно естественного света",
            //         "Освещенность должна соответствовать нормам для данного вида работ",
            //         "Главное, чтобы было видно",
            //         "Освещение не влияет на безопасность"
            //     ],
            //     correct: 1,
            //     explanation: "Освещенность рабочих мест должна соответствовать санитарным нормам и правилам в зависимости от характера работ."
            // },
            // {
            //     question: "Что делать при обнаружении неисправности оборудования?",
            //     options: [
            //         "Продолжить работу и не обращать внимания",
            //         "Прекратить работу и сообщить руководству или ответственному лицу",
            //         "Попытаться починить самому",
            //         "Попросить коллег помочь"
            //     ],
            //     correct: 1,
            //     explanation: "При обнаружении неисправности необходимо немедленно прекратить работу и сообщить об этом ответственному лицу."
            // },
            // {
            //     question: "Какие основные принципы безопасного поведения на рабочем месте?",
            //     options: [
            //         "Быстрота и эффективность",
            //         "Соблюдение инструкций, использование СИЗ, внимательность",
            //         "Минимальное общение с коллегами",
            //         "Работа в одиночку"
            //     ],
            //     correct: 1,
            //     explanation: "Безопасное поведение включает соблюдение инструкций, правильное использование СИЗ, внимательность и ответственность."
            // },
            // {
            //     question: "Что такое горячие работы?",
            //     options: [
            //         "Работа при высокой температуре окружающей среды",
            //         "Работы с открытым огнем, нагревом, сваркой",
            //         "Работа в жаркий летний день",
            //         "Работа на кухне"
            //     ],
            //     correct: 1,
            //     explanation: "Горячие работы - это работы с открытым огнем, нагревом, сваркой, резкой металла и другие работы с повышенной пожарной опасностью."
            // },
            {
                question: "Какие меры предосторожности при работе с химическими веществами?",
                options: [
                    "Работать в хорошо проветриваемом помещении",
                    "Использовать соответствующие СИЗ, знать свойства веществ, иметь инструкции",
                    "Работать быстро и эффективно",
                    "Просто быть осторожным"
                ],
                correct: 1,
                explanation: "При работе с химическими веществами необходимо использовать соответствующие СИЗ, знать свойства веществ, иметь инструкции и средства первой помощи."
            }
        ];
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

    startTest() {
        this.testStarted = true;
        this.currentQuestion = 0;
        this.answers = [];
        
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('testProgress').classList.remove('hidden');
        document.getElementById('questionCard').classList.remove('hidden');
        document.getElementById('totalQuestion').textContent = this.questions.length;
        
        this.showQuestion();
        this.updateProgress();
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
        document.getElementById('totalQuestions').textContent = this.questions.length;
    }

    completeTest() {
        this.testCompleted = true;
        
        let correctAnswers = 0;
        this.questions.forEach((question, index) => {
            if (this.answers[index] === question.correct) {
                correctAnswers++;
            }
        });
        
        const score = Math.round((correctAnswers / this.questions.length) * 100);
        
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

    restartTest() {
        this.testStarted = false;
        this.testCompleted = false;
        this.currentQuestion = 0;
        this.answers = [];
        
        document.getElementById('resultsCard').classList.add('hidden');
        document.getElementById('certificateCard').classList.add('hidden');
        document.getElementById('startScreen').classList.remove('hidden');
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