import { createFile, MP4BoxBuffer } from '../entries/all';
import { C2PAAlternateManifestStoreBox, C2PAManifestStoreBox } from '../src/boxes/uuid';
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

  it('recognizes the alternate C2PA uuid manifest-store box', () => {
    const payload = [1, 2, 3, 4];
    const size = 8 + 16 + payload.length;
    const bytes = new Uint8Array(size);
    new DataView(bytes.buffer).setUint32(0, size);
    bytes.set([0x75, 0x75, 0x69, 0x64], 4); // 'uuid'
    bytes.set(
      [216, 254, 195, 214, 26, 150, 79, 50, 160, 246, 243, 236, 249, 108, 16, 234], // alt UUID
      8,
    );
    bytes.set(payload, 24);

    const mp4 = createFile();
    mp4.appendBuffer(MP4BoxBuffer.fromArrayBuffer(bytes.buffer, 0), true);
    mp4.flush();

    const box = mp4.boxes.find(b => b instanceof C2PAAlternateManifestStoreBox);
    expect(box).toBeDefined();
    expect(box?.box_name).toBe('C2PAAlternateManifestStoreBox');
    expect(box?.has_unparsed_data).toBeFalsy();
    expect(Array.from(box?.manifest_store ?? [])).toEqual(payload);
  });
});
