// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
// MOCK_DATA is the published Fréscopa machine catalog (samplePayload, verbatim).
// This handler produces an ILLUSTRATIVE preview only — it maps details the user
// supplied in the conversation onto the Atelier's published capabilities. It does
// not access a calendar, machine, account, or live household data.
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
    key_features: ['Same clever taste-learning brain in a compact body', 'Fits smaller counters'],
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
    key_features: ['Full manual control over grind, dose and pull', 'Tactile, built to reward practice'],
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
    included_items: ['The Atelier machine', 'A year of house beans, delivered as needed', 'Automatic bean reordering'],
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

const EMPTY_RESULT = {
  profile_summary: null,
  suggested_cups: [],
  matched_capabilities: [],
  fit_notes: [],
  assumptions: [],
  recommended_next_step: null,
};

function mentions(text, terms) {
  const lower = text.toLowerCase();
  return terms.some((t) => lower.includes(t));
}

module.exports = async ({
  taste_preferences = '',
  routine_context = '',
  household_profiles = [],
  automation_goals = [],
} = {}) => {
  const taste = typeof taste_preferences === 'string' ? taste_preferences.trim() : '';
  const routine = typeof routine_context === 'string' ? routine_context.trim() : '';

  if (!taste || !routine) {
    return {
      content: [{ type: 'text', text: 'Please describe both your taste_preferences and your routine_context so I can build an illustrative routine preview.' }],
      structuredContent: { ...EMPTY_RESULT },
    };
  }

  const profiles = Array.isArray(household_profiles)
    ? household_profiles.filter((p) => typeof p === 'string' && p.trim()).map((p) => p.trim())
    : [];
  const goals = Array.isArray(automation_goals)
    ? automation_goals.filter((g) => typeof g === 'string' && g.trim()).map((g) => g.trim())
    : [];

  const atelier = MOCK_DATA.find((m) => m.product_id === 'the-atelier') || MOCK_DATA[0];

  const wantsMilk = mentions(taste, ['latte', 'cappuccino', 'flat white', 'milk', 'silky', 'microfoam', 'foam']);
  const wantsBlack = mentions(taste, ['black', 'long black', 'americano', 'espresso', 'filter']);
  const earlyRoutine = mentions(routine, ['7am', '7 am', 'early', 'commute', 'morning', 'alarm', 'before work']);

  const profileLabels = profiles.length ? profiles : ['You'];

  const summaryParts = [];
  summaryParts.push(profileLabels.length > 1 ? `A ${profileLabels.length}-person household` : 'A one-person routine');
  summaryParts.push(`with a ${routine.replace(/\.$/, '')} rhythm`);
  summaryParts.push(`and a taste for ${taste.replace(/\.$/, '')}.`);
  const profile_summary = summaryParts.join(' ');

  const suggested_cups = [];
  profileLabels.forEach((person, i) => {
    const prefersMilkPerson = i > 0 ? wantsMilk : wantsBlack || !wantsMilk;
    if (prefersMilkPerson && wantsMilk) {
      suggested_cups.push({
        time_or_moment: earlyRoutine ? 'Early weekday' : 'Morning',
        person,
        drink: 'Latte',
        taste_adjustment: 'Silky microfoam, medium strength',
        reason: 'Automatic milk preparation delivers a silky latte without hand-steaming, matching the stated milk preference.',
      });
    } else {
      suggested_cups.push({
        time_or_moment: earlyRoutine ? 'Before the commute' : 'Morning',
        person,
        drink: wantsBlack ? 'Long black' : 'Espresso',
        taste_adjustment: 'Full strength, extra hot, no milk',
        reason: 'A fast, hands-off cup ready the moment you reach the kitchen — suited to an early start.',
      });
    }
  });
  if (wantsMilk && wantsBlack && suggested_cups.length < 3) {
    suggested_cups.push({
      time_or_moment: 'Weekend · Late morning',
      person: profileLabels.length > 1 ? 'Both' : profileLabels[0],
      drink: 'Cappuccino & long black',
      taste_adjustment: 'Relaxed timing, no warm-up schedule',
      reason: 'On unhurried mornings the machine brews on demand rather than following the pre-alarm warm-up.',
    });
  }

  const matched_capabilities = [];
  if (profileLabels.length > 1) matched_capabilities.push("Up to 6 household taste profiles ('flavour DNA')");
  if (wantsMilk) matched_capabilities.push('Automatic milk preparation for silky milk drinks');
  if (earlyRoutine || goals.some((g) => mentions(g, ['warm', 'warm-up', 'alarm']))) matched_capabilities.push('Automatic warm-up before your alarm');
  matched_capabilities.push('Contextual intelligence reads time of day');
  if (goals.some((g) => mentions(g, ['reorder', 'bean', 'restock'])) || goals.length === 0) matched_capabilities.push('Self-reordering beans before you run out');

  const fit_notes = [
    `Needs ${atelier.counter_space} counter space (${atelier.dimensions ? atelier.dimensions.split(',')[0] : 'standard footprint'}).`,
    "Whisper-quiet 58 dB grinding won't wake a sleeping household.",
    'Learns each person\'s taste over about 7 days, no dialing-in.',
  ];

  const assumptions = [];
  if (earlyRoutine) assumptions.push('Assumed an early weekday departure driving the first cup of the day.');
  if (wantsMilk) assumptions.push("Assumed 'silky' means latte-style microfoam at a warm serving temperature.");
  if (wantsBlack) assumptions.push("Assumed 'quick black coffee' means a long black rather than a straight espresso.");
  if (!profiles.length) assumptions.push('Assumed a single drinker because no household profiles were provided.');
  if (!assumptions.length) assumptions.push('Filled in serving style and timing where details were not specified — refine these to sharpen the preview.');

  const recommended_next_step = 'View the Atelier details to confirm the milk system and per-person profiles fit your kitchen.';

  // Narrative for the assistant to read aloud: which capabilities matter most for
  // this household and which assumptions the user may want to refine. The widget
  // renders the structured data; this stays a concise summary.
  const capsLead = matched_capabilities.slice(0, 2).join(' and ');
  const summaryText = `Here's an illustrative routine preview for ${profileLabels.length > 1 ? 'your household' : 'you'} — ${suggested_cups.length} cup(s) mapped to your mornings. The Atelier capabilities that matter most here are ${capsLead}. It's built only from what you shared, so review the ${assumptions.length} assumption(s) and refine anything that's off.`;

  return {
    content: [{ type: 'text', text: summaryText }],
    structuredContent: {
      profile_summary,
      suggested_cups,
      matched_capabilities,
      fit_notes,
      assumptions,
      recommended_next_step,
    },
  };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * This tool is illustrative by design — it maps conversation-supplied details onto
 * the Atelier's PUBLISHED capabilities. If a real capability/catalog API becomes
 * available, fetch the published machine spec (not live household data) instead of
 * the embedded MOCK_DATA:
 *   GET ${process.env.API_BASE_URL}/machines/atelier
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/machines/atelier`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   const spec = await res.json()
 *
 * The preview must remain illustrative: never fetch or infer real calendar,
 * machine, account, or household data.
 */
