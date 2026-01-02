function safe(v) {
  return v && String(v).trim().length ? String(v) : "unknown";
}

export function repoParts(full) {
  const [owner, repo] = safe(full) === "unknown" ? ["unknown", "unknown"] : String(full).split("/");
  return { owner: owner || "unknown", repo: repo || "unknown" };
}

export function badgeUrl({ serverUrl, repoFull, workflowFile, branch }) {
  // GitHub Actions badge URL format:
  // https://github.com/<owner>/<repo>/actions/workflows/<workflow>.yml/badge.svg?branch=<branch>
  return `${serverUrl}/${repoFull}/actions/workflows/${workflowFile}/badge.svg?branch=${encodeURIComponent(branch)}`;
}

export function getMeta(env) {
  return {
    commit: safe(env.VITE_COMMIT_SHA),
    built: safe(env.VITE_BUILD_TIME),
    branch: safe(env.VITE_REF_NAME),
    repoFull: safe(env.VITE_REPO),

    actor: safe(env.VITE_ACTOR),
    event: safe(env.VITE_EVENT_NAME),
    workflow: safe(env.VITE_WORKFLOW),

    runUrl: safe(env.VITE_RUN_URL),
    runNumber: safe(env.VITE_RUN_NUMBER),
    runAttempt: safe(env.VITE_RUN_ATTEMPT),

    serverUrl: safe(env.VITE_SERVER_URL),
    ciWorkflowFile: safe(env.VITE_CI_WORKFLOW_FILE),
    pagesWorkflowFile: safe(env.VITE_PAGES_WORKFLOW_FILE)
  };
}
