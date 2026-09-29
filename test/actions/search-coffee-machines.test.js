const handler = require('../../actions/search-coffee-machines/index.js');

describe('search_coffee_machines handler', () => {
  test('content is an array of text blocks', async () => {
    const out = await handler({});
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"find a low-effort espresso machine for a small counter" returns machines', async () => {
    const out = await handler({ brewing_style: 'espresso', counter_space: 'compact' });
    expect(out.content[0].text.length).toBeGreaterThan(0);
    expect(out.structuredContent.machines.length).toBeGreaterThan(0);
    expect(out.structuredContent.machines.every((m) => m.brewing_style === 'espresso')).toBe(true);
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler({});
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
    expect(Array.isArray(out.structuredContent.machines)).toBe(true);
  });

  test('no args returns the full catalog', async () => {
    const out = await handler({});
    expect(out.structuredContent.machines.length).toBe(8);
  });

  test('max_budget filters out machines above the budget', async () => {
    const out = await handler({ max_budget: 300 });
    const { machines } = out.structuredContent;
    expect(machines.length).toBeGreaterThan(0);
    expect(machines.every((m) => m.price <= 300)).toBe(true);
  });

  test('availability filter returns only available-now machines', async () => {
    const out = await handler({ availability: 'Available now' });
    const { machines } = out.structuredContent;
    expect(machines.every((m) => m.availability === 'Available now')).toBe(true);
  });

  test('no matches returns empty machines array with a helpful message', async () => {
    const out = await handler({ brewing_style: 'cold brew', max_budget: 10 });
    expect(out.structuredContent.machines).toEqual([]);
    expect(out.content[0].text).toMatch(/no.*match|try/i);
  });
});
