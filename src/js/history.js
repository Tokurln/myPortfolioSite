// src/content/history.json（コンテスト・ハッカソン・インターンなどの実績）を年表として描画する
//
// history.json の1件 = { ... } ひとつ。項目の意味:
//   date   : 年月（必須）。"2026-08" の形で書く（"2026" だけでも可）。新しい順に自動で並ぶ
//   type   : 種類（コンテスト / ハッカソン / インターン / 受賞 / 登壇 など）。種類ごとに色が変わる
//   title  : イベント名・会社名（必須）
//   result : 結果（例: 最優秀賞 / 本選出場 / 2週間参加）。空欄なら表示しない
//   url    : 公式サイトなど。あれば名前がリンクになる
//   work   : 関連する作品のタイトル（works/*.md の title と同じ文字）。あれば「作品を見る」ボタンが出る
//   note   : ひとこと説明。空欄なら表示しない
//   hidden : true にするとサイトに表示しない（下書き・記入例用）

import data from '../content/history.json';

const TYPE_CLASS = {
    コンテスト: 'contest',
    ハッカソン: 'hackathon',
    インターン: 'intern',
    受賞: 'award',
    登壇: 'talk',
};

const entries = data
    .filter((item) => item && item.date && item.title && !item.hidden)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

function parseDate(date) {
    const [year, month] = String(date).split('-');
    return { year, month: month ? `${Number(month)}月` : '' };
}

function createItem(item, works, onSelect) {
    const li = document.createElement('li');
    li.className = `history-item history-${TYPE_CLASS[item.type] ?? 'other'}`;

    const month = document.createElement('span');
    month.className = 'history-month';
    month.textContent = parseDate(item.date).month;

    const body = document.createElement('div');
    body.className = 'history-body';

    const head = document.createElement('div');
    head.className = 'history-head';
    if (item.type) {
        const type = document.createElement('span');
        type.className = 'history-type';
        type.textContent = item.type;
        head.append(type);
    }
    let title;
    if (item.url) {
        title = document.createElement('a');
        title.href = item.url;
        title.target = '_blank';
        title.rel = 'noreferrer';
    } else {
        title = document.createElement('span');
    }
    title.className = 'history-title';
    title.textContent = item.title;
    head.append(title);
    body.append(head);

    if (item.result) {
        const result = document.createElement('p');
        result.className = 'history-result';
        result.textContent = item.result;
        body.append(result);
    }
    if (item.note) {
        const note = document.createElement('p');
        note.className = 'history-note';
        note.textContent = item.note;
        body.append(note);
    }

    const work = item.work && works.find((w) => w.title === item.work);
    if (work) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'history-work';
        button.textContent = `作品を見る：${work.title}`;
        button.addEventListener('click', () => onSelect(work));
        body.append(button);
    }

    li.append(month, body);
    return li;
}

export function renderHistory(works, onSelect) {
    const root = document.querySelector('.history');
    if (!root) return;
    const section = root.closest('section');
    if (section) section.hidden = entries.length === 0;

    // 年ごとにまとめる（entries は新しい順なので、そのまま出てきた順に並べる）
    const years = new Map();
    for (const item of entries) {
        const { year } = parseDate(item.date);
        if (!years.has(year)) years.set(year, []);
        years.get(year).push(item);
    }

    root.replaceChildren(
        ...[...years].map(([year, items]) => {
            const group = document.createElement('li');
            group.className = 'history-year';
            const label = document.createElement('span');
            label.className = 'history-year-label';
            label.textContent = year;
            const list = document.createElement('ol');
            list.className = 'history-items';
            list.append(...items.map((item) => createItem(item, works, onSelect)));
            group.append(label, list);
            return group;
        })
    );
}
