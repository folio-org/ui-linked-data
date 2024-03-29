import { fireEvent, render } from '@testing-library/react';
import { DropdownItemType } from '@common/constants/uiElements.constants';
import { Dropdown } from '@components/Dropdown';

describe('Dropdown', () => {
  const labelId = 'test-label';
  const items: DropdownItems = [];

  it('renders Dropdown component correctly', () => {
    const { getByText } = render(<Dropdown labelId={labelId} items={items} />);

    expect(getByText(labelId)).toBeInTheDocument();
  });

  it('expands and collapses Dropdown on click', () => {
    const { container, getByText, getByRole } = render(<Dropdown labelId={labelId} items={items} />);

    const options = container.querySelector('.dropdown-options');
    const button = getByRole('button');

    expect(getByText(labelId)).toBeInTheDocument();

    fireEvent.click(button);
    expect(options).toHaveClass('expanded');

    fireEvent.click(button);
    expect(options).toHaveClass('collapsed');
  });

  it('handles keyboard navigation within dropdown options', () => {
    const items: DropdownItems = [
      {
        id: 'group1',
        labelId: 'group1-label',
        data: [
          {
            id: 'testItem_1',
            type: DropdownItemType.basic,
            labelId: 'testItem_1_label',
          },
          {
            id: 'testItem_2',
            type: DropdownItemType.basic,
            labelId: 'testItem_2_label',
          },
        ],
      },
    ];

    const { getByRole } = render(<Dropdown labelId={labelId} items={items} />);

    fireEvent.keyDown(getByRole('button'), { key: 'ArrowDown' });
    expect(getByRole('menuitem', { name: 'testItem_1_label' })).toHaveFocus();

    fireEvent.keyDown(getByRole('menuitem', { name: 'testItem_1_label' }), { key: 'ArrowDown' });
    expect(getByRole('menuitem', { name: 'testItem_2_label' })).toHaveFocus();

    fireEvent.keyDown(getByRole('menuitem', { name: 'testItem_2_label' }), { key: 'ArrowUp' });
    expect(getByRole('menuitem', { name: 'testItem_1_label' })).toHaveFocus();
  });

  it('renders basic and custom component dropdown items', () => {
    const labelId = 'test-label';
    const items: DropdownItems = [
      {
        id: 'group_1',
        labelId: 'groupLabel',
        data: [
          {
            id: 'testItem_1',
            type: DropdownItemType.basic,
            labelId: 'item.label',
            action: jest.fn(),
          },
          {
            id: 'testItem_2',
            type: DropdownItemType.customComponent,
            renderComponent: (key: string | number) => <div key={key}>Custom Component</div>,
          },
        ],
      },
    ];

    const { getByText } = render(<Dropdown labelId={labelId} items={items} />);

    expect(getByText('item.label')).toBeInTheDocument();
    expect(getByText('Custom Component')).toBeInTheDocument();
  });
});
