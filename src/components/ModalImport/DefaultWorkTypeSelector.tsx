import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { WORK_TYPES } from '@/common/constants/bibframe.constants';
import { Select, SelectValue } from '@/components/Select';

type DefaultWorkTypeSelectorProps = {
  defaultWorkType: string;
  setDefaultWorkType: (workType: string) => void;
};

const WORK_TYPE_OPTIONS = WORK_TYPES.map(workType => {
  return {
    label: workType.label,
    value: workType.uri,
    isDisabled: false,
  };
});

export const DefaultWorkTypeSelector: FC<DefaultWorkTypeSelectorProps> = ({ defaultWorkType, setDefaultWorkType }) => {
  const handleWorkTypeChange = ({ value }: SelectValue) => {
    setDefaultWorkType(value);
  };

  return (
    <>
      <label id="default-work-type-label" htmlFor="default-work-type">
        <FormattedMessage id="ld.importDefaultWorkType" />
      </label>
      <Select
        data-testid="default-work-type"
        id="default-work-type"
        options={WORK_TYPE_OPTIONS}
        value={defaultWorkType}
        withIntl={true}
        ariaLabelledBy="default-work-type-label"
        onChange={handleWorkTypeChange}
      />
    </>
  );
};
