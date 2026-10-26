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

export type DownloadTotal = {
  total: number;
  // When the stored total last moved. npm batches its daily figures, so this
  // trails the recompute time by up to a few days.
  changed: number | null;
};

export async function loadDownloadTotal(fresh = false): Promise<DownloadTotal | null> {
  try {
    // A fresh read skips the Worker's five minute response cache, for the case
    // where someone comes back to the library to check the count.
    const url = fresh ? `${SKILL_STATS_URL}?v=${Date.now()}` : SKILL_STATS_URL;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      cache: fresh ? 'no-store' : 'default',
    });
    if (!response.ok) return null;
    const { total, changed } = await response.json();
    if (!Number.isSafeInteger(total) || total <= 0) return null;
    return { total, changed: Number.isFinite(changed) ? changed : null };
  } catch {
    return null;
  }
}
