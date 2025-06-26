import { render } from '@testing-library/react';
import React from 'react';
import { ChildFields } from '@components/Preview/ChildFields';
import { checkShouldGroupWrap } from '@common/helpers/preview.helper';
import { Fields } from '@components/Preview/Fields';

jest.mock('@common/helpers/preview.helper', () => ({
  checkShouldGroupWrap: jest.fn(),
}));

jest.mock('@components/Preview/Fields', () => ({
  Fields: jest.fn(() => null),
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
};

describe('ChildFields', () => {
  beforeEach(() => {
    (checkShouldGroupWrap as jest.Mock).mockReturnValue(false);
  });

  it('renders nothing when no entryChildren provided', () => {
    const { container } = render(<ChildFields {...defaultProps} entryChildren={undefined} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders Fields components for each child', () => {
    render(<ChildFields {...defaultProps} />);

    expect(Fields).toHaveBeenCalledTimes(2);
    expect(Fields).toHaveBeenCalledWith(
      expect.objectContaining({
        uuid: 'uuid_1',
        base: mockSchema,
        level: 1,
        paths: ['path_1', 'path_2'],
      }),
      expect.any(Object),
    );
    expect(Fields).toHaveBeenCalledWith(
      expect.objectContaining({
        uuid: 'uuid_2',
        base: mockSchema,
        level: 1,
        paths: ['path_1', 'path_2'],
      }),
      expect.any(Object),
    );
  });

  it('passes alternate props correctly', () => {
    const altProps = {
      altSchema: new Map(),
      altUserValues: {},
      altSelectedEntries: ['entry_1'],
      altDisplayNames: { name_1: 'Display_1' },
      hideEntities: true,
      forceRenderAllTopLevelEntities: true,
    };

    render(<ChildFields {...defaultProps} {...altProps} />);

    expect(Fields).toHaveBeenCalledWith(
      expect.objectContaining({
        ...altProps,
      }),
      expect.any(Object),
    );
  });

  it('does not apply grouping when isGroupable is true', () => {
    render(<ChildFields {...defaultProps} isGroupable={true} />);

    expect(checkShouldGroupWrap).not.toHaveBeenCalled();
  });
});
