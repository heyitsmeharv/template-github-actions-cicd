import { formatMeta } from "./meta.js";

const meta = formatMeta({
  commitSha: import.meta.env.VITE_COMMIT_SHA,
  buildTime: import.meta.env.VITE_BUILD_TIME
});

document.querySelector("#meta").innerHTML = `
  <div><b>Commit:</b> <code>${meta.commitSha}</code></div>
  <div><b>Built:</b> <code>${meta.buildTime}</code></div>
`;
