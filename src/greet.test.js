import { test } from "node:test";
import assert from "node:assert";
import { greet } from "./greet.js";

test("名前を渡すと挨拶を返す", () => {
  assert.strictEqual(greet("Atsushi"), "Hello, Atsushi!");
});
