import { omitNulls } from '../schema-builder.js';

export interface OrganizationData {
  name?: string;
  orgName?: string;
  description?: string;
  url?: string;
  logo?: string;
  orgType?: string;
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
  telephone?: string;
  email?: string;
  contactType?: string;
  sameAs?: string | string[];
}

export function buildOrganization(data: OrganizationData): Record<string, unknown> {
  const result: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': data.orgType || 'Organization',
  };

  const name = data.name || data.orgName;
  if (name) result.name = name;
  if (data.description) result.description = data.description;
  if (data.url) result.url = data.url;
  if (data.logo) result.logo = data.logo;

  const hasAddress = data.streetAddress || data.addressLocality || data.addressRegion || data.postalCode || data.addressCountry;
  if (hasAddress) {
    const address: Record<string, unknown> = { '@type': 'PostalAddress' };
    if (data.streetAddress) address.streetAddress = data.streetAddress;
    if (data.addressLocality) address.addressLocality = data.addressLocality;
    if (data.addressRegion) address.addressRegion = data.addressRegion;
    if (data.postalCode) address.postalCode = data.postalCode;
    if (data.addressCountry) address.addressCountry = data.addressCountry;
    result.address = address;
  }

  const hasContact = data.telephone || data.email;
  if (hasContact) {
    const cp: Record<string, unknown> = { '@type': 'ContactPoint' };
    if (data.telephone) cp.telephone = data.telephone;
    if (data.email) cp.email = data.email;
    if (data.contactType) cp.contactType = data.contactType;
    result.contactPoint = cp;
  }

  if (data.sameAs) {
    if (typeof data.sameAs === 'string') {
      const sames = data.sameAs.split(',').map(s => s.trim()).filter(Boolean);
      if (sames.length > 0) result.sameAs = sames;
    } else if (Array.isArray(data.sameAs) && data.sameAs.length > 0) {
      result.sameAs = data.sameAs;
    }
  }

  return omitNulls(result);
}
