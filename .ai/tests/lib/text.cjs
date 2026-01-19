function assertIncludes(haystack, needle, message) {
  if (!String(haystack).includes(String(needle))) {
    throw new Error(message || `Expected output to include: ${needle}`);
  }
}

function assertNotIncludes(haystack, needle, message) {
  if (String(haystack).includes(String(needle))) {
    throw new Error(message || `Expected output to NOT include: ${needle}`);
  }
}

module.exports = { assertIncludes, assertNotIncludes };
