// ===============================
// 1. Declaração de variáveis e elementos
// ===============================
let username = '';
let avatar = '';
let audioBlob = null;
let mediaRecorder = null;
let typingTimeout;
const socket = io();
const usernameInput = document.getElementById('usernameInput');
const avatarInput = document.getElementById('avatarInput');
const setUserBtn = document.getElementById('setUserBtn');
const userStatus = document.getElementById('userStatus');
const logoutBtn = document.getElementById('logoutBtn');
const chatBox = document.getElementById('chatBox');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const emojiPicker = document.getElementById('emojiPicker');
const fileInput = document.getElementById('fileInput');
const userList = document.getElementById('userList');
const privateTo = document.getElementById('privateTo');
const audioRecordBtn = document.getElementById('audioRecordBtn');
const audioPreview = document.getElementById('audioPreview');
const typingStatus = document.getElementById('typingStatus');
const toggleThemeBtn = document.getElementById('toggleTheme');
const saveUsernameBtn = document.getElementById('saveUsername');

// ===============================
// 2. Funções utilitárias
// ===============================
function formatMessage(text) {
    // Detecta links e transforma em <a>
    return text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
}

function updateHeader() {
    if (username) {
        userStatus.textContent = `Logado como: ${username}`;
        logoutBtn.style.display = 'inline-block';
        usernameInput.style.display = 'none';
        avatarInput.style.display = 'none';
        setUserBtn.style.display = 'none';
    } else {
        userStatus.textContent = '';
        logoutBtn.style.display = 'none';
        usernameInput.style.display = 'inline-block';
        avatarInput.style.display = 'inline-block';
        setUserBtn.style.display = 'inline-block';
    }
}

// ===============================
// 3. Autenticação (login/cadastro/logout)
// ===============================
setUserBtn.addEventListener('click', () => {
    const value = usernameInput.value.trim();
    const avatarValue = avatarInput.value;
    if (value) {
        username = value;
        avatar = avatarValue;
        updateHeader();
        socket.emit('user joined', { username, avatar });
    } else {
        alert('Digite um nome de usuário!');
    }
});

logoutBtn.addEventListener('click', () => {
    username = '';
    avatar = '';
    updateHeader();
});

usernameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        setUserBtn.click();
    }
});

// ===============================
// 4. Tema escuro/claro
// ===============================
function setTheme(dark) {
    if (dark) {
        document.body.classList.add('dark-mode');
        toggleThemeBtn.textContent = '☀️ Modo claro';
    } else {
        document.body.classList.remove('dark-mode');
        toggleThemeBtn.textContent = '🌙 Modo escuro';
    }
    localStorage.setItem('chatTheme', dark ? 'dark' : 'light');
}

toggleThemeBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    setTheme(isDark);
});

// ===============================
// 5. Eventos de interface
// ===============================
// Digitação
messageInput.addEventListener('input', () => {
    socket.emit('typing', username);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit('stop typing', username);
    }, 1500);
});

// Gravação de áudio
audioRecordBtn.addEventListener('click', async () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        audioRecordBtn.textContent = '🎤 Gravar áudio';
        return;
    }
    if (!navigator.mediaDevices) {
        alert('Seu navegador não suporta gravação de áudio.');
        return;
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        let chunks = [];
        mediaRecorder.ondataavailable = e => {
            if (e.data.size > 0) chunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
            audioBlob = new Blob(chunks, { type: 'audio/webm' });
            audioPreview.src = URL.createObjectURL(audioBlob);
            audioPreview.style.display = 'block';
            chunks = [];
        };
        mediaRecorder.start();
        audioRecordBtn.textContent = '⏹️ Parar gravação';
    } catch (err) {
        alert('Erro ao acessar o microfone: ' + err.message);
    }
});

// ===============================
// 6. Envio de mensagem
// ===============================
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let text = messageInput.value.trim();
    const emoji = emojiPicker.value;
    let file = fileInput.files[0];
    const to = privateTo.value;
    if (!username) {
        alert('Digite seu nome de usuário para enviar mensagens!');
        return;
    }
    if (emoji) {
        text += ' ' + emoji;
    }
    if (audioBlob) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            socket.emit('chat message', { username, avatar, message: text, file: { url: evt.target.result, type: 'audio/webm', name: 'audio_message.webm' }, to });
            addMessage(username, avatar, text, { url: evt.target.result, type: 'audio/webm', name: 'audio_message.webm' }, to);
        };
        reader.readAsDataURL(audioBlob);
        audioBlob = null;
        audioPreview.src = '';
        audioPreview.style.display = 'none';
    } else if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            let fileUrl = evt.target.result;
            let fileType = file.type;
            socket.emit('chat message', { username, avatar, message: text, file: { url: fileUrl, type: fileType, name: file.name }, to });
            addMessage(username, avatar, text, { url: fileUrl, type: fileType, name: file.name }, to);
        };
        reader.readAsDataURL(file);
        fileInput.value = '';
    } else if (text) {
        socket.emit('chat message', { username, avatar, message: text, to });
        addMessage(username, avatar, text, null, to);
    }
    messageInput.value = '';
    emojiPicker.selectedIndex = 0;
});

// ===============================
// 7. Comunicação com o servidor (Socket.io)
// ===============================
socket.on('chat message', (data) => {
    addMessage(data.username, data.avatar, data.message, data.file, data.to);
});

socket.on('user list', (users) => {
    userList.innerHTML = '<strong>Usuários online:</strong> ' + users.join(', ');
    privateTo.innerHTML = '<option value="">Público</option>' + users.filter(u => u !== username).map(u => `<option value="${u}">${u}</option>`).join('');
});

socket.on('typing', (user) => {
    if (user !== username) {
        typingStatus.textContent = `${user} está digitando...`;
    }
});

socket.on('stop typing', (user) => {
    if (user !== username) {
        typingStatus.textContent = '';
    }
});

socket.on('system message', (msg) => {
    addSystemMessage(msg);
});

// ===============================
// 8. Renderização de mensagens e interface
// ===============================
function addMessage(user, avatar, text, file, to) {
    const msgDiv = document.createElement('div');
    let content = '';
    if (avatar) {
        content += `<img src="${avatar}" alt="avatar" style="width:32px;height:32px;border-radius:50%;vertical-align:middle;margin-right:8px;">`;
    }
    content += `<strong>${user}:</strong> `;
    if (to && to !== "") {
        content += `<span style='color:#007bff'>(privado)</span> `;
    }
    if (text) {
        content += formatMessage(text);
    }
    if (file) {
        if (file.type.startsWith('image/')) {
            content += `<br><img src="${file.url}" alt="${file.name}" style="max-width:200px;max-height:200px;">`;
        } else if (file.type.startsWith('video/')) {
            content += `<br><video controls style="max-width:200px;max-height:200px;"><source src="${file.url}" type="${file.type}"></video>`;
        } else if (file.type.startsWith('audio/')) {
            content += `<br><audio controls src="${file.url}"></audio>`;
        }
    }
    msgDiv.innerHTML = content;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addSystemMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = `<em>${text}</em>`;
    msgDiv.style.color = '#888';
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ===============================
// 9. Inicialização
// ===============================
window.onload = () => {
    updateHeader();
    const savedTheme = localStorage.getItem('chatTheme');
    setTheme(savedTheme === 'dark');
};
