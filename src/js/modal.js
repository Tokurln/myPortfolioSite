import { createStoreLinks } from './store.js';

const modal = () => document.getElementById('projectModal');

// .md の本文を表示用の要素にする（空行で段落、「- 」で始まる行は箇条書き）
function renderText(container, text) {
    container.replaceChildren();
    let list = null;
    for (const block of text.split(/\n\s*\n/)) {
        list = null;
        let paragraph = null;
        for (const line of block.split('\n')) {
            const item = line.match(/^\s*[-*]\s+(.*)$/);
            if (item) {
                if (!list) {
                    list = document.createElement('ul');
                    container.append(list);
                }
                const li = document.createElement('li');
                li.textContent = item[1];
                list.append(li);
                paragraph = null;
            } else if (line.trim()) {
                if (!paragraph) {
                    paragraph = document.createElement('p');
                    container.append(paragraph);
                } else {
                    paragraph.append(document.createElement('br'));
                }
                paragraph.append(line.trim());
                list = null;
            }
        }
    }
}

export function openProjectModal(project) {
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalRole').textContent = project.role;

    // ゲームの説明（空なら見出しごと隠す）
    renderText(document.getElementById('modalExplanation'), project.explanation);
    document.getElementById('modalExplanationSection').hidden = !project.explanation;

    // 「## 実装内容」などの追加セクション
    const extra = document.getElementById('modalExtraSections');
    extra.replaceChildren(
        ...project.sections.map((section) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'modal-extra-section';
            const heading = document.createElement('h4');
            heading.textContent = section.heading;
            const body = document.createElement('div');
            body.className = 'modal-text';
            renderText(body, section.text);
            wrapper.append(heading, body);
            return wrapper;
        })
    );

    // 画像がない作品はプレースホルダーを表示
    const image = document.getElementById('modalImage');
    const placeholder = document.getElementById('modalImagePlaceholder');
    if (project.image) {
        image.src = project.image;
        image.alt = project.title;
        image.hidden = false;
        placeholder.hidden = true;
    } else {
        image.removeAttribute('src');
        image.hidden = true;
        placeholder.hidden = false;
    }

    // YouTube の URL があるときだけ動画セクションを表示
    const videoSection = document.querySelector('.modal-video-section');
    if (project.youtube) {
        document.getElementById('modalYoutube').src = project.youtube;
        videoSection.style.display = 'block';
    } else {
        videoSection.style.display = 'none';
    }

    // 入手先（なければ隠す）
    const store = document.getElementById('modalStore');
    store.replaceChildren(...(project.store.length ? [createStoreLinks(project.store)] : []));
    store.hidden = project.store.length === 0;

    renderTweets(project.twitter);
    renderLinks(project.links);

    if (!modal().classList.contains('show')) {
        document.dispatchEvent(new Event('modal:open')); // ヒーローのスライドを止める合図
    }
    modal().classList.add('show');
    document.body.style.overflow = 'hidden';
}

// X(Twitter) の公式埋め込みスクリプトを、必要になったときに1回だけ読み込む
let twitterScript;
function loadTwitterWidgets() {
    twitterScript ??= new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.onload = () => window.twttr.ready(resolve);
        script.onerror = reject;
        document.head.append(script);
    });
    return twitterScript;
}

// https://x.com/ユーザー名/status/123... や twitter.com の URL からポストの ID を取り出す
function tweetId(url) {
    return url.match(/(?:twitter\.com|x\.com)\/[^/]+\/status(?:es)?\/(\d+)/)?.[1];
}

async function renderTweets(urls) {
    const section = document.getElementById('modalTweetSection');
    const container = document.getElementById('modalTweets');
    container.replaceChildren();
    const ids = urls.map(tweetId).filter(Boolean);
    section.hidden = ids.length === 0;
    if (ids.length === 0) return;

    // 読み込めなかったとき用に、先にポストへのリンクを置いておく
    const slots = ids.map((id, i) => {
        const slot = document.createElement('div');
        slot.className = 'modal-tweet';
        const link = document.createElement('a');
        link.href = urls.find((u) => tweetId(u) === id) ?? urls[i];
        link.target = '_blank';
        link.rel = 'noreferrer';
        link.textContent = 'X でポストを見る';
        slot.append(link);
        container.append(slot);
        return slot;
    });

    try {
        await loadTwitterWidgets();
    } catch {
        return; // スクリプトがブロックされたときはリンクのまま
    }
    // 読み込み中にモーダルが閉じられたり、別の作品に切り替わったりしたら何もしない
    if (!slots[0].isConnected) return;
    for (const [i, id] of ids.entries()) {
        const slot = slots[i];
        const tweet = await window.twttr.widgets.createTweet(id, slot, {
            theme: 'light',
            lang: 'ja',
            dnt: true,
            align: 'center',
        });
        if (tweet) slot.querySelector('a')?.remove();
    }
}

// .md の links: に書いたリンクを一覧で表示（なければセクションごと隠す）
function renderLinks(links) {
    const section = document.getElementById('modalLinkSection');
    const list = document.getElementById('modalLinks');
    list.replaceChildren(
        ...links.map(({ label, url }) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.rel = 'noreferrer';
            a.textContent = label;
            li.append(a);
            return li;
        })
    );
    section.hidden = links.length === 0;
}

export function closeProjectModal() {
    modal().classList.remove('show');
    document.body.style.overflow = '';
    document.dispatchEvent(new Event('modal:close')); // ヒーローのスライドを再開
    // 動画の再生を止める
    document.getElementById('modalYoutube').src = '';
    document.getElementById('modalTweets').replaceChildren();
}

export function initModal() {
    // 背景クリックで閉じる（中身のクリックでは閉じない）
    modal().addEventListener('click', (e) => {
        if (e.target === modal()) closeProjectModal();
    });
    document.querySelector('.modal-close').addEventListener('click', closeProjectModal);

    // ESCキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal().classList.contains('show')) {
            closeProjectModal();
        }
    });
}
