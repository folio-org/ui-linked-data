export const RECORD_NORMALIZING_CASES = {
  'http://bibfra.me/vocab/marc/production': {
    processor: (record: RecordEntry) =>
      wrapWithContainer(
        record,
        'http://bibfra.me/vocab/marc/production',
        'https://bibfra.me/vocab/marc/provisionActivity',
      ),
  },
  'http://bibfra.me/vocab/marc/publication': {
    processor: (record: RecordEntry) =>
      wrapWithContainer(
        record,
        'http://bibfra.me/vocab/marc/publication',
        'https://bibfra.me/vocab/marc/provisionActivity',
      ),
  },
  'http://bibfra.me/vocab/marc/distribution': {
    processor: (record: RecordEntry) =>
      wrapWithContainer(
        record,
        'http://bibfra.me/vocab/marc/distribution',
        'https://bibfra.me/vocab/marc/provisionActivity',
      ),
  },
  'http://bibfra.me/vocab/marc/manufacture': {
    processor: (record: RecordEntry) =>
      wrapWithContainer(
        record,
        'http://bibfra.me/vocab/marc/manufacture',
        'https://bibfra.me/vocab/marc/provisionActivity',
      ),
  },
};

const wrapWithContainer = (record: any, key: string, container: string) => {
  if (!record[key]) return;

  record[key].forEach(recordEntry => {
    if (record[container]) {
      record[container] = [...record[container], { [key]: recordEntry }];
    } else {
      record[container] = [{ [key]: recordEntry }];
    }
  });

  delete record[key];
};

// TODO: add edge cases for:
// Instance: "Statement of Responsibility", "Mode of Issuance", "Extent", "Notes about the Instance"
// Work: "Primary Contributor", "Other contributors"
