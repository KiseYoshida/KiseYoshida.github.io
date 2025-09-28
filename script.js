// タブをクリックした時にセクションへスムーズスクロール
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // モバイル版では大きめのオフセットを設定、PC版でも余裕を持たせる
        const isMobile = window.innerWidth <= 600;
        const targetPosition = section.offsetTop - (isMobile ? 140 : 60);
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    // アクティブなナビゲーションアイテムの切り替え
    const allNavItems = document.querySelectorAll('.nav-item');
    allNavItems.forEach(item => item.classList.remove('active'));
    
    const clickedNavItem = event.target;
    clickedNavItem.classList.add('active');
}

// スクロール位置に応じてアクティブナビゲーションを自動切り替え
window.addEventListener('scroll', function() {
    const sections = ['profile', 'biography', 'publication'];
    const isMobile = window.innerWidth <= 600;
    const scrollPosition = window.scrollY + (isMobile ? 150 : 120); // バッファを考慮、PC版も調整
    
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
            const allNavItems = document.querySelectorAll('.nav-item');
            allNavItems.forEach(item => item.classList.remove('active'));
            
            const activeNavItem = document.querySelector(`[onclick="scrollToSection('${sections[i]}')"]`);
            if (activeNavItem) {
                activeNavItem.classList.add('active');
            }
            break;
        }
    }
});

// 言語切り替え機能
let currentLanguage = 'ja'; // デフォルトは日本語

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

// ページ読み込み時に保存された言語設定を復元
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'ja';
    switchToLanguage(savedLanguage);
});