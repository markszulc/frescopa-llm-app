const handler = require('../../actions/book-atelier-tour/index.js')

const validArgs = {
    showroom_id: 'seattle-pike-place',
    requested_date: '2026-10-03',
    requested_time: '2:30 PM',
    guest_count: 2,
    customer_name: 'Jordan Lee',
    email: 'jordan@example.com',
}

describe('book_atelier_tour handler', () => {
    test('returns content block shape on happy path', async () => {
        const out = await handler(validArgs)
        expect(out).toHaveProperty('content')
        expect(Array.isArray(out.content)).toBe(true)
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) })
    })

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler(validArgs)
        expect(typeof out.structuredContent).toBe('object')
        expect(Array.isArray(out.structuredContent)).toBe(false)
    })

    test('"Book me a free private tour for two next Saturday afternoon" returns a pending confirmation', async () => {
        const out = await handler(validArgs)
        const sc = out.structuredContent
        expect(sc.confirmation_id).toEqual(expect.any(String))
        expect(sc.confirmation_id.length).toBeGreaterThan(0)
        expect(sc.status).toMatch(/pending/i)
        expect(sc.showroom_name).toMatch(/Seattle/i)
        expect(sc.address).toEqual(expect.any(String))
        expect(sc.requested_date).toBe('2026-10-03')
        expect(sc.requested_time).toBe('2:30 PM')
        expect(sc.guest_count).toBe(2)
        expect(sc.duration_minutes).toBe(45)
        expect(sc.payment_required).toBe(false)
        expect(sc.directions_url).toMatch(/^https:\/\//)
    })

    test('content is concise and mentions the pending, no-payment nature (Content guidance)', async () => {
        const out = await handler(validArgs)
        expect(out.content[0].text).toMatch(/pending/i)
        expect(out.content[0].text).toMatch(/no payment/i)
    })

    test('matches a showroom by recognized name, not just id', async () => {
        const out = await handler({ ...validArgs, showroom_id: 'Fréscopa Seattle — Pike Place' })
        expect(out.structuredContent.showroom_name).toMatch(/Seattle/i)
        expect(out.structuredContent.confirmation_id).toEqual(expect.any(String))
    })

    test('passes optional interests through to structuredContent', async () => {
        const out = await handler({ ...validArgs, interests: ['The Atelier line', 'Cold brew & tea'] })
        expect(out.structuredContent.interests).toEqual(['The Atelier line', 'Cold brew & tea'])
    })

    test('returns error message when required arg is missing', async () => {
        const out = await handler({ showroom_id: 'seattle-pike-place' })
        expect(out.content[0].text).toMatch(/provide|requested_date|guest_count|email/i)
    })

    test('every branch keeps the same structuredContent key shape', async () => {
        const ok = await handler(validArgs)
        const err = await handler({})
        expect(Object.keys(err.structuredContent).sort())
            .toEqual(expect.arrayContaining(Object.keys(ok.structuredContent).filter((k) => k !== 'interests').sort()))
    })

    test('unknown showroom returns a helpful message and empty confirmation', async () => {
        const out = await handler({ ...validArgs, showroom_id: 'Atlantis Café' })
        expect(out.content[0].text).toMatch(/couldn't find|choose|Seattle|Portland/i)
        expect(out.structuredContent.confirmation_id).toBeNull()
    })

    test('rejects a non-positive guest_count', async () => {
        const out = await handler({ ...validArgs, guest_count: 0 })
        expect(out.content[0].text).toMatch(/guest_count/i)
        expect(out.structuredContent.confirmation_id).toBeNull()
    })
})
