import { omitNulls, normalizeArray } from '../schema-builder.js';

export interface FaqItem {
  question?: string;
  q?: string;
  name?: string;
  answer?: string;
  a?: string;
  text?: string;
}

export interface FaqData {
  questions?: unknown;
  faq?: unknown;
  question?: unknown;
  answer?: unknown;
}

export function buildFaq(data: FaqData): Record<string, unknown> {
  const result: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
  };

  let items: FaqItem[] = [];

  if (data.questions && Array.isArray(data.questions)) {
    items = data.questions as FaqItem[];
  } else if (data.faq && Array.isArray(data.faq)) {
    items = data.faq as FaqItem[];
  } else if (data.question && Array.isArray(data.question) && data.answer && Array.isArray(data.answer)) {
    const qs = data.question as string[];
    const ans = data.answer as string[];
    const len = Math.min(qs.length, ans.length);
    for (let i = 0; i < len; i++) {
      items.push({ question: qs[i], answer: ans[i] });
    }
  } else if (data.question && typeof data.question === 'object' && !Array.isArray(data.question)) {
    items = [data.question as FaqItem];
  }

  if (items.length === 0) {
    return omitNulls({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] });
  }

  const mainEntity = items.map((item: FaqItem) => {
    const q = item.question || item.q || item.name;
    const a = item.answer || item.a || item.text;

    if (!q || !a) return null;

    return {
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    };
  }).filter(Boolean);

  result.mainEntity = mainEntity;

  return omitNulls(result);
}
