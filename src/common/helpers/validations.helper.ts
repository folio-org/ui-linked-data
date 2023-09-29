const MIN_SERIAL_NUMBER_CHARS = 6;
const MAX_LCCN_CHARS = 12;

export const normalizeLccn = (lccn: string) => {
  const normalizeable = validateLccn(lccn, false);

  if (!normalizeable) return null;

  const [beforeHyphen, afterHyphen] = (normalizeable as string).split(/-(.*)/s);
  const afterHyphenLen = afterHyphen?.length || 0;

  return beforeHyphen.concat(
    afterHyphenLen || 0 < MIN_SERIAL_NUMBER_CHARS
      ? `${'0'.repeat(MIN_SERIAL_NUMBER_CHARS - afterHyphenLen)}${afterHyphen ?? ''}`
      : afterHyphen,
  );
};

export const validateLccn = (lccn: string, normalized = true) => {
  if (normalized) {
    // test for optional 2-letter prefix followed by 10 digits
    const regexForNormalizedLccn = /^\d{10}|([a-z]{2}\d{10})$/gi;
    return regexForNormalizedLccn.test(lccn);
  } else {
    // test for optional 2-letter prefix, then 4-digit (year),
    // then and 0 to 6 digits with one or less hyphens in between
    const regexForNonNormalizedLccn = /^([a-z]{0}|[a-z]{2})\d{4}([\d]*-?[\d]){0,6}$/gi;

    const preformatted = lccn.replaceAll(/\s+/g, '').split('/')[0];
    
    // TODO: try to have a single regexp rule?
    const passes =
      regexForNonNormalizedLccn.test(preformatted) &&
      preformatted.length < MAX_LCCN_CHARS &&
      (preformatted.match(/-/g) || []).length <= 1;

    return passes ? preformatted : passes;
  }
};
