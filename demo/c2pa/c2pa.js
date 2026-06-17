// demo/c2pa/c2pa.js — maps a detection result + file bytes to a render-ready C2PA view model.
// Display only: isValid/errorCodes are ignored here (surfaced in a later milestone).
// Reads the C2PA validators from the global exposed by c2pa.engine.iife.js (browser) or
// injected as globalThis.C2PA in tests.

// returns a view model or null
export async function buildC2paViewModel(detection, bytes) {
  switch (detection.kind) {
    case 'init': {
      const v = await globalThis.C2PA.validateC2paInitSegment(bytes);
      if (!v.manifest) return null;
      return {
        type: 'manifest',
        manifest: v.manifest, // { label, instanceId, claimGenerator, signatureInfo, assertions }
        manifestId: v.manifestId,
        hasCertificate: !!v.certificate,
      };
    }
    case 'manifestbox': {
      const out = await globalThis.C2PA.validateC2paManifestBoxSegment(bytes, null);
      if (!out.result.manifest) return null;
      return {
        type: 'manifest',
        manifest: out.result.manifest,
        manifestId: out.result.manifest.label,
        streamId: out.result.streamId,
        sequenceNumber: out.result.sequenceNumber,
      };
    }
    case 'vsi': {
      const seg = await globalThis.C2PA.validateC2paSegment(bytes, []); // no session keys -> display only
      if (!seg) return null;
      const r = seg.result;
      return {
        type: 'vsi',
        sequenceNumber: r.sequenceNumber,
        manifestId: r.manifestId,
        bmffHashHex: r.bmffHashHex,
        kidHex: r.kidHex,
      };
    }
    default:
      return null;
  }
}

if (typeof window !== 'undefined') {
  window.buildC2paViewModel = buildC2paViewModel;
}
