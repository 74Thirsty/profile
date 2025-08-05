import {
  GAAP_ENABLED,
  ENABLE_DEPRECIATION,
  ENABLE_PREPAIDS,
  ENABLE_ACCRUALS,
  ENABLE_ADJUSTMENTS,
  ENABLE_REPORTS,
  log
} from './core.js';

import { scanDepreciation, scanPrepaids, scanAccruals, scanAdjustments } from './scanners.js';
import { createDialogBox } from './dialog.js';
import { buildGAAPButton } from './actions.js';

export function runAutoGAAP() {
  if (!GAAP_ENABLED) return;
  log("🔥 AutoGAAP: Running full scan...");

  const findings = [];
  const ledger = window.ledgerEntries || [];

  if (ENABLE_DEPRECIATION) {
    const results = scanDepreciation();
    results.forEach(entry => {
      findings.push(
        `[Depreciation] ${entry.account} — $${entry.monthly}/mo x ${entry.years} yrs ` +
        buildGAAPButton("📥 Post", () => ({
          id: Date.now(),
          description: `AutoGAAP Depreciation for ${entry.account}`,
          postDate: new Date().toISOString().split("T")[0],
          journalNumber: `GAAP-DEP-${Date.now()}`,
          entries: [
            { accountType: "expense", accountName: "Depreciation Expense", debit: entry.monthly, credit: 0 },
            { accountType: "asset", accountName: `Accum. Depreciation – ${entry.account}`, debit: 0, credit: entry.monthly }
          ]
        }))
      );
    });
  }

  if (ENABLE_PREPAIDS) {
    const results = scanPrepaids();
    results.forEach(entry => {
      findings.push(
        `[Prepaid] ${entry.account} — $${entry.amount} likely amortized monthly ` +
        buildGAAPButton("📥 Post", () => ({
          id: Date.now(),
          description: `AutoGAAP Prepaid adjustment for ${entry.account}`,
          postDate: new Date().toISOString().split("T")[0],
          journalNumber: `GAAP-PPD-${Date.now()}`,
          entries: [
            { accountType: "expense", accountName: `${entry.account} Expense`, debit: entry.monthly, credit: 0 },
            { accountType: "asset", accountName: entry.account, debit: 0, credit: entry.monthly }
          ]
        }))
      );
    });
  }

  if (ENABLE_ACCRUALS) {
    const results = scanAccruals();
    results.forEach(entry => {
      findings.push(
        `[Accrual] ${entry.account} — Unpaid or pending ` +
        buildGAAPButton("📥 Post", () => ({
          id: Date.now(),
          description: `AutoGAAP Accrued ${entry.account}`,
          postDate: new Date().toISOString().split("T")[0],
          journalNumber: `GAAP-ACC-${Date.now()}`,
          entries: [
            { accountType: "expense", accountName: `${entry.account} Expense`, debit: 100, credit: 0 },
            { accountType: "liability", accountName: entry.account, debit: 0, credit: 100 }
          ]
        }))
      );
    });
  }

  if (ENABLE_ADJUSTMENTS) {
    const results = scanAdjustments();
    results.forEach(entry => {
      findings.push(
        `[Adjustment] ${entry.account} — from ${entry.date} ` +
        buildGAAPButton("📥 Post", () => ({
          id: Date.now(),
          description: `AutoGAAP Adjustment: ${entry.account}`,
          postDate: new Date().toISOString().split("T")[0],
          journalNumber: `GAAP-ADJ-${Date.now()}`,
          entries: [
            { accountType: "equity", accountName: "Adjustment Reserve", debit: 0, credit: 500 },
            { accountType: entry.type, accountName: entry.account, debit: 500, credit: 0 }
          ]
        }))
      );
    });
  }

  if (findings.length === 0) {
    createDialogBox("AutoGAAP Scan Complete", ["✅ No GAAP triggers found."]);
  } else {
    createDialogBox("AutoGAAP Findings", findings);
  }
}

window.runAutoGAAP = runAutoGAAP;
