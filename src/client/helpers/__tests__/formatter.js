import { jsonParse } from '../formatter';

describe('jsonParse', () => {
  it('should return undefined on undefined input', () => {
    expect(jsonParse(undefined)).toBeNull();

    expect(jsonParse('{')).toBeNull();

    expect(jsonParse('hello world')).toBeNull();
  });

  it('should return parsed JSON', () => {
    expect(jsonParse('{}')).toEqual({});

    expect(jsonParse('"hello world"')).toEqual('hello world');

    expect(jsonParse(42)).toEqual(42);

    expect(jsonParse('24')).toEqual(24);

    expect(jsonParse('{ "test": "ok" }')).toEqual({
      test: 'ok',
    });

    expect(jsonParse('[2, 4, 55]')).toEqual([2, 4, 55]);

    expect(jsonParse('{ "arr": [2, 5] }')).toEqual({
      arr: [2, 5],
    });
  });
});
