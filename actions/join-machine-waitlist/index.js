// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
// MOCK_DATA is the real machine catalog from samplePayload — used to validate
// the requested machine_name and confirm it is currently accepting waitlist
// registrations before returning a confirmation.
const MOCK_DATA = [
    {
        name: 'The Atelier',
        category: 'Bean-to-cup',
        price_label: '$2,199 or $184/month',
        availability: 'Available',
        availability_status: 'available',
    },
    {
        name: 'The Atelier Mini',
        category: 'Bean-to-cup',
        price_label: '$799',
        availability: 'Join the list',
        availability_status: 'waitlist',
    },
    {
        name: 'The Barista',
        category: 'Espresso',
        price_label: '$899',
        availability: 'Available',
        availability_status: 'available',
    },
    {
        name: 'The Everyday',
        category: 'Espresso',
        price_label: '$499',
        availability: 'Available',
        availability_status: 'available',
    },
    {
        name: 'The Slow Pour',
        category: 'Filter',
        price_label: '$279',
        availability: 'Available',
        availability_status: 'available',
    },
    {
        name: 'The Carafe',
        category: 'Cold brew',
        price_label: '$179',
        availability: 'Join the list',
        availability_status: 'waitlist',
    },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function makeConfirmationId(machineName) {
    const slug = machineName
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 16);
    const suffix = Math.floor(10000 + Math.random() * 90000);
    return `WL-${slug}-${suffix}`;
}

module.exports = async ({ machine_name = '', name = '', email = '', location = '', marketing_consent = false }) => {
    if (!machine_name || typeof machine_name !== 'string' || !machine_name.trim()) {
        return {
            content: [{ type: 'text', text: 'Please provide the machine_name you want to join the waitlist for.' }],
            structuredContent: { confirmation_id: null, status: null, message: null, machine_name: null, email: null },
        };
    }
    if (!name || typeof name !== 'string' || !name.trim()) {
        return {
            content: [{ type: 'text', text: 'Please provide your name to register for the waitlist.' }],
            structuredContent: { confirmation_id: null, status: null, message: null, machine_name: null, email: null },
        };
    }
    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
        return {
            content: [{ type: 'text', text: 'Please provide a valid email address for availability updates.' }],
            structuredContent: { confirmation_id: null, status: null, message: null, machine_name: null, email: null },
        };
    }

    const query = machine_name.trim().toLowerCase();
    const machine = MOCK_DATA.find((m) => m.name.toLowerCase() === query)
        || MOCK_DATA.find((m) => m.name.toLowerCase().includes(query));

    if (!machine) {
        return {
            content: [{ type: 'text', text: `We couldn't find a Fréscopa machine called "${machine_name}". Please check the model name and try again.` }],
            structuredContent: { confirmation_id: null, status: 'not_found', message: `No machine named "${machine_name}" was found.`, machine_name: null, email: null },
        };
    }

    if (machine.availability_status !== 'waitlist') {
        return {
            content: [{ type: 'text', text: `${machine.name} is currently available for purchase, so there is no waitlist to join.` }],
            structuredContent: { confirmation_id: null, status: 'not_waitlisted', message: `${machine.name} is available now — no waitlist registration is needed.`, machine_name: machine.name, email: null },
        };
    }

    // TODO: replace this local confirmation with the real registration API call.
    const registeredEmail = email.trim();
    const confirmation_id = makeConfirmationId(machine.name);
    const status = 'registered';
    const consentNote = marketing_consent === true
        ? ' You have opted in to related Fréscopa updates.'
        : '';
    const message = `You're on the waitlist for ${machine.name}. We'll email ${registeredEmail} the moment it's available to order.${consentNote} Registration reserves your place on the list only — it does not guarantee a release date, inventory allocation, or purchase priority unless Fréscopa explicitly provides one.`;

    const locationNote = location && location.trim() ? ` for ${location.trim()}` : '';

    return {
        content: [{ type: 'text', text: `${name.trim()} is registered on the ${machine.name} waitlist${locationNote} (confirmation ${confirmation_id}). Note: this does not guarantee timing or inventory.` }],
        structuredContent: { confirmation_id, status, message, machine_name: machine.name, email: registeredEmail },
    };
};

/*
 * TODO: Replace MOCK_DATA + local confirmation with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   POST ${process.env.API_BASE_URL}/waitlist
 *   body: { machine_name, name, email, location, marketing_consent }
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(`${process.env.API_BASE_URL}/waitlist`, {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${process.env.API_KEY}`,
 *     },
 *     body: JSON.stringify({ machine_name, name, email, location, marketing_consent }),
 *   })
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
