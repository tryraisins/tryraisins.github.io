// The skill-downloads Worker (workers/skill-downloads) adds prompt copies recorded
// here to npm and skills.sh installs and returns only the combined total.
const SKILL_STATS_URL: string =
  import.meta.env.PUBLIC_SKILL_STATS_API_URL || 'https://skill-downloads.tryraisins.workers.dev';

// Counts each skill and scope once per visit so repeated copy clicks don't inflate it.
export function recordInstall(skill: string, scope: string) {
  const key = `sk-installed:${skill}:${scope}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
  } catch {
    // Storage can be blocked; counting without dedupe is still better than not counting.
  }
  const body = JSON.stringify({ skill, scope });
  // sendBeacon posts text/plain, which avoids a CORS preflight.
  if (navigator.sendBeacon?.(SKILL_STATS_URL, body)) return;
  fetch(SKILL_STATS_URL, { method: 'POST', body, keepalive: true }).catch(() => {});
}

export async function loadDownloadTotal(): Promise<number | null> {
  try {
    const response = await fetch(SKILL_STATS_URL, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;
    const { total } = await response.json();
    return Number.isSafeInteger(total) && total > 0 ? total : null;
  } catch {
    return null;
  }
}
