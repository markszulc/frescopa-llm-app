// Fréscopa product catalog context (from samplePayload). Used to validate the
// requested interests and surface the featured Atelier machine in the summary.
// TODO: Replace MOCK_DATA with a real API call. See the TODO block below the handler.
const MOCK_DATA = [
    {
        name: 'The Atelier',
        description: 'AI-enabled bean-to-cup machine that learns your taste cup by cup and reorders beans before you run low.',
        category: 'Bean-to-cup',
        brewing_style: 'bean-to-cup',
        price: 2199,
        price_label: '$2,199 or $184/month',
        automation_level: 'Fully automatic',
        automation_preference: 'fully automatic',
        counter_space: 'standard',
        footprint: '32 × 24 × 41 cm',
        capacity: '1.8 L water tank, 250 g bean hopper',
        availability: 'Available',
        availability_status: 'available',
        finishes: ['Cream', 'Charcoal', 'Terracotta'],
        feature_highlights: [
            'Learns your taste over ~7 days across up to 6 household profiles',
            'Automatically reorders beans before you run low',
            'Whisper-quiet grinding at 58 dB',
            'Calendar-aware smart warmup and self-rinsing',
        ],
        key_features: [
            'Taste-learning flavour DNA per user',
            'Sensor ring monitors grind, flow, strength and temperature',
            'Automatic motorized milk wand',
            'Wi-Fi + calendar integration',
            '2-year warranty, 30-night trial',
        ],
        tradeoffs: [
            'Highest price in the range',
            'Hands-off automation means less manual control for ritual enthusiasts',
        ],
        image_url: 'https://main--frescopa26--markszulc.aem.live/media_1a775c161149ea61e50ce787b6c0adb646148c6ca.jpg?width=1200&format=pjpg&optimize=medium',
        product_url: 'https://main--frescopa26--markszulc.aem.live/of1/knowledge/atelier',
    },
    {
        name: 'The Atelier Mini',
        description: 'The same intelligent taste-learning technology as the flagship, sized for smaller kitchens.',
        category: 'Bean-to-cup',
        brewing_style: 'bean-to-cup',
        price: 799,
        price_label: '$799',
        automation_level: 'Fully automatic',
        automation_preference: 'fully automatic',
        counter_space: 'compact',
        footprint: 'Compact (space-efficient)',
        capacity: 'Compact bean-to-cup format',
        availability: 'Join the list',
        availability_status: 'waitlist',
        finishes: ['Cream', 'Charcoal', 'Terracotta'],
        feature_highlights: [
            'Same intelligent taste-learning as the flagship',
            'Compact design for smaller kitchens',
            'Automatic motorized milk wand',
            'Wi-Fi and calendar integration',
        ],
        key_features: [
            'Intelligent learning in a compact body',
            'Multiple household profiles',
            'Automatic milk steaming',
            'Smart connectivity',
        ],
        tradeoffs: [
            'Currently waitlist-only, not available for direct purchase',
            'Smaller footprint trades away some capacity versus the flagship',
        ],
        product_url: 'https://main--frescopa26--markszulc.aem.live/of1/knowledge/machines',
    },
    {
        name: 'The Barista',
        description: 'A hands-on espresso machine for the morning ritualist, with full manual control over every shot.',
        category: 'Espresso',
        brewing_style: 'hands-on espresso',
        price: 899,
        price_label: '$899',
        automation_level: 'Manual',
        automation_preference: 'hands-on',
        counter_space: 'standard',
        footprint: 'Standard espresso machine',
        capacity: 'Espresso-based drinks',
        availability: 'Available',
        availability_status: 'available',
        feature_highlights: [
            'Full manual control — dial in every shot',
            'Manual steam wand',
            'Built for espresso-based drinks',
            'Made for the hands-on ritualist',
        ],
        key_features: [
            'Pure hands-on craft, no automation',
            'Manual steam wand',
            'Single shared setup',
        ],
        product_url: 'https://main--frescopa26--markszulc.aem.live/of1/knowledge/machines',
    },
    {
        name: 'The Everyday',
        description: 'Honest espresso every single morning with simplified, one-button operation.',
        category: 'Espresso',
        brewing_style: 'espresso',
        price: 499,
        price_label: '$499',
        automation_level: 'Semi-automatic (one-button)',
        automation_preference: 'simple',
        counter_space: 'compact',
        footprint: 'Compact countertop espresso',
        capacity: 'Espresso-based drinks',
        availability: 'Available',
        availability_status: 'available',
        feature_highlights: [
            'Simplified one-button operation',
            'Reliable, consistent results',
            'Honest espresso every morning',
        ],
        key_features: [
            'One-button simplicity',
            'Consistent daily espresso',
            'Approachable price',
        ],
        product_url: 'https://main--frescopa26--markszulc.aem.live/of1/knowledge/machines',
    },
    {
        name: 'The Slow Pour',
        description: 'Even saturation and gentle timing for consistent filter coffee.',
        category: 'Filter',
        brewing_style: 'filter',
        price: 279,
        price_label: '$279',
        automation_level: 'Automatic pour-over',
        automation_preference: 'guided',
        counter_space: 'compact',
        footprint: 'Compact filter brewer',
        capacity: 'Filter coffee',
        availability: 'Available',
        availability_status: 'available',
        feature_highlights: [
            'Even saturation for consistent extraction',
            'Gentle, controlled timing',
            'Reliable filter coffee',
        ],
        key_features: [
            'Consistent saturation',
            'Gentle brew timing',
            'Filter-focused',
        ],
        product_url: 'https://main--frescopa26--markszulc.aem.live/of1/knowledge/machines',
    },
    {
        name: 'The Carafe',
        description: 'Overnight steeping produces smooth, low-acid cold brew, ready from the fridge whenever you need it.',
        category: 'Cold brew',
        brewing_style: 'cold brew',
        price: 179,
        price_label: '$179',
        automation_level: 'Manual overnight steep',
        automation_preference: 'hands-off steep',
        counter_space: 'compact',
        footprint: 'Compact carafe',
        capacity: 'Cold brew carafe',
        availability: 'Join the list',
        availability_status: 'waitlist',
        feature_highlights: [
            'Overnight steeping for smooth flavor',
            'Low-acid cold brew',
            'Ready from the fridge anytime',
        ],
        key_features: [
            'Overnight cold-brew steep',
            'Smooth, low-acid profile',
            'Lowest price in the range',
        ],
        product_url: 'https://main--frescopa26--markszulc.aem.live/of1/knowledge/machines',
    },
];

const EMPTY_CONFIRMATION = {
    confirmation_id: null,
    status: null,
    message: null,
    cafe_name: null,
    date: null,
    time: null,
    guest_count: null,
    confirmation_email: null,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildConfirmationId(cafe_name) {
    const prefix = String(cafe_name).replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'ATL';
    const suffix = Math.floor(100000 + Math.random() * 900000);
    return `FRESCO-${prefix}-${suffix}`;
}

module.exports = async ({
    cafe_name = '',
    date = '',
    time = '',
    guest_count,
    name = '',
    email = '',
    phone = '',
    interests = [],
} = {}) => {
    // Validate required parameters.
    const missing = [];
    if (!cafe_name || typeof cafe_name !== 'string' || !cafe_name.trim()) missing.push('cafe_name');
    if (!date || typeof date !== 'string' || !date.trim()) missing.push('date');
    if (!time || typeof time !== 'string' || !time.trim()) missing.push('time');
    if (guest_count === undefined || guest_count === null || Number(guest_count) < 1) missing.push('guest_count');
    if (!name || typeof name !== 'string' || !name.trim()) missing.push('name');
    if (!email || typeof email !== 'string' || !email.trim()) missing.push('email');

    if (missing.length > 0) {
        return {
            content: [{ type: 'text', text: `Please provide ${missing.join(', ')} to request an Atelier tour.` }],
            structuredContent: { ...EMPTY_CONFIRMATION },
        };
    }

    if (!EMAIL_RE.test(email.trim())) {
        return {
            content: [{ type: 'text', text: 'Please provide a valid email address for the tour confirmation.' }],
            structuredContent: { ...EMPTY_CONFIRMATION },
        };
    }

    const guests = Number(guest_count);
    const featured = MOCK_DATA.find((m) => m.name === 'The Atelier') || MOCK_DATA[0];
    const validInterests = Array.isArray(interests) ? interests.filter((i) => typeof i === 'string' && i.trim()) : [];

    // TODO: Replace this local confirmation with a real booking API call.
    const confirmation_id = buildConfirmationId(cafe_name.trim());
    const interestNote = validInterests.length
        ? ` We noted your interest in ${validInterests.join(', ')}.`
        : '';
    const phoneNote = phone && String(phone).trim() ? ' A team member may call the number you provided.' : '';
    const message = `Thanks, ${name.trim()} — your request for a private ${featured.name} tour at ${cafe_name.trim()} on ${date.trim()} at ${time.trim()} for ${guests} guest(s) has been received. This tour is free and no payment is required; a final confirmation will be sent to ${email.trim()} by email.${interestNote}${phoneNote}`;

    return {
        content: [{ type: 'text', text: `Tour request received — confirmation ${confirmation_id}, pending email confirmation to ${email.trim()}.` }],
        structuredContent: {
            confirmation_id,
            status: 'Pending email confirmation',
            message,
            cafe_name: cafe_name.trim(),
            date: date.trim(),
            time: time.trim(),
            guest_count: guests,
            confirmation_email: email.trim(),
        },
    };
};

/*
 * TODO: Replace the local confirmation logic with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   POST ${process.env.API_BASE_URL}/atelier-tours
 *   body: { cafe_name, date, time, guest_count, name, email, phone, interests }
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(`${process.env.API_BASE_URL}/atelier-tours`, {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${process.env.API_KEY}`,
 *     },
 *     body: JSON.stringify({ cafe_name, date, time, guest_count, name, email, phone, interests }),
 *   })
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
