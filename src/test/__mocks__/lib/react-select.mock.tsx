jest.mock('react-select', () => ({
  default: ({
    options,
    value,
    onChange,
  }: {
    options: ReactSelectOption[];
    value: ReactSelectOption;
    onChange: (value: ReactSelectOption, fieldId?: string, isDynamicField?: boolean) => void;
  }) => {
    function handleChange({ currentTarget: { value: targetValue } }: React.ChangeEvent<HTMLSelectElement>) {
      const option = options.find(({ value }: ReactSelectOption) => value === targetValue);
      if (!option) return;

      onChange(option);
    }

    return (
      <select data-testid="mock-select" value={value as unknown as string} onChange={handleChange}>
        {options.map(({ label, value, uri }: ReactSelectOption) => (
          <option key={value} value={value} data-uri={uri}>
            {label}
          </option>
        ))}
      </select>
    );
  },
}));
