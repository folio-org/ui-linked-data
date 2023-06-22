import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Input } from '../Input/Input';

interface Props {
  label: string;
  id: string;
  value?: RenderedFieldValue;
  onChange: (value: RenderedFieldValue, fieldId: string) => void;
}

export const ComplexLookupField: FC<Props> = ({ label, id, value = undefined, onChange }) => {
  const [localValue, setLocalValue] = useState<RenderedFieldValue | undefined>(value);

  // TODO: should open a modal with current input value and search data using it
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = {
      id: null,
      label: event.target.value,
      uri: null,
    };

    setLocalValue(newValue);
  };

  useEffect(() => {
    // ToDo: workaround for setting a default value and should be re-written.
    if (value) onChange(value, id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>{label}</div>
      <Input placeholder={label} onChange={handleOnChange} value={localValue?.label ?? ''} />
    </div>
  );
};
