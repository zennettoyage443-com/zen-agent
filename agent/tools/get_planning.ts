import { defineTool } from 'eve/tools';
import { z } from 'zod';
import { fetchZenData } from '../lib/zenApi';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default defineTool({
  description:
    "Lit les interventions planifiées pour une date donnée. Si aucune date n'est fournie, utilise la date du jour.",
  inputSchema: z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe("Date au format AAAA-MM-JJ. Par défaut : aujourd'hui."),
  }),
  async execute(input) {
    const date = input.date ?? todayISO();
    const data = await fetchZenData();
    const items = data.interventions
      .filter((x) => x.date === date)
      .sort((a, b) => (a.heure || '').localeCompare(b.heure || ''));

    return {
      date,
      count: items.length,
      interventions: items.map((x) => ({
        heure: x.heure,
        client: x.client,
        adresse: x.adresse ?? null,
        tel: x.tel ?? null,
        prestation: x.prestation ?? null,
        statut: x.statut ?? 'à confirmer',
        notes: x.notes ?? null,
      })),
    };
  },
});
