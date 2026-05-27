import { omitNulls, toSchemaOrgUrl, toItemCondition } from '../schema-builder.js';

export interface ProductData {
  name?: string;
  productName?: string;
  description?: string;
  image?: string;
  sku?: string;
  mpn?: string;
  brand?: string;
  price?: number | string;
  currency?: string;
  priceCurrency?: string;
  priceValidUntil?: string;
  availability?: string;
  itemCondition?: string;
  url?: string;
  ratingValue?: number | string;
  ratingCount?: number | string;
  reviewCount?: number | string;
  bestRating?: number | string;
  worstRating?: number | string;
  reviewBody?: string;
  reviewAuthor?: string;
  reviewRating?: number | string;
}

export function buildProduct(data: ProductData): Record<string, unknown> {
  const result: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
  };

  const name = data.name || data.productName;
  if (name) result.name = name;
  if (data.description) result.description = data.description;
  if (data.image) result.image = data.image;
  if (data.sku) result.sku = data.sku;
  if (data.mpn) result.mpn = data.mpn;
  if (data.url) result.url = data.url;

  if (data.brand) {
    result.brand = {
      '@type': 'Brand',
      name: data.brand,
    };
  }

  const price = data.price;
  if (price !== undefined && price !== null) {
    const offer: Record<string, unknown> = {
      '@type': 'Offer',
      price: typeof price === 'number' ? price : Number(price),
      priceCurrency: data.currency || data.priceCurrency || 'USD',
    };
    if (data.priceValidUntil) offer.priceValidUntil = data.priceValidUntil;
    if (data.availability) offer.availability = toSchemaOrgUrl(data.availability);
    if (data.itemCondition) offer.itemCondition = toItemCondition(data.itemCondition);
    if (data.url) offer.url = data.url;
    result.offers = offer;
  }

  const ratingValue = data.ratingValue ?? data.reviewRating;
  if (ratingValue !== undefined && ratingValue !== null) {
    const aggregate: Record<string, unknown> = {
      '@type': 'AggregateRating',
      ratingValue: typeof ratingValue === 'number' ? ratingValue : Number(ratingValue),
    };
    if (data.ratingCount) aggregate.ratingCount = typeof data.ratingCount === 'number' ? data.ratingCount : Number(data.ratingCount);
    if (data.reviewCount) aggregate.reviewCount = typeof data.reviewCount === 'number' ? data.reviewCount : Number(data.reviewCount);
    if (data.bestRating) aggregate.bestRating = typeof data.bestRating === 'number' ? data.bestRating : Number(data.bestRating);
    if (data.worstRating) aggregate.worstRating = typeof data.worstRating === 'number' ? data.worstRating : Number(data.worstRating);
    result.aggregateRating = aggregate;
  }

  if (data.reviewBody && data.reviewAuthor) {
    result.review = {
      '@type': 'Review',
      reviewBody: data.reviewBody,
      author: {
        '@type': 'Person',
        name: data.reviewAuthor,
      },
      ...(data.reviewRating ? {
        reviewRating: {
          '@type': 'Rating',
          ratingValue: typeof data.reviewRating === 'number' ? data.reviewRating : Number(data.reviewRating),
        }
      } : {}),
    };
  }

  return omitNulls(result);
}
