// Guards the demo's hardcoded C2PA UUID list against drift.
//
// @svta/cml-c2pa@1.0.1 keeps these values internal (only the three validators are
// exported), so there is nothing to assert against. Instead we assert the demo's
// C2PA_UUIDS stays in sync with the boxes registered in src/. The library tie is
// documented, not tested: its internal isC2paUuid() matches C2PA_MANIFEST_UUID
// (…10ea) and JUMBF_UUID (…c481). Re-verify both values if @svta/cml-c2pa is upgraded.
import { C2PA_UUIDS } from '../demo/c2pa/constants.js';
import { C2PAAlternateManifestStoreBox, C2PAManifestStoreBox } from '../src/boxes/uuid';

describe('C2PA UUID constants', () => {
  const registeredUuids = [C2PAManifestStoreBox.uuid, C2PAAlternateManifestStoreBox.uuid];

  it('C2PA_UUIDS stays in sync with the registered C2PA boxes', () => {
    expect([...C2PA_UUIDS].sort()).toEqual([...registeredUuids].sort());
  });

  it('every C2PA UUID is a 32-char lowercase hex string', () => {
    for (const uuid of C2PA_UUIDS) {
      expect(uuid).toMatch(/^[0-9a-f]{32}$/);
    }
  });
});
