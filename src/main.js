import './styles.css';
import projects from './data/projects.json';
import { renderProjects } from './js/projects.js';
import { initModal, openProjectModal } from './js/modal.js';

// 作品カードを JSON から生成
const grid = document.querySelector('.project-grid');
renderProjects(grid, projects, openProjectModal);

initModal();

// スムーズスクロール（固定ナビの高さ分ずらして、見出しが隠れないようにする）
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// スクロール時のアニメーション
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
);

document.querySelectorAll('.project-card, .skill-card').forEach((el) => {
    observer.observe(el);
});
