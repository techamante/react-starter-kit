import URLSafeBase64 from 'urlsafe-base64';

import uuid from 'uuid';

export function URLSafeUUID() {
  return URLSafeBase64.encode(uuid.v4(null, new Buffer(16)));
}

/**
 * Access nested JavaScript objects with string key
 * http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
 *
 * @param {object} obj The base object you want to get a reference to
 * @param {string} str The string addressing the part of the object you want
 * @return {object|undefined} a reference to the requested key or undefined if not found
 */

export function getObjectRef(obj, str) {
  let tempObj = obj;
  let tempstr = str.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  tempstr = tempstr.replace(/^\./, ''); // strip a leading dot
  const pList = tempstr.split('.');
  while (pList.length) {
    const n = pList.shift();
    if (n in tempObj) {
      tempObj = tempObj[n];
    } else {
      return;
    }
  }
  return tempObj;
}
