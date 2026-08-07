// 練習用: わざとバグを残してあります。
// name を渡さないと "Hello, undefined!" になります。
// Issue に「@claude greet がデフォルト値を持つように直して」と書いて動作確認してください。

export function greet(name) {
  return `Hello, ${name}!`;
}
