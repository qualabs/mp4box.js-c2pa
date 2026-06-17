// demo/c2pa/detect.js — detects C2PA presence and carrier method in a parsed mp4box.js box tree
import { C2PA_UUIDS, VSI_SCHEME } from './constants.js';

function eachBox(boxes, fn) {
  if (!boxes) return;
  for (var i = 0; i < boxes.length; i++) {
    fn(boxes[i]);
    eachBox(boxes[i].boxes, fn);
  }
}

function getBoxUuid(box) {
  // Registered uuid boxes carry the uuid on the class (static); unknown ones on the instance.
  return box.uuid || (box.constructor && box.constructor.uuid);
}

// returns { kind: 'init' | 'manifestbox' | 'vsi' | 'none' }
export function detectC2pa(mp4boxfile) {
  var hasUuid = false;
  var hasVsi = false;
  var hasMoov = false;
  var hasMoof = false;
  eachBox(mp4boxfile && mp4boxfile.boxes, function (box) {
    if (box.type === 'uuid' && C2PA_UUIDS.includes(getBoxUuid(box))) hasUuid = true;
    if (box.type === 'emsg' && box.scheme_id_uri === VSI_SCHEME) hasVsi = true;
    if (box.type === 'moov') hasMoov = true;
    if (box.type === 'moof') hasMoof = true;
  });
  if (hasVsi) return { kind: 'vsi' };
  if (hasUuid) return { kind: hasMoof && !hasMoov ? 'manifestbox' : 'init' };
  return { kind: 'none' };
}

if (typeof window !== 'undefined') {
  window.detectC2pa = detectC2pa;
}
