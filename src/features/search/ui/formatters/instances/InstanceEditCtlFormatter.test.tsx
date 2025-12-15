import { render, screen, fireEvent } from '@testing-library/react';
import { InstanceEditCtlFormatter } from './InstanceEditCtlFormatter';
import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import type { Row } from '@/components/Table';

jest.mock('@/common/helpers/navigation.helper', () => ({
  generateEditResourceUrl: jest.fn((id: string) => `/edit/${id}`),
}));

interface MockButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  'data-testid'?: string;
  ariaLabel?: string;
  className?: string;
  type?: string;
  [key: string]: string | undefined | (() => void) | React.ReactNode;
}

jest.mock('@/components/Button', () => ({
  Button: (props: MockButtonProps) => {
    const { children, onClick, 'data-testid': testId, ariaLabel, className, type, ...restProps } = props;
    const handleClick = () => {
      if (onClick) onClick();
    };
    const buttonProps: Record<string, string | undefined | (() => void) | React.ReactNode> = {
      'data-testid': testId,
      onClick: handleClick,
      className,
      'data-type': type,
    };

    if (Object.keys(restProps).length > 0) {
      Object.assign(buttonProps, restProps);
    }

    if (ariaLabel) {
      buttonProps['aria-label'] = ariaLabel;
    }

    return <button {...buttonProps}>{children}</button>;
  },
  ButtonType: {
    Primary: 'primary',
  },
}));

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id }: { id: string }) => <span>{id}</span>,
}));

describe('InstanceEditCtlFormatter', () => {
  const formatMessage = jest.fn((descriptor, values) => {
    if (descriptor.id === 'ld.aria.sections.editInstance') {
      return `Edit instance ${values?.title}`;
    }

    return descriptor.id;
  });

  const onEdit = jest.fn();

  const mockRow: Row = {
    title: { label: 'Test Instance Title' },
    __meta: { id: '123', key: 'key-123' },
  };

  beforeEach(() => {
    (generateEditResourceUrl as jest.Mock).mockImplementation((id: string) => `/edit/${id}`);
  });

  test('renders button with formatted message', () => {
    render(<InstanceEditCtlFormatter row={mockRow} formatMessage={formatMessage} onEdit={onEdit} />);

    expect(screen.getByRole('button')).toHaveTextContent('ld.editInstance');
  });

  test('calls onEdit with correct URL when button is clicked', () => {
    render(<InstanceEditCtlFormatter row={mockRow} formatMessage={formatMessage} onEdit={onEdit} />);

    fireEvent.click(screen.getByRole('button'));

    expect(generateEditResourceUrl).toHaveBeenCalledWith('123');
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith('/edit/123');
  });

  test('applies correct CSS classes to button', () => {
    render(<InstanceEditCtlFormatter row={mockRow} formatMessage={formatMessage} onEdit={onEdit} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('button-nowrap');
    expect(button).toHaveClass('button-capitalize');
  });

  test('renders with correct testid', () => {
    render(<InstanceEditCtlFormatter row={mockRow} formatMessage={formatMessage} onEdit={onEdit} />);

    expect(screen.getByTestId('edit-button__123')).toBeInTheDocument();
  });

  test('uses ButtonType.Primary', () => {
    render(<InstanceEditCtlFormatter row={mockRow} formatMessage={formatMessage} onEdit={onEdit} />);

    expect(screen.getByRole('button')).toHaveAttribute('data-type', 'primary');
  });
});
