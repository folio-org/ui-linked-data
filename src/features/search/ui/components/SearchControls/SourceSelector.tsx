import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@/components/Accordion';
import { SearchParam } from '@/features/search/core';
import { useSearchState } from '@/store';
import { useSearchContext } from '../../providers';
import './RootControls.scss';

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
  const { onSourceChange } = useSearchContext();
  const { navigationState } = useSearchState(['navigationState']);

  const resolvedOptions = options && options.length > 0 ? options : DEFAULT_SOURCE_OPTIONS;
  const fallbackValue = defaultValue ?? resolvedOptions[0]?.value ?? FALLBACK_SOURCE;
  const radioName = `${accordionId}-option`;
  const navigationStateSource = (navigationState as Record<string, unknown>)?.[SearchParam.SOURCE] as
    | string
    | undefined;
  const sourceValue = navigationStateSource ?? fallbackValue;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = event.target.value;

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
              checked={sourceValue === option.value}
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
