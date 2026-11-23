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

// "GitHub|https://github.com/..." → { label: 'GitHub', url: 'https://github.com/...' }
// 表示名がなければ URL をそのまま表示名にする
function parseLink(item) {
    const bar = String(item).indexOf('|');
    const label = bar === -1 ? '' : String(item).slice(0, bar).trim();
    const url = (bar === -1 ? String(item) : String(item).slice(bar + 1)).trim();
    if (!/^https?:\/\//.test(url)) return null;
    return { label: label || url, url };
}

// 入手先の URL からストア名とアイコンの種類を決める（表示名を書かなかったときに使う）
const STORES = [
    { match: /unityroom\.com/, label: 'unityroom', kind: 'unityroom' },
    { match: /apps\.apple\.com/, label: 'App Store', kind: 'appstore' },
    { match: /play\.google\.com/, label: 'Google Play', kind: 'googleplay' },
    { match: /store\.steampowered\.com/, label: 'Steam', kind: 'steam' },
    { match: /itch\.io/, label: 'itch.io', kind: 'itch' },
    { match: /booth\.pm/, label: 'BOOTH', kind: 'booth' },
    { match: /github\.com/, label: 'GitHub', kind: 'github' },
];

function parseStore(item) {
    const link = parseLink(item);
    if (!link) return null;
    const store = STORES.find((s) => s.match.test(link.url));
    const named = link.label !== link.url;
    return {
        url: link.url,
        label: named ? link.label : store?.label ?? new URL(link.url).hostname,
        kind: store?.kind ?? 'other',
    };
}

// YouTube のどの形式の URL でも埋め込み用（/embed/動画ID）に変換する
// 例: https://youtu.be/ID?si=... / https://www.youtube.com/watch?v=ID / /shorts/ID / /live/ID
function toYoutubeEmbed(value) {
    if (!value) return '';
    let url;
    try {
        url = new URL(String(value).trim());
    } catch {
        return '';
    }
    const host = url.hostname.replace(/^(www|m)\./, '');
    let id = '';
    if (host === 'youtu.be') {
        id = url.pathname.slice(1).split('/')[0];
    } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
        id =
            url.searchParams.get('v') ??
            url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?]+)/)?.[1] ??
            '';
    }
    if (!/^[\w-]{6,}$/.test(id)) return '';
    const start = url.searchParams.get('t') ?? url.searchParams.get('start');
    const seconds = start ? parseInt(start, 10) : 0;
    return `https://www.youtube.com/embed/${id}` + (seconds > 0 ? `?start=${seconds}` : '');
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
        // 共有リンク（youtu.be）や watch?v= の URL をそのまま書いても OK
        youtube: toYoutubeEmbed(data.youtube),
        // X(Twitter) のポストURL。1つなら文字列、複数なら [url1, url2]
        twitter: [].concat(data.twitter ?? []).filter(Boolean),
        // その他のリンク。「表示名|URL」または URL だけ。複数なら [表示名|URL1, 表示名|URL2]
        links: [].concat(data.links ?? []).filter(Boolean).map(parseLink).filter(Boolean),
        // アプリ・ゲームの入手先（unityroom / App Store / Steam など）。書き方は links と同じ
        store: [].concat(data.store ?? []).filter(Boolean).map(parseStore).filter(Boolean),
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
