import { ChangeEvent, FC, useCallback, useContext, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { useModalControls } from '@common/hooks/useModalControls';
import { IS_EMBEDDED_MODE } from '@common/constants/build.constants';
import { COMPLEX_LOOKUPS_CONFIG } from '@common/constants/complexLookup.constants';
import {
  generateEmptyValueUuid,
  getLinkedField,
  getUpdatedSelectedEntries,
  updateLinkedFieldValue,
} from '@common/helpers/complexLookup.helper';
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
  const linkedField = getLinkedField({ schema, linkedEntry });

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

    if (!(linkedField && selectedEntriesService)) return;

    const updatedSelectedEntries = getUpdatedSelectedEntries({
      selectedEntriesService,
      selectedEntries,
      linkedFieldChildren: linkedField.children,
      newValue: generateEmptyValueUuid(linkedField.uuid),
    });

    setSelectedEntries(updatedSelectedEntries);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onAssign = useCallback(({ id, title, linkedFieldValue }: ComplexLookupAssignRecordDTO) => {
    const newValue = {
      label: title,
      meta: {
        id,
        uri: '',
      },
    };

    onChange(uuid, [newValue]);
    setLocalValue([newValue]);

    // Has an associated dependent subfield.
    // For now we assume that the associated field's type is Dropdown only
    if (linkedEntry?.secondary) {
      const updatedValue = updateLinkedFieldValue({ schema, linkedField, linkedFieldValue, lookupConfig });
      const updatedSelectedEntries = getUpdatedSelectedEntries({
        selectedEntriesService,
        selectedEntries,
        linkedFieldChildren: linkedField?.children,
        newValue: updatedValue?.uuid,
      });

      setSelectedEntries(updatedSelectedEntries);
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
