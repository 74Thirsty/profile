export const GAAP_ENABLED = true;

export const ENABLE_DEPRECIATION = true;
export const ENABLE_PREPAIDS = true;
export const ENABLE_ACCRUALS = true;
export const ENABLE_ADJUSTMENTS = true;
export const ENABLE_REPORTS = true;

export const DEPRECIATION_THRESHOLD = 2500;
export const DEFAULT_DEPRECIATION_YEARS = 5;

export const fuzzyAssetNames = ["equipment", "vehicle", "truck", "machinery", "furniture", "computer", "laptop"];
export const prepaidKeywords = ["12 month", "annual", "6 month", "upfront", "subscription", "prepaid", "advance"];
export const accrualKeywords = ["accrued", "pending", "earned", "unpaid", "not received", "accrual"];

export function log(msg) {
  console.log(`[AutoGAAP] ${msg}`);
}
