import fs from 'fs';
import { detectC2pa } from '../demo/c2pa/detect.js';
import { buildC2paViewModel } from '../demo/c2pa/c2pa.js';
import { loadAndGetInfo } from './common';

beforeAll(async () => {
  (globalThis as { C2PA?: unknown }).C2PA = await import('@svta/cml-c2pa');
});

async function modelFor(name: string) {
  const path = `tests/data/c2pa/${name}`;
  const { mp4 } = await loadAndGetInfo(path, true);
  const bytes = new Uint8Array(fs.readFileSync(path));
  const detection = detectC2pa(mp4);
  return { detection, model: await buildC2paViewModel(detection, bytes) };
}

describe('buildC2paViewModel', () => {
  it('maps init segments to a manifest model with assertions and issuer', async () => {
    for (const name of ['init_session_keys.m4s', 'init_manifest_box.m4s']) {
      const { model } = await modelFor(name);
      expect(model?.type).toBe('manifest');
      expect(model?.manifest.label).toBeTruthy();
      expect(model?.manifest.assertions.length).toBeGreaterThanOrEqual(1);
      expect(model?.manifest.signatureInfo.issuer).toBeTruthy();
    }
  });

  it('maps a manifest-box media segment to a manifest model', async () => {
    const { model } = await modelFor('segment1_manifest_box.m4s');
    expect(model?.type).toBe('manifest');
    expect(model?.manifest).toBeTruthy();
  });

  it('maps a VSI media segment to a vsi model', async () => {
    const { model } = await modelFor('segment1_session_keys.m4s');
    expect(model?.type).toBe('vsi');
    expect(model?.manifestId).toBeTruthy();
    expect(model?.bmffHashHex).toBeTruthy();
  });

  it('returns none/null for unsigned files', async () => {
    for (const name of ['init_unsigned.m4s', 'segment1_unsigned.m4s', 'segment2_unsigned.m4s']) {
      const { detection, model } = await modelFor(name);
      expect(detection.kind).toBe('none');
      expect(model).toBeNull();
    }
  });
});
