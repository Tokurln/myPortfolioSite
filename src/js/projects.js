import { createStoreLinks } from './store.js';

// 作品データから作品カードを生成する
// カード本体（サムネイル〜タグ）はモーダルを開くボタン、その下に入手先リンクを並べる
function createCard(project, onSelect) {
    const card = document.createElement('article');
    card.className = 'project-card';

    const main = document.createElement('button');
    main.type = 'button';
    main.className = 'project-card-main';

    // カード上部のサムネイル（画像がない作品はプレースホルダー）
    let thumb;
    if (project.image) {
        thumb = document.createElement('img');
        thumb.className = 'project-thumb';
        thumb.src = project.image;
        thumb.alt = '';
        thumb.loading = 'lazy';
    } else {
        thumb = document.createElement('div');
        thumb.className = 'project-thumb project-thumb-empty';
        thumb.textContent = 'No Image';
    }

    const body = document.createElement('div');
    body.className = 'project-card-body';

    const period = document.createElement('p');
    period.className = 'project-period';
    period.textContent = project.period;

    const title = document.createElement('h3');
    title.textContent = project.title;

    const tech = document.createElement('div');
    tech.className = 'project-tech';
    project.tech.forEach((name) => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = name;
        tech.append(tag);
    });

    body.append(period, title, tech);
    main.append(thumb, body);
    main.addEventListener('click', () => onSelect(project));
    card.append(main);

    if (project.store.length) {
        card.append(createStoreLinks(project.store, 'store-links project-store'));
    }
    return card;
}

export function renderProjects(container, projects, onSelect) {
    container.replaceChildren(...projects.map((project) => createCard(project, onSelect)));
}

// 作品の tech からタブ（ALL + 使われている数の多い順）を作り、選んだタグで絞り込む
export function renderWorksTabs(tabsEl, container, projects, onSelect) {
    const counts = new Map();
    projects.forEach((p) => p.tech.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    const tags = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag);

    const tabs = ['ALL', ...tags].map((tag) => {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'tab';
        tab.setAttribute('role', 'tab');
        const count = tag === 'ALL' ? projects.length : counts.get(tag);
        tab.innerHTML = '<span class="tab-label"></span><span class="tab-count"></span>';
        tab.querySelector('.tab-label').textContent = tag;
        tab.querySelector('.tab-count').textContent = count;
        tab.addEventListener('click', () => select(tag));
        return { tag, tab };
    });
    tabsEl.replaceChildren(...tabs.map(({ tab }) => tab));

    function select(tag) {
        tabs.forEach(({ tag: t, tab }) => {
            const active = t === tag;
            tab.classList.toggle('is-active', active);
            tab.setAttribute('aria-selected', String(active));
        });
        const filtered = tag === 'ALL' ? projects : projects.filter((p) => p.tech.includes(tag));
        renderProjects(container, filtered, onSelect);
    }

    select('ALL');
}
