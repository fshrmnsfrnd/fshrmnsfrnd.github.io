const btn = document.querySelector('.burger-btn');
const drawer = document.getElementById('side-menu');
const overlay = document.querySelector('.overlay');
const closeBtn = drawer.querySelector('.close-btn');

function openMenu() {
    drawer.classList.add('open');
    overlay.classList.add('active');
    overlay.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    // Move focus to close for accessibility if present
    if (closeBtn) closeBtn.focus();
}

function closeMenu() {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    overlay.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    btn && btn.focus();
}

function toggleMenu() {
    if (drawer.classList.contains('open')) {
        closeMenu();
    } else {
        openMenu();
    }
}

btn.addEventListener('click', toggleMenu);
overlay.addEventListener('click', closeMenu);
if (closeBtn) closeBtn.addEventListener('click', closeMenu);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});