import { FC, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@/components/Accordion';
import { useSearchContext } from '../../providers/SearchProvider';
import { useSearchParams } from 'react-router-dom';
import { SearchParam } from '../../../core';
import { useSearchState } from '@/store';
import './RootControls.scss';

type SourceValue = string;

export type SourceOption = {
  value: string;
  labelId: string;
};

export type SourceSelectorProps = {
  options?: SourceOption[];
  defaultValue?: string;
  accordionId?: string;
  accordionTitleId?: string;
  groupId?: string;
  defaultState?: boolean;
};

const DEFAULT_SOURCE_OPTIONS: SourceOption[] = [
  { value: 'external', labelId: 'ld.source.libraryOfCongress' },
  { value: 'internal', labelId: 'ld.source.local' },
];

const FALLBACK_SOURCE = 'external';

export const SourceSelector: FC<SourceSelectorProps> = ({
  options,
  defaultValue,
  accordionId = 'search-source',
  accordionTitleId = 'ld.source',
  groupId = 'source',
  defaultState = true,
}) => {
  const { onSourceChange, flow } = useSearchContext();
  const [searchParams] = useSearchParams();
  const { navigationState } = useSearchState(['navigationState']);

  const resolvedOptions = options && options.length > 0 ? options : DEFAULT_SOURCE_OPTIONS;
  const fallbackValue = defaultValue ?? resolvedOptions[0]?.value ?? FALLBACK_SOURCE;
  const radioName = `${accordionId}-option`;

  const getInitial = (): SourceValue => {
    if (flow === 'url') {
      const paramValue = searchParams.get(SearchParam.SOURCE);

      return (paramValue as SourceValue) ?? fallbackValue;
    }

    const navigationStateSource = (navigationState as Record<string, unknown>)?.[SearchParam.SOURCE] as
      | SourceValue
      | undefined;

    return navigationStateSource ?? fallbackValue;
  };

  const [value, setValue] = useState<SourceValue>(getInitial);

  useEffect(() => {
    // Notify context about initial value (ensures navigation state is in sync)
    onSourceChange?.(value);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;

    setValue(newVal);
    onSourceChange?.(newVal);
  };

  return (
    <Accordion
      id={accordionId}
      title={<FormattedMessage id={accordionTitleId} />}
      defaultState={defaultState}
      groupId={groupId}
    >
      <div className="source-selector">
        {resolvedOptions.map(option => (
          <label key={option.value} htmlFor={`${radioName}-${option.value}`}>
            <input
              id={`${radioName}-${option.value}`}
              type="radio"
              name={radioName}
              value={option.value}
              checked={value === option.value}
              onChange={handleChange}
            />
            <FormattedMessage id={option.labelId} />
          </label>
        ))}
      </div>
    </Accordion>
  );
};

export default SourceSelector;
