---
# 書き終わったら draft を false にすると、サイトに表示されます
title: STREAL
tech: [Unity, Twitch]
period: 2026年 2月～3月
# モーダルの「担当内容」
role: チームマネジメント、Unity機能実装、Twitch連携実装
image: images/works/Streal.png
youtube:
twitter:
links:
order: 6
draft: false
---

XREALデバイスを使用した、AR配信管理アプリ。配信の醍醐味として視聴者との掛け合いがあるが、作業・料理配信の際には、手元に集中するため、その際のコメントの交流がなくなってしまう。そのため、ARによって、いつでもコメントを確認できる機能を実装しました。

## 実装内容
XREAL用SDKを使用した、AR機能の実装。XR Intaraction Toolkit、XR Handsを使用したXR体験の実装。

TwitchのEventSubを使用した、UnityとTwitchの連携を実装。
- Twitchのコメント(ユーザー名・バッチ・サブスク情報)、サブスク、ビッツの情報をTwitchLib.Unityにて実装。
- Twitchのフォロー通知をTwitch EventSubサーバーとWebSocketでの接続で取得。
