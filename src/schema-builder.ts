export function omitNulls(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      const cleaned = value
        .map(v => (typeof v === 'object' && v !== null ? omitNulls(v as Record<string, unknown>) : v))
        .filter(v => v !== null && v !== undefined);
      if (cleaned.length > 0) result[key] = cleaned;
    } else if (typeof value === 'object') {
      const cleaned = omitNulls(value as Record<string, unknown>);
      if (Object.keys(cleaned).length > 0) result[key] = cleaned;
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      result[key] = value;
    }
  }
  return result;
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function toSchemaOrgUrl(availability: string): string {
  const map: Record<string, string> = {
    instock: 'https://schema.org/InStock',
    outofstock: 'https://schema.org/OutOfStock',
    preorder: 'https://schema.org/PreOrder',
    backorder: 'https://schema.org/BackOrder',
    discontinued: 'https://schema.org/Discontinued',
    inshop: 'https://schema.org/InStoreOnly',
    onlineonly: 'https://schema.org/OnlineOnly',
    limitedavailability: 'https://schema.org/LimitedAvailability',
  };
  const key = availability.replace(/[\s_-]/g, '').toLowerCase();
  return map[key] || availability;
}

export function toItemCondition(value: string): string {
  const map: Record<string, string> = {
    new: 'https://schema.org/NewCondition',
    used: 'https://schema.org/UsedCondition',
    refurbished: 'https://schema.org/RefurbishedCondition',
    damaged: 'https://schema.org/DamagedCondition',
  };
  const key = value.toLowerCase();
  return map[key] || value;
}

export function formatDate(date: string): string {
  if (/^\d{4}-\d{2}-\d{2}/.test(date)) return date;
  const d = new Date(date);
  if (!isNaN(d.getTime())) return d.toISOString();
  return date;
}

export function normalizeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === 'object') return [value] as T[];
  return [];
}
