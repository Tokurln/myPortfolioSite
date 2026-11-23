// サイドバー・トップバー・Contact・フッターに出すリンク類はここで一括管理する
// （名前・肩書き・所属などの文言は index.html に直接書いてある）
// ゲームキャラの URL を空欄 '' にしておくと「準備中」として表示される

export const profile = {
    // SNS などのリンク（トップバー・サイドバー「Links」・フッターに表示）
    // icon: 'github' | 'x' | 'qiita' | 'youtube' | 'booth' | 'link'
    links: [
        { label: 'GitHub', url: 'https://github.com/Tokurln', icon: 'github' },
        { label: 'X (Twitter)', url: 'https://x.com/tokurin_athome', icon: 'x' },
        { label: 'Qiita', url: 'https://qiita.com/tokurin', icon: 'qiita' },
        // 追加したいときはこの形で1行足す
        // { label: 'YouTube', url: 'https://www.youtube.com/@xxxx', icon: 'youtube' },
        // { label: 'BOOTH', url: 'https://xxxx.booth.pm/', icon: 'booth' },
    ],

    // ゲームのキャラクター（サイドバー「Game Characters」に表示）
    games: [
        {
            game: 'FINAL FANTASY XIV',
            name: 'Toku Rin', // ← キャラ名
            server: 'Meteor / Zeromus', // ← ワールド名（例: Mana / Tiamat）
            url: 'https://jp.finalfantasyxiv.com/lodestone/character/49662528/', // ← キャラページURL（例: https://jp.finalfantasyxiv.com/lodestone/character/12345678/）
            color: '#3b6fd4',
        },
        {
            game: 'AION2',
            name: 'tokurin', // ← キャラ名
            server: '天族 ネザカン', // ← サーバー名
            url: 'https://aion2.plaync.com/ja-jp/characters/1502/DnU27YOmcowuQ9RiKardz8kbVOq6aO293sy3FxZm6os%3D?region=as', // ← キャラページURL
            color: '#b8892f',
        },
    ],

    // Contact セクション
    contact: {
        // メールアドレスを載せる場合だけ書く（空欄なら表示しない）
        email: 'tokurin.official@gmail.com',
        message: 'ご連絡は、X の DM または GitHub からお気軽にどうぞ。',
    },
};
