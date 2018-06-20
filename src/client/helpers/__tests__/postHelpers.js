import { getAppData, getContentImages } from '../postHelpers';

describe('getAppData', () => {
  it('should return an empty object when post does not contain an app', () => {
    const post = { json_metadata: '{}' };
    expect(getAppData(post)).toEqual({});
  });

  it('should return an empty object if app is defined but empty', () => {
    const post = { json_metadata: '{ "app": "" }' };
    expect(getAppData(post)).toEqual({});
  });

  it('should return an empty object if app is not on the white list', () => {
    const post = { json_metadata: '{ "app": "thisappshouldneverbeonthewhitelist12356" }' };
    expect(getAppData(post)).toEqual({});
  });

  it('should return an object with the appName and version', () => {
    const post = { json_metadata: '{ "app": "busy/1.2.4" }' };
    expect(getAppData(post)).toEqual({ appName: 'Busy', version: '1.2.4' });
  });

  it('should return an object with the appName and empty version if version is absent', () => {
    const post = { json_metadata: '{ "app": "busy" }' };
    expect(getAppData(post)).toEqual({ appName: 'Busy', version: '' });
  });

  it('should handle more app parameters without failing, eg. busy/1.2/other', () => {
    const post = { json_metadata: '{ "app": "busy/1.2.3/something" }' };
    expect(getAppData(post)).toEqual({ appName: 'Busy', version: '1.2.3' });
  });
});

describe('getContentImages', () => {
  it('should return empty array if no images are found', () => {
    const expected = [];
    const actual = getContentImages('Hello World');

    expect(actual).toEqual(expected);
  });

  it('should return images array', () => {
    const content = `
Hello World!

Before:
![image](https://user-images.githubusercontent.com/1968722/41253250-0a6d2ece-6dc0-11e8-981a-a1d1a1c0ecec.png)

After:
![image](https://user-images.githubusercontent.com/1968722/41253262-1056e3f2-6dc0-11e8-8cfb-7cca34f41e86.png)

Bye!
    `;

    const expected = [
      'https://user-images.githubusercontent.com/1968722/41253250-0a6d2ece-6dc0-11e8-981a-a1d1a1c0ecec.png',
      'https://user-images.githubusercontent.com/1968722/41253262-1056e3f2-6dc0-11e8-8cfb-7cca34f41e86.png',
    ];
    const actual = getContentImages(content);

    expect(actual).toEqual(expected);
  });

  it('should return empty array if no images are found with parsed body', () => {
    const expected = [];
    const actual = getContentImages('<b>Hello</b>', true);

    expect(actual).toEqual(expected);
  });

  it('should return images array', () => {
    const content = `
Hello World!

Before:
<img src="https://user-images.githubusercontent.com/1968722/41253250-0a6d2ece-6dc0-11e8-981a-a1d1a1c0ecec.png" />

After:
<img src="https://user-images.githubusercontent.com/1968722/41253262-1056e3f2-6dc0-11e8-8cfb-7cca34f41e86.png" />

Bye!
    `;

    const expected = [
      'https://user-images.githubusercontent.com/1968722/41253250-0a6d2ece-6dc0-11e8-981a-a1d1a1c0ecec.png',
      'https://user-images.githubusercontent.com/1968722/41253262-1056e3f2-6dc0-11e8-8cfb-7cca34f41e86.png',
    ];
    const actual = getContentImages(content);

    expect(actual).toEqual(expected);
  });
});
