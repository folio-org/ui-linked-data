import { ChangeEvent, FC, useCallback, useContext, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { useModalControls } from '@common/hooks/useModalControls';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import {
  COMPLEX_LOOKUPS_CONFIG,
  COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING,
} from '@common/constants/complexLookup.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { Input } from '@components/Input';
import { ServicesContext } from '@src/contexts';
import state from '@state';
import CloseIcon from '@src/assets/times-16.svg?react';
import { ModalComplexLookup } from './ModalComplexLookup';
import './ComplexLookupField.scss';

interface Props {
  uuid: string;
  entry: SchemaEntry;
  value?: UserValueContents[];
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
}

const __MOCK_URI_CHANGE_WHEN_IMPLEMENTING = '__MOCK_URI_CHANGE_WHEN_IMPLEMENTING';
const VALUE_DIVIDER = ', ';

export const ComplexLookupField: FC<Props> = ({ value = undefined, uuid, entry, onChange }) => {
  const { selectedEntriesService } = useContext(ServicesContext);
  const [selectedEntries, setSelectedEntries] = useRecoilState(state.config.selectedEntries);
  const schema = useRecoilValue(state.config.schema);
  const [localValue, setLocalValue] = useState<UserValueContents[]>(value || []);
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();
  const { layout, linkedEntry } = entry;
  const lookupConfig = COMPLEX_LOOKUPS_CONFIG[layout?.api as string];
  const linkedField = linkedEntry?.secondary ? schema.get(linkedEntry.secondary) : undefined;

  const handleOnChangeBase = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    const newValue = {
      label: value,
      meta: {
        uri: __MOCK_URI_CHANGE_WHEN_IMPLEMENTING,
      },
    };

    onChange(uuid, [newValue]);
    setLocalValue(prevValue => [...prevValue, newValue]);
  };

  const handleDelete = (id?: string) => {
    onChange(uuid, []);
    setLocalValue(prevValue => prevValue.filter(({ id: prevId }) => prevId !== id));

    if (linkedField && selectedEntriesService) {
      selectedEntriesService.set(selectedEntries);
      selectedEntriesService.removeMultiple(linkedField.children);
      selectedEntriesService.addNew(undefined, `${linkedField.uuid}_empty`);
      setSelectedEntries(selectedEntriesService.get());
    }
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onAssign = useCallback(({ id, title, subclass }: ComplexLookupAssignRecordDTO) => {
    const newValue = {
      label: title,
      meta: {
        id,
        uri: '',
      },
    };

    onChange(uuid, [newValue]);
    setLocalValue([newValue]);

    if (linkedEntry?.secondary) {
      let updatedValue: SchemaEntry | undefined;

      linkedField?.children?.forEach(uuid => {
        if (updatedValue) return;

        const childEntry = schema.get(uuid);

        if (
          childEntry?.type === AdvancedFieldType.dropdownOption &&
          lookupConfig?.linkedField &&
          subclass &&
          childEntry.uri ===
            COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING?.[
              lookupConfig.linkedField as unknown as keyof typeof COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING
            ]?.[subclass]?.bf2Uri
        ) {
          updatedValue = childEntry;
        }
      });

      if (linkedField && updatedValue && selectedEntriesService) {
        selectedEntriesService.set(selectedEntries);
        selectedEntriesService.removeMultiple(linkedField.children);
        selectedEntriesService.addNew(undefined, updatedValue.uuid);
        setSelectedEntries(selectedEntriesService.get());
      }
    }

    closeModal();
  }, []);

  return (
    <>
      {layout?.isNew ? (
        <div className="complex-lookup">
          {!!localValue.length && (
            <div className="complex-lookup-value" data-testid="complex-lookup-value">
              {localValue?.map(({ id, label }) => (
                <div
                  key={id}
                  className={classNames([
                    'complex-lookup-selected',
                    IS_EMBEDDED_MODE && 'complex-lookup-selected-embedded',
                  ])}
                  data-testid="complex-lookup-selected"
                >
                  <span className="complex-lookup-selected-label" data-testid="complex-lookup-selected-label">
                    {label}
                  </span>
                  <button
                    role="button"
                    onClick={() => handleDelete(id)}
                    className="complex-lookup-selected-delete"
                    data-testid="complex-lookup-selected-delete"
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button role="button" className="complex-lookup-select-button button-passive" onClick={openModal}>
            <FormattedMessage
              id={localValue?.length ? lookupConfig?.labels?.button.change : lookupConfig?.labels?.button.base}
            />
          </button>

          <ModalComplexLookup
            isOpen={isModalOpen}
            onClose={closeModal}
            onAssign={onAssign}
            assignEntityName={layout.api}
            baseLabelType={layout.baseLabelType}
          />
        </div>
      ) : (
        <Input
          onChange={handleOnChangeBase}
          value={localValue?.map(({ label }) => label).join(VALUE_DIVIDER) ?? ''}
          disabled={true}
          data-testid="complex-lookup-input"
        />
      )}
    </>
  );
};
