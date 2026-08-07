# claude-agent-starter

GitHub Actions 上で Claude Code を動かす練習用リポジトリ。
Issue や PR に `@claude` とメンションすると、Claude がコードを読んで修正ブランチと PR を作ります。

---

## セットアップ（5ステップ）

### 1. リポジトリを作る

```bash
cd claude-agent-starter
git init
git add -A
git commit -m "init: claude agent starter"
gh repo create claude-agent-starter --private --source=. --push
```

`gh` が無ければ GitHub の Web で空リポジトリを作り、`git remote add origin ...` して push。

### 2. Claude GitHub App を入れる

ターミナルで Claude Code を起動して:

```
/install-github-app
```

ブラウザが開くので、対象リポジトリを選んで許可する。
（手動でやるなら https://github.com/apps/claude からインストール）

### 3. API キーを Secrets に登録

1. https://console.anthropic.com/settings/keys でキーを発行
2. リポジトリの **Settings → Secrets and variables → Actions → New repository secret**
3. Name: `ANTHROPIC_API_KEY` / Value: 発行したキー

> キーは絶対にコードやコミットに含めない。Secrets のみ。

### 4. 使用上限を設定する（重要）

Anthropic Console の **Billing → Usage limits** で月額上限とアラートを設定。
従量課金なので、これを最初にやらないと事故ります。

### 5. 動作確認

リポジトリに Issue を立てて、本文にこう書く:

```
@claude src/greet.js の greet 関数が name を渡さないとエラーになります。
デフォルト値を入れて、テストも追加してください。
```

数分で Actions が走り、修正ブランチと PR が返ってきます。

---

## 使い方のパターン

| 書き方 | 挙動 |
|---|---|
| Issue に `@claude ○○を直して` | 修正ブランチ + PR を作成 |
| PR コメントに `@claude レビューして` | 差分をレビューしてコメント |
| PR コメントに `@claude テストが落ちてる。直して` | CI ログを読んで修正を push |
| コード行コメントに `@claude ここ何してる？` | その箇所を解説 |

---

## 運用の勘所

**コスト**

- `if:` 条件で `@claude` を含むときだけ起動 → 無駄な実行をゼロに
- `timeout-minutes: 20` と `--max-turns 25` で暴走時の上限を固定
- Actions の無料枠は Private リポジトリだと月 2,000 分。Public は無制限

**安全性**

- `permissions:` は必要な分だけ。`contents: write` はあるが、**main への直接 push は GitHub 側のブランチ保護で塞ぐ**のが正解
  - Settings → Branches → main に「Require a pull request before merging」を設定
- `--allowedTools` で `Bash` を無制限に許可しない。`Bash(npm test)` のように個別に列挙する
- Public リポジトリで外部の人がコメントできる状態なら、`if:` に作者チェックを足す:
  ```yaml
  github.event.comment.author_association == 'OWNER' ||
  github.event.comment.author_association == 'MEMBER'
  ```

**観測**

- 実行ログは Actions タブに全部残る。「何をしようとして失敗したか」はここを見る
- コストを本格的に見たくなったら Cloudflare AI Gateway を挟む（後からでも可）

---

## 次にやると良いこと

1. `CLAUDE.md` にプロジェクトの規約（命名、テストの書き方、使用ライブラリ）を書く → 出力品質が明確に上がる
2. PR 自動レビュー用のワークフローを別ファイルで追加する
3. 慣れたら本番リポジトリに `.github/workflows/claude.yml` をコピーする
