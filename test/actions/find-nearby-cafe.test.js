const handler = require('../../actions/find-nearby-cafe/index.js');

describe('find_nearby_cafe action', () => {
  test('happy path — returns matching cafes for a location', async () => {
    const res = await handler({ location: 'New York' });
    expect(Array.isArray(res.content)).toBe(true);
    expect(res.content[0].type).toBe('text');
    expect(typeof res.content[0].text).toBe('string');
    expect(res.content[0].text.length).toBeGreaterThan(0);
    expect(res.structuredContent.cafes.length).toBeGreaterThan(0);
    expect(res.structuredContent.cafes[0]).toHaveProperty('name');
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const res = await handler({ location: 'Chicago' });
    expect(Array.isArray(res.structuredContent)).toBe(false);
    expect(typeof res.structuredContent).toBe('object');
    expect(res.structuredContent).toHaveProperty('cafes');
    expect(Array.isArray(res.structuredContent.cafes)).toBe(true);
  });

  test('preserves latitude/longitude for the map surface', async () => {
    const res = await handler({ location: 'Los Angeles' });
    const first = res.structuredContent.cafes[0];
    expect(typeof first.latitude).toBe('number');
    expect(typeof first.longitude).toBe('number');
  });

  test('missing required location arg returns a prompt and empty cafes', async () => {
    const res = await handler({});
    expect(res.content[0].text).toMatch(/provide a city|postal code|address/i);
    expect(res.structuredContent.cafes).toEqual([]);
  });

  test('required_amenity filter — matching amenity returns results', async () => {
    const res = await handler({ location: 'New York', required_amenity: 'Workshops' });
    expect(res.structuredContent.cafes.length).toBeGreaterThan(0);
    res.structuredContent.cafes.forEach((c) => {
      expect(c.amenities.some((a) => a.toLowerCase().includes('workshop'))).toBe(true);
    });
  });

  test('required_amenity filter — no match returns empty cafes', async () => {
    const res = await handler({ location: 'New York', required_amenity: 'ice skating rink' });
    expect(res.structuredContent.cafes).toEqual([]);
    expect(res.content[0].text).toMatch(/No Fréscopa locations/i);
  });
});
