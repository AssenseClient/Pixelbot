/**
 * MoonDLC — Полный функционал
 */

// Звездное небо
const canvas = document.getElementById('stars-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize); resize();
    class Star {
        constructor() { this.reset(); }
        reset() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.size = Math.random() * 1.5; this.speed = Math.random() * 0.05; }
        update() { this.y -= this.speed; if (this.y < 0) this.reset(); }
        draw() { ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fill(); }
    }
    for(let i=0; i<80; i++) stars.push(new Star());
    function anim() { ctx.clearRect(0,0,canvas.width,canvas.height); stars.forEach(s=>{s.update();s.draw();}); requestAnimationFrame(anim); }
    anim();
}

// Навигация
window.showSection = function(id) {
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if (target) target.style.display = (id === 'home-section') ? 'flex' : 'block';
};

window.handleProfileNav = function() {
    if (localStorage.getItem('currentUser')) {
        updateProfileUI();
        showSection('profile-section');
    } else {
        showSection('auth-section');
    }
};

window.toggleAuth = function(isLogin) {
    document.getElementById('login-box').style.display = isLogin ? 'block' : 'none';
    document.getElementById('reg-box').style.display = isLogin ? 'none' : 'block';
};

// Аккаунты
window.doRegister = function() {
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const conf = document.getElementById('reg-confirm').value;
    if (!email.includes('@') || pass !== conf || pass === "") {
        const err = document.getElementById('err-reg');
        err.innerText = "Ошибка данных"; err.style.display = 'block';
        return;
    }
    localStorage.setItem('user_' + email, JSON.stringify({email, pass, sub: false}));
    localStorage.setItem('currentUser', email);
    updateProfileUI();
    showSection('profile-section');
};

window.doLogin = function() {
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value;
    const data = localStorage.getItem('user_' + email);
    if (data && JSON.parse(data).pass === pass) {
        localStorage.setItem('currentUser', email);
        updateProfileUI();
        showSection('profile-section');
    } else {
        const err = document.getElementById('err-login');
        err.innerText = "Неверный вход"; err.style.display = 'block';
    }
};

// Обновление Личного Кабинета
function updateProfileUI() {
    const email = localStorage.getItem('currentUser');
    if (!email) return;
    const user = JSON.parse(localStorage.getItem('user_' + email));

    document.getElementById('prof-email').innerText = user.email;
    const status = document.getElementById('prof-status');
    const actArea = document.getElementById('activation-area');

    if (user.sub) {
        status.innerText = "Активна";
        status.className = "status-active";
        actArea.innerHTML = `
            <p style="margin-bottom:15px; color:var(--text-dim);">Подписка активна. Можете скачать лаунчер:</p>
            <button class="btn-act" onclick="window.open('https://workupload.com/start/JjRt6Xdszyg')">Скачать MoonDLC.exe</button>
        `;
    } else {
        status.innerText = "Не активна";
        status.className = "status-inactive";
        actArea.innerHTML = `
            <p style="margin-bottom:15px; color:var(--text-dim);">Активация доступа:</p>
            <input type="password" id="pass-act" class="input-act" placeholder="Ключ">
            <button class="btn-act" onclick="activateSub()">Активировать</button>
            <div id="err-act" class="error-label">Неверный ключ</div>
        `;
    }
}

window.activateSub = function() {
    const val = document.getElementById('pass-act').value;
    if (val === "MoonHACKsoon") {
        const email = localStorage.getItem('currentUser');
        let user = JSON.parse(localStorage.getItem('user_' + email));
        user.sub = true;
        localStorage.setItem('user_' + email, JSON.stringify(user));
        updateProfileUI();
    } else {
        document.getElementById('err-act').style.display = 'block';
    }
};

window.logout = function() {
    localStorage.removeItem('currentUser');
    showSection('home-section');
};

window.addEventListener('load', () => {
    if (localStorage.getItem('currentUser')) updateProfileUI();
});
