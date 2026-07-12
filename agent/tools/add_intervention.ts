import { defineTool } from 'eve/tools';
import { z } from 'zod';
import { fetchZenData, saveZenData, genId } from '../lib/zenApi';

export default defineTool({
  description: 'Ajoute une nouvelle intervention au planning ZEN NETTOYAGE 44.',
  inputSchema: z.object({
    client: z.string(),
    date: z.string(),
    heure: z.string(),
    adresse: z.string().optional(),
    tel: z.string().optional(),
    prestation: z.string().optional(),
    notes: z.string().optional(),
    statut: z.string().optional(),
  }),
  async execute(input) {
    const data = await fetchZenData();
    const intervention = {
      id: genId(),
      client: input.client,
      date: input.date,
      heure: input.heure,
      adresse: input.adresse || '',
      tel: input.tel || '',
      prestation: input.prestation || '',
      notes: input.notes || '',
      statut: input.statut || 'à confirmer',
    };
    data.interventions.push(intervention);
    await saveZenData(data);
    return { created: true, intervention: intervention };
  },
});
