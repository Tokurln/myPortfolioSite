// src/content/affiliations.json（所属・サークル・外部コミュニティ）を描画する
//
// affiliations.json の1件 = { ... } ひとつ。項目の意味:
//   name   : 名前（必須）
//   type   : 種類のラベル（例: 大学 / サークル / コミュニティ / インターン）
//   role   : 役職・立場（例: 代表 / メンバー / 運営）。空欄なら表示しない
//   since  : いつから（例: 2024年4月）。空欄なら期間を表示しない
//   until  : いつまで。空欄なら「現在」
//   url    : 公式サイトなど。あれば名前がリンクになる
//   note   : ひとこと説明。空欄なら表示しない
//   main   : true にするとサイドバーのキャラクターカードにも表示（メインの所属）
//   hidden : true にするとサイトに表示しない（下書き・記入例用）
// 並び順はファイルに書いた順（main: true のものが先頭に来る）

import data from '../content/affiliations.json';

const affiliations = data
    .filter((item) => item && item.name && !item.hidden)
    .sort((a, b) => Number(Boolean(b.main)) - Number(Boolean(a.main)));

function period(item) {
    if (!item.since) return '';
    return `${item.since} 〜 ${item.until || '現在'}`;
}

function createItem(item) {
    const li = document.createElement('li');
    li.className = 'affiliation' + (item.main ? ' is-main' : '');

    const head = document.createElement('div');
    head.className = 'affiliation-head';

    if (item.type) {
        const type = document.createElement('span');
        type.className = 'affiliation-type';
        type.textContent = item.type;
        head.append(type);
    }

    let name;
    if (item.url) {
        name = document.createElement('a');
        name.href = item.url;
        name.target = '_blank';
        name.rel = 'noreferrer';
    } else {
        name = document.createElement('span');
    }
    name.className = 'affiliation-name';
    name.textContent = item.name;
    head.append(name);
    li.append(head);

    const meta = [item.role, period(item)].filter(Boolean);
    if (meta.length) {
        const metaEl = document.createElement('p');
        metaEl.className = 'affiliation-meta';
        meta.forEach((text, i) => {
            const span = document.createElement('span');
            span.className = i === 0 && item.role ? 'affiliation-role' : 'affiliation-period';
            span.textContent = text;
            metaEl.append(span);
        });
        li.append(metaEl);
    }

    if (item.note) {
        const note = document.createElement('p');
        note.className = 'affiliation-note';
        note.textContent = item.note;
        li.append(note);
    }
    return li;
}

// 表示先の要素が index.html から消されていても、他の処理を止めないようにそれぞれ存在チェックする
export function renderAffiliations() {
    // Profile パネルの一覧
    const list = document.querySelector('.affiliation-list');
    if (list) {
        list.replaceChildren(...affiliations.map(createItem));
        const block = list.closest('.affiliation-block');
        if (block) block.hidden = affiliations.length === 0;
    }

    // サイドバーのキャラクターカード（main: true のもの）
    const side = document.querySelector('.character-affiliation');
    if (!side) return;
    const mains = affiliations.filter((item) => item.main);
    side.replaceChildren(
        ...mains.map((item) => {
            const line = document.createElement('span');
            line.textContent = item.role ? `${item.name}（${item.role}）` : item.name;
            return line;
        })
    );
    side.hidden = mains.length === 0;
}
