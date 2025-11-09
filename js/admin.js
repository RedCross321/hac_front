// ———— Глобальные элементы ————
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const uploadForm = document.getElementById('uploadForm');
const docNameInput = document.getElementById('docName');
const docDescInput = document.getElementById('docDescription');
const docCategoryInput = document.getElementById('docCategory');
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
// ———— Обработчик выбора/перетаскивания файла ————
function handleFile(file) {
    displayFileInfo(file);
}

fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
        handleFile(fileInput.files[0]);
    }
});

// Drag & drop (ваш существующий код — оставьте, но без дублей)
// ... (preventDefaults, highlight, unhighlight, handleDrop)

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        const file = e.dataTransfer.files[0];
        if (/\.(pdf|doc|docx|txt)$/i.test(file.name)) {
            fileInput.files = e.dataTransfer.files;
            handleFile(file);
        } else {
            alert('Поддерживаются только .pdf, .doc, .docx, .txt');
        }
    }
});

// ———— Отображение информации о файле ————
function displayFileInfo(file) {
    fileInfo.innerHTML = `
        <div class="file-info">
            <img class="file-icon" src="../media/upload.png" alt="file">
            <div class="file-name">${file.name}</div>
            <button class="delete-file" onclick="clearFile()">×</button>
        </div>
    `;
    fileInfo.classList.remove('hidden');
}

function clearFile() {
    fileInput.value = '';
    fileInfo.classList.add('hidden');
}

// ———— Отправка формы ————
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
        alert('Пожалуйста, выберите файл.');
        return;
    }

    const title = docNameInput.value.trim() || file.name.replace(/\.[^/.]+$/, "");
    const description = docDescInput.value.trim();
    const category = docCategoryInput.value.trim();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    if (description) formData.append('description', description);
    if (category) formData.append('category', category);

    try {
        const response = await fetch('http://192.168.218.9:8000/api/documents/', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error(`Ошибка ${response.status}`);

        const data = await response.json();
        alert(`✅ Документ "${data.title}" успешно загружен!`);
        uploadForm.reset();
        fileInfo.classList.add('hidden');
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        alert('❌ Не удалось загрузить документ: ' + error.message);
    }
});


['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropZone.classList.add('highlight'); // добавьте стиль .highlight в CSS
}

function unhighlight() {
    dropZone.classList.remove('highlight');
}

// Обработка сброса файла
dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    if (file && /\.(pdf|doc|docx|txt)$/i.test(file.name)) {
        fileInput.files = dt.files; // имитируем выбор
        // Триггерим событие вручную
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
    } else {
        alert('Поддерживаются только .pdf, .doc, .docx, .txt');
    }
}

// Функция форматирования даты: 25.03.2024
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Функция получения и отображения последних 3 документов
async function loadLatestDocuments() {
    const documentList = document.querySelector('.document-list');
    if (!documentList) return;

    try {
        const response = await fetch('http://192.168.218.9:8000/api/documents/');
        if (!response.ok) throw new Error('Не удалось загрузить документы');

        const data = await response.json();

        // Сортируем по дате (новые сверху)
        const sortedDocs = data.results
            .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))
            .slice(0, 3); // Берём только 3 последних

        // Генерируем HTML
        const html = sortedDocs.map(doc => {
            // Определяем иконку по типу файла
            let icon = '../media/file-icon.png'; // fallback

            if (doc.file_type === 'pdf') {
                icon = '../media/pdf.png';
            } else if (['doc', 'docx'].includes(doc.file_type)) {
                icon = '../media/doc.png';
            } else if (doc.file_type === 'txt') {
                icon = '../media/txt.png';
            } else if (doc.file_type === 'rtf') {
                icon = '../media/rtf.png';
            }

            return `
                <div class="document-card">
                    <img class="document-icon" src="${icon}" alt="${doc.file_type}">
                    <div class="document-name">${doc.title}</div>
                    <div class="document-meta">${formatDate(doc.upload_date)} • ${doc.file_size_display}</div>
                </div>
            `;
        }).join('');

        documentList.innerHTML = html || '<div class="document-card">Нет документов</div>';

    } catch (error) {
        console.error('Ошибка загрузки документов:', error);
        documentList.innerHTML = '<div class="document-card text-red-500">Не удалось загрузить документы</div>';
    }
}

// Загружаем документы при загрузке страницы
document.addEventListener('DOMContentLoaded', loadLatestDocuments);

// Форматирование времени: 16.39 → "16.4 сек"
function formatTime(seconds) {
    if (seconds === null || seconds === undefined) return "—";
    return parseFloat(seconds.toFixed(1)) + " сек";
}

// Форматирование оценки: 85.3 → "85.3%", если 0 — "—"
function formatScore(score) {
    if (score === null || score === undefined || score === 0) return "—";
    return parseFloat(score.toFixed(1)) + "%";
}

async function loadAnalytics() {
    const statsGrid = document.getElementById('statsGrid');
    if (!statsGrid) return;

    try {
        const response = await fetch('http://192.168.218.9:8000/api/analytics/overview/');
        if (!response.ok) throw new Error('Не удалось загрузить статистику');

        const data = await response.json();

        const html = `
            <div class="stat-card">
                <div class="stat-label">Всего документов</div>
                <div class="stat-value">${data.documents.total || 0}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-label">Запросов в месяц</div>
                <div class="stat-value">${data.consultations.total_last_month || 0}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-label">Среднее время ответа</div>
                <div class="stat-value">${formatTime(data.consultations.avg_response_time)}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-label">Пройдено тестов</div>
                <div class="stat-value">${data.tests.total_attempts_last_month || 0}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-label">Средняя оценка</div>
                <div class="stat-value">${formatScore(data.tests.avg_score)}</div>
            </div>
        `;

        statsGrid.innerHTML = html;

    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
        statsGrid.innerHTML = `
            <div class="stat-card col-span-full text-center text-red-500">
                Не удалось загрузить статистику
            </div>
        `;
    }
}

// Загружаем при старте
document.addEventListener('DOMContentLoaded', () => {
    loadLatestDocuments(); // ваши документы
    loadAnalytics();       // статистика
});