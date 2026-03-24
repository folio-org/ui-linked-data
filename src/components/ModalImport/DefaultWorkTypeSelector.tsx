import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { WORK_TYPES } from '@/common/constants/bibframe.constants';
import { Select, SelectValue } from '@/components/Select';

type DefaultWorkTypeSelectorProps = {
  defaultWorkType: string;
  setDefaultWorkType: (workType: string) => void;
};

export const DefaultWorkTypeSelector: FC<DefaultWorkTypeSelectorProps> = ({ defaultWorkType, setDefaultWorkType }) => {
  const handleWorkTypeChange = ({ value }: SelectValue) => {
    setDefaultWorkType(value);
  };

  const workTypeOptions = WORK_TYPES.map(workType => {
    return {
      label: workType.label,
      value: workType.uri,
      isDisabled: false,
    };
  });

  return (
    <>
      <label id="default-work-type-label" htmlFor="default-work-type">
        <FormattedMessage id="ld.importDefaultWorkType" />
      </label>
      <Select
        data-testid="default-work-type"
        id="default-work-type"
        options={workTypeOptions}
        value={defaultWorkType}
        withIntl={true}
        ariaLabelledBy="default-work-type-label"
        onChange={handleWorkTypeChange}
      />
    </>
  );
};
