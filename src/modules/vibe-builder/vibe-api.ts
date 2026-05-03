const STORAGE_KEY = 'vibe_sites';

function loadAll(): any[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function saveAll(sites: any[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
}

export async function getUserSites(userId: string) {
  return loadAll().filter(s => s.userId === userId);
}

export async function saveSite(userId: string, site: any) {
  const all = loadAll();
  const idx = all.findIndex(s => s.id === site.id);
  const entry = { ...site, userId, entryId: site.id };
  if (idx >= 0) all[idx] = entry;
  else all.push(entry);
  saveAll(all);
  return { data: { id: site.id } };
}

export async function deleteSite(entryId: string) {
  saveAll(loadAll().filter(s => s.id !== entryId));
}

export async function getPublicSite(userSlug: string, siteSlug: string) {
  return loadAll().find(s => s.slug === siteSlug && s.published) || null;
}