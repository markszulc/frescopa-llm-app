const handler = require('../../actions/find-frescopa-cafe/index.js');

describe('find_frescopa_cafe action handler', () => {
  test('happy path — returns content and structuredContent for a valid location', async () => {
    const result = await handler({ location: 'New York, NY' });

    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content[0].type).toBe('text');
    expect(typeof result.content[0].text).toBe('string');
    expect(result.content[0].text.length).toBeGreaterThan(0);

    expect(Array.isArray(result.structuredContent.cafes)).toBe(true);
    expect(result.structuredContent.cafes.length).toBeGreaterThan(0);
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const result = await handler({ location: 'Chicago, IL' });
    expect(Array.isArray(result.structuredContent)).toBe(false);
    expect(typeof result.structuredContent).toBe('object');
    expect(result.structuredContent).not.toBeNull();
    expect(result.structuredContent).toHaveProperty('cafes');
  });

  test('missing required location — returns a prompt and empty cafes array', async () => {
    const result = await handler({});
    expect(result.content[0].text).toMatch(/provide a location/i);
    expect(result.structuredContent.cafes).toEqual([]);
  });

  test('blank location string is treated as missing', async () => {
    const result = await handler({ location: '   ' });
    expect(result.structuredContent.cafes).toEqual([]);
  });

  test('each café carries coordinates for the map surface', async () => {
    const result = await handler({ location: 'Miami, FL' });
    result.structuredContent.cafes.forEach((cafe) => {
      expect(typeof cafe.latitude).toBe('number');
      expect(typeof cafe.longitude).toBe('number');
    });
  });

  test('amenity filter — restricts results to matching amenities', async () => {
    const result = await handler({ location: 'San Francisco, CA', amenity: 'workshops' });
    expect(result.structuredContent.cafes.length).toBeGreaterThan(0);
    result.structuredContent.cafes.forEach((cafe) => {
      const amenities = cafe.amenities.map((a) => String(a).toLowerCase());
      expect(amenities.some((a) => a.includes('workshops'))).toBe(true);
    });
  });

  test('amenity "any" does not filter out results', async () => {
    const all = await handler({ location: 'Atlanta, GA' });
    const anyResult = await handler({ location: 'Atlanta, GA', amenity: 'any' });
    expect(anyResult.structuredContent.cafes.length).toBe(all.structuredContent.cafes.length);
  });

  test('origin coordinates — computes distance and sorts nearest first', async () => {
    // toolPreviewPrompt: "taste Atelier near downtown Seattle, find nearby Fréscopa cafés"
    const result = await handler({
      location: 'Los Angeles, CA',
      latitude: 34.0522,
      longitude: -118.2437,
    });
    const cafes = result.structuredContent.cafes;
    cafes.forEach((cafe) => {
      expect(typeof cafe.distance_miles).toBe('number');
    });
    for (let i = 1; i < cafes.length; i += 1) {
      expect(cafes[i].distance_miles).toBeGreaterThanOrEqual(cafes[i - 1].distance_miles);
    }
  });

  test('radius filter — excludes cafés beyond the radius from the origin', async () => {
    const result = await handler({
      location: 'Los Angeles, CA',
      latitude: 34.0522,
      longitude: -118.2437,
      radius_miles: 50,
    });
    result.structuredContent.cafes.forEach((cafe) => {
      expect(cafe.distance_miles).toBeLessThanOrEqual(50);
    });
  });

  test('no matching café within radius — returns empty cafes with a message', async () => {
    const result = await handler({
      location: 'Los Angeles, CA',
      latitude: 34.0522,
      longitude: -118.2437,
      radius_miles: 0.0001,
    });
    expect(result.structuredContent.cafes).toEqual([]);
    expect(result.content[0].text).toMatch(/No Fréscopa cafés found/i);
  });
});
