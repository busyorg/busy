import { getAppData } from '../postHelpers';

describe('getAppData', () => {
  it('should return an empty object when post does not contain an app', () => {
    const post = { json_metadata: {} };
    expect(getAppData(post)).toEqual({});
  });

  it('should return an empty object if app is defined but empty', () => {
    const post = { json_metadata: { app: '' } };
    expect(getAppData(post)).toEqual({});
  });

  it('should return an empty object if app is not on the white list', () => {
    const post = { json_metadata: { app: 'thisappshouldneverbeonthewhitelist12356' } };
    expect(getAppData(post)).toEqual({});
  });

  it('should return an object with the appName and version', () => {
    const post = { json_metadata: { app: 'busy/1.2.4' } };
    expect(getAppData(post)).toEqual({ appName: 'Busy', version: '1.2.4' });
  });

  it('should return an object with the appName and empty version if version is absent', () => {
    const post = { json_metadata: { app: 'busy' } };
    expect(getAppData(post)).toEqual({ appName: 'Busy', version: '' });
  });
});
