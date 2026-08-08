import { test } from "node:test";
import assert from "node:assert";
import { greet } from "./greet.js";

test("名前を渡すと挨拶を返す", () => {
  assert.strictEqual(greet("Atsushi"), "Hello, Atsushi!");
});

test("日本語名と空白を含む名前をそのまま扱う", () => {
  assert.strictEqual(greet("山泉"), "Hello, 山泉!");
  assert.strictEqual(greet("Ada Lovelace"), "Hello, Ada Lovelace!");
});
