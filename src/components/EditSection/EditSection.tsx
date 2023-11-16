import { useEffect, memo, useCallback, useState, useMemo } from 'react';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { FormattedMessage } from 'react-intl';
import state from '@state';
import { applyUserValues } from '@common/helpers/profile.helper';
import { getRecordId, saveRecordLocally } from '@common/helpers/record.helper';
import { getAllDisabledFields } from '@common/helpers/disabledEditorGroups.helper';
import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { AUTOSAVE_INTERVAL } from '@common/constants/storage.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { Fields } from '@components/Fields';
import { LiteralField } from '@components/LiteralField';
import { DropdownField } from '@components/DropdownField';
import { SimpleLookupField } from '@components/SimpleLookupField';
import { ComplexLookupField } from '@components/ComplexLookupField';
import { DuplicateGroup } from '@components/DuplicateGroup';
import { ScrollToTop } from '@components/ScrollToTop';
import { useProfileSchema } from '@common/hooks/useProfileSchema';
import { SelectedEntriesService } from '@common/services/selectedEntries';
import { checkRepeatableGroup } from '@common/helpers/repeatableFields.helper';
import './EditSection.scss';

const WINDOW_SCROLL_OFFSET_TRIG = 100;

export const EditSection = memo(() => {
  const resourceTemplates = useRecoilValue(state.config.selectedProfile)?.json.Profile.resourceTemplates;
  const [schema, setSchema] = useRecoilState(state.config.schema);
  const initialSchemaKey = useRecoilValue(state.config.initialSchemaKey);
  const [selectedEntries, setSelectedEntries] = useRecoilState(state.config.selectedEntries);
  const [userValues, setUserValues] = useRecoilState(state.inputs.userValues);
  const [isEdited, setIsEdited] = useRecoilState(state.status.recordIsEdited);
  const setIsInititallyLoaded = useSetRecoilState(state.status.recordIsInititallyLoaded);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const record = useRecoilValue(state.inputs.record);
  const { getSchemaWithCopiedEntries } = useProfileSchema();
  const selectedEntriesService = new SelectedEntriesService(selectedEntries);
  const setIsEditSectionOpen = useSetRecoilState(state.ui.isEditSectionOpen);

  const onWindowScroll = () => {
    const updatedValue = window.scrollY > WINDOW_SCROLL_OFFSET_TRIG;

    if (showScrollToTop === updatedValue) {
      return;
    }

    setShowScrollToTop(updatedValue);
  };

  useEffect(() => {
    if (!isEdited) return;

    const autoSaveRecord = setInterval(() => {
      try {
        const parsed = applyUserValues(schema, initialSchemaKey, { userValues, selectedEntries });

        if (!parsed) return;

        const profile = PROFILE_BFIDS.MONOGRAPH;

        saveRecordLocally(profile, parsed, getRecordId(record) as string);
      } catch (error) {
        console.error('Unable to automatically save changes:', error);
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(autoSaveRecord);
  }, [isEdited, userValues]);

  useEffect(() => {
    setIsInititallyLoaded(true);
    window.addEventListener('scroll', onWindowScroll);

    return () => {
      window.removeEventListener('scroll', onWindowScroll);

      setIsInititallyLoaded(false);
    };
  }, []);

  useEffect(() => {
    setIsEditSectionOpen(true);

    return () => setIsEditSectionOpen(false);
  }, []);

  const onChange = (uuid: string, contents: Array<UserValueContents>) => {
    if (!isEdited) {
      setIsEdited(true);
    }

    setUserValues(oldValue => ({
      ...oldValue,
      [uuid]: {
        uuid,
        contents,
      },
    }));
  };

  const drawTitleWithDuplicateButton = (hasButton = false, name?: string, onClickButton?: VoidFunction) =>
    hasButton && (
      <div className="group-name-container">
        {name && <span>{name}</span>}
        <DuplicateGroup onClick={onClickButton} />
      </div>
    );

  const drawComponent = useCallback(
    ({
      schema,
      entry,
      disabledFields,
      level,
    }: {
      schema: Map<string, SchemaEntry>;
      entry: SchemaEntry;
      disabledFields?: Schema;
      level?: number;
    }) => {
      const { uuid, displayName = '', type, children, constraints } = entry;
      const isDisabled = !!disabledFields?.get(uuid);
      const hasDuplicateGroupButton = checkRepeatableGroup({ schema, entry, level, isDisabled });
      const componentTitle = hasDuplicateGroupButton ? '' : displayName;
      const onClickDuplicateGroup = () => {
        const updatedSchema = getSchemaWithCopiedEntries(schema, entry, selectedEntries);

        setSchema(updatedSchema);
      };
      const drawTitle = () => drawTitleWithDuplicateButton(hasDuplicateGroupButton, displayName, onClickDuplicateGroup);

      if (type === AdvancedFieldType.block) {
        return (
          <div>
            {drawTitle()}
            {!hasDuplicateGroupButton && <strong id={uuid}>{displayName}</strong>}
          </div>
        );
      }

      if (type === AdvancedFieldType.group || type === AdvancedFieldType.groupComplex) {
        return (
          <div>
            {drawTitle()}
            {!hasDuplicateGroupButton && <span id={uuid}>{displayName}</span>}
          </div>
        );
      }

      if (type === AdvancedFieldType.literal) {
        return (
          <div>
            {drawTitle()}
            <LiteralField
              displayName={componentTitle}
              uuid={uuid}
              value={userValues[uuid]?.contents[0].label}
              onChange={onChange}
              isDisabled={isDisabled}
            />
          </div>
        );
      }

      if (type === AdvancedFieldType.dropdown && children) {
        const options = children
          .map(id => schema.get(id))
          .map(entry => ({
            label: entry?.displayName ?? '',
            value: entry?.uri ?? '', // TBD
            uri: entry?.uri ?? '',
            id: entry?.uuid,
          }));

        const selectedOption = options?.find(({ id }) => id && selectedEntries.includes(id));

        const handleChange = (option: any) => {
          selectedEntriesService.addNew(selectedOption?.id, option.id);

          setSelectedEntries(selectedEntriesService.get());
        };

        return (
          <div>
            {drawTitle()}
            <DropdownField
              options={options}
              name={componentTitle}
              uuid={uuid}
              onChange={handleChange}
              value={selectedOption}
              isDisabled={isDisabled}
            />
          </div>
        );
      }

      if (type === AdvancedFieldType.simple) {
        return (
          <div>
            {drawTitle()}
            <SimpleLookupField
              uri={constraints?.useValuesFrom[0] || ''}
              displayName={componentTitle}
              uuid={uuid}
              onChange={onChange}
              parentUri={constraints?.valueDataType?.dataTypeURI}
              value={userValues[uuid]?.contents}
              isDisabled={isDisabled}
            />
          </div>
        );
      }

      if (type === AdvancedFieldType.complex) {
        return (
          <div>
            {drawTitle()}
            <ComplexLookupField
              label={componentTitle}
              uuid={uuid}
              onChange={onChange}
              value={userValues[uuid]?.contents?.[0]}
            />
          </div>
        );
      }

      return null;
    },
    [selectedEntries],
  );

  const disabledFields = useMemo(() => getAllDisabledFields(schema), [schema]);

  return resourceTemplates ? (
    <div className="edit-section">
      <h3>
        <FormattedMessage id="marva.edit" />
      </h3>
      <Fields
        drawComponent={drawComponent}
        schema={schema}
        disabledFields={disabledFields}
        uuid={initialSchemaKey}
        groupClassName="edit-section-group"
      />
      {showScrollToTop && <ScrollToTop className="back-to-top" />}
    </div>
  ) : null;
});
