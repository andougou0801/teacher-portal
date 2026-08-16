export const qaCategories = [
  "授業",
  "学級経営",
  "校務・書類",
  "保護者対応",
  "福利厚生",
  "その他",
] as const;

export type QaCategory = (typeof qaCategories)[number];
