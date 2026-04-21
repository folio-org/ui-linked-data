import { fireEvent, render, screen } from '@testing-library/react';

import { DateRange } from '@/components/DateRange';

describe('DateRange Component', () => {
  it('renders without crashing', () => {
    render(<DateRange facet="testFacet" onSubmit={jest.fn()} />);

    expect(screen.getByTestId('testFacet-start')).toBeInTheDocument();
    expect(screen.getByTestId('testFacet-end')).toBeInTheDocument();
    expect(screen.getByTestId('testFacet-apply')).toBeInTheDocument();
  });

  it('has initial empty dateStart and dateEnd', () => {
    render(<DateRange facet="testFacet" onSubmit={jest.fn()} />);

    const startDate: HTMLInputElement = screen.getByTestId('testFacet-start');
    const endDate: HTMLInputElement = screen.getByTestId('testFacet-end');

    expect(startDate.value).toBe('');
    expect(endDate.value).toBe('');
  });

  it('updates dateStart and dateEnd on change', () => {
    render(<DateRange facet="testFacet" onSubmit={jest.fn()} />);

    const startDate: HTMLInputElement = screen.getByTestId('testFacet-start');
    const endDate: HTMLInputElement = screen.getByTestId('testFacet-end');

    fireEvent.change(startDate, { target: { value: '2024-01-01' } });
    fireEvent.change(endDate, { target: { value: '2024-01-31' } });

    expect(startDate.value).toBe('2024-01-01');
    expect(endDate.value).toBe('2024-01-31');
  });

  it('calls onSubmit with correct values when apply button is clicked', () => {
    const mockSubmit = jest.fn();
    render(<DateRange facet="testFacet" onSubmit={mockSubmit} />);

    const startDate: HTMLInputElement = screen.getByTestId('testFacet-start');
    const endDate: HTMLInputElement = screen.getByTestId('testFacet-end');
    const applyButton = screen.getByTestId('testFacet-apply');

    fireEvent.change(startDate, { target: { value: '2024-01-01' } });
    fireEvent.change(endDate, { target: { value: '2024-01-31' } });
    fireEvent.click(applyButton);

    expect(mockSubmit).toHaveBeenCalledWith('testFacet', {
      dateStart: '2024-01-01',
      dateEnd: '2024-01-31',
    });
  });

  it('does not call onSubmit if facet is not provided', () => {
    const mockSubmit = jest.fn();
    render(<DateRange onSubmit={mockSubmit} />);

    const applyButton = screen.getByTestId('undefined-apply');

    fireEvent.click(applyButton);

    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
