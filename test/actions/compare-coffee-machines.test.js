const handler = require('../../actions/compare-coffee-machines/index.js');

describe('compare_coffee_machines handler', () => {
  test('content is an array of text blocks', async () => {
    const out = await handler({ first_machine_id: 'the-atelier', second_machine_id: 'the-barista' });
    expect(out).toHaveProperty('content');
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"Compare the Atelier and the Barista" returns exactly two machines', async () => {
    const out = await handler({ first_machine_id: 'the-atelier', second_machine_id: 'the-barista' });
    expect(out.content[0].text.length).toBeGreaterThan(0);
    expect(out.structuredContent.machines).toHaveLength(2);
    expect(out.structuredContent.machines[0].name).toBe('The Atelier');
    expect(out.structuredContent.machines[1].name).toBe('The Barista');
  });

  test('resolves machines by display name as well as id', async () => {
    const out = await handler({ first_machine_id: 'The Atelier', second_machine_id: 'The Barista' });
    expect(out.structuredContent.machines).toHaveLength(2);
  });

  test('structuredContent is a plain object with a machines array, not a bare array', async () => {
    const out = await handler({ first_machine_id: 'the-atelier', second_machine_id: 'the-barista' });
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
    expect(Array.isArray(out.structuredContent.machines)).toBe(true);
  });

  test('returns error message when a required arg is missing', async () => {
    const out = await handler({ first_machine_id: 'the-atelier' });
    expect(out.content[0].text).toMatch(/provide|second_machine_id|two machines/i);
    expect(out.structuredContent.machines).toEqual([]);
  });

  test('unknown machine id yields a not-found message and empty machines array', async () => {
    const out = await handler({ first_machine_id: 'the-atelier', second_machine_id: 'no-such-machine' });
    expect(out.content[0].text).toMatch(/could not find|no-such-machine|check/i);
    expect(out.structuredContent.machines).toEqual([]);
  });

  test('flags unpublished specifications for a waitlist model', async () => {
    const out = await handler({ first_machine_id: 'the-atelier', second_machine_id: 'the-barista' });
    const barista = out.structuredContent.machines.find((m) => m.product_id === 'the-barista');
    expect(barista.limitations.length).toBeGreaterThan(0);
    expect(barista.capacity).toBe('N/A');
  });

  test('optional priority is reflected in the summary text', async () => {
    const out = await handler({ first_machine_id: 'the-atelier', second_machine_id: 'the-barista', priority: 'ease of use' });
    expect(out.content[0].text).toMatch(/ease of use/i);
  });
});
