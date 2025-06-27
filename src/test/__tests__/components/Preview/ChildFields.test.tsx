import { render } from '@testing-library/react';
import React from 'react';
import { ChildFields } from '@components/Preview/ChildFields';
import { checkShouldGroupWrap } from '@common/helpers/preview.helper';
import { ChildFieldsProps } from '@components/Preview/preview.types';

jest.mock('@common/helpers/preview.helper', () => ({
  checkShouldGroupWrap: jest.fn(),
}));

jest.mock('@components/Preview/preview.wrappers', () => ({
  getValueGroupWrapper: jest.fn(() => (children: React.ReactNode) => children),
}));

const mockSchema = new Map();
mockSchema.set('uuid_1', {
  type: 'literal',
  value: 'test',
});
mockSchema.set('uuid_2', {
  type: 'simple',
  value: 123,
});

const defaultProps = {
  schema: mockSchema,
  entryChildren: ['uuid_1', 'uuid_2'],
  level: 0,
  paths: ['path_1', 'path_2'],
  altSchema: new Map(),
  altUserValues: {},
  altSelectedEntries: ['entry_1'],
  altDisplayNames: { name_1: 'Display_1' },
  hideEntities: true,
  forceRenderAllTopLevelEntities: true,
  isGroupable: false,
  isGroup: false,
  renderField: jest.fn(props => <div {...props} />),
} as unknown as ChildFieldsProps;

describe('ChildFields', () => {
  beforeEach(() => {
    (checkShouldGroupWrap as jest.Mock).mockReturnValue(false);
  });

  it('renders nothing when no entryChildren provided', () => {
    const { container } = render(<ChildFields {...defaultProps} entryChildren={undefined} />);

    expect(container.firstChild).toBeNull();
  });

  it('does not apply grouping when isGroupable is true', () => {
    render(<ChildFields {...defaultProps} isGroupable={true} />);

    expect(checkShouldGroupWrap).not.toHaveBeenCalled();
  });
});
