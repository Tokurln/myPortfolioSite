// src/content/profile.js の内容から、リンク・ゲームキャラ・Contact・新着作品を描画する

const ICONS = {
    github:
        '<path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/>',
    x: '<path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z"/>',
    youtube:
        '<path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/>',
    mail: '<path d="M3 4h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v.4l9 5.6 9-5.6V6H3Zm18 2.8-8.5 5.3a1 1 0 0 1-1 0L3 8.8V18h18V8.8Z"/>',
    link: '<path d="M10.6 13.4a1 1 0 0 1 0-1.4l4-4a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0Zm-2.8 6.4a4.5 4.5 0 0 1-3.2-7.7l2.5-2.5a1 1 0 1 1 1.4 1.4l-2.5 2.5a2.5 2.5 0 0 0 3.5 3.5l2.5-2.5a1 1 0 1 1 1.4 1.4l-2.5 2.5a4.5 4.5 0 0 1-3.1 1.4Zm9.1-5.5a1 1 0 0 1-.7-1.7l2.5-2.5a2.5 2.5 0 0 0-3.5-3.5l-2.5 2.5a1 1 0 1 1-1.4-1.4l2.5-2.5a4.5 4.5 0 0 1 6.3 6.3l-2.5 2.5a1 1 0 0 1-.7.3Z"/>',
};

// SVG アイコンがないもの（Qiita, BOOTH など）は頭文字のバッジにする
function iconElement(name, label) {
    const svgPath = ICONS[name];
    if (svgPath) {
        const wrapper = document.createElement('span');
        wrapper.className = `link-icon link-icon-${name}`;
        wrapper.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">${svgPath}</svg>`;
        return wrapper;
    }
    const badge = document.createElement('span');
    badge.className = `link-icon link-icon-badge link-icon-${name}`;
    badge.setAttribute('aria-hidden', 'true');
    badge.textContent = label.charAt(0).toUpperCase();
    return badge;
}

function externalLink(url) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noreferrer';
    return a;
}

// data-links="icon|banner|button|text" の <ul> にリンクを並べる
function renderLinks(links) {
    document.querySelectorAll('[data-links]').forEach((list) => {
        const style = list.dataset.links;
        list.replaceChildren(
            ...links.map((link) => {
                const li = document.createElement('li');
                const a = externalLink(link.url);
                if (style === 'icon') {
                    a.setAttribute('aria-label', link.label);
                    a.title = link.label;
                    a.append(iconElement(link.icon, link.label));
                } else if (style === 'text') {
                    a.textContent = link.label;
                } else {
                    a.className = style === 'banner' ? 'side-link' : 'contact-link';
                    const label = document.createElement('span');
                    label.className = 'link-label';
                    label.textContent = link.label;
                    a.append(iconElement(link.icon, link.label), label);
                }
                li.append(a);
                return li;
            })
        );
    });
}

function renderGames(games) {
    const list = document.querySelector('.game-list');
    list.replaceChildren(
        ...games.map((game) => {
            const li = document.createElement('li');
            const card = game.url ? externalLink(game.url) : document.createElement('div');
            card.className = 'game-card' + (game.url ? '' : ' is-pending');
            card.style.setProperty('--game-color', game.color ?? 'var(--accent)');

            const title = document.createElement('span');
            title.className = 'game-title';
            title.textContent = game.game;

            const name = document.createElement('span');
            name.className = 'game-name';
            name.textContent = game.name;

            const server = document.createElement('span');
            server.className = 'game-server';
            server.textContent = game.server;

            const status = document.createElement('span');
            status.className = 'game-status';
            status.textContent = game.url ? 'キャラページを見る ›' : '準備中';

            card.append(title, name, server, status);
            li.append(card);
            return li;
        })
    );
}

function renderContact(contact) {
    document.querySelector('.contact-message').textContent = contact.message;
    if (contact.email) {
        const list = document.querySelector('.contact-links');
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'contact-link';
        a.href = `mailto:${contact.email}`;
        const label = document.createElement('span');
        label.className = 'link-label';
        label.textContent = contact.email;
        a.append(iconElement('mail', 'Mail'), label);
        li.append(a);
        list.prepend(li);
    }
}

// サイドバーの「NEW WORKS」：新しい順に3件
function renderNews(works, onSelect) {
    const list = document.querySelector('.news-list');
    list.replaceChildren(
        ...works.slice(0, 3).map((work) => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'news-item';
            const period = document.createElement('span');
            period.className = 'news-date';
            period.textContent = work.period;
            const title = document.createElement('span');
            title.className = 'news-title';
            title.textContent = work.title;
            button.append(period, title);
            button.addEventListener('click', () => onSelect(work));
            li.append(button);
            return li;
        })
    );
}

export function renderSidebar(profile, works, onSelect) {
    renderLinks(profile.links);
    renderGames(profile.games);
    renderContact(profile.contact);
    renderNews(works, onSelect);
}
