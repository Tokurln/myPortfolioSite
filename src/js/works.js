// src/content/works/*.md を読み込んで、作品データの配列にする
// 各ファイルは「--- で囲んだ設定（frontmatter）」＋「本文（ゲームの説明）」の形

const files = import.meta.glob('../content/works/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
});

// "key: value" 形式の frontmatter を読む（# で始まる行はコメント）
function parseFrontmatter(text) {
    const data = {};
    for (const line of text.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const colon = trimmed.indexOf(':');
        if (colon === -1) continue;

        const key = trimmed.slice(0, colon).trim();
        let value = trimmed.slice(colon + 1).trim();

        if (value.startsWith('[') && value.endsWith(']')) {
            data[key] = value
                .slice(1, -1)
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
            continue;
        }

        value = value.replace(/^(["'])(.*)\1$/, '$2');
        if (value === 'true' || value === 'false') {
            data[key] = value === 'true';
        } else if (/^-?\d+(\.\d+)?$/.test(value)) {
            data[key] = Number(value);
        } else {
            data[key] = value;
        }
    }
    return data;
}

// 本文を「最初の ## より前（ゲームの説明）」と「## 見出し ごとのセクション」に分ける
function splitBody(body) {
    const sections = [];
    let explanation = [];
    let current = null;
    for (const line of body.split(/\r?\n/)) {
        const heading = line.match(/^##\s+(.+)$/);
        if (heading) {
            current = { heading: heading[1].trim(), lines: [] };
            sections.push(current);
        } else if (current) {
            current.lines.push(line);
        } else {
            explanation.push(line);
        }
    }
    return {
        explanation: explanation.join('\n').trim(),
        sections: sections
            .map((s) => ({ heading: s.heading, text: s.lines.join('\n').trim() }))
            .filter((s) => s.text),
    };
}

function parseWork(path, raw) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) {
        console.warn(`${path}: 先頭の --- で囲んだ設定が見つかりません`);
        return null;
    }
    const data = parseFrontmatter(match[1]);
    const { explanation, sections } = splitBody(match[2]);
    return {
        title: data.title ?? '',
        tech: Array.isArray(data.tech) ? data.tech : [],
        period: data.period ?? '',
        role: data.role ?? '',
        image: data.image ?? '',
        youtube: data.youtube ?? '',
        // X(Twitter) のポストURL。1つなら文字列、複数なら [url1, url2]
        twitter: [].concat(data.twitter ?? []).filter(Boolean),
        order: typeof data.order === 'number' ? data.order : -Infinity,
        draft: data.draft === true,
        explanation,
        sections, // [{ heading: '実装内容', text: '...' }, ...]
    };
}

// .md は古い順に order を振っているので、サイトでは order の大きい順（新しい作品が上）に並べる
// draft: true の作品は表示しない
export const works = Object.entries(files)
    .map(([path, raw]) => parseWork(path, raw))
    .filter((work) => work && !work.draft)
    .sort((a, b) => b.order - a.order);
