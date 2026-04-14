#!/usr/bin/env node
/**
 * TBI AI — GitHub Labels setup script
 *
 * Gebruik: node scripts/setup-labels.js <owner> <repo>
 * Vereist: GITHUB_TOKEN in environment
 *
 * Maakt alle labels aan die de GitHub Actions verwachten.
 * Kleuren zijn gebaseerd op TBI huisstijl.
 */

const { Octokit } = require('@octokit/rest');

const owner = process.argv[2];
const repo  = process.argv[3];

if (!owner || !repo) {
  console.error('Gebruik: node setup-labels.js <owner> <repo>');
  process.exit(1);
}

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// ─────────────────────────────────────────────────────────────────────────────
// LABEL DEFINITIES
// TBI paars: 630d80 | TBI groen: c1e62e (te licht, gebruik 7a9015)
// ─────────────────────────────────────────────────────────────────────────────
const LABELS = [

  // ── Status ────────────────────────────────────────────────────────────────
  { name: 'status: nieuw',          color: '768694', description: 'Zojuist ingediend, nog niet getriaged' },
  { name: 'status: in review',      color: '869eb3', description: 'AI team is dit aan het beoordelen' },
  { name: 'status: goedgekeurd',    color: '34c759', description: 'GO — opgenomen in actieve backlog' },
  { name: 'status: on hold',        color: 'ffae0d', description: 'Tijdelijk geparkeerd' },
  { name: 'status: afgewezen',      color: 'f26457', description: 'NO GO — niet opgenomen' },
  { name: 'stale',                  color: 'e4e669', description: '14+ dagen geen activiteit' },

  // ── PMC Fase (rijpheid + governance) ──────────────────────────────────────
  // Kleur: paars = TBI Holding centraal | teal = transitie | groen = bedrijf
  { name: 'fase: Idee',           color: '630d80', description: 'Fase 1 — TBI Holding, Holding fonds' },
  { name: 'fase: Prototype',      color: '7a3596', description: 'Fase 2 — TBI Holding, Holding fonds' },
  { name: 'fase: Pilots',         color: '1d7a6e', description: 'Fase 3 — Transitie, co-financiering' },
  { name: 'fase: Go-to-Market',   color: '2a7a1a', description: 'Fase 4 — TBI Bedrijf, eigen budget primair' },
  { name: 'fase: Scale-Up',       color: '3a9020', description: 'Fase 5 — TBI Bedrijf, volledig eigen budget' },

  // ── Kleur (governance) ────────────────────────────────────────────────────
  { name: 'kleur: paars',  color: '630d80', description: 'TBI Holding centraal gefinancierd' },
  { name: 'kleur: teal',   color: '1d7a6e', description: 'Transitiefase — co-financiering' },
  { name: 'kleur: groen',  color: '3a9020', description: 'TBI Bedrijf eigen budget' },

  // ── Financiering ──────────────────────────────────────────────────────────
  { name: 'financiering: holding-fonds',    color: '534AB7', description: 'Centraal TBI Holding fonds' },
  { name: 'financiering: co-financiering',  color: '1D9E75', description: '50/50 TBI + bedrijf' },
  { name: 'financiering: bedrijf-primair',  color: '3B6D11', description: 'Bedrijf primair + TBI ondersteuning' },
  { name: 'financiering: volledig-bedrijf', color: '27500A', description: 'Volledig eigen bedrijfsbudget' },

  // ── Sector ────────────────────────────────────────────────────────────────
  { name: 'sector: TECHNIEK',       color: '630d80', description: 'Croonwolter&dros, Comfort Partners, WTH, etc.' },
  { name: 'sector: BOUW',           color: '2a8a2a', description: 'ERA Contour, J.P. van Eesteren, Koopmans, etc.' },
  { name: 'sector: INFRA',          color: '1489cc', description: 'Mobilis, Voorbij Funderingstechniek' },
  { name: 'sector: HOLDING',        color: '404040', description: 'TBI Holdings, TBI SSC ICT' },

  // ── Bedrijf ───────────────────────────────────────────────────────────────
  { name: 'bedrijf: Comfort Partners',            color: '8b5cf6', description: '' },
  { name: 'bedrijf: Croonwolter&dros',            color: '630d80', description: '' },
  { name: 'bedrijf: Eekels Technology',           color: '7c3aed', description: '' },
  { name: 'bedrijf: ERA Contour',                 color: '2a8a2a', description: '' },
  { name: 'bedrijf: GeWOONhout',                  color: '15803d', description: '' },
  { name: 'bedrijf: Giesbers InstallatieGroep',   color: '9333ea', description: '' },
  { name: 'bedrijf: Hazenberg Bouw',              color: '166534', description: '' },
  { name: 'bedrijf: HEVO',                        color: '16a34a', description: '' },
  { name: 'bedrijf: J.P. van Eesteren',           color: '4d7c0f', description: '' },
  { name: 'bedrijf: Koopmans Bouwgroep',          color: '3f6212', description: '' },
  { name: 'bedrijf: MDB',                         color: '365314', description: '' },
  { name: 'bedrijf: Mobilis',                     color: '1d4ed8', description: '' },
  { name: 'bedrijf: Nico de Bont',                color: '14532d', description: '' },
  { name: 'bedrijf: Synchroon',                   color: '064e3b', description: '' },
  { name: 'bedrijf: TBI Holdings',                color: '404040', description: '' },
  { name: 'bedrijf: TBI SSC ICT',                 color: '374151', description: '' },
  { name: 'bedrijf: Voorbij Funderingstechniek',  color: '1e40af', description: '' },
  { name: 'bedrijf: Voorbij Prefab',              color: '1e3a8a', description: '' },
  { name: 'bedrijf: WTH Vloerverwarming',         color: 'a21caf', description: '' },

  // ── ACI fase ──────────────────────────────────────────────────────────────
  { name: 'aci: assistent',         color: 'c1e62e', description: 'Fase 1 — AI ondersteunt individuele medewerker' },
  { name: 'aci: digitale collega',  color: 'a816d9', description: 'Fase 2 — AI werkt samen in een team' },
  { name: 'aci: agent',             color: '630d80', description: 'Fase 3 — AI handelt autonoom' },

  // ── Impact ────────────────────────────────────────────────────────────────
  { name: 'impact: 5',              color: 'dc2626', description: 'Transformatief' },
  { name: 'impact: 4',              color: 'f26457', description: 'Groot' },
  { name: 'impact: 3',              color: 'ffae0d', description: 'Gemiddeld' },
  { name: 'impact: 2',              color: 'fbbf24', description: 'Klein' },
  { name: 'impact: 1',              color: 'fde68a', description: 'Experimenteel' },

  // ── Veranderingsbereidheid ─────────────────────────────────────────────────
  { name: 'verandering: hoog',      color: '34c759', description: 'Team is klaar' },
  { name: 'verandering: gemiddeld', color: 'ffae0d', description: 'Enige begeleiding nodig' },
  { name: 'verandering: laag',      color: 'f26457', description: 'Significante change management nodig' },

  // ── Domein ────────────────────────────────────────────────────────────────
  { name: 'domein: werkvoorbereiding', color: '26bdbd', description: '' },
  { name: 'domein: calculatie',        color: '2fb2eb', description: '' },
  { name: 'domein: bouwproces',        color: '1489cc', description: '' },
  { name: 'domein: energietransitie',  color: '16a34a', description: '' },
  { name: 'domein: risico',            color: 'f26457', description: '' },
  { name: 'domein: operations',        color: '768694', description: '' },
  { name: 'domein: documenten',        color: '869eb3', description: '' },
  { name: 'domein: data',              color: '7c3aed', description: '' },
  { name: 'domein: strategie',         color: '630d80', description: '' },
];

// ─────────────────────────────────────────────────────────────────────────────
// UITVOERING
// ─────────────────────────────────────────────────────────────────────────────
async function setupLabels() {
  console.log(`\n🏷️  TBI AI Labels Setup — ${owner}/${repo}\n`);

  // Haal bestaande labels op
  const { data: existing } = await octokit.issues.listLabelsForRepo({
    owner, repo, per_page: 200,
  });
  const existingNames = new Set(existing.map(l => l.name));

  let created = 0, updated = 0, skipped = 0;

  for (const label of LABELS) {
    try {
      if (existingNames.has(label.name)) {
        // Update kleur/beschrijving
        await octokit.issues.updateLabel({ owner, repo, ...label });
        console.log(`  ✏️  Updated: ${label.name}`);
        updated++;
      } else {
        await octokit.issues.createLabel({ owner, repo, ...label });
        console.log(`  ✅ Created: ${label.name}`);
        created++;
      }
    } catch (e) {
      console.error(`  ❌ Error: ${label.name} — ${e.message}`);
      skipped++;
    }

    // Rate limiting: wacht 100ms tussen calls
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n✅ Klaar! Created: ${created}, Updated: ${updated}, Errors: ${skipped}`);
  console.log(`Total labels: ${LABELS.length}\n`);
}

setupLabels().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
