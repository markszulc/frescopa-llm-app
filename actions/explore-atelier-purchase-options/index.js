// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
const MOCK_DATA = [
    {
        product_id: 'the-atelier',
        name: 'The Atelier',
        category: 'Bean-to-cup',
        brewing_style: 'bean-to-cup',
        description: 'AI-enabled bean-to-cup machine that learns your taste cup by cup, reads the day ahead, and reorders beans before you run out.',
        price: 2199,
        availability: 'Available now',
        automation_preference: 'fully automatic',
        automation_level: 'Fully automatic',
        counter_space: 'standard',
        bundle_interest: 'machine only',
        rating: 4.8,
        review_count: 214,
        finishes: ['Cream', 'Charcoal', 'Terracotta'],
        key_features: [
            'Learns your taste over ~7 days, no dialing-in',
            "Up to 6 household taste profiles ('flavour DNA')",
            'Contextual intelligence reads calendar, weather and time of day',
            'Automatic warm-up before your alarm and self-reordering beans',
            'Whisper-quiet grinding at 58 dB',
        ],
        brewing_methods: ['Espresso', 'Filter', 'Long black', 'Cappuccino', 'Latte', 'Tea'],
        ideal_for: 'Hands-off households wanting barista-quality coffee tailored to each person',
        capacity: '1.8 L water tank, 250 g bean hopper',
        dimensions: '32 × 24 × 41 cm, 9.8 kg',
        image_url: 'https://www.frescopa.coffee/media_1a775c161149ea61e50ce787b6c0adb646148c6ca.jpg?width=2000&format=webply&optimize=medium',
        detail_url: 'https://www.frescopa.coffee/machines/atelier',
    },
    {
        product_id: 'the-atelier-mini',
        name: 'The Atelier Mini',
        category: 'Bean-to-cup',
        brewing_style: 'bean-to-cup',
        description: 'The same intelligent, self-learning heart as the Atelier, sized for smaller kitchens.',
        price: 799,
        availability: 'Waitlist',
        automation_preference: 'fully automatic',
        automation_level: 'Fully automatic',
        counter_space: 'compact',
        bundle_interest: 'machine only',
        key_features: [
            'Same clever taste-learning brain in a compact body',
            'Fits smaller counters',
        ],
        brewing_methods: ['Espresso', 'Filter', 'Milk drinks'],
        ideal_for: 'Small kitchens that still want a fully automatic bean-to-cup machine',
        image_url: 'https://www.frescopa.coffee/media_1017eb8d437ebe44b4a61e0865dcaef05ff3d934a.png?width=2000&format=webply&optimize=medium',
        detail_url: 'https://www.frescopa.coffee/machines',
    },
    {
        product_id: 'the-barista',
        name: 'The Barista',
        category: 'Espresso',
        brewing_style: 'espresso',
        description: 'A hands-on espresso machine for the morning ritualist, with full manual control.',
        price: 899,
        availability: 'Waitlist',
        automation_preference: 'hands-on',
        automation_level: 'Manual',
        counter_space: 'standard',
        bundle_interest: 'machine only',
        key_features: [
            'Full manual control over grind, dose and pull',
            'Tactile, built to reward practice',
        ],
        brewing_methods: ['Espresso'],
        ideal_for: 'People who want to be the barista and enjoy the hands-on ritual',
        image_url: 'https://www.frescopa.coffee/media_1db811b17fbc255479a69bb6ae75e55e55fbd2ea3.png?width=2000&format=webply&optimize=medium',
        detail_url: 'https://www.frescopa.coffee/machines',
    },
    {
        product_id: 'the-everyday',
        name: 'The Everyday',
        category: 'Espresso',
        brewing_style: 'espresso',
        description: 'Honest espresso every morning with simplified, no-fuss operation.',
        price: 499,
        availability: 'Waitlist',
        automation_preference: 'guided',
        automation_level: 'Semi-automatic',
        counter_space: 'compact',
        bundle_interest: 'machine only',
        key_features: ['Simplified operation for a reliable shot each morning'],
        brewing_methods: ['Espresso'],
        ideal_for: 'Anyone who wants a dependable espresso without the learning curve',
        image_url: 'https://www.frescopa.coffee/media_1dd4513b3aaf352944950aa2185c9927305b2f93d.png?width=2000&format=webply&optimize=medium',
        detail_url: 'https://www.frescopa.coffee/machines',
    },
    {
        product_id: 'the-slow-pour',
        name: 'The Slow Pour',
        category: 'Filter',
        brewing_style: 'filter',
        description: 'Even saturation and gentle timing for consistent, balanced filter coffee.',
        price: 279,
        availability: 'Waitlist',
        automation_preference: 'guided',
        automation_level: 'Automatic drip',
        counter_space: 'compact',
        bundle_interest: 'machine only',
        key_features: ['Even saturation and gentle timing', 'Repeatable, balanced batches'],
        brewing_methods: ['Filter'],
        ideal_for: 'The unhurried cup, sipped through a quiet morning',
        image_url: 'https://www.frescopa.coffee/media_1d34c4d078381820a4960089ca6fa50b65f695921.png?width=2000&format=webply&optimize=medium',
        detail_url: 'https://www.frescopa.coffee/machines',
    },
    {
        product_id: 'the-carafe',
        name: 'The Carafe',
        category: 'Cold brew',
        brewing_style: 'cold brew',
        description: 'Overnight steeping for smooth, low-acid cold brew, ready and waiting by morning.',
        price: 179,
        availability: 'Waitlist',
        automation_preference: 'hands-off',
        automation_level: 'Set-and-steep',
        counter_space: 'compact',
        bundle_interest: 'machine only',
        key_features: ['Overnight steeping while you sleep', 'Smooth, low-acid cold brew'],
        brewing_methods: ['Cold brew'],
        ideal_for: 'Cold-brew drinkers who want it poured cold straight from the fridge',
        image_url: 'https://www.frescopa.coffee/media_1b37b66e87d844199ff136582ca6c1f13bce38563.png?width=2000&format=webply&optimize=medium',
        detail_url: 'https://www.frescopa.coffee/machines',
    },
    {
        product_id: 'atelier-year-of-beans',
        name: 'The Atelier + a year of beans',
        category: 'Atelier Bundle',
        brewing_style: 'bean-to-cup',
        description: 'The Atelier machine plus house beans delivered as you need them for a year — it reorders, so you never run dry.',
        price: 2799,
        original_price: 2899,
        savings: 100,
        availability: 'Available now',
        automation_preference: 'fully automatic',
        counter_space: 'standard',
        bundle_interest: 'beans',
        included_items: [
            'The Atelier machine',
            'A year of house beans, delivered as needed',
            'Automatic bean reordering',
        ],
        image_url: 'https://www.frescopa.coffee/machines/media_132718180b6190179a138b13595a42c32f51665ed.jpg?width=1200&format=jpg&optimize=medium',
        detail_url: 'https://www.frescopa.coffee/machines/atelier',
    },
    {
        product_id: 'atelier-barista-kit',
        name: 'The Atelier + Barista Kit',
        category: 'Atelier Bundle',
        brewing_style: 'bean-to-cup',
        description: 'The Atelier machine plus a milk jug, tamper and two ceramic cups — for the mornings you want to do it by hand.',
        price: 2399,
        original_price: 2509,
        savings: 110,
        availability: 'Available now',
        automation_preference: 'fully automatic',
        counter_space: 'standard',
        bundle_interest: 'barista accessories',
        included_items: ['The Atelier machine', 'Milk jug', 'Tamper', 'Two ceramic cups'],
        image_url: 'https://www.frescopa.coffee/machines/media_14dda38183367f1ef5f700eaf66d1a13a59bdd756.jpg?width=1200&format=jpg&optimize=medium',
        detail_url: 'https://www.frescopa.coffee/machines/atelier',
    },
];

const BUNDLE_ALIASES = {
    'machine only': ['machine only', 'machine', 'standalone'],
    beans: ['beans', 'bean'],
    'barista accessories': ['barista accessories', 'barista', 'accessories', 'accessory'],
};

function matchesInterest(item, interest) {
    if (interest === 'all options' || interest === 'all') return true;
    const itemInterest = (item.bundle_interest || '').toLowerCase();
    const aliases = BUNDLE_ALIASES[interest] || [interest];
    return aliases.some((a) => itemInterest.indexOf(a) !== -1);
}

module.exports = async ({ max_budget = null, bundle_interest = '' } = {}) => {
    const interest = typeof bundle_interest === 'string' ? bundle_interest.trim().toLowerCase() : '';
    const budget = typeof max_budget === 'number' && max_budget > 0 ? max_budget : null;

    const options = MOCK_DATA.filter((item) => {
        if (budget !== null && typeof item.price === 'number' && item.price > budget) return false;
        if (interest && !matchesInterest(item, interest)) return false;
        return true;
    });

    if (options.length === 0) {
        return {
            content: [{ type: 'text', text: 'No Atelier purchase options match those preferences right now.' }],
            // structuredContent.options — bare array outputSchema; key derived from actionName "explore_atelier_purchase_options"
            structuredContent: { options: [] },
        };
    }

    const bundles = options.filter((o) => typeof o.savings === 'number' && o.savings > 0);
    let summary = `Showing ${options.length} Atelier purchase option${options.length === 1 ? '' : 's'}.`;
    if (bundles.length > 0) {
        const best = bundles.reduce((a, b) => (b.savings > a.savings ? b : a));
        summary += ` ${best.name} advertises the largest displayed saving at $${best.savings.toLocaleString('en-US')}. Displayed pricing and savings only — no unpublished financing or subscription terms.`;
    }

    return {
        content: [{ type: 'text', text: summary }],
        // structuredContent.options — bare array outputSchema; key derived from actionName "explore_atelier_purchase_options"
        structuredContent: { options },
    };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/purchase-options?max_budget=${max_budget}&bundle_interest=${bundle_interest}
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
 *     `${process.env.API_BASE_URL}/purchase-options?max_budget=${encodeURIComponent(max_budget)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
