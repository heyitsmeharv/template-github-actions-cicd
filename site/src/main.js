import { getMeta, repoParts, badgeUrl } from "./meta.js";

function el(tag, attrs = {}, html = "") {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  node.innerHTML = html;
  return node;
}

function safe(v) {
  return v && String(v).trim().length ? String(v) : "unknown";
}

async function latestRun({ owner, repo, workflowFile, branch }) {
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowFile}/runs?per_page=1&branch=${encodeURIComponent(branch)}`;

  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const data = await res.json();
  const run = data.workflow_runs?.[0];
  if (!run) return null;

  return {
    name: run.name,
    status: run.status,
    conclusion: run.conclusion,
    htmlUrl: run.html_url,
    startedAt: run.run_started_at,
    updatedAt: run.updated_at
  };
}

const meta = getMeta(import.meta.env);

const root = document.querySelector("#meta");
root.innerHTML = "";

// --- Build metadata (static for the deployed version) ---
root.appendChild(
  el(
    "div",
    {},
    `
      <h3>Deployment metadata</h3>
      <ul>
        <li><b>Repo</b>: <code>${meta.repoFull}</code></li>
        <li><b>Branch</b>: <code>${meta.branch}</code></li>
        <li><b>Commit</b>: <code>${meta.commit}</code></li>
        <li><b>Built</b>: <code>${meta.built}</code></li>
        <li><b>Triggered by</b>: <code>${meta.event}</code> (actor: <code>${meta.actor}</code>)</li>
        <li><b>Workflow</b>: <code>${meta.workflow}</code></li>
        <li><b>Run</b>: <a href="${meta.runUrl}" target="_blank" rel="noreferrer">#${meta.runNumber} (attempt ${meta.runAttempt})</a></li>
      </ul>
    `
  )
);

// --- Live status badges (always “live”) ---
const badges = el(
  "div",
  {},
  `
    <h3>Live workflow status</h3>
    <p class="muted">Badges update automatically based on the latest workflow runs.</p>
    <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
      <a href="${meta.serverUrl}/${meta.repoFull}/actions/workflows/${meta.ciWorkflowFile}" target="_blank" rel="noreferrer">
        <img alt="CI status" src="${badgeUrl({
          serverUrl: meta.serverUrl,
          repoFull: meta.repoFull,
          workflowFile: meta.ciWorkflowFile,
          branch: meta.branch
        })}">
      </a>
      <a href="${meta.serverUrl}/${meta.repoFull}/actions/workflows/${meta.pagesWorkflowFile}" target="_blank" rel="noreferrer">
        <img alt="Pages deploy status" src="${badgeUrl({
          serverUrl: meta.serverUrl,
          repoFull: meta.repoFull,
          workflowFile: meta.pagesWorkflowFile,
          branch: "main"
        })}">
      </a>
    </div>
  `
);
root.appendChild(badges);

// --- Optional: “live” latest run details via GitHub API ---
const live = el("div", {}, `<h3>Latest runs (live)</h3><p class="muted">Loading…</p>`);
root.appendChild(live);

(async () => {
  const { owner, repo } = repoParts(meta.repoFull);

  try {
    const [ciRun, pagesRun] = await Promise.all([
      latestRun({ owner, repo, workflowFile: meta.ciWorkflowFile, branch: meta.branch }),
      latestRun({ owner, repo, workflowFile: meta.pagesWorkflowFile, branch: "main" })
    ]);

    const renderRun = (title, run) => {
      if (!run) return `<li><b>${title}</b>: <span class="muted">No runs found</span></li>`;
      const status = run.status === "completed" ? safe(run.conclusion) : safe(run.status);
      return `
        <li>
          <b>${title}</b>:
          <a href="${run.htmlUrl}" target="_blank" rel="noreferrer">${status}</a>
          <span class="muted">(updated: ${safe(run.updatedAt)})</span>
        </li>
      `;
    };

    live.innerHTML = `
      <ul>
        ${renderRun("CI", ciRun)}
        ${renderRun("Pages deploy", pagesRun)}
      </ul>
      <p class="muted">
        If this repo is private, the GitHub API section may not load without authentication.
        The badges still work reliably for a “live” view.
      </p>
    `;
  } catch (e) {
    live.innerHTML = `
      <p class="muted">
        Live run details unavailable (${safe(e.message)}). This is normal for private repos or API rate limits.
        Badges above still show live status.
      </p>
    `;
  }
})();
