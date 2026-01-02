import test from "node:test";
import assert from "node:assert/strict";
import { formatMeta } from "../src/meta.js";

test("formatMeta falls back to unknown", () => {
  const out = formatMeta({});
  assert.equal(out.commitSha, "unknown");
  assert.equal(out.buildTime, "unknown");
});

test("formatMeta uses provided values", () => {
  const out = formatMeta({ commitSha: "abc", buildTime: "2026-01-02T00:00:00Z" });
  assert.equal(out.commitSha, "abc");
  assert.equal(out.buildTime, "2026-01-02T00:00:00Z");
});
