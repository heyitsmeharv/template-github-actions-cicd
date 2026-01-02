import test from "node:test";
import assert from "node:assert/strict";
import { getMeta, repoParts, badgeUrl } from "../src/meta.js";

test("getMeta falls back to unknown", () => {
  const out = getMeta({});
  assert.equal(out.commit, "unknown");
  assert.equal(out.built, "unknown");
  assert.equal(out.branch, "unknown");
  assert.equal(out.repoFull, "unknown");
});

test("getMeta uses env values", () => {
  const out = getMeta({
    VITE_COMMIT_SHA: "abc123",
    VITE_BUILD_TIME: "2026-01-02T00:00:00Z",
    VITE_REF_NAME: "main",
    VITE_REPO: "heyitsmeharv/template-github-actions-cicd",
    VITE_SERVER_URL: "https://github.com",
    VITE_CI_WORKFLOW_FILE: "ci.yml"
  });

  assert.equal(out.commit, "abc123");
  assert.equal(out.built, "2026-01-02T00:00:00Z");
  assert.equal(out.branch, "main");
  assert.equal(out.repoFull, "heyitsmeharv/template-github-actions-cicd");
  assert.equal(out.serverUrl, "https://github.com");
  assert.equal(out.ciWorkflowFile, "ci.yml");
});

test("repoParts splits owner/repo", () => {
  const out = repoParts("a/b");
  assert.deepEqual(out, { owner: "a", repo: "b" });
});

test("badgeUrl builds a badge URL", () => {
  const url = badgeUrl({
    serverUrl: "https://github.com",
    repoFull: "a/b",
    workflowFile: "ci.yml",
    branch: "main"
  });

  assert.equal(
    url,
    "https://github.com/a/b/actions/workflows/ci.yml/badge.svg?branch=main"
  );
});
