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
        footprint: '32 × 24 × 41 cm',
        capacity: '1.8 L water tank, 250 g bean hopper',
        availability: 'Available',
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
        footprint: 'Compact (space-efficient)',
        capacity: 'Compact bean-to-cup format',
        availability: 'Join the list',
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
        footprint: 'Standard espresso machine',
        capacity: 'Espresso-based drinks',
        availability: 'Available',
        key_features: [
            'Pure hands-on craft, no automation',
            'Manual steam wand',
            'Single shared setup',
        ],
        tradeoffs: [
            'No automation — every shot is fully manual',
            'Espresso-only; no filter or cold-brew drinks',
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
        footprint: 'Compact countertop espresso',
        capacity: 'Espresso-based drinks',
        availability: 'Available',
        key_features: [
            'One-button simplicity',
            'Consistent daily espresso',
            'Approachable price',
        ],
        tradeoffs: [
            'Less control than a manual espresso machine',
            'Espresso-only; no milk-drink automation',
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
        footprint: 'Compact filter brewer',
        capacity: 'Filter coffee',
        availability: 'Available',
        key_features: [
            'Consistent saturation',
            'Gentle brew timing',
            'Filter-focused',
        ],
        tradeoffs: [
            'Filter coffee only — no espresso or milk drinks',
            'No on-demand single-cup automation',
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
        footprint: 'Compact carafe',
        capacity: 'Cold brew carafe',
        availability: 'Join the list',
        key_features: [
            'Overnight cold-brew steep',
            'Smooth, low-acid profile',
            'Lowest price in the range',
        ],
        tradeoffs: [
            'Requires overnight planning — not for on-demand cups',
            'Cold brew only; no hot coffee',
        ],
        product_url: 'https://main--frescopa26--markszulc.aem.live/of1/knowledge/machines',
    },
];

function findMachine(query) {
    const q = query.trim().toLowerCase();
    return MOCK_DATA.find((m) => m.name.toLowerCase() === q)
        || MOCK_DATA.find((m) => m.name.toLowerCase().includes(q));
}

module.exports = async ({ machine_names = [], priorities = [] }) => {
    if (!Array.isArray(machine_names) || machine_names.length !== 2
        || !machine_names.every((n) => typeof n === 'string' && n.trim())) {
        return {
            content: [{ type: 'text', text: 'Please provide exactly two Fréscopa machine names to compare.' }],
            // structuredContent.machines — derived from action name "compare_coffee_machines" (bare array outputSchema rule)
            structuredContent: { machines: [] },
        };
    }

    const matched = machine_names.map(findMachine);
    const missing = machine_names.filter((n, i) => !matched[i]);
    if (missing.length > 0) {
        return {
            content: [{ type: 'text', text: `Couldn't find these Fréscopa machine(s): ${missing.join(', ')}.` }],
            // structuredContent.machines — derived from action name "compare_coffee_machines" (bare array outputSchema rule)
            structuredContent: { machines: [] },
        };
    }

    const [a, b] = matched;
    const prioNote = Array.isArray(priorities) && priorities.length
        ? ` Weighing your priorities (${priorities.join(', ')}).`
        : '';
    const narrative = `The ${a.name} suits ${a.automation_level.toLowerCase()} routines where convenience leads, while the ${b.name} suits ${b.automation_level.toLowerCase()} routines built around the ritual of making coffee by hand — the main compromise is trading hands-off ease for hands-on control.`;

    return {
        content: [{ type: 'text', text: `Comparing the ${a.name} and the ${b.name} side by side.${prioNote} ${narrative}` }],
        // structuredContent.machines — derived from action name "compare_coffee_machines" (bare array outputSchema rule)
        structuredContent: { machines: [a, b] },
    };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/machines?names=${encodeURIComponent(machine_names.join(','))}
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/machines?names=${encodeURIComponent(machine_names.join(','))}`,
 *     { headers: { Authorization: `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
