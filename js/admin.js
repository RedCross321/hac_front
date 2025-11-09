function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('overlay').classList.add('active');
}

document.getElementById('overlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
});

// File upload handling
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        displayFileInfo(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
        displayFileInfo(fileInput.files[0]);
    }
});

function displayFileInfo(file) {
    fileInfo.innerHTML = `
        <div class="file-info">
            <img class="file-icon" src="../media/file-icon.png" alt="file">
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

// Form submission
document.getElementById('uploadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // In a real implementation, this would send data to the backend
    alert('Документ успешно загружен!');
    // Reset form
    document.getElementById('uploadForm').reset();
    fileInfo.classList.add('hidden');
});