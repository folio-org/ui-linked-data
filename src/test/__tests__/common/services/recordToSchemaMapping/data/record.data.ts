export const record = {
  block_1: {
    uriBFLite_literal_1: ['literal value 1', 'literal value 2'],
    uriBFLite_simple_1: [
      {
        label: ['test simple lookup value 1'],
        link: ['test_link'],
      },
    ],
    uriBFLite_group_1: [
      {
        uriBFLite_option_1: {
          uriBFLite_option_literal_1: ['literal value 3'],
        },
      },
    ],
  },
};

export const recordWithRepeatableSubcomponents = {
  block_1: {
    uriBFLite_literal_1: ['literal value 1'],
    uriBFLite_simple_1: [
      {
        label: ['test simple lookup value 1'],
        link: ['test_link'],
      },
    ],
    uriBFLite_group_1: [
      {
        uriBFLite_option_1: {
          uriBFLite_option_literal_1: ['literal value 2', 'literal value 3', 'literal value 4'],
        },
      },
    ],
  },
};

export const mockInstanceTemplateMetadata = [
  {
    path: ['block_1', 'uriBFLite_literal_1'],
    template: {
      prefix: 'mockPrefix',
    },
  },
  {
    path: ['uriBFLite_option_literal_1'],
    template: {
      prefix: 'unreachableMockPrefix',
    },
  },
];
