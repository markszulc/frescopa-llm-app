// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
const MOCK_DATA = [
    {
        store_id: 'frescopa-soho',
        name: 'Fréscopa SoHo (Flagship)',
        city: 'New York, NY',
        address: '112 Greene Street, New York, NY',
        hours: 'Mon–Sun · 7am–8pm',
        amenities: ['Café', 'Showroom', 'Workshops'],
        tour_eligible: true,
        latitude: 40.7245739,
        longitude: -73.999429,
        directions_url: 'https://www.google.com/maps/search/?api=1&query=112%20Greene%20Street%2C%20New%20York%2C%20NY',
    },
    {
        store_id: 'frescopa-west-loop',
        name: 'Fréscopa West Loop',
        city: 'Chicago, IL',
        address: '905 W Fulton Market, Chicago, IL',
        hours: 'Mon–Sun · 7am–7pm',
        amenities: ['Café', 'Showroom', 'Workshops'],
        tour_eligible: true,
        latitude: 41.8864169,
        longitude: -87.6502131,
        directions_url: 'https://www.google.com/maps/search/?api=1&query=905%20W%20Fulton%20Market%2C%20Chicago%2C%20IL',
    },
    {
        store_id: 'frescopa-ponce-city-market',
        name: 'Fréscopa Ponce City Market',
        city: 'Atlanta, GA',
        address: '675 Ponce De Leon Ave NE, Atlanta, GA',
        hours: 'Mon–Sun · 7am–8pm',
        amenities: ['Café', 'Showroom', 'Workshops'],
        tour_eligible: true,
        latitude: 33.7723214,
        longitude: -84.3653476,
        directions_url: 'https://www.google.com/maps/search/?api=1&query=675%20Ponce%20De%20Leon%20Ave%20NE%2C%20Atlanta%2C%20GA',
    },
    {
        store_id: 'frescopa-wynwood',
        name: 'Fréscopa Wynwood',
        city: 'Miami, FL',
        address: '2750 NW 3rd Ave, Miami, FL',
        hours: 'Mon–Sun · 7am–9pm',
        amenities: ['Café', 'Showroom', 'Workshops'],
        tour_eligible: true,
        latitude: 25.8025107,
        longitude: -80.2016599,
        directions_url: 'https://www.google.com/maps/search/?api=1&query=2750%20NW%203rd%20Ave%2C%20Miami%2C%20FL',
    },
    {
        store_id: 'frescopa-ferry-building',
        name: 'Fréscopa Ferry Building',
        city: 'San Francisco, CA',
        address: '1 Ferry Building, San Francisco, CA',
        hours: 'Mon–Sun · 7am–7pm',
        amenities: ['Café', 'Showroom'],
        tour_eligible: true,
        latitude: 37.7955487,
        longitude: -122.3934746,
        directions_url: 'https://www.google.com/maps/search/?api=1&query=1%20Ferry%20Building%2C%20San%20Francisco%2C%20CA',
    },
    {
        store_id: 'frescopa-arts-district',
        name: 'Fréscopa Arts District',
        city: 'Los Angeles, CA',
        address: '720 E 3rd St, Los Angeles, CA',
        hours: 'Mon–Sun · 7am–8pm',
        amenities: ['Café', 'Showroom', 'Workshops'],
        tour_eligible: true,
        latitude: 34.0455829,
        longitude: -118.2372567,
        directions_url: 'https://www.google.com/maps/search/?api=1&query=720%20E%203rd%20St%2C%20Los%20Angeles%2C%20CA',
    },
];

const EARTH_RADIUS_MILES = 3958.8;

function haversineMiles(lat1, lon1, lat2, lon2) {
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2
        + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

module.exports = async ({
    location = '',
    latitude = null,
    longitude = null,
    amenity = '',
    radius_miles = null,
} = {}) => {
    if (!location || typeof location !== 'string' || !location.trim()) {
        return {
            content: [{ type: 'text', text: 'Please provide a location (city, state, ZIP code, or address) to search near.' }],
            // structuredContent.cafes — bare array outputSchema; key derived from actionName "find_frescopa_cafe"
            structuredContent: { cafes: [] },
        };
    }

    const hasOrigin = typeof latitude === 'number' && Number.isFinite(latitude)
        && typeof longitude === 'number' && Number.isFinite(longitude);

    let results = MOCK_DATA.map((cafe) => {
        if (hasOrigin && typeof cafe.latitude === 'number' && typeof cafe.longitude === 'number') {
            const distance = haversineMiles(latitude, longitude, cafe.latitude, cafe.longitude);
            return { ...cafe, distance_miles: Math.round(distance * 10) / 10 };
        }
        return { ...cafe };
    });

    // Optional amenity filter — "café", "showroom", "workshops", or "any".
    const amenityKey = typeof amenity === 'string' ? amenity.trim().toLowerCase() : '';
    if (amenityKey && amenityKey !== 'any' && amenityKey !== 'any location') {
        results = results.filter((cafe) => Array.isArray(cafe.amenities)
            && cafe.amenities.some((a) => String(a).toLowerCase().includes(amenityKey)));
    }

    // Optional radius filter — only meaningful when an origin coordinate was supplied.
    const radius = typeof radius_miles === 'number' && Number.isFinite(radius_miles) ? radius_miles : null;
    if (hasOrigin && radius !== null && radius > 0) {
        results = results.filter((cafe) => typeof cafe.distance_miles === 'number' && cafe.distance_miles <= radius);
    }

    if (hasOrigin) {
        results.sort((a, b) => {
            const da = typeof a.distance_miles === 'number' ? a.distance_miles : Infinity;
            const db = typeof b.distance_miles === 'number' ? b.distance_miles : Infinity;
            return da - db;
        });
    }

    if (results.length === 0) {
        return {
            content: [{ type: 'text', text: `No Fréscopa cafés found near ${location.trim()}.` }],
            // structuredContent.cafes — bare array outputSchema; key derived from actionName "find_frescopa_cafe"
            structuredContent: { cafes: [] },
        };
    }

    const nearest = results[0];
    const tourReady = results.filter((c) => c.tour_eligible).length;
    let summary = `Showing ${results.length} Fréscopa café${results.length === 1 ? '' : 's'} near ${location.trim()}.`;
    summary += ` ${nearest.name} in ${nearest.city} is the closest suitable match`;
    if (Array.isArray(nearest.amenities) && nearest.amenities.length) {
        summary += `, where you can ${nearest.amenities.map((a) => String(a).toLowerCase()).join(', ')}`;
    }
    summary += '.';
    if (tourReady > 0) {
        summary += ` ${tourReady} location${tourReady === 1 ? '' : 's'} accept${tourReady === 1 ? 's' : ''} Atelier tour requests.`;
    }

    return {
        content: [{ type: 'text', text: summary }],
        // structuredContent.cafes — bare array outputSchema; key derived from actionName "find_frescopa_cafe"
        structuredContent: { cafes: results },
    };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/cafes?location=${location}&amenity=${amenity}&radius=${radius_miles}
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Authentication: check the website's developer docs or network requests
 *   captured during browsing for the correct auth header pattern.
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/cafes?location=${encodeURIComponent(location)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
