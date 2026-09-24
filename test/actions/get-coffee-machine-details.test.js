const handler = require('../../actions/get-coffee-machine-details/index.js');

describe('get_coffee_machine_details handler', () => {
    test('content is an array of text blocks', async () => {
        const out = await handler({ machine_name: 'The Atelier' });
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
    });

    test('"Walk me through The Atelier" returns the machine details', async () => {
        const out = await handler({ machine_name: 'The Atelier' });
        expect(out.content[0].text.length).toBeGreaterThan(0);
        expect(out.content[0].text).toMatch(/Atelier/);
        expect(out.structuredContent.name).toBe('The Atelier');
        expect(out.structuredContent.price).toBe(2199);
        expect(Array.isArray(out.structuredContent.finishes)).toBe(true);
    });

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({ machine_name: 'The Atelier' });
        expect(typeof out.structuredContent).toBe('object');
        expect(Array.isArray(out.structuredContent)).toBe(false);
    });

    test('matches by case-insensitive partial name', async () => {
        const out = await handler({ machine_name: 'barista' });
        expect(out.structuredContent.name).toBe('The Barista');
    });

    test('returns error message when machine_name is missing', async () => {
        const out = await handler({});
        expect(out.content[0].text).toMatch(/machine_name|provide/i);
        expect(out.structuredContent).toEqual({});
    });

    test('unknown machine returns not-found with empty structuredContent', async () => {
        const out = await handler({ machine_name: 'The Nonexistent' });
        expect(out.content[0].text).toMatch(/no .*machine found|not found/i);
        expect(out.structuredContent).toEqual({});
    });

    test('waitlist machine summary mentions the list rather than purchase', async () => {
        const out = await handler({ machine_name: 'The Carafe' });
        expect(out.structuredContent.availability_status).toBe('waitlist');
        expect(out.content[0].text).toMatch(/waitlist|join the list/i);
    });
});
