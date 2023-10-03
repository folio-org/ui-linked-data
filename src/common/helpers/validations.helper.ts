const MIN_SERIAL_NUMBER_CHARS = 6;
const MAX_LCCN_CHARS = 12;
const YEAR_INDEX = 4;

const combineLccnParts = (first: string, second = '') => {
  const secondLen = second?.length || 0;

  return first?.concat(
    secondLen < MIN_SERIAL_NUMBER_CHARS
      ? `${'0'.repeat(MIN_SERIAL_NUMBER_CHARS - secondLen)}${second}`
      : second,
  );
}

export const normalizeLccn = (lccn: string) => {
  const normalizeable = validateLccn(lccn, false);

  if (!normalizeable) return null;

  const [beforeHyphen, afterHyphen] = (normalizeable as string).split(/-(.*)/s);
  const afterHyphenLen = afterHyphen?.length || 0;
  const containsHyphen = afterHyphenLen > 0;

  let first = beforeHyphen;
  let second = afterHyphen;

  if (!containsHyphen) {
    first = beforeHyphen.slice(0, YEAR_INDEX);
    second = beforeHyphen.slice(YEAR_INDEX);
  }

  return combineLccnParts(first, second);
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
