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
            name: 'キャラクター名', // ← キャラ名
            server: 'ワールド名', // ← ワールド名（例: Mana / Tiamat）
            url: '', // ← キャラページURL（例: https://jp.finalfantasyxiv.com/lodestone/character/12345678/）
            color: '#3b6fd4',
        },
        {
            game: 'AION2',
            name: 'キャラクター名', // ← キャラ名
            server: 'サーバー名', // ← サーバー名
            url: '', // ← キャラページURL
            color: '#b8892f',
        },
    ],

    // Contact セクション
    contact: {
        // メールアドレスを載せる場合だけ書く（空欄なら表示しない）
        email: '',
        message: 'お仕事のご相談・ご連絡は、X の DM または GitHub からお気軽にどうぞ。',
    },
};
