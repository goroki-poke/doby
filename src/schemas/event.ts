import { omitNulls, formatDate, toSchemaOrgUrl } from '../schema-builder.js';

export interface EventData {
  name?: string;
  eventName?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  image?: string;
  url?: string;
  eventUrl?: string;
  venueName?: string;
  venueStreetAddress?: string;
  venueLocality?: string;
  venueRegion?: string;
  venuePostalCode?: string;
  venueCountry?: string;
  price?: number | string;
  eventPrice?: number | string;
  currency?: string;
  eventCurrency?: string;
  availability?: string;
  performerName?: string;
  eventStatus?: string;
  eventAttendanceMode?: string;
}

export function buildEvent(data: EventData): Record<string, unknown> {
  const result: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
  };

  const name = data.name || data.eventName;
  if (name) result.name = name;
  if (data.startDate) result.startDate = formatDate(data.startDate);
  if (data.endDate) result.endDate = formatDate(data.endDate);
  if (data.description) result.description = data.description;
  if (data.image) result.image = data.image;

  const link = data.url || data.eventUrl;
  if (link) result.url = link;

  if (data.eventStatus) {
    const st = data.eventStatus.toLowerCase();
    if (['scheduled', 'postponed', 'cancelled', 'movedonline', 'rescheduled'].includes(st)) {
      result.eventStatus = `https://schema.org/Event${st.charAt(0).toUpperCase() + st.slice(1)}`;
    } else {
      result.eventStatus = data.eventStatus;
    }
  }

  if (data.eventAttendanceMode) {
    const am = data.eventAttendanceMode.toLowerCase().replace(/[\s_-]/g, '');
    if (['offline', 'offlineeventattendancemode'].includes(am)) {
      result.eventAttendanceMode = 'https://schema.org/OfflineEventAttendanceMode';
    } else if (['online', 'onlineeventattendancemode'].includes(am)) {
      result.eventAttendanceMode = 'https://schema.org/OnlineEventAttendanceMode';
    } else if (['mixed', 'mixedeventattendancemode'].includes(am)) {
      result.eventAttendanceMode = 'https://schema.org/MixedEventAttendanceMode';
    } else {
      result.eventAttendanceMode = data.eventAttendanceMode;
    }
  }

  const hasVenue = data.venueName || data.venueStreetAddress || data.venueLocality;
  if (hasVenue) {
    const place: Record<string, unknown> = { '@type': 'Place' };
    if (data.venueName) place.name = data.venueName;
    if (data.venueStreetAddress || data.venueLocality || data.venueRegion || data.venuePostalCode || data.venueCountry) {
      const addr: Record<string, unknown> = { '@type': 'PostalAddress' };
      if (data.venueStreetAddress) addr.streetAddress = data.venueStreetAddress;
      if (data.venueLocality) addr.addressLocality = data.venueLocality;
      if (data.venueRegion) addr.addressRegion = data.venueRegion;
      if (data.venuePostalCode) addr.postalCode = data.venuePostalCode;
      if (data.venueCountry) addr.addressCountry = data.venueCountry;
      place.address = addr;
    }
    result.location = place;
  }

  const p = data.price ?? data.eventPrice;
  if (p !== undefined && p !== null) {
    const offer: Record<string, unknown> = {
      '@type': 'Offer',
      price: typeof p === 'number' ? p : Number(p),
      priceCurrency: data.currency || data.eventCurrency || 'USD',
    };
    if (data.availability) offer.availability = toSchemaOrgUrl(data.availability);
    if (link) offer.url = link;
    result.offers = offer;
  }

  if (data.performerName) {
    result.performer = {
      '@type': 'Person',
      name: data.performerName,
    };
  }

  return omitNulls(result);
}
