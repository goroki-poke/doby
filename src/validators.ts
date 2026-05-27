export const VALID_TYPES = ['article', 'product', 'organization', 'webpage', 'event', 'faq', 'auto'] as const;
export type SchemaType = (typeof VALID_TYPES)[number];

export interface InputData {
  type?: string;
  data?: Record<string, unknown>;
}

export interface ValidationResult {
  valid: boolean;
  type?: SchemaType;
  data?: Record<string, unknown>;
  error?: string;
}

const RECOGNIZED_FIELDS = new Set([
  'headline', 'description', 'excerpt',
  'productName', 'name', 'price', 'currency', 'sku', 'mpn', 'brand',
  'orgName', 'logo', 'url', 'streetAddress', 'addressLocality',
  'pageTitle', 'siteName', 'breadcrumbs',
  'eventName', 'startDate', 'endDate', 'venueName',
  'questions', 'faq', 'question', 'answer',
  'authorName', 'publisherName', 'datePublished', 'articleBody', 'image',
  'sameAs', 'telephone', 'email',
  'ratingValue', 'ratingCount',
  'offerPrice', 'offerCurrency',
]);

function hasRecognizedFields(data: Record<string, unknown>): boolean {
  return Object.keys(data).some(key => RECOGNIZED_FIELDS.has(key));
}

export function validateInput(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { valid: false, error: 'Invalid input data provided.' };
  }

  const input = body as InputData;

  if (!input.data || typeof input.data !== 'object' || Array.isArray(input.data) || Object.keys(input.data).length === 0) {
    return { valid: false, error: 'Invalid input data provided.' };
  }

  if (!hasRecognizedFields(input.data)) {
    return { valid: false, error: 'Invalid input data provided.' };
  }

  if (input.type && input.type !== 'auto' && !VALID_TYPES.includes(input.type as SchemaType)) {
    return { valid: false, error: 'Invalid input data provided.' };
  }

  return {
    valid: true,
    type: (input.type as SchemaType) || 'auto',
    data: input.data,
  };
}
