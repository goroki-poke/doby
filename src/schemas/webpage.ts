import { omitNulls, normalizeArray } from '../schema-builder.js';

export interface BreadcrumbItem {
  name?: string;
  url?: string;
  label?: string;
  href?: string;
  position?: number;
}

export interface WebPageData {
  pageTitle?: string;
  name?: string;
  title?: string;
  description?: string;
  url?: string;
  siteUrl?: string;
  siteName?: string;
  breadcrumbs?: BreadcrumbItem[] | string | unknown[];
  potentialActionTarget?: string;
  image?: string;
}

export function buildWebPage(data: WebPageData): Record<string, unknown> {
  const result: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@graph': [],
  };

  const name = data.pageTitle || data.name || data.title;
  if (!data.url && !name) {
    return omitNulls({ '@context': 'https://schema.org', '@type': 'WebPage', name: '(unnamed)' });
  }

  const webPage: Record<string, unknown> = {
    '@type': 'WebPage',
  };
  if (data.url) {
    webPage['@id'] = data.url;
    webPage.url = data.url;
  }
  if (name) webPage.name = name;
  if (data.description) webPage.description = data.description;
  if (data.image) webPage.image = data.image;

  if (data.siteUrl || data.siteName) {
    const sitePart: Record<string, unknown> = {
      '@type': 'WebSite',
    };
    if (data.siteUrl) {
      sitePart['@id'] = data.siteUrl;
      sitePart.url = data.siteUrl;
    }
    if (data.siteName) sitePart.name = data.siteName;
    webPage.isPartOf = sitePart;
  }

  if (data.potentialActionTarget) {
    webPage.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: data.potentialActionTarget,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  const graph: Record<string, unknown>[] = [webPage];

  const raw = data.breadcrumbs;
  if (raw && (Array.isArray(raw) || typeof raw === 'string')) {
    let items: BreadcrumbItem[];

    if (typeof raw === 'string') {
      try {
        items = JSON.parse(raw);
      } catch {
        items = [];
      }
    } else {
      items = normalizeArray<BreadcrumbItem>(raw);
    }

    if (items.length > 0) {
      const listItems = items.map((item: BreadcrumbItem, i: number) => {
        const li: Record<string, unknown> = {
          '@type': 'ListItem',
          position: item.position || i + 1,
        };
        const itemUrl = item.url || item.href;
        const itemName = item.name || item.label;
        if (itemUrl || itemName) {
          li.item = {};
          if (itemUrl) {
            (li.item as Record<string, unknown>)['@id'] = itemUrl;
            (li.item as Record<string, unknown>).url = itemUrl;
          }
          if (itemName) (li.item as Record<string, unknown>).name = itemName;
        }
        return li;
      });

      const breadcrumbList: Record<string, unknown> = {
        '@type': 'BreadcrumbList',
        itemListElement: listItems,
      };

      if (data.url && webPage['@id']) {
        breadcrumbList['@id'] = `${data.url}#breadcrumb`;
      }

      graph.push(breadcrumbList);
    }
  }

  result['@graph'] = graph;
  return omitNulls(result);
}
