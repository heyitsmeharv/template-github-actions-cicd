export function formatMeta({ commitSha, buildTime }) {
  return {
    commitSha: commitSha || "unknown",
    buildTime: buildTime || "unknown"
  };
}
