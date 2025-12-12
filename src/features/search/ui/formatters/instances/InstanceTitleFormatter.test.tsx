import { render, screen, fireEvent } from '@testing-library/react';
import { InstanceTitleFormatter } from './InstanceTitleFormatter';
import { FullDisplayType } from '@/common/constants/uiElements.constants';
import type { Row } from '@/components/Table';

interface MockButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  'data-testid'?: string;
  ariaLabel?: string;
  type?: string;
  [key: string]: string | undefined | (() => void) | React.ReactNode;
}

jest.mock('@/components/Button', () => ({
  Button: (props: MockButtonProps) => {
    const { children, onClick, 'data-testid': testId, ariaLabel, type, ...restProps } = props;
    const handleClick = () => {
      if (onClick) onClick();
    };
    const buttonProps: Record<string, string | undefined | (() => void) | React.ReactNode> = {
      'data-testid': testId,
      onClick: handleClick,
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
    Link: 'link',
    Primary: 'primary',
  },
}));

describe('InstanceTitleFormatter', () => {
  const formatMessage = jest.fn((descriptor, values) => {
    if (descriptor.id === 'ld.aria.sections.openResourcePreview') {
      return `Open preview for ${values?.title}`;
    }

    return descriptor.id;
  });

  const onPreview = jest.fn();

  const mockRow: Row = {
    title: { label: 'Test Instance Title' },
    __meta: { id: '123', key: 'key-123' },
  };

  test('renders button with title text', () => {
    render(
      <InstanceTitleFormatter
        row={mockRow}
        formatMessage={formatMessage}
        onPreview={onPreview}
        selectedInstances={[]}
        previewContent={[]}
      />,
    );

    expect(screen.getByRole('button')).toHaveTextContent('Test Instance Title');
  });

  test('calls onPreview with correct id when button is clicked', () => {
    render(
      <InstanceTitleFormatter
        row={mockRow}
        formatMessage={formatMessage}
        onPreview={onPreview}
        selectedInstances={[]}
        previewContent={[]}
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(onPreview).toHaveBeenCalledTimes(1);
    expect(onPreview).toHaveBeenCalledWith('123');
  });

  test('displays comparison index when instance is selected', () => {
    render(
      <InstanceTitleFormatter
        row={mockRow}
        formatMessage={formatMessage}
        onPreview={onPreview}
        selectedInstances={['999', '123', '456']}
        previewContent={[{ id: '999' }, { id: '123' }]}
      />,
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('2')).toHaveClass('comparison-index');
  });

  test('does not display comparison index when instance is not selected', () => {
    render(
      <InstanceTitleFormatter
        row={mockRow}
        formatMessage={formatMessage}
        onPreview={onPreview}
        selectedInstances={['999', '456']}
        previewContent={[{ id: '999' }]}
      />,
    );

    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  test('displays comparison index when fullDisplayComponentType is Comparison', () => {
    render(
      <InstanceTitleFormatter
        row={mockRow}
        formatMessage={formatMessage}
        onPreview={onPreview}
        selectedInstances={['123']}
        previewContent={[{ id: '123' }]}
        fullDisplayComponentType={FullDisplayType.Comparison}
      />,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('does not display comparison index for single preview when not in comparison mode', () => {
    render(
      <InstanceTitleFormatter
        row={mockRow}
        formatMessage={formatMessage}
        onPreview={onPreview}
        selectedInstances={['123']}
        previewContent={[{ id: '123' }]}
      />,
    );

    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  test('renders with correct testid', () => {
    render(
      <InstanceTitleFormatter
        row={mockRow}
        formatMessage={formatMessage}
        onPreview={onPreview}
        selectedInstances={[]}
        previewContent={[]}
      />,
    );

    expect(screen.getByTestId('preview-button__123')).toBeInTheDocument();
  });
});
