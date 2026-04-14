# TBI AI Team — Innovation Backlog

> **Augmented Collective Intelligence** — AI als activator van humaan kapitaal.

Dit is de centrale GitHub-repository voor het TBI AI team. Alle AI-initiatieven van de 21 TBI-bedrijven worden hier beheerd, gevolgd en geprioriteerd.

---

## 🗺️ Repository structuur

```
tbi-ai-backlog/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   └── ai-initiatief.yml      ← Het formulier (vervangt de PPTX)
│   └── workflows/
│       ├── auto-label.yml          ← Auto-labeling & triage
│       ├── notify-teams.yml        ← Teams notificaties
│       └── update-dashboard.yml    ← Dashboard data genereren + deploy
├── dashboard/
│   ├── index.html                  ← Live boardroom dashboard
│   └── data.json                   ← Auto-gegenereerde projectdata (niet handmatig editen)
├── scripts/
│   └── setup-labels.js             ← Eenmalige labels setup
└── docs/
    ├── handleiding.md              ← Handleiding voor bedrijven
    └── ai-strategie.md             ← TBI ACI-framework uitleg
```

---

## 🚀 Opzet (eenmalig, door AI team)

### Stap 1 — Repository aanmaken

```bash
# Op GitHub.com: New repository
# Naam: tbi-ai-backlog
# Visibility: Private (later eventueel Internal voor TBI-medewerkers)
# Initialize with README: ja
```

### Stap 2 — Labels aanmaken

```bash
# Installeer dependencies
npm install @octokit/rest

# Zet token
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx

# Voer setup uit
node scripts/setup-labels.js tbi-holdings tbi-ai-backlog
```

### Stap 3 — Secrets instellen

Ga naar **Settings → Secrets and variables → Actions** en voeg toe:

| Secret naam | Waarde | Waarvoor |
|---|---|---|
| `TEAMS_WEBHOOK_URI` | Webhook URL van Teams-kanaal | Notificaties |

**Teams webhook aanmaken:**
1. Open het gewenste Teams-kanaal
2. `···` → Connectors → Incoming Webhook → Add
3. Geef het een naam (bv. "TBI AI Backlog")
4. Kopieer de URL → plak in GitHub Secret

### Stap 4 — GitHub Projects activeren

1. Ga naar **Projects** tab → New project → Board
2. Noem het "TBI AI Pipeline"
3. Maak kolommen: `Discover | Experiment | Scale | Operate | Afgerond`
4. Koppel de repository aan het project

### Stap 5 — GitHub Pages inschakelen (voor dashboard)

1. Ga naar **Settings → Pages**
2. Source: `GitHub Actions`
3. De workflow deployt automatisch na elke update

---

## 📋 Nieuw initiatief indienen

1. Ga naar **Issues → New Issue**
2. Kies **🤖 TBI AI Initiatief**
3. Vul het formulier in (± 10 minuten)
4. Submit → automatisch:
   - Labels worden toegepast
   - Milestone wordt ingesteld (huidig kwartaal)
   - Teams-notificatie wordt verstuurd
   - Welkomstcomment verschijnt met volgende stappen

---

## 🏷️ Label systeem

| Prefix | Voorbeeld | Betekenis |
|---|---|---|
| `status:` | `status: nieuw` | Levenscyclusstatus |
| `fase:` | `fase: Experiment` | Rijpheidsfase (Discover/Experiment/Scale/Operate) |
| `sector:` | `sector: BOUW` | TBI-sector |
| `bedrijf:` | `bedrijf: ERA Contour` | Specifiek TBI-bedrijf |
| `impact:` | `impact: 4` | Verwachte impact 1–5 |
| `aci:` | `aci: assistent` | ACI-fase (assistent/digitale collega/agent) |
| `domein:` | `domein: calculatie` | Vakdomein |
| `verandering:` | `verandering: hoog` | Veranderingsbereidheid |
| `stale` | `stale` | 14+ dagen inactief |

### Handige filters

```
# Alle open experimenten bij ERA Contour
is:open label:"bedrijf: ERA Contour" label:"fase: Experiment"

# Alles met hoge impact dat nog niet goedgekeurd is
is:open label:"impact: 5" -label:"status: goedgekeurd"

# Alle BOUW-initiatieven in Scale of Operate
is:open label:"sector: BOUW" label:"fase: Scale"
is:open label:"sector: BOUW" label:"fase: Operate"

# Stale items die aandacht nodig hebben
is:open label:stale
```

---

## 🤖 Automatisering overzicht

| Trigger | Actie |
|---|---|
| Nieuw issue | Labels toepassen, milestone instellen, welkomstcomment posten, Teams notificatie |
| Issue bewerkt | Labels herberekenen |
| Elke maandag 08:00 | Inactiviteitscheck (14+ dagen → stale label + reminder) |
| Issue gesloten | Status naar `Operate` bijwerken in dashboard |
| Elke dag 06:00 | Dashboard data.json regenereren + deploy naar GitHub Pages |
| Label toegevoegd/verwijderd | Dashboard data.json update |

---

## 📊 Live dashboard

Na setup is het dashboard beschikbaar op:
```
https://tbi-holdings.github.io/tbi-ai-backlog/
```

Het dashboard toont:
- 🗺️ **Kaart** — pins op hoofdkantooradressen van TBI-bedrijven
- 🔄 **Pipeline** — Kanban per fase (Discover → Operate)
- 📋 **Backlog** — alle initiatieven met beschrijving
- 📊 **KPI's** — statistieken en voortgang

Roteert automatisch elke 18 seconden — boardroom-ready.

---

## ❓ Veelgestelde vragen

**Kan iedereen een initiatief indienen?**
Ja, iedereen met een GitHub-account kan een issue aanmaken. Het AI team triageert en beoordeelt.

**Hoe worden initiatieven geprioriteerd?**
Op basis van impact (1–5), strategische fit (ACI-fase) en veranderingsbereidheid. Het AI team bespreekt maandelijks de backlog prioritering.

**Wat als ik geen GitHub-account heb?**
Stuur het PPTX-formulier naar [ai-team@tbi.nl](mailto:ai-team@tbi.nl). Het AI team maakt het Issue namens jou aan.

**Hoe kan ik de voortgang van mijn initiatief volgen?**
Via het GitHub Issue (notifications), het live dashboard, of de maandelijkse AI nieuwsbrief.

---

*TBI AI Team — Innovatieve ICT-oplossingen, SSC ICT*
*Contactpersoon: [ai-team@tbi.nl](mailto:ai-team@tbi.nl)*
