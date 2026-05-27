import { SchemaType, VALID_TYPES } from './validators.js';
import {
  buildArticle,
  buildProduct,
  buildOrganization,
  buildWebPage,
  buildEvent,
  buildFaq,
} from './schemas/index.js';

const AUTO_DETECT_ORDER: { type: SchemaType; score: (data: Record<string, unknown>) => number }[] = [
  {
    type: 'faq',
    score: (d) => {
      if (d.questions && Array.isArray(d.questions) && d.questions.length > 0) return 100;
      if (d.faq && Array.isArray(d.faq) && d.faq.length > 0) return 100;
      if (d.question && Array.isArray(d.question) && d.question.length > 0 && d.answer && Array.isArray(d.answer) && d.answer.length > 0) return 100;
      return 0;
    },
  },
  {
    type: 'product',
    score: (d) => {
      let s = 0;
      if (d.price !== undefined && d.price !== null) s += 50;
      if (d.productName || (d.name && d.price !== undefined)) s += 30;
      if (d.sku || d.mpn) s += 20;
      if (d.brand) s += 10;
      if (d.ratingValue !== undefined || d.ratingCount !== undefined) s += 10;
      return s;
    },
  },
  {
    type: 'event',
    score: (d) => {
      let s = 0;
      if (d.eventName || (d.name && d.startDate)) s += 40;
      if (d.startDate) s += 40;
      if (d.venueName) s += 20;
      if (d.endDate) s += 10;
      if (d.performerName) s += 10;
      return s;
    },
  },
  {
    type: 'article',
    score: (d) => {
      let s = 0;
      if (d.headline) s += 50;
      if (d.authorName) s += 20;
      if (d.publisherName) s += 20;
      if (d.datePublished) s += 20;
      if (d.articleBody) s += 10;
      return s;
    },
  },
  {
    type: 'organization',
    score: (d) => {
      let s = 0;
      if (d.orgName) s += 40;
      if (d.streetAddress || d.addressLocality) s += 20;
      if (d.telephone || d.email) s += 15;
      if (d.logo) s += 10;
      if (d.sameAs) s += 10;
      return s;
    },
  },
  {
    type: 'webpage',
    score: (d) => {
      let s = 0;
      if (d.pageTitle || d.title) s += 30;
      if (d.url) s += 20;
      if (d.description) s += 20;
      if (d.breadcrumbs) s += 20;
      if (d.siteName || d.siteUrl) s += 10;
      return s;
    },
  },
];

function detectType(data: Record<string, unknown>): SchemaType {
  let bestType: SchemaType = 'webpage';
  let bestScore = 0;

  for (const detector of AUTO_DETECT_ORDER) {
    if (detector.type === 'webpage') continue;
    const s = detector.score(data);
    if (s > bestScore) {
      bestScore = s;
      bestType = detector.type;
    }
  }

  if (bestScore === 0) return 'webpage';
  return bestType;
}

export function generateJsonLd(type: SchemaType, data: Record<string, unknown>): Record<string, unknown> {
  const resolvedType = type === 'auto' ? detectType(data) : type;

  switch (resolvedType) {
    case 'article':
      return buildArticle(data);
    case 'product':
      return buildProduct(data);
    case 'organization':
      return buildOrganization(data);
    case 'webpage':
      return buildWebPage(data);
    case 'event':
      return buildEvent(data);
    case 'faq':
      return buildFaq(data);
    default:
      return buildWebPage(data as any);
  }
}

export { detectType };
