import { omitNulls, formatDate } from '../schema-builder.js';

export interface ArticleData {
  headline?: string;
  description?: string;
  excerpt?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  authorUrl?: string;
  authorType?: string;
  publisherName?: string;
  publisherLogo?: string;
  publisherUrl?: string;
  image?: string;
  articleBody?: string;
  url?: string;
  articleSection?: string;
}

export function buildArticle(data: ArticleData): Record<string, unknown> {
  const result: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
  };

  if (data.headline) result.headline = data.headline;
  if (data.description) result.description = data.description;
  if (data.excerpt && !data.description) result.description = data.excerpt;

  if (data.datePublished) result.datePublished = formatDate(data.datePublished);
  if (data.dateModified) result.dateModified = formatDate(data.dateModified);
  if (data.image) result.image = data.image;
  if (data.url) result.url = data.url;
  if (data.articleSection) result.articleSection = data.articleSection;
  if (data.articleBody) result.articleBody = data.articleBody;

  if (data.authorName) {
    const author: Record<string, unknown> = {
      '@type': data.authorType === 'Organization' ? 'Organization' : 'Person',
      name: data.authorName,
    };
    if (data.authorUrl) author.url = data.authorUrl;
    result.author = author;
  }

  if (data.publisherName) {
    const publisher: Record<string, unknown> = {
      '@type': 'Organization',
      name: data.publisherName,
    };
    if (data.publisherLogo) {
      publisher.logo = {
        '@type': 'ImageObject',
        url: data.publisherLogo,
      };
    }
    if (data.publisherUrl) publisher.url = data.publisherUrl;
    result.publisher = publisher;
  }

  const cleaned = omitNulls(result);
  if (cleaned['@type'] === 'Article') {
    if (!cleaned.headline && data.url) {
      cleaned.headline = data.url;
    }
  }
  return cleaned;
}
