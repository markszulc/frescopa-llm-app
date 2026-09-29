const handler = require('../../actions/explore-atelier-purchase-options/index.js');

describe('explore_atelier_purchase_options handler', () => {
    test('returns content block shape on happy path', async () => {
        const out = await handler({});
        expect(out).toHaveProperty('content');
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
    });

    test('"lay out the purchase options including beans and Barista Kit" returns options', async () => {
        const out = await handler({});
        expect(out.structuredContent.options.length).toBeGreaterThan(0);
        expect(out.content[0].text.length).toBeGreaterThan(0);
    });

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({});
        expect(typeof out.structuredContent).toBe('object');
        expect(Array.isArray(out.structuredContent)).toBe(false);
        expect(Array.isArray(out.structuredContent.options)).toBe(true);
    });

    test('filters by max_budget', async () => {
        const out = await handler({ max_budget: 500 });
        const { options } = out.structuredContent;
        expect(options.every((o) => o.price <= 500)).toBe(true);
        expect(options.length).toBeGreaterThan(0);
    });

    test('filters by bundle_interest', async () => {
        const out = await handler({ bundle_interest: 'beans' });
        const { options } = out.structuredContent;
        expect(options.length).toBeGreaterThan(0);
        expect(options.every((o) => (o.bundle_interest || '').toLowerCase().includes('bean'))).toBe(true);
    });

    test('returns empty options (not an error) when nothing matches the budget', async () => {
        const out = await handler({ max_budget: 10 });
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0].text).toMatch(/no .*options|match/i);
        expect(out.structuredContent.options).toEqual([]);
    });
});
