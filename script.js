const API_URL = 'http://localhost:3000';
let reminders = [];
let alarmSound = new Audio('alarm.mp3'); // Som do alarme

function loadDashboard() {
    document.getElementById('welcome-message').textContent += localStorage.getItem('username');

    fetch(`${API_URL}/reminder/list`, {
        headers: { 'Authorization': localStorage.getItem('token') }
    })
    .then(res => res.json())
    .then(data => {
        reminders = data;
        displayReminders();
        checkReminders(); // Inicia a verificação contínua
    });
}

function displayReminders() {
    const list = document.getElementById('reminder-list');
    list.innerHTML = '';

    reminders.forEach(reminder => {
        const li = document.createElement('li');
        li.textContent = `${reminder.name} - ${reminder.time}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.onclick = () => deleteReminder(reminder.id);

        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

function addReminder() {
    const name = document.getElementById('reminder-name').value;
    const time = document.getElementById('reminder-time').value;

    fetch(`${API_URL}/reminder/add`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') 
        },
        body: JSON.stringify({ name, time })
    })
    .then(() => {
        loadDashboard();
        alert('Lembrete adicionado!');
    });
}

function deleteReminder(id) {
    fetch(`${API_URL}/reminder/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': localStorage.getItem('token') }
    })
    .then(() => {
        loadDashboard();
        alert('Lembrete removido!');
    });
}

// 🕒 Função para verificar lembretes em tempo real
function checkReminders() {
    setInterval(() => {
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ":" + 
                            now.getMinutes().toString().padStart(2, '0');

        reminders.forEach(reminder => {
            if (reminder.time === currentTime) {
                triggerReminder(reminder.name);
            }
        });
    }, 60000); // Checa a cada 60 segundos
}

// 🚨 Aciona o popup e o som do lembrete
function triggerReminder(reminderName) {
    // Toca o alarme
    alarmSound.play();

    // Mostra o popup
    alert(`⏰ Está na hora de: ${reminderName}!`);
}

if (window.location.pathname.endsWith('dashboard.html')) {
    loadDashboard();
}
