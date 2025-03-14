const API_URL = 'mysql://root:CXkOKJGdpvPKgPoVCOmlichhHKZifFjt@mainline.proxy.rlwy.net:26776/railway'; 
let audioAlarme = new Audio('alarme.mp3'); 


async function registrar() {
    const email = document.getElementById('emailRegistro').value;
    const senha = document.getElementById('senhaRegistro').value;
    const username = document.getElementById('usernameRegistro').value;

    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha, username })
    });

    const data = await response.json();
    if (response.ok) {
        alert('Conta criada com sucesso! Faça login.');
        window.location.href = 'login.html';
    } else {
        alert('Erro: ' + data.message);
    }
}


async function login() {
    const email = document.getElementById('emailLogin').value;
    const senha = document.getElementById('senhaLogin').value;

    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        window.location.href = 'dashboard.html';
    } else {
        alert('Erro: ' + data.message);
    }
}


async function carregarDashboard() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('welcomeMessage').innerText = `Olá, ${username}`;

    const response = await fetch(`${API_URL}/lembretes`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const lembretes = await response.json();
    const lista = document.getElementById('listaLembretes');
    lista.innerHTML = '';

    lembretes.forEach(lembrete => {
        const item = document.createElement('li');
        item.innerHTML = `${lembrete.nome} - ${lembrete.horario}  
            <button onclick="deletarLembrete(${lembrete.id})">🗑</button>`;
        lista.appendChild(item);
    });

    verificarLembretes(lembretes);
}


async function adicionarLembrete() {
    const token = localStorage.getItem('token');
    const nome = document.getElementById('nomeLembrete').value;
    const horario = document.getElementById('horarioLembrete').value;

    const response = await fetch(`${API_URL}/lembretes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome, horario })
    });

    if (response.ok) {
        carregarDashboard();
    } else {
        alert('Erro ao adicionar lembrete.');
    }
}


async function deletarLembrete(id) {
    const token = localStorage.getItem('token');

    await fetch(`${API_URL}/lembretes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    carregarDashboard();
}


function verificarLembretes(lembretes) {
    setInterval(() => {
        const agora = new Date();
        const horaAtual = agora.getHours().toString().padStart(2, '0') + ":" +
                          agora.getMinutes().toString().padStart(2, '0');

        lembretes.forEach(lembrete => {
            if (lembrete.horario === horaAtual) {
                exibirNotificacao(lembrete.nome);
            }
        });
    }, 60000);
}


function exibirNotificacao(nome) {
    alert(`Está na hora de: ${nome}`);
    audioAlarme.play();
}


function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}


if (window.location.pathname.includes('dashboard.html')) {
    carregarDashboard();
}
