import { C2PAManifestStoreBox } from '../src/boxes/uuid';
import { loadAndGetInfo } from './common';

describe('C2PA boxes', () => {
  it('recognizes the C2PA uuid manifest-store box', async () => {
    const { mp4 } = await loadAndGetInfo('tests/data/c2pa/init_session_keys.m4s', true);
    const box = mp4.boxes.find(b => b instanceof C2PAManifestStoreBox);
    expect(box).toBeDefined();
    expect(box?.box_name).toBe('C2PAManifestStoreBox');
    expect(box?.has_unparsed_data).toBeFalsy();
    expect(box?.manifest_store.length).toBeGreaterThan(0);
  });

  it('parses the C2PA emsg verifiable-segment-info box', async () => {
    const { mp4 } = await loadAndGetInfo('tests/data/c2pa/segment1_session_keys.m4s', true);
    const emsg = mp4.getBox('emsg');
    expect(emsg.scheme_id_uri).toBe('urn:c2pa:verifiable-segment-info');
    expect(emsg.message_data.length).toBeGreaterThan(0);
  });
});
