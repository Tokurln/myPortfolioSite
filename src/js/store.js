// 作品の入手先（.md の store:）をボタンの並びにする。カードとモーダルの両方で使う

export function createStoreLinks(store, className = 'store-links') {
    const list = document.createElement('div');
    list.className = className;
    store.forEach(({ url, label, kind }) => {
        const a = document.createElement('a');
        a.className = `store-link store-${kind}`;
        a.href = url;
        a.target = '_blank';
        a.rel = 'noreferrer';
        const icon = document.createElement('span');
        icon.className = 'store-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = '▶';
        const text = document.createElement('span');
        text.textContent = label;
        a.append(icon, text);
        list.append(a);
    });
    return list;
}
