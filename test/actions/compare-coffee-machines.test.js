const handler = require('../../actions/compare-coffee-machines/index.js');

describe('compare_coffee_machines handler', () => {
    test('content is an array of text blocks', async () => {
        const out = await handler({ machine_names: ['The Atelier', 'The Barista'] });
        expect(out).toHaveProperty('content');
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
    });

    test('"Compare The Atelier and The Barista" returns exactly two machines', async () => {
        const out = await handler({ machine_names: ['The Atelier', 'The Barista'] });
        expect(out.content[0].text.length).toBeGreaterThan(0);
        expect(out.structuredContent.machines).toHaveLength(2);
        expect(out.structuredContent.machines.map((m) => m.name)).toEqual(['The Atelier', 'The Barista']);
    });

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({ machine_names: ['The Atelier', 'The Barista'] });
        expect(typeof out.structuredContent).toBe('object');
        expect(Array.isArray(out.structuredContent)).toBe(false);
        expect(Array.isArray(out.structuredContent.machines)).toBe(true);
    });

    test('returns error when required machine_names is missing', async () => {
        const out = await handler({});
        expect(out.content[0].text).toMatch(/two|machine|provide/i);
        expect(out.structuredContent.machines).toEqual([]);
    });

    test('rejects when not exactly two names are supplied', async () => {
        const out = await handler({ machine_names: ['The Atelier'] });
        expect(out.content[0].text).toMatch(/two/i);
        expect(out.structuredContent.machines).toEqual([]);
    });

    test('unknown machine name yields empty machines list', async () => {
        const out = await handler({ machine_names: ['The Atelier', 'Nonexistent Machine'] });
        expect(out.content[0].text).toMatch(/couldn't find|find/i);
        expect(out.structuredContent.machines).toEqual([]);
    });

    test('matches machines by case-insensitive partial name', async () => {
        const out = await handler({ machine_names: ['atelier', 'barista'] });
        expect(out.structuredContent.machines).toHaveLength(2);
    });

    test('folds priorities into the summary text when provided', async () => {
        const out = await handler({ machine_names: ['The Atelier', 'The Barista'], priorities: ['price', 'automation'] });
        expect(out.content[0].text).toMatch(/price/i);
    });
});
