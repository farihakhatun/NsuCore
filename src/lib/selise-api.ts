import { clients } from '@/lib/https';
import { useAuthStore } from '@/state/store/auth';

// --- AUTHENTICATION ---
export async function getUserId(): Promise<string> {
  try {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      const base64Url = token.split('.')[1];
      const decoded = JSON.parse(window.atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded?.sub || decoded?.userId || '';
    }
    return '';
  } catch (e) {
    console.error("Auth Error", e);
    return '';
  }
}

// --- SITE MANAGEMENT ---
export async function saveSite(siteName: string, canvasData: any) {
  const slug = siteName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const payload = {
    schemaSlug: 'vibe-sites',
    referenceId: slug,
    data: typeof canvasData === 'string' ? canvasData : JSON.stringify(canvasData)
  };
  
  return await clients.post('/content/v1/Entries', payload);
}

export async function getSite(siteName: string) {
  try {
    const res: any = await clients.get(`/content/v1/Entries?schemaSlug=vibe-sites&referenceId=${siteName}`);
    if (res?.data?.items && res.data.items.length > 0) {
      const entry = res.data.items[0];
      return entry.data ? JSON.parse(entry.data) : null;
    }
    return null;
  } catch (e) {
    console.error("GetSite Error", e);
    return null;
  }
}

export async function getUserSites(userId: string) {
  try {
    const res: any = await clients.get(`/content/v1/Entries?schemaSlug=vibe-sites`);
    const items = res?.data?.items || [];
    return items.map((item: any) => ({
      id: item.id,
      name: item.referenceId ? item.referenceId.replace(/-/g, ' ') : 'Untitled Site',
      slug: item.referenceId,
      pages: [{ id: 'home', slug: 'home' }]
    }));
  } catch (e) {
    console.error("GetUserSites Error", e);
    return [];
  }
}

export async function deleteSite(id: string) {
  return await clients.delete(`/content/v1/Entries/${id}`);
}

// --- USER PROFILES ---
export async function getProfile(userId: string) {
  try {
    const res: any = await clients.get(`/content/v1/Entries?schemaSlug=user-profile&referenceId=${userId}`);
    return res?.data?.items?.[0] || null;
  } catch (e) {
    console.error("GetProfile Error", e);
    return null;
  }
}

export async function saveProfile(userId: string, data: any) {
  return await clients.post('/content/v1/Entries', {
    schemaSlug: 'user-profile',
    referenceId: userId,
    data: data
  });
}

// --- MEDIA & ASSETS ---
export async function uploadMedia(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res: any = await clients.post('/content/v1/Media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res?.data?.url || '';
  } catch (e) {
    console.error("Upload Error", e);
    return '';
  }
}

// --- UTILS ---
export function formatSlug(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}