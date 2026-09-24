const handler = require('../../actions/discover-coffee-machines/index.js');

describe('discover_coffee_machines', () => {
    test('happy path — returns machines with no filters', async () => {
        const res = await handler({});
        expect(Array.isArray(res.content)).toBe(true);
        expect(res.content[0].type).toBe('text');
        expect(res.structuredContent).toBeDefined();
        expect(Array.isArray(res.structuredContent)).toBe(false);
        expect(Array.isArray(res.structuredContent.machines)).toBe(true);
        expect(res.structuredContent.machines.length).toBeGreaterThan(0);
    });

    test('filters by max_price', async () => {
        const res = await handler({ max_price: 500 });
        expect(res.structuredContent.machines.length).toBeGreaterThan(0);
        res.structuredContent.machines.forEach((m) => {
            expect(m.price).toBeLessThanOrEqual(500);
        });
    });

    test('filters by brewing_style', async () => {
        const res = await handler({ brewing_style: 'filter' });
        expect(res.structuredContent.machines.every((m) => (
            `${m.brewing_style} ${m.category}`.toLowerCase().includes('filter')
        ))).toBe(true);
    });

    test('filters by availability_status', async () => {
        const res = await handler({ availability_status: 'waitlist' });
        res.structuredContent.machines.forEach((m) => {
            expect(m.availability_status).toBe('waitlist');
        });
    });

    test('no matches — returns empty machines array under the same key', async () => {
        const res = await handler({ max_price: 1 });
        expect(Array.isArray(res.content)).toBe(true);
        expect(res.structuredContent.machines).toEqual([]);
    });

    test('handles being called with no arguments', async () => {
        const res = await handler();
        expect(Array.isArray(res.structuredContent.machines)).toBe(true);
    });
});
