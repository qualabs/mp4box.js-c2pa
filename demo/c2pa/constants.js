// demo/c2pa/constants.js — shared C2PA identifiers for the demo's C2PA code.
//
// Source: @svta/cml-c2pa@1.0.1. The package exports only the three validators; the UUID
// values are internal — its isC2paUuid() matches JUMBF_UUID (…c481) and C2PA_MANIFEST_UUID
// (…10ea) — so there is nothing to import and they are mirrored here.
// RE-VERIFY ON UPGRADE: a version bump is the one thing that can silently invalidate these.
// On any @svta/cml-c2pa upgrade, re-check isC2paUuid()/JUMBF_UUID/C2PA_MANIFEST_UUID against
// this list. The drift test in tests/c2pa-constants.test.ts keeps C2PA_UUIDS in sync with the
// registered boxes in src/, but it cannot catch a change inside the (unexported) library.
export const C2PA_UUIDS = [
  'd8fec3d61b0e483c92975828877ec481', // JUMBF_UUID — JUMBF / Manifest Store (C2PA spec BMFF embedding)
  'd8fec3d61a964f32a0f6f3ecf96c10ea', // C2PA_MANIFEST_UUID — alternate C2PA manifest UUID recognized by cml-c2pa
];

export const VSI_SCHEME = 'urn:c2pa:verifiable-segment-info';
