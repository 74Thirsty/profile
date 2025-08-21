import {
  fuzzyAssetNames,
  prepaidKeywords,
  accrualKeywords,
  DEPRECIATION_THRESHOLD,
  DEFAULT_DEPRECIATION_YEARS
} from './core.js';

function monthsBetween(startDate, endDate) {
  const s = new Date(startDate);
  const e = new Date(endDate);
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
}

function isOlderThanOneMonth(dateStr) {
  return monthsBetween(new Date(dateStr), new Date()) >= 1;
}

function isLikelyLongTerm(accountName = "") {
  const name = accountName.toLowerCase();
  return fuzzyAssetNames.some(keyword => name.includes(keyword));
}

function containsAny(text = "", keywords = []) {
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

export function scanDepreciation() {
  return (window.ledgerEntries || []).filter(entry =>
    entry.type === 'asset' &&
    entry.credit === 0 &&
    isOlderThanOneMonth(entry.date) &&
    (entry.depreciation || (
      entry.debit >= DEPRECIATION_THRESHOLD &&
      isLikelyLongTerm(entry.account)
    ))
  ).map(entry => {
    const years = entry.depreciation?.years || DEFAULT_DEPRECIATION_YEARS;
    const monthly = +(entry.debit / (years * 12)).toFixed(2);
    return {
      account: entry.account,
      monthly,
      years
    };
  });
}

export function scanPrepaids() {
  return (window.ledgerEntries || []).filter(entry =>
    entry.type === 'expense' &&
    containsAny(entry.desc, prepaidKeywords) &&
    entry.credit === 0 &&
    entry.debit >= 500
  ).map(entry => {
    const months = 12;
    const monthly = +(entry.debit / months).toFixed(2);
    return {
      account: entry.account,
      amount: entry.debit,
      monthly
    };
  });
}

export function scanAccruals() {
  return (window.ledgerEntries || []).filter(entry =>
    containsAny(entry.desc, accrualKeywords) &&
    entry.debit === 0 && entry.credit === 0
  ).map(entry => ({
    account: entry.account
  }));
}

export function scanAdjustments() {
  return (window.ledgerEntries || []).filter(entry =>
    entry.type === 'adjusting' &&
    isOlderThanOneMonth(entry.date)
  ).map(entry => ({
    account: entry.account,
    date: entry.date,
    type: entry.type
  }));
}
