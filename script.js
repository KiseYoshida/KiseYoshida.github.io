const sectionIds = Array.from(
    document.querySelectorAll('.content-section[id]'),
    section => section.id
);

function getScrollOffset() {
    return window.innerWidth <= 880 ? 82 : 20;
}

function setActiveNavItem(sectionId) {
    const allNavItems = document.querySelectorAll('.nav-menu-item');
    allNavItems.forEach(item => item.classList.remove('active'));

    const activeNavItem = document.querySelector(`.nav-menu-item[data-section="${sectionId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
}

function closeNavMenu() {
    const topNav = document.querySelector('.top-nav');
    const navMenu = document.getElementById('navMenu');
    const menuToggleBtn = document.getElementById('menuToggleBtn');

    if (topNav && navMenu && menuToggleBtn) {
        topNav.classList.remove('open');
        navMenu.hidden = true;
        menuToggleBtn.setAttribute('aria-expanded', 'false');
    }
}

function toggleNavMenu(event) {
    if (event) {
        event.stopPropagation();
    }

    const topNav = document.querySelector('.top-nav');
    const navMenu = document.getElementById('navMenu');
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    if (!topNav || !navMenu || !menuToggleBtn) {
        return;
    }

    const willOpen = navMenu.hidden;
    navMenu.hidden = !willOpen;
    topNav.classList.toggle('open', willOpen);
    menuToggleBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
}

// タブをクリックした時にセクションへスムーズスクロール
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const targetPosition = window.scrollY + section.getBoundingClientRect().top - getScrollOffset();
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    setActiveNavItem(sectionId);
    closeNavMenu();
}

function scrollToSubsection(subsectionId, sectionId) {
    const subsection = document.getElementById(subsectionId);
    if (subsection) {
        const targetPosition = window.scrollY + subsection.getBoundingClientRect().top - getScrollOffset();

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    setActiveNavItem(sectionId);
    closeNavMenu();
}

// スクロール位置に応じてアクティブナビゲーションを自動切り替え
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY + getScrollOffset() + 20;
    
    for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollPosition) {
            setActiveNavItem(sectionIds[i]);
            break;
        }
    }
});

// 言語切り替え機能
let currentLanguage = 'en'; // デフォルトは英語

function toggleLanguage() {
    // 現在の言語を切り替え
    currentLanguage = currentLanguage === 'ja' ? 'en' : 'ja';
    switchToLanguage(currentLanguage);
}

function switchToLanguage(lang) {
    currentLanguage = lang;
    
    // すべての言語要素を非表示
    const allJaElements = document.querySelectorAll('.ja');
    const allEnElements = document.querySelectorAll('.en');
    
    if (lang === 'ja') {
        // 日本語を表示、英語を非表示
        allJaElements.forEach(el => el.style.display = '');
        allEnElements.forEach(el => el.style.display = 'none');
    } else {
        // 英語を表示、日本語を非表示
        allJaElements.forEach(el => el.style.display = 'none');
        allEnElements.forEach(el => el.style.display = '');
    }
    
    // ボタンのテキストを更新
    updateLanguageButton(lang);
    
    // ローカルストレージに言語設定を保存
    localStorage.setItem('preferredLanguage', lang);
}

function updateLanguageButton(lang) {
    const langText = document.getElementById('langText');
    if (langText) {
        // 現在の言語とは反対の言語を表示
        langText.textContent = lang === 'ja' ? 'English' : 'Japanese';
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    updateThemeButton(isDark);
    localStorage.setItem('preferredTheme', isDark ? 'dark' : 'light');
}

function switchToTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    updateThemeButton(isDark);
}

function updateThemeButton(isDark) {
    const themeIcon = document.getElementById('themeIcon');
    const themeToggle = document.getElementById('themeToggle');

    if (themeIcon) {
        themeIcon.className = isDark ? 'fa-regular fa-sun' : 'fa-regular fa-moon';
    }

    if (themeToggle) {
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function updateLastUpdatedDate() {
    const jaEl = document.getElementById('lastUpdatedJa');
    const enEl = document.getElementById('lastUpdatedEn');
    if (!jaEl || !enEl) {
        return;
    }

    const parsed = new Date(document.lastModified);
    const safeDate = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
    const dateText = formatDate(safeDate);

    jaEl.textContent = dateText;
    enEl.textContent = dateText;
}

// ページ読み込み時に保存された言語設定を復元
document.addEventListener('DOMContentLoaded', function() {
    updateLastUpdatedDate();
    const savedTheme = localStorage.getItem('preferredTheme') || 'light';
    switchToTheme(savedTheme);

    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    switchToLanguage(savedLanguage);

    document.addEventListener('click', function(event) {
        const topNav = document.querySelector('.top-nav');
        if (topNav && !topNav.contains(event.target)) {
            closeNavMenu();
        }
    });
});
