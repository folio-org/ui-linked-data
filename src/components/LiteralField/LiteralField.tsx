import { ChangeEvent, FC, useState } from 'react';
import { Input } from '../Input';

interface Props {
  displayName: string;
  uuid: string;
  value?: string;
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
}

export const LiteralField: FC<Props> = ({ displayName, uuid, value = '', onChange }) => {
  const [localValue, setLocalValue] = useState(value);

  const handleOnChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setLocalValue(value);

    onChange(uuid, [{ label: value }]);
  };

  return (
    <div id={uuid}>
      <div>{displayName}</div>
      <Input placeholder={displayName} onChange={handleOnChange} value={localValue} />
    </div>
  );
};
