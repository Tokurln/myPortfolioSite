---
# 書き終わったら draft を false にすると、サイトに表示されます
title: Dream Ever Garden
tech: [Unity, C#, Blender]
period: 2026年 7月～8月
role: 世界設定作成。チームマネジメント。同期・非同期オンライン実装。一部アセット作成。
image: images/works/ShapeOfDreams.jpg
youtube:
twitter:
links: https://ivrc.net/2026_metaverse/seed-stage/
order: 9
draft: false
---

10分でループする世界で3つのギミックを解き、最後の扉を開いてゲームクリアを目指す謎解きゲームです。難易度が高く、初見での攻略は困難です。しかし世界には過去のプレイヤーが残したヒントやアイテム、ゲームオーバーになった記録が蓄積されています。それらを手がかりに周回を重ね、攻略を進めます。メタバースの「複数人が共通の目標を達成するための空間」という特性に着目し、1人で遊んでいても見知らぬ他者と助け合える非同期的な協力プレイを実現しました。

## 実装内容

- Meta XR SDKでのVR機能実装
- Unity Multiplayer Serviceを使用したオンラインマルチ実装
- Netcode for GameObjectsのゲーム内オンラインロジック実装
- Unity Cloudでのバックエンド・永続化実装
- 各メンバーの実装をオンライン版に修正
