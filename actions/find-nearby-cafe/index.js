// Mock fixture — real scraped sample data for Fréscopa locations.
// In production this is replaced by a live API call (see TODO below).
const MOCK_DATA = [
  {
    name: 'Fréscopa SoHo (Flagship)',
    location_type: 'Flagship',
    address: '112 Greene Street',
    city: 'New York',
    state: 'NY',
    hours: 'See location page for hours',
    amenities: ['Café / taste bar', 'Showroom', 'Workshops', 'Atelier tours'],
    latitude: 40.724564,
    longitude: -73.999404,
    tour_available: true,
    directions_url: 'https://www.google.com/maps/dir/?api=1&destination=112+Greene+Street+New+York+NY+10012',
  },
  {
    name: 'Fréscopa Chicago (West Loop)',
    location_type: 'Showroom café',
    address: '905 W Fulton Market',
    city: 'Chicago',
    state: 'IL',
    hours: 'See location page for hours',
    amenities: ['Café / taste bar', 'Showroom', 'Workshops', 'Atelier tours'],
    latitude: 41.886658,
    longitude: -87.650101,
    tour_available: true,
    directions_url: 'https://www.google.com/maps/dir/?api=1&destination=905+W+Fulton+Market+Chicago+IL+60607',
  },
  {
    name: 'Fréscopa Los Angeles (Arts District)',
    location_type: 'Showroom café',
    address: '720 E 3rd St',
    city: 'Los Angeles',
    state: 'CA',
    hours: 'See location page for hours',
    amenities: ['Café / taste bar', 'Showroom', 'Workshops', 'Atelier tours'],
    latitude: 34.0455829,
    longitude: -118.2372567,
    tour_available: true,
    directions_url: 'https://www.google.com/maps/dir/?api=1&destination=720+E+3rd+St+Los+Angeles+CA+90013',
  },
];

module.exports = async (args) => {
  const {
    location = '',
    max_distance,
    required_amenity = '',
  } = args || {};

  if (!location || !String(location).trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide a city, postal code, or address to find nearby Fréscopa locations.' }],
      structuredContent: { cafes: [] },
    };
  }

  // TODO: replace MOCK_DATA lookup with a real geospatial query.
  //   const base = process.env.API_BASE_URL; // never hardcode or take a URL from request data
  //   const res = await fetch(`${base}/locations?near=${encodeURIComponent(location)}`);
  //   const cafes = await res.json();
  let cafes = MOCK_DATA.slice();

  if (required_amenity && String(required_amenity).trim()) {
    const needle = String(required_amenity).trim().toLowerCase();
    cafes = cafes.filter((c) => (c.amenities || []).some((a) => a.toLowerCase().includes(needle)));
  }

  if (typeof max_distance === 'number' && !Number.isNaN(max_distance)) {
    cafes = cafes.filter((c) => typeof c.distance_miles !== 'number' || c.distance_miles <= max_distance);
  }

  if (!cafes.length) {
    return {
      content: [{ type: 'text', text: `No Fréscopa locations near "${location}" matched your criteria. Try widening the search radius or removing the amenity filter.` }],
      structuredContent: { cafes: [] },
    };
  }

  const closest = cafes[0];
  const experiences = [];
  const amen = (closest.amenities || []).map((a) => a.toLowerCase());
  if (amen.some((a) => a.includes('café') || a.includes('cafe') || a.includes('taste'))) experiences.push('tasting');
  if (amen.some((a) => a.includes('showroom'))) experiences.push('machine demonstrations');
  if (amen.some((a) => a.includes('workshop'))) experiences.push('workshops');
  const expText = experiences.length === 3
    ? 'all three — tasting, machine demonstrations, and workshops'
    : experiences.join(', ') || 'in-person experiences';
  const tourNote = closest.tour_available ? ' It can host an Atelier tour on request.' : '';

  // structuredContent.cafes — bare array outputSchema; key derived from actionName "find_nearby_cafe"
  return {
    content: [{
      type: 'text',
      text: `Found ${cafes.length} Fréscopa location${cafes.length === 1 ? '' : 's'} near "${location}". The closest relevant one is ${closest.name} at ${closest.address}, ${closest.city}, ${closest.state}, which supports ${expText}.${tourNote}`,
    }],
    structuredContent: { cafes },
  };
};
