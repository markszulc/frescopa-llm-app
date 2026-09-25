const handler = require('../../actions/find-coffee-by-taste/index.js');

describe('find_coffee_by_taste handler', () => {
    test('returns content block shape on happy path', async () => {
        const out = await handler({ flavor_preferences: ['chocolatey', 'low-acid'] });
        expect(out).toHaveProperty('content');
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
    });

    test('"chocolatey, low-acid for espresso, decaf" returns coffee matches', async () => {
        const out = await handler({
            flavor_preferences: ['chocolatey', 'low-acid'],
            brewing_method: 'espresso',
            caffeine_preference: 'decaf',
        });
        expect(out.structuredContent.coffees.length).toBeGreaterThan(0);
        expect(out.content[0].text.length).toBeGreaterThan(0);
    });

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({ flavor_preferences: ['bold'] });
        expect(typeof out.structuredContent).toBe('object');
        expect(Array.isArray(out.structuredContent)).toBe(false);
        expect(Array.isArray(out.structuredContent.coffees)).toBe(true);
    });

    test('returns error message when required flavor_preferences is missing', async () => {
        const out = await handler({});
        expect(out.content[0].text).toMatch(/flavor_preference|provide/i);
        expect(out.structuredContent.coffees).toEqual([]);
    });

    test('empty flavor_preferences array is treated as missing', async () => {
        const out = await handler({ flavor_preferences: [] });
        expect(out.content[0].text).toMatch(/flavor_preference|provide/i);
        expect(out.structuredContent.coffees).toEqual([]);
    });

    test('attaches match_reasons tied to the stated preferences', async () => {
        const out = await handler({ flavor_preferences: ['espresso'] });
        const withReasons = out.structuredContent.coffees.filter((c) => c.match_reasons.length > 0);
        expect(withReasons.length).toBeGreaterThan(0);
    });

    test('coffee_category filter narrows results to that category', async () => {
        const out = await handler({ flavor_preferences: ['smooth'], coffee_category: 'Espresso' });
        const cats = out.structuredContent.coffees.map((c) => c.category.toLowerCase());
        expect(cats.every((c) => c.includes('espresso'))).toBe(true);
    });

    test('unmatched preference still returns the full range as a fallback', async () => {
        const out = await handler({ flavor_preferences: ['zzz-nonexistent-note'] });
        expect(out.structuredContent.coffees.length).toBeGreaterThan(0);
    });
});
