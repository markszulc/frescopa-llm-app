const handler = require('../../actions/get-machine-details/index.js');

describe('get_machine_details handler', () => {
  test('content is an array of text blocks', async () => {
    const out = await handler({ machine_id: 'the-atelier' });
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"The Atelier keeps coming up in my Fréscopa search" returns the machine details', async () => {
    const out = await handler({ machine_id: 'the-atelier' });
    expect(out.content[0].text.length).toBeGreaterThan(0);
    expect(out.content[0].text).toMatch(/Atelier/);
    expect(out.structuredContent.name).toBe('The Atelier');
    expect(out.structuredContent.price).toBe(2199);
  });

  test('lookup by display name also resolves', async () => {
    const out = await handler({ machine_id: 'The Barista' });
    expect(out.structuredContent.product_id).toBe('the-barista');
  });

  test('structuredContent is a flat plain object, not a bare array', async () => {
    const out = await handler({ machine_id: 'the-atelier' });
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
    // detail shape: fields flat, no wrapper key
    expect(out.structuredContent).toHaveProperty('finishes');
    expect(out.structuredContent).toHaveProperty('purchase_url');
  });

  test('returns error message when required machine_id is missing', async () => {
    const out = await handler({});
    expect(out.content[0].text).toMatch(/machine_id|provide/i);
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
  });

  test('unknown machine returns a not-found message and empty structuredContent', async () => {
    const out = await handler({ machine_id: 'nonexistent-machine-xyz' });
    expect(out.content[0].text).toMatch(/no matching|not found|no results/i);
    expect(out.structuredContent).toEqual({});
  });
});
