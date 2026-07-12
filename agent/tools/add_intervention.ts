import { defineTool } from 'eve/tools';
import { z } from 'zod';
import { fetchZenData, saveZenData, genId } from '../lib/zenApi';

export default defineTool({
  description:
    "Ajoute une nouvelle intervention au planning ZEN NETTOYAGE 44. Nécessite au minimum un client, une date et une heure. Calcule toujours la date exacte (AAAA-MM-JJ) avant d'appeler cet outil — n'envoie jamais 'demain' ou 'lundi prochain' tel quel.",
  inputSchema: z.object({
    client: z.string().min(1).describe('Nom du client ou de la société'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Date au format AAAA-MM-JJ'),
    heure: z.string().regex(/^\d{2}:\d{2}$/).describe("Heure au format HH:MM"),
    adresse: z.string().optional().describe("Adresse de l'intervention"),
    tel: z.string().optional().describe('Numéro de téléphone du client'),
    prestation: z
      .string()
      .optional()
      .describe('Type de prestation : bureaux, copropriété, fin de chantier, vitres, Airbnb, grand ménage…'),
    notes: z.string().optional().describe("Notes libres : code d'accès, étage, consignes…"),
    statut: z
      .enum(['à confirmer', 'confirmé', 'réalisé', 'annulé'])
      .optional()
      .describe("Par défaut : 'à confirmer', sauf si Taha dit explicitement que c'est confirmé."),
  }),
  async execute(input) {
    const data = await fetchZenData();

    const intervention = {
      id: genId(),
      client: input.client,
      date: input.date,
      heure: input.heure,
      adresse: input.adresse ?? '',
      tel: input.tel ?? '',
      prestation: input.prestation ?? '',
      notes: input.notes ?? '',
      statut: input.statut ?? ('à confirmer' as const),
    };

    data.interventions.push(intervention);
    await saveZenData(data);

    return {
      created: true,
      intervention,
    };
  },
});
