// Client minimal pour l'API /api/data de l'appli ZEN Planning.
// Réutilisé par tous les outils qui ont besoin de lire/écrire le planning.

export type Intervention = {
  id: string;
  client: string;
  tel?: string;
  adresse?: string;
  email?: string;
  prestation?: string;
  date: string;   // AAAA-MM-JJ
  heure: string;  // HH:MM
  duree?: string;
  statut?: 'à confirmer' | 'confirmé' | 'réalisé' | 'annulé';
  notes?: string;
};

export type ZenData = {
  interventions: Intervention[];
  leads: unknown[];
  devis: unknown[];
  factures: unknown[];
  depenses: unknown[];
};

function baseUrl(): string {
  const url = process.env.ZEN_API_URL;
  if (!url) throw new Error('ZEN_API_URL manquant dans les variables d\'environnement');
  return url.replace(/\/$/, '');
}

function code(): string {
  const c = process.env.ZEN_SYNC_CODE;
  if (!c) throw new Error('ZEN_SYNC_CODE manquant dans les variables d\'environnement');
  return c;
}

const EMPTY: ZenData = { interventions: [], leads: [], devis: [], factures: [], depenses: [] };

export async function fetchZenData(): Promise<ZenData> {
  const res = await fetch(`${baseUrl()}/api/data`, {
    headers: { 'x-zen-code': code() },
  });
  if (res.status === 401) throw new Error('Code de synchro incorrect (ZEN_SYNC_CODE)');
  if (!res.ok) throw new Error(`Échec lecture planning (HTTP ${res.status})`);
  const json = (await res.json()) as { data: ZenData | null };
  return json.data ?? EMPTY;
}

export async function saveZenData(data: ZenData): Promise<void> {
  const res = await fetch(`${baseUrl()}/api/data`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-zen-code': code() },
    body: JSON.stringify({ data }),
  });
  if (res.status === 401) throw new Error('Code de synchro incorrect (ZEN_SYNC_CODE)');
  if (!res.ok) throw new Error(`Échec écriture planning (HTTP ${res.status})`);
}

// Même format d'ID que l'appli (index.html) : base36(timestamp) + suffixe aléatoire.
export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
