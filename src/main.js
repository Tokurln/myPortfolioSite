import './styles.css';
import { works } from './js/works.js';
import { profile } from './content/profile.js';
import { renderWorksTabs } from './js/projects.js';
import { renderHero } from './js/hero.js';
import { renderSidebar } from './js/sidebar.js';
import { renderAffiliations } from './js/affiliations.js';
import { initModal, openProjectModal } from './js/modal.js';

// モーダルの閉じるボタンなどは、他の描画でエラーが出ても効くように最初に登録する
initModal();

// 作品カード（タブで絞り込み）を src/content/works/*.md から生成
renderWorksTabs(
    document.querySelector('.works-tabs'),
    document.querySelector('.project-grid'),
    works,
    openProjectModal
);
renderHero(document.querySelector('.hero'), works, openProjectModal);
renderSidebar(profile, works, openProjectModal);
renderAffiliations();

// Skills / Tools のタブ切り替え
const skillTabs = document.querySelectorAll('[data-skill-tab]');
skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        skillTabs.forEach((t) => {
            const active = t === tab;
            t.classList.toggle('is-active', active);
            t.setAttribute('aria-selected', String(active));
        });
        document.querySelectorAll('[data-skill-panel]').forEach((panel) => {
            panel.hidden = panel.dataset.skillPanel !== tab.dataset.skillTab;
        });
    });
});

// スマホ用ハンバーガーメニュー
const nav = document.querySelector('.gnav');
const toggle = document.querySelector('.gnav-toggle');
function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
}
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));

// スムーズスクロール（固定ナビの高さ分ずらして、見出しが隠れないようにする）
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        setMenu(false);
        const offset = nav.querySelector('.gnav-inner').offsetHeight + 12;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
    });
});

// スクロール時のフェードイン
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.05 }
);
document.querySelectorAll('.panel, .side-box').forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
});
