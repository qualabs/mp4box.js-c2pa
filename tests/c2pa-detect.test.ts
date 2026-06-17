import { detectC2pa } from '../demo/c2pa/detect.js';
import { loadAndGetInfo } from './common';

async function detectFixture(name: string) {
  const { mp4 } = await loadAndGetInfo(`tests/data/c2pa/${name}`, true);
  return detectC2pa(mp4).kind;
}

describe('detectC2pa', () => {
  it("returns 'init' for init segments carrying the C2PA uuid box", async () => {
    expect(await detectFixture('init_session_keys.m4s')).toBe('init');
    expect(await detectFixture('init_manifest_box.m4s')).toBe('init');
  });

  it("returns 'vsi' for media segments with the verifiable-segment-info emsg", async () => {
    expect(await detectFixture('segment1_session_keys.m4s')).toBe('vsi');
  });

  it("returns 'manifestbox' for media segments embedding a manifest box", async () => {
    expect(await detectFixture('segment1_manifest_box.m4s')).toBe('manifestbox');
  });

  it("returns 'none' for unsigned files", async () => {
    expect(await detectFixture('init_unsigned.m4s')).toBe('none');
    expect(await detectFixture('segment1_unsigned.m4s')).toBe('none');
    expect(await detectFixture('segment2_unsigned.m4s')).toBe('none');
  });

  it('does not throw on empty input', () => {
    expect(detectC2pa(undefined).kind).toBe('none');
    expect(detectC2pa({ boxes: [] }).kind).toBe('none');
  });

  it('detects the alternate C2PA uuid (instance and registered paths)', () => {
    const viaInstance = {
      boxes: [{ type: 'uuid', uuid: 'd8fec3d61a964f32a0f6f3ecf96c10ea' }, { type: 'moov' }],
    };
    expect(detectC2pa(viaInstance).kind).toBe('init');

    class FakeRegistered {
      static uuid = 'd8fec3d61a964f32a0f6f3ecf96c10ea';
      type = 'uuid';
    }
    const viaStatic = { boxes: [new FakeRegistered(), { type: 'moof' }] };
    expect(detectC2pa(viaStatic).kind).toBe('manifestbox');
  });
});
