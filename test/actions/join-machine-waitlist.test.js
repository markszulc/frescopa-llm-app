const handler = require('../../actions/join-machine-waitlist/index.js');

const validArgs = {
    machine_name: 'The Atelier Mini',
    name: 'Jordan Rivera',
    email: 'jordan@example.com',
};

describe('join_machine_waitlist handler', () => {
    test('content is an array of text blocks', async () => {
        const out = await handler(validArgs);
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
    });

    test('"Add me to the Atelier Mini waitlist" registers and confirms', async () => {
        const out = await handler(validArgs);
        expect(out.content[0].text.length).toBeGreaterThan(0);
        expect(out.structuredContent.status).toBe('registered');
        expect(out.structuredContent.machine_name).toBe('The Atelier Mini');
        expect(out.structuredContent.email).toBe('jordan@example.com');
        expect(typeof out.structuredContent.confirmation_id).toBe('string');
        expect(out.structuredContent.confirmation_id.length).toBeGreaterThan(0);
    });

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler(validArgs);
        expect(typeof out.structuredContent).toBe('object');
        expect(Array.isArray(out.structuredContent)).toBe(false);
    });

    test('confirmation message notes no timing/inventory guarantee', async () => {
        const out = await handler(validArgs);
        expect(out.structuredContent.message).toMatch(/does not guarantee|release date|inventory|priority/i);
    });

    test('returns error message when machine_name is missing', async () => {
        const out = await handler({ name: 'Jordan Rivera', email: 'jordan@example.com' });
        expect(out.content[0].text).toMatch(/machine_name|provide/i);
        expect(out.structuredContent.confirmation_id).toBeNull();
    });

    test('returns error message when email is invalid', async () => {
        const out = await handler({ ...validArgs, email: 'not-an-email' });
        expect(out.content[0].text).toMatch(/email|valid/i);
        expect(out.structuredContent.status).toBeNull();
    });

    test('rejects a machine that is available for purchase (not waitlisted)', async () => {
        const out = await handler({ ...validArgs, machine_name: 'The Barista' });
        expect(out.structuredContent.status).toBe('not_waitlisted');
        expect(out.structuredContent.confirmation_id).toBeNull();
        expect(out.content[0].text).toMatch(/available/i);
    });

    test('reports not_found for an unknown machine', async () => {
        const out = await handler({ ...validArgs, machine_name: 'The Nonexistent 9000' });
        expect(out.structuredContent.status).toBe('not_found');
        expect(out.structuredContent.confirmation_id).toBeNull();
    });

    test('every return path exposes the same structuredContent keys', async () => {
        const expectedKeys = ['confirmation_id', 'status', 'message', 'machine_name', 'email'].sort();
        const outs = await Promise.all([
            handler(validArgs),
            handler({}),
            handler({ ...validArgs, machine_name: 'The Barista' }),
            handler({ ...validArgs, machine_name: 'Unknown' }),
        ]);
        outs.forEach((out) => {
            expect(Object.keys(out.structuredContent).sort()).toEqual(expectedKeys);
        });
    });
});
