import { CSSObjectWithLabel, GroupBase, OptionProps } from 'react-select';

export const SimpleLookupFieldStyles = {
  container: (base: CSSObjectWithLabel, state: OptionProps<unknown, boolean, GroupBase<unknown>>) => ({
    ...base,
    width: '100%',
    backgroundColor: state.isDisabled ? '#ebebe4' : 'transparent',
  }),
  control: (base: CSSObjectWithLabel) => ({
    ...base,
    minHeight: '1.5rem',
    border: '1px solid rgba(0, 0, 0, 0.42)',
    borderRadius: 0,
  }),
  placeholder: (base: CSSObjectWithLabel) => ({
    ...base,
    paddingLeft: '7px',
  }),
  valueContainer: (base: CSSObjectWithLabel) => ({
    ...base,
    display: 'flex',
    alignItems: 'center',
    padding: '0',
    lineHeight: 'auto',
  }),
  multiValue: (base: CSSObjectWithLabel) => ({
    ...base,
    alignItems: 'center',
    margin: '1px 2px',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    borderRadius: 0,
    backgroundColor: '#efefef',
  }),
  multiValueLabel: (base: CSSObjectWithLabel) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
    lineHeight: '1.125rem',
  }),
  multiValueRemove: (base: CSSObjectWithLabel) => ({
    ...base,
    padding: '0.25rem',
    borderRadius: 0,
  }),
  indicatorSeparator: (base: CSSObjectWithLabel) => ({
    ...base,
    width: 0,
  }),
  clearIndicator: (base: CSSObjectWithLabel) => ({
    ...base,
    padding: 0,
  }),
  dropdownIndicator: (base: CSSObjectWithLabel) => ({
    ...base,
    padding: '0 0.5rem',
  }),
  input: (base: CSSObjectWithLabel) => ({
    ...base,
    display: 'flex',
    gridArea: 'auto',
    width: 0,
    margin: 0,
    padding: 0,
  }),
  indicatorsContainer: (base: CSSObjectWithLabel) => ({
    ...base,
    padding: 0,
  }),
  menu: (base: CSSObjectWithLabel) => ({
    ...base,
    border: '1px solid #ccc',
    borderRadius: 0,
    boxShadow: '0 4px 32px rgba(0, 0, 0, 0.3)',
  }),
  option: (base: CSSObjectWithLabel, state: OptionProps<unknown, boolean, GroupBase<unknown>>) => ({
    ...base,
    backgroundColor: state.isFocused ? 'rgba(37, 118, 195, 0.2)' : 'transparent',
  }),
};
