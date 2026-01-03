/**
 * MoonDLC — Полная логика
 */

// --- 1. АНИМАЦИЯ ФОНА ---
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
window.addEventListener('resize', resize); resize();

class Star {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.3;
        this.speed = Math.random() * 0.05 + 0.01;
    }
    update() { this.y -= this.speed; if (this.y < 0) this.reset(); }
    draw() { ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
}
for (let i = 0; i < 80; i++) stars.push(new Star());
function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); stars.forEach(s => { s.update(); s.draw(); }); requestAnimationFrame(animate); }
animate();

// --- 2. НАВИГАЦИЯ ---
window.showSection = function(id) {
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    const t = document.getElementById(id);
    if(t) t.style.display = (id === 'home-section' ? 'flex' : 'block');
};

window.handleProfileNav = function() {
    if (localStorage.getItem('currentUser')) {
        updateProfileUI();
        showSection('profile-section');
    } else {
        showSection('auth-section');
    }
};

window.toggleAuth = function(toLogin) {
    document.getElementById('reg-box').style.display = toLogin ? 'none' : 'block';
    document.getElementById('login-box').style.display = toLogin ? 'block' : 'none';
    document.querySelectorAll('.error-label').forEach(el => el.style.display = 'none');
};

window.switchTab = function(id, btn) {
    document.querySelectorAll('.tab-link').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.info-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(id).classList.add('active');
};

// --- 3. РЕГИСТРАЦИЯ И ВХОД ---
window.doRegister = function() {
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const conf = document.getElementById('reg-confirm').value;
    const emailPat = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yandex\.ru|mail\.ru)$/;

    const errEmail = document.getElementById('err-reg-email');
    const errPass = document.getElementById('err-reg-pass');

    errEmail.style.display = 'none';
    errPass.style.display = 'none';

    if (!emailPat.test(email)) { 
        errEmail.innerText = "Неверный формат почты";
        errEmail.style.display = 'block'; 
        return; 
    }

    if (localStorage.getItem('user_' + email)) {
        errEmail.innerText = "Данная почта уже занята";
        errEmail.style.display = 'block';
        return;
    }

    if (pass !== conf || pass === "") { 
        errPass.style.display = 'block'; 
        return; 
    }

    const userData = { email, pass, sub: false };
    localStorage.setItem('user_' + email, JSON.stringify(userData));
    localStorage.setItem('currentUser', email);
    
    updateProfileUI();
    showSection('profile-section');
};

window.doLogin = function() {
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value;
    const errLogin = document.getElementById('err-login');
    
    errLogin.style.display = 'none';
    const rawData = localStorage.getItem('user_' + email);

    if (rawData) {
        const user = JSON.parse(rawData);
        if (user.pass === pass) {
            localStorage.setItem('currentUser', email);
            updateProfileUI();
            showSection('profile-section');
            return;
        }
    }
    errLogin.innerText = "Неверная почта или пароль";
    errLogin.style.display = 'block';
};

// --- 4. ПРОФИЛЬ И ПОДПИСКА ---
function updateProfileUI() {
    const currentEmail = localStorage.getItem('currentUser');
    if (!currentEmail) return;
    
    const user = JSON.parse(localStorage.getItem('user_' + currentEmail));
    document.getElementById('prof-email').innerText = user.email;
    const statusLabel = document.getElementById('prof-status');
    const downloadBox = document.getElementById('download-box');

    if (user.sub) {
        statusLabel.innerText = "Активна";
        statusLabel.className = "status-active";
        downloadBox.innerHTML = `
            <p style="font-size: 0.85rem; margin-bottom: 15px;">Доступ активирован.</p>
            <a href="https://workupload.com/start/JjRt6Xdszyg" target="_blank" class="btn-card">Скачать Лаунчер</a>`;
    } else {
        statusLabel.innerText = "Не активна";
        statusLabel.className = "status-inactive";
        downloadBox.innerHTML = `
            <p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 10px;">Введите пароль активации:</p>
            <input type="password" id="pass-act" style="width:100%; max-width:250px; padding:10px; margin-bottom:5px; background:rgba(255,255,255,0.05); border:1px solid #333; color:#fff; border-radius:8px; outline:none;">
            <div id="err-activate" class="error-label" style="margin-bottom:10px;">Неверный пароль!</div>
            <button class="btn-card" onclick="activateSub()">Активировать</button>
        `;
    }
}

window.activateSub = function() {
    const enteredPass = document.getElementById('pass-act').value;
    const errAct = document.getElementById('err-activate');

    if (enteredPass === "MoonHACKsoon") {
        const email = localStorage.getItem('currentUser');
        let user = JSON.parse(localStorage.getItem('user_' + email));
        user.sub = true; 
        localStorage.setItem('user_' + email, JSON.stringify(user));
        updateProfileUI();
    } else {
        errAct.style.display = 'block';
    }
};

window.logout = function() {
    localStorage.removeItem('currentUser');
    showSection('home-section');
};

window.onload = function() {
    if (localStorage.getItem('currentUser')) {
        updateProfileUI();
    }
};