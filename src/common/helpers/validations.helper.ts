const MIN_SERIAL_NUMBER_CHARS = 6;

const combineLccnParts = (first: string, second = '') => {
  const secondLen = second.length;

  if (first.length >= MIN_SERIAL_NUMBER_CHARS) return first;

  return first?.concat(
    secondLen < MIN_SERIAL_NUMBER_CHARS ? `${'0'.repeat(MIN_SERIAL_NUMBER_CHARS - secondLen)}${second}` : second,
  );
};

export const normalizeLccn = (lccn: string) => {
  const normalizeable = validateNonNormalizedLccn(lccn);

  if (!normalizeable) return null;

  const [prefix, suffix] = normalizeable.split(/-(.*)/s);

  return combineLccnParts(prefix, suffix);
};

export const validateNormalizedLccn = (lccn: string) => {
  // test for optional 2-letter prefix followed by 10 digits
  const regexForNormalizedLccn = /^(\d{10}|[a-z]{2}\d{10})$/gi;

  return regexForNormalizedLccn.test(lccn);
};

export const validateNonNormalizedLccn = (lccn: string) => {
  // test for optional 2-letter prefix, then 4-digit (year),
  // then and 0 to 6 digits with one or less hyphens in between
  const regexForNonNormalizedLccn = /^\d{4}(\d{6}|-\d{1,6})$/g;

  const preformatted = lccn.replaceAll(/\s+/g, '').split('/')[0];

  // Refactor: try to have a single regexp rule?
  const passes = regexForNonNormalizedLccn.test(preformatted);

  // if passes, return string with only digits and letters in it
  return passes ? preformatted : passes;
};
