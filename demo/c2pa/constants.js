// demo/c2pa/constants.js — shared C2PA identifiers for the demo's C2PA code.
// Both UUIDs are accepted by @svta/cml-c2pa's internal isC2paUuid(); the package does not
// export them, so they are mirrored here. Update these if cml-c2pa adds or changes identifiers.
export const C2PA_UUIDS = [
  'd8fec3d61b0e483c92975828877ec481', // JUMBF / Manifest Store (C2PA spec BMFF embedding)
  'd8fec3d61a964f32a0f6f3ecf96c10ea', // alternate C2PA manifest UUID recognized by cml-c2pa
];

export const VSI_SCHEME = 'urn:c2pa:verifiable-segment-info';
