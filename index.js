// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// プロジェクトモーダル機能
function openProjectModal(element) {
    const title = element.querySelector('h3').textContent;
    const image = element.querySelector('.project-image').textContent;
    const explanation = element.querySelector('.project-explanation').textContent;
    const role = element.querySelector('.project-role').textContent;
    const youtube = element.querySelector('.project-youtube').textContent;
    
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalImage').src = image;
    document.getElementById('modalExplanation').textContent = explanation;
    document.getElementById('modalRole').textContent = role;
    
    // YouTubeのURLがあるかない場合で動画セクションの表示を切り替え
    const videoSection = document.querySelector('.modal-video-section');
    if (youtube && youtube.trim() !== '') {
        document.getElementById('modalYoutube').src = youtube;
        videoSection.style.display = 'block';
    } else {
        videoSection.style.display = 'none';
    }
    
    const modal = document.getElementById('projectModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal(event) {
    if (event && event.target.id !== 'projectModal') return;
    
    const modal = document.getElementById('projectModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

// スクロール時のアニメーション
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .skill-card, .timeline-item, .tool-item').forEach(el => {
    observer.observe(el);
});