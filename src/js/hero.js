// 画像のある作品をヒーローでスライド表示する（画像付きの作品がなければ名前のバナー）

const INTERVAL = 6000;

export function renderHero(root, works, onSelect) {
    const slidesEl = root.querySelector('.hero-slides');
    const dotsEl = root.querySelector('.hero-dots');
    const featured = works.filter((work) => work.image);

    if (featured.length === 0) {
        root.classList.add('hero-static');
        slidesEl.innerHTML =
            '<div class="hero-slide is-active hero-fallback"><div class="hero-caption">' +
            '<span class="hero-label">PORTFOLIO</span><p class="hero-title">Rin Imai</p>' +
            '<p class="hero-meta">Game Developer / 3D Artist</p></div></div>';
        return;
    }

    const slides = featured.map((work, i) => {
        const slide = document.createElement('button');
        slide.type = 'button';
        slide.className = 'hero-slide' + (i === 0 ? ' is-active' : '');
        slide.setAttribute('aria-label', `${work.title} の詳細を見る`);

        const img = document.createElement('img');
        img.src = work.image;
        img.alt = '';
        if (i > 0) img.loading = 'lazy';

        const caption = document.createElement('div');
        caption.className = 'hero-caption';
        const label = document.createElement('span');
        label.className = 'hero-label';
        label.textContent = 'PICK UP';
        const title = document.createElement('p');
        title.className = 'hero-title';
        title.textContent = work.title;
        const meta = document.createElement('p');
        meta.className = 'hero-meta';
        meta.textContent = [work.period, work.tech.join(' / ')].filter(Boolean).join('　|　');
        caption.append(label, title, meta);

        slide.append(img, caption);
        slide.addEventListener('click', () => onSelect(work));
        return slide;
    });
    slidesEl.replaceChildren(...slides);

    if (slides.length < 2) return;

    let current = 0;
    let timer;
    const dots = slides.map((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `${i + 1}枚目`);
        dot.addEventListener('click', () => {
            show(i);
            restart();
        });
        return dot;
    });
    dotsEl.replaceChildren(...dots);

    function show(index) {
        slides[current].classList.remove('is-active');
        dots[current].classList.remove('is-active');
        current = index;
        slides[current].classList.add('is-active');
        dots[current].classList.add('is-active');
    }

    function restart() {
        clearInterval(timer);
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        timer = setInterval(() => show((current + 1) % slides.length), INTERVAL);
    }

    root.addEventListener('mouseenter', () => clearInterval(timer));
    root.addEventListener('mouseleave', restart);
    restart();
}
