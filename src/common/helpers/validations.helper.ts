const MIN_SN_CHARS = 6;

export const normalizeLccn = (lccn: string) => {
  const normalizeable = validateLccn(lccn, false);

  if (!normalizeable) return false;

  const [beforeHyphen, afterHyphen] = (normalizeable as string).split(/-(.*)/s);
  const afterHyphenLen = afterHyphen?.length || 0;

  return beforeHyphen.concat(
    afterHyphenLen || 0 < MIN_SN_CHARS
      ? `${'0'.repeat(MIN_SN_CHARS - afterHyphenLen)}${afterHyphen ?? ''}`
      : afterHyphen,
  );
};

export const validateLccn = (lccn: string, normalized = true) => {
  if (normalized) {
    return /^\d{10}|([a-z]{2}\d{10})$/gi.test(lccn);
  } else {
    // remove whitespace and split at first slash, throw the remainder away
    const preformatted = lccn.replaceAll(/\s+/g, '').split('/')[0];
    // test for optional 2-letter prefix, 4-digit year
    // and 0 to 6 digits with one or less hyphens in between
    // TODO: try to have a single regexp rule?
    const passes =
      /^([a-z]{0}|[a-z]{2})\d{4}([\d]*-?[\d]){0,6}$/gi.test(preformatted) &&
      preformatted.length < 12 &&
      (preformatted.match(/-/g) || []).length <= 1;

    return passes ? preformatted : passes;
  }
};
