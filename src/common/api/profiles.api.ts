export const fetchProfiles = async () => {
  return await (
    await fetch('https://raw.githubusercontent.com/lcnetdev/bfe-profiles/main/profile-prod/data.json')
  ).json();
};

export const fetchStartingPoints = async () => {
  return await (
    await fetch('https://raw.githubusercontent.com/lcnetdev/bfe-profiles/main/starting-prod/data.json')
  ).json();
};

export const fetchUserInputScheme = async () => {
  // TODO: Make a request to the backend
  return await Promise.resolve({
    'http://id.loc.gov/ontologies/bibframe/Work': {
      'http://id.loc.gov/ontologies/bibframe/contribution': [
        {
          'http://id.loc.gov/ontologies/bflc/PrimaryContribution': {
            'http://id.loc.gov/ontologies/bibframe/agent': [
              {
                id: 'lc:RT:bf2:Agent:bfPerson',
                uri: 'http://id.loc.gov/ontologies/bibframe/Person',
                label: 'Person',
              },
            ],
            'http://id.loc.gov/ontologies/bibframe/role': [
              {
                id: null,
                uri: '',
                label: '',
              },
            ],
          },
        },
      ],
      'http://id.loc.gov/ontologies/bibframe/title': [
        {
          id: 'lc:RT:bf2:WorkTitle',
          uri: 'http://id.loc.gov/ontologies/bibframe/Title',
          label: 'Work Title',
        },
      ],
      'http://id.loc.gov/ontologies/bflc/governmentPubType': [
        {
          id: null,
          uri: 'https://id.loc.gov/vocabulary/mgovtpubtype/a',
          label: 'Autonomous',
        },
        {
          id: null,
          uri: 'https://id.loc.gov/vocabulary/mgovtpubtype/m.html',
          label: 'Multistate',
        },
        {
          id: null,
          uri: null,
          label: 'created(uncontrolled)',
        },
      ],
      'http://id.loc.gov/ontologies/bibframe/originDate': [
        {
          id: null,
          uri: null,
          label: 'test',
        },
      ],
      'http://id.loc.gov/ontologies/bibframe/temporalCoverage': [
        {
          id: null,
          uri: null,
          label: 'val',
        },
      ],
    },
  });
};
