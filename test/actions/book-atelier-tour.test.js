const handler = require('../../actions/book-atelier-tour/index.js');

const validArgs = {
    cafe_name: 'Fréscopa Atelier — Downtown',
    date: '2026-10-03',
    time: '2:00 PM',
    guest_count: 2,
    name: 'Jordan Rivera',
    email: 'jordan@example.com',
};

describe('book_atelier_tour handler', () => {
    test('content is an array of text blocks', async () => {
        const out = await handler(validArgs);
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
    });

    test('"book a private Atelier tour for two next Saturday" returns a confirmation', async () => {
        const out = await handler(validArgs);
        expect(out.content[0].text.length).toBeGreaterThan(0);
        expect(out.structuredContent.confirmation_id).toEqual(expect.any(String));
        expect(out.structuredContent.status).toMatch(/pending|confirm/i);
        expect(out.structuredContent.cafe_name).toBe(validArgs.cafe_name);
        expect(out.structuredContent.guest_count).toBe(2);
        expect(out.structuredContent.confirmation_email).toBe(validArgs.email);
    });

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler(validArgs);
        expect(typeof out.structuredContent).toBe('object');
        expect(Array.isArray(out.structuredContent)).toBe(false);
    });

    test('returns error message when required args are missing', async () => {
        const out = await handler({});
        expect(out.content[0].text).toMatch(/provide|cafe_name|email/i);
        expect(out.structuredContent.confirmation_id).toBeNull();
    });

    test('rejects an invalid email address', async () => {
        const out = await handler({ ...validArgs, email: 'not-an-email' });
        expect(out.content[0].text).toMatch(/valid email/i);
        expect(out.structuredContent.confirmation_id).toBeNull();
    });

    test('error branch keeps the same structuredContent key shape as the happy path', async () => {
        const ok = await handler(validArgs);
        const err = await handler({});
        expect(Object.keys(err.structuredContent).sort()).toEqual(Object.keys(ok.structuredContent).sort());
    });

    test('optional interests are folded into the confirmation message', async () => {
        const out = await handler({ ...validArgs, interests: ['The Atelier line', 'Cold brew & tea'] });
        expect(out.structuredContent.message).toMatch(/The Atelier line/);
        expect(out.structuredContent.message).toMatch(/Cold brew & tea/);
    });
});
