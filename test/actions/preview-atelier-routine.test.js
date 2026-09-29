const handler = require('../../actions/preview-atelier-routine/index.js');

describe('preview_atelier_routine handler', () => {
  const validArgs = {
    taste_preferences: 'My partner loves silky lattes and I want quick black coffee',
    routine_context: 'Weekday, black coffee before a 7am commute',
    household_profiles: ['You', 'Your partner'],
    automation_goals: ['automatic warm-up', 'automatic milk preparation', 'bean reordering'],
  };

  test('returns content block shape on happy path', async () => {
    const out = await handler(validArgs);
    expect(out).toHaveProperty('content');
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"Show me how the Atelier fits our mornings" builds a routine preview', async () => {
    const out = await handler(validArgs);
    expect(out.content[0].text.length).toBeGreaterThan(0);
    expect(out.structuredContent).toBeDefined();
    expect(out.structuredContent.suggested_cups.length).toBeGreaterThan(0);
    expect(typeof out.structuredContent.profile_summary).toBe('string');
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler(validArgs);
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
  });

  test('every return path exposes the same top-level keys', async () => {
    const happy = await handler(validArgs);
    const missing = await handler({});
    const keys = ['profile_summary', 'suggested_cups', 'matched_capabilities', 'fit_notes', 'assumptions', 'recommended_next_step'];
    keys.forEach((k) => {
      expect(happy.structuredContent).toHaveProperty(k);
      expect(missing.structuredContent).toHaveProperty(k);
    });
  });

  test('returns error message when required args are missing', async () => {
    const out = await handler({});
    expect(out.content[0].text).toMatch(/taste_preferences|routine_context|provide/i);
    expect(out.structuredContent.suggested_cups).toEqual([]);
  });

  test('maps a silky-latte preference to automatic milk preparation', async () => {
    const out = await handler(validArgs);
    const caps = out.structuredContent.matched_capabilities;
    expect(caps.some((c) => /milk/i.test(c))).toBe(true);
    const latte = out.structuredContent.suggested_cups.find((c) => /latte/i.test(c.drink));
    expect(latte).toBeDefined();
  });

  test('multiple household profiles surface the taste-profiles capability', async () => {
    const out = await handler(validArgs);
    expect(out.structuredContent.matched_capabilities.some((c) => /profile/i.test(c))).toBe(true);
  });

  test('single drinker with no profiles still returns a cup and an assumption', async () => {
    const out = await handler({
      taste_preferences: 'Strong black coffee',
      routine_context: 'Quick cup before an early commute',
    });
    expect(out.structuredContent.suggested_cups.length).toBeGreaterThan(0);
    expect(out.structuredContent.assumptions.length).toBeGreaterThan(0);
  });
});
