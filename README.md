# ZEN Assistant — agent eve

Premier agent eve connecté à l'API `/api/data` de ton appli ZEN Planning. Il peut :

- **lire ton planning** d'une date donnée (`get_planning`)
- **ajouter une intervention** (`add_intervention`)

Ce projet est volontairement minimal — deux outils, pour valider le principe avant de brancher WhatsApp ou Gmail.

## 1. Installer

```bash
cd zen-agent
npm install
```

## 2. Configurer

Copie `.env.example` en `.env` et remplis les deux variables :

```bash
cp .env.example .env
```

- `ZEN_API_URL` → l'URL de ton appli ZEN Planning déjà en ligne (celle qui a `/api/data`)
- `ZEN_SYNC_CODE` → **exactement le même code** que celui que tu as défini dans la variable d'environnement `ZEN_SYNC_CODE` sur le projet Vercel `zen-planning`

Sans ces deux variables, les outils renvoient une erreur claire plutôt que d'échouer silencieusement.

## 3. Tester en local

```bash
npm run dev
```

Ça lance `eve dev` avec une interface terminal interactive. Tape directement :

```
Ajoute Karine demain 14h, nettoyage copro, 12 rue du Port Boyer
```

```
C'est prévu quoi aujourd'hui ?
```

Tu verras dans le terminal chaque étape : quel outil est appelé, avec quels paramètres, et la réponse.

Tu peux aussi tester par HTTP direct :

```bash
curl -X POST http://127.0.0.1:3000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"Ajoute Karine demain 14h, nettoyage copro"}'
```

## 4. Vérifier que ça a bien écrit

Ouvre ton appli ZEN Planning normalement (sur ton téléphone) → onglet Planning → le jour concerné doit afficher la nouvelle intervention, statut "à confirmer" (rose).

## 5. Déployer

```bash
vercel deploy
```

C'est un projet Vercel comme un autre. Une fois déployé, tu as une URL HTTP pour l'agent — c'est CETTE étape suivante qui te permettra de brancher WhatsApp (canal Chat SDK) ou Slack en un fichier.

## Prochaine étape

Une fois que ça marche en local et que tu vois bien les interventions apparaître dans ton appli, on ajoute :

- `agent/channels/whatsapp.ts` — pour parler à l'agent depuis WhatsApp
- `agent/connections/gmail.ts` + un outil `read_gmail_leads.ts` — pour transformer des mails clients en nouvelles interventions

Dis-le moi quand tu es prêt et on enchaîne.
