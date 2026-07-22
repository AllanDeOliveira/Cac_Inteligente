// Funções auxiliares, formatação geográfica e integração com a API REST para o Cáceres Inteligente

export const pad = (n) => String(n).padStart(2, '0');

export const dms = (v, pos, neg) => {
  if (typeof v !== 'number' || isNaN(v)) return '';
  const t = Math.round(Math.abs(v) * 3600);
  return `${Math.floor(t / 3600)}°${pad(Math.floor((t % 3600) / 60))}'${pad(t % 60)}"${v >= 0 ? pos : neg}`;
};

export const coords = (lat, lng) => `${dms(lat, 'N', 'S')} · ${dms(lng, 'E', 'W')}`;

export const century = (period) => {
  if (!period) return '';
  const parts = period.split(' ');
  return parts[1] || parts[0];
};

export const engraved = (period) => {
  if (!period) return '';
  return period.replace(' - ', ' · ');
};

export const findMonumentById = (monuments, id) => {
  if (!Array.isArray(monuments) || !id) return null;
  const cleanId = String(id).trim().toLowerCase();
  return monuments.find(m => m.id === cleanId) || null;
};

// Integração de API Backend com resiliência e fallback offline
export const fetchMonumentsFromApi = async (apiUrl, fallbackData = []) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${apiUrl}/api/v1/monuments`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const body = await res.json();
    return body.data || fallbackData;
  } catch (err) {
    console.warn('[Cáceres Inteligente] Falha na busca remota. Utilizando fallback local/offline:', err.message);
    return fallbackData;
  }
};

export const sendScanTelemetryApi = async (apiUrl, monumentId, deviceOS = 'mobile') => {
  try {
    const res = await fetch(`${apiUrl}/api/v1/telemetry/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monumentId, deviceOS })
    });
    return res.ok;
  } catch (err) {
    console.warn('[Cáceres Inteligente] Falha ao enviar telemetria (offline):', err.message);
    return false;
  }
};
