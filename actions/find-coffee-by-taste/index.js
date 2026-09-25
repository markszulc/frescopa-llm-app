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
        product_url: 'https://main--frescopa26--markszulc.aem.live/of1/knowledge/machines',
    },
    {
        name: 'The Barista',
        description: 'A hands-on espresso machine for the morning ritualist, with full manual control over every shot.',
        category: 'Espresso',
        brewing_style: 'hands-on espresso',
        price: 899,
        price_label: '$899',
        product_url: 'https://main--frescopa26--markszulc.aem.live/of1/knowledge/machines',
    },
    {
        name: 'The Everyday',
        description: 'Honest espresso every single morning with simplified, one-button operation.',
        category: 'Espresso',
        brewing_style: 'espresso',
        price: 499,
        price_label: '$499',
        product_url: 'https://main--frescopa26--markszulc.aem.live/of1/knowledge/machines',
    },
    {
        name: 'The Slow Pour',
        description: 'Even saturation and gentle timing for consistent filter coffee.',
        category: 'Filter',
        brewing_style: 'filter',
        price: 279,
        price_label: '$279',
        product_url: 'https://main--frescopa26--markszulc.aem.live/of1/knowledge/machines',
    },
    {
        name: 'The Carafe',
        description: 'Overnight steeping produces smooth, low-acid cold brew, ready from the fridge whenever you need it.',
        category: 'Cold brew',
        brewing_style: 'cold brew',
        price: 179,
        price_label: '$179',
        product_url: 'https://main--frescopa26--markszulc.aem.live/of1/knowledge/machines',
    },
];

module.exports = async ({
    flavor_preferences = [],
    brewing_method = '',
    caffeine_preference = '',
    format_preference = '',
    coffee_category = '',
}) => {
    const prefs = Array.isArray(flavor_preferences)
        ? flavor_preferences.filter((p) => typeof p === 'string' && p.trim())
        : [];

    if (prefs.length === 0) {
        return {
            content: [{ type: 'text', text: 'Please provide at least one flavor_preference (e.g. chocolatey, low-acid, bold) so I can match Fréscopa coffees to your taste.' }],
            // structuredContent.coffees — bare array outputSchema; key derived from actionName "find_coffee_by_taste"
            structuredContent: { coffees: [] },
        };
    }

    const method = String(brewing_method || '').trim().toLowerCase();
    const category = String(coffee_category || '').trim().toLowerCase();
    const caffeine = String(caffeine_preference || '').trim().toLowerCase();
    const format = String(format_preference || '').trim().toLowerCase();

    const matched = MOCK_DATA.map((item) => {
        const haystack = `${item.name} ${item.description} ${item.category} ${item.brewing_style || ''}`.toLowerCase();
        const match_reasons = [];

        prefs.forEach((pref) => {
            if (haystack.includes(pref.trim().toLowerCase())) {
                match_reasons.push(`Matches "${pref}"`);
            }
        });
        if (method && haystack.includes(method)) {
            match_reasons.push(`Suited to ${brewing_method}`);
        }
        if (category && item.category && item.category.toLowerCase().includes(category)) {
            match_reasons.push(`In the ${coffee_category} range`);
        }

        return { ...item, match_reasons };
    });

    let results = matched.filter((item) => item.match_reasons.length > 0);

    // Apply an explicit category filter as a hard constraint when supplied.
    if (category) {
        const byCategory = results.filter((item) => item.category && item.category.toLowerCase().includes(category));
        if (byCategory.length > 0) results = byCategory;
    }

    // No strong match — fall back to the full range so the customer still sees options.
    if (results.length === 0) {
        results = matched;
    }

    const noteParts = [];
    if (caffeine) noteParts.push(caffeine);
    if (format) noteParts.push(format);

    const lead = `Found ${results.length} Fréscopa coffee ${results.length === 1 ? 'option' : 'options'} for your ${prefs.join(', ')} preference${method ? ` and ${brewing_method} brewing` : ''}. `
        + 'These are transparent matches based on published tasting context, not a prediction of personal taste — '
        + 'if you remain uncertain, book a tasting at a Fréscopa café to try before you commit.';

    return {
        content: [{ type: 'text', text: lead }],
        // structuredContent.coffees — bare array outputSchema; key derived from actionName "find_coffee_by_taste"
        structuredContent: { coffees: results },
    };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/coffees?flavor=${flavor_preferences.join(',')}&brew=${brewing_method}
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/coffees?flavor=${encodeURIComponent(flavor_preferences.join(','))}`,
 *     { headers: { Authorization: `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
