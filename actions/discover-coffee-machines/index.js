// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
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
        availability: 'Available',
        availability_status: 'available',
        feature_highlights: [
            'Learns your taste over ~7 days across up to 6 household profiles',
            'Automatically reorders beans before you run low',
            'Whisper-quiet grinding at 58 dB',
            'Calendar-aware smart warmup and self-rinsing',
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
        availability: 'Join the list',
        availability_status: 'waitlist',
        feature_highlights: [
            'Same intelligent taste-learning as the flagship',
            'Compact design for smaller kitchens',
            'Automatic motorized milk wand',
            'Wi-Fi and calendar integration',
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
        availability: 'Available',
        availability_status: 'available',
        feature_highlights: [
            'Full manual control — dial in every shot',
            'Manual steam wand',
            'Built for espresso-based drinks',
            'Made for the hands-on ritualist',
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
        availability: 'Available',
        availability_status: 'available',
        feature_highlights: [
            'Simplified one-button operation',
            'Reliable, consistent results',
            'Honest espresso every morning',
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
        availability: 'Available',
        availability_status: 'available',
        feature_highlights: [
            'Even saturation for consistent extraction',
            'Gentle, controlled timing',
            'Reliable filter coffee',
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
        availability: 'Join the list',
        availability_status: 'waitlist',
        feature_highlights: [
            'Overnight steeping for smooth flavor',
            'Low-acid cold brew',
            'Ready from the fridge anytime',
        ],
        product_url: 'https://main--frescopa26--markszulc.aem.live/of1/knowledge/machines',
    },
];

module.exports = async ({
    brewing_style = '',
    max_price = 0,
    automation_preference = '',
    counter_space = '',
    availability_status = '',
} = {}) => {
    const norm = (v) => (typeof v === 'string' ? v.trim().toLowerCase() : '');
    const styleQ = norm(brewing_style);
    const autoQ = norm(automation_preference);
    const spaceQ = norm(counter_space);
    const availQ = norm(availability_status);
    const priceCap = typeof max_price === 'number' && max_price > 0 ? max_price : 0;

    const machines = MOCK_DATA.filter((m) => {
        if (styleQ && !(`${norm(m.brewing_style)} ${norm(m.category)}`).includes(styleQ)) return false;
        if (priceCap && typeof m.price === 'number' && m.price > priceCap) return false;
        if (autoQ && !(`${norm(m.automation_preference)} ${norm(m.automation_level)}`).includes(autoQ)) return false;
        if (spaceQ && norm(m.counter_space) !== spaceQ) return false;
        if (availQ && norm(m.availability_status) !== availQ) return false;
        return true;
    });

    if (machines.length === 0) {
        return {
            content: [{ type: 'text', text: 'No Fréscopa machines matched those preferences. Try relaxing the budget, brewing style, or counter-space filters.' }],
            // structuredContent.machines — bare array outputSchema; key derived from actionName "discover_coffee_machines"
            structuredContent: { machines: [] },
        };
    }

    const summary = `Found ${machines.length} Fréscopa machine${machines.length === 1 ? '' : 's'} to consider — compare each model's routine, price, and level of hands-on involvement to see which best fits your counter space and budget before deciding.`;

    return {
        content: [{ type: 'text', text: summary }],
        // structuredContent.machines — bare array outputSchema; key derived from actionName "discover_coffee_machines"
        structuredContent: { machines },
    };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/machines?brewing_style=${brewing_style}&max_price=${max_price}
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
 *     `${process.env.API_BASE_URL}/machines?brewing_style=${encodeURIComponent(brewing_style)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
