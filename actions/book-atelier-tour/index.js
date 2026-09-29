// TODO: Replace MOCK_DATA / SHOWROOMS with a real API call.
// See the TODO block below the handler for endpoint details.

// Fréscopa product catalog — used for context/validation of tour interests.
const MOCK_DATA = [
    { product_id: 'the-atelier', name: 'The Atelier', category: 'Bean-to-cup', price: 2199, availability: 'Available now' },
    { product_id: 'the-atelier-mini', name: 'The Atelier Mini', category: 'Bean-to-cup', price: 799, availability: 'Waitlist' },
    { product_id: 'the-barista', name: 'The Barista', category: 'Espresso', price: 899, availability: 'Waitlist' },
    { product_id: 'the-everyday', name: 'The Everyday', category: 'Espresso', price: 499, availability: 'Waitlist' },
    { product_id: 'the-slow-pour', name: 'The Slow Pour', category: 'Filter', price: 279, availability: 'Waitlist' },
    { product_id: 'the-carafe', name: 'The Carafe', category: 'Cold brew', price: 179, availability: 'Waitlist' },
    { product_id: 'atelier-year-of-beans', name: 'The Atelier + a year of beans', category: 'Atelier Bundle', price: 2799 },
    { product_id: 'atelier-barista-kit', name: 'The Atelier + Barista Kit', category: 'Atelier Bundle', price: 2399 },
]

// Participating showroom cafés that host the private Atelier tour.
const SHOWROOMS = [
    {
        id: 'seattle-pike-place',
        name: 'Fréscopa Seattle — Pike Place',
        address: '1428 Post Alley, Seattle, WA 98101',
        directions_url: 'https://www.frescopa.coffee/showrooms/seattle',
    },
    {
        id: 'portland-pearl-district',
        name: 'Fréscopa Portland — Pearl District',
        address: '1015 NW Everett St, Portland, OR 97209',
        directions_url: 'https://www.frescopa.coffee/showrooms/portland',
    },
    {
        id: 'san-francisco-hayes-valley',
        name: 'Fréscopa San Francisco — Hayes Valley',
        address: '580 Hayes St, San Francisco, CA 94102',
        directions_url: 'https://www.frescopa.coffee/showrooms/san-francisco',
    },
]

const EMPTY = {
    confirmation_id: null,
    status: null,
    message: null,
    showroom_name: null,
    address: null,
    requested_date: null,
    requested_time: null,
    guest_count: null,
    duration_minutes: null,
    payment_required: null,
    directions_url: null,
}

function findShowroom(showroom_id) {
    const q = showroom_id.trim().toLowerCase()
    return SHOWROOMS.find((s) => s.id.toLowerCase() === q)
        || SHOWROOMS.find((s) => s.name.toLowerCase() === q)
        || SHOWROOMS.find((s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q))
}

module.exports = async ({
    showroom_id = '',
    requested_date = '',
    requested_time = '',
    guest_count,
    customer_name = '',
    email = '',
    phone = '',
    interests = [],
} = {}) => {
    const missing = []
    if (!showroom_id || typeof showroom_id !== 'string' || !showroom_id.trim()) missing.push('showroom_id')
    if (!requested_date || typeof requested_date !== 'string' || !requested_date.trim()) missing.push('requested_date')
    if (!requested_time || typeof requested_time !== 'string' || !requested_time.trim()) missing.push('requested_time')
    if (!Number.isFinite(guest_count) || guest_count < 1) missing.push('guest_count')
    if (!customer_name || typeof customer_name !== 'string' || !customer_name.trim()) missing.push('customer_name')
    if (!email || typeof email !== 'string' || !email.trim()) missing.push('email')

    if (missing.length > 0) {
        return {
            content: [{ type: 'text', text: `Please provide the following to request your tour: ${missing.join(', ')}.` }],
            structuredContent: { ...EMPTY },
        }
    }

    const showroom = findShowroom(showroom_id)
    if (!showroom) {
        return {
            content: [{ type: 'text', text: `We couldn't find a participating showroom matching "${showroom_id}". Please choose Seattle, Portland, or San Francisco.` }],
            structuredContent: { ...EMPTY },
        }
    }

    const confirmation_id = `ATL-${requested_date.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`
    const interestList = Array.isArray(interests) ? interests.filter((i) => typeof i === 'string' && i.trim()) : []
    const message = `Thanks, ${customer_name.trim()}! Your request for a private Atelier tour at ${showroom.name} on ${requested_date} at ${requested_time} for ${guest_count} guest(s) has been received. It's a request pending confirmation — we'll email ${email.trim()} within one business day. No payment is required.`

    return {
        content: [{ type: 'text', text: `Tour request received (#${confirmation_id}) for ${showroom.name} on ${requested_date} at ${requested_time}. This is a request pending email confirmation within one business day — no payment is required.` }],
        // structuredContent — flat single-object confirmation shape (widget reads sc directly, keys off confirmation_id)
        structuredContent: {
            confirmation_id,
            status: 'Pending confirmation',
            message,
            showroom_name: showroom.name,
            address: showroom.address,
            requested_date,
            requested_time,
            guest_count,
            duration_minutes: 45,
            payment_required: false,
            directions_url: showroom.directions_url,
            interests: interestList,
        },
    }
}

/*
 * TODO: Replace SHOWROOMS lookup and confirmation generation with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   POST ${process.env.API_BASE_URL}/tours/requests
 *   body: { showroom_id, requested_date, requested_time, guest_count, customer_name, email, phone, interests }
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(`${process.env.API_BASE_URL}/tours/requests`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.API_KEY}` },
 *     body: JSON.stringify({ showroom_id, requested_date, requested_time, guest_count, customer_name, email, phone, interests }),
 *   })
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 *
 * MOCK_DATA (the Fréscopa product catalog) is retained for validating tour
 * interests against real machine lines once the tours API is wired up.
 */
