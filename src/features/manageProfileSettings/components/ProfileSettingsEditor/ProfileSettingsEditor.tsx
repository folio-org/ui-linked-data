import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { DndContext, DragOverlay, MeasuringStrategy, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import classNames from 'classnames';

import { useManageProfileSettingsState } from '@/store';

import { UNUSED_EMPTY_ID } from '../../constants';
import {
  type UpdateStateParams,
  useDragHandlers,
  useDragStateUpdate,
  useMoveBetweenLists,
  useNudge,
  useSettingsAnnouncements,
} from '../../hooks';
import {
  FilteredKeyboardSensor,
  FilteredPointerSensor,
  childrenDifference,
  componentFromId,
  getProfileChildren,
  getSettingsChildren,
} from '../../utils';
import { ComponentType } from './BaseComponent';
import { ComponentList } from './ComponentList';
import { DraggingComponent } from './DraggingComponent';
import { SelectedComponent } from './SelectedComponent';
import { UnusedComponent } from './UnusedComponent';

import './ProfileSettingsEditor.scss';

export const ProfileSettingsEditor = () => {
  const { formatMessage } = useIntl();
  const [profileComponents, setProfileComponents] = useState([] as ProfileSettingComponent[]);
  const [unusedComponents, setUnusedComponents] = useState([] as ProfileSettingComponent[]);
  const [selectedComponents, setSelectedComponents] = useState([] as ProfileSettingComponent[]);
  const [draggingUnused, setDraggingUnused] = useState([] as ProfileSettingComponent[]);
  const [draggingSelected, setDraggingSelected] = useState([] as ProfileSettingComponent[]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [startingList, setStartingList] = useState<ComponentType | null>(null);
  const [startingStyle, setStartingStyle] = useState<ComponentType | null>(null);

  const {
    fullProfile,
    profileSettings,
    isSettingsActive,
    setIsSettingsActive,
    // setProfileSettings, // TODO: UILD-698 save values
  } = useManageProfileSettingsState([
    'fullProfile',
    'profileSettings',
    'isSettingsActive',
    'setIsSettingsActive',
    // 'setProfileSettings', // TODO: UILD-698
  ]);

  const updateState = ({
    activeId,
    startingList,
    unused,
    selected,
    draggingUnused,
    draggingSelected,
    cursorStyle,
  }: UpdateStateParams) => {
    setActiveId(activeId);
    setStartingList(startingList);
    setStartingStyle(startingList);
    if (unused) {
      setUnusedComponents([...unused]);
    }
    if (selected) {
      setSelectedComponents([...selected]);
    }
    setDraggingUnused([...draggingUnused]);
    setDraggingSelected([...draggingSelected]);
    document.body.style.cursor = cursorStyle;
  };

  const { startDrag, cancelDrag, endDrag } = useDragStateUpdate({
    unusedComponents,
    selectedComponents,
    draggingUnused,
    draggingSelected,
    updateState,
  });

  const sensors = useSensors(
    useSensor(FilteredPointerSensor),
    useSensor(FilteredKeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { makeMoveUp, makeMoveDown } = useNudge({ setSelected: setSelectedComponents });
  const { makeMoveComponentIdToSelected, makeMoveComponentIdToUnused } = useMoveBetweenLists({
    unused: unusedComponents,
    selected: selectedComponents,
    setUnused: setUnusedComponents,
    setSelected: setSelectedComponents,
  });

  const { announcements } = useSettingsAnnouncements({
    profile: fullProfile as Profile,
    startingList: startingStyle,
    components: selectedComponents,
  });
  const instructions = formatMessage({ id: 'ld.profileSettings.announce.instructions' });

  const { handleDragStart, handleDragCancel, handleDragOver, handleDragEnd } = useDragHandlers({
    unused: unusedComponents,
    selected: selectedComponents,
    startingList,
    cancelDrag,
    endDrag,
    setSelected: setSelectedComponents,
    setStartingList,
    setUnused: setUnusedComponents,
    startDrag,
  });

  useEffect(() => {
    if (fullProfile && profileSettings) {
      const profileChildren = getProfileChildren(fullProfile);
      setProfileComponents(profileChildren);
      setIsSettingsActive(profileSettings.active);
      if (profileSettings.active && !!profileSettings.children?.length) {
        const visibleSettingsChildren = getSettingsChildren(fullProfile, profileSettings);
        setSelectedComponents(visibleSettingsChildren);
        setUnusedComponents(childrenDifference(profileChildren, visibleSettingsChildren));
      } else {
        setSelectedComponents(profileChildren);
        setUnusedComponents([]);
      }
    }
  }, [fullProfile, profileSettings]);

  useEffect(() => {
    if (!isSettingsActive) {
      setSelectedComponents(profileComponents);
      setUnusedComponents([]);
    }
  }, [isSettingsActive]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default';
    };
  });

  return (
    <div data-testid="profile-settings-editor" className="components-editor-wrapper">
      <div className="components-editor">
        <DndContext
          sensors={sensors}
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          accessibility={{ announcements, screenReaderInstructions: { draggable: instructions } }}
        >
          <ComponentList
            components={unusedComponents}
            type={ComponentType.unused}
            titleId="ld.unusedComponents"
            descriptionId="ld.unusedComponents.description"
            droppable={true}
            containerId={UNUSED_EMPTY_ID}
          >
            {unusedComponents.length === 0 || !isSettingsActive ? (
              <div className="empty-list">
                <FormattedMessage id="ld.unusedComponents.allUsed" />
              </div>
            ) : (
              unusedComponents.map(component => {
                return (
                  <UnusedComponent
                    key={component.id}
                    component={component}
                    moveFn={makeMoveComponentIdToSelected(component.id)}
                  />
                );
              })
            )}
          </ComponentList>

          <ComponentList
            components={selectedComponents}
            type={ComponentType.selected}
            titleId="ld.selectedComponents"
            descriptionId="ld.selectedComponents.description"
            droppable={false}
            containerId="selected-container"
          >
            {isSettingsActive === true
              ? selectedComponents.map((component, idx) => {
                  return (
                    <SelectedComponent
                      key={component.id}
                      size={selectedComponents.length}
                      index={idx + 1}
                      component={component}
                      upFn={makeMoveUp(idx, component.name)}
                      downFn={makeMoveDown(idx, component.name)}
                      moveFn={makeMoveComponentIdToUnused(component.id)}
                    />
                  );
                })
              : profileComponents.map((component, idx) => {
                  return (
                    <SelectedComponent
                      key={component.id}
                      size={profileComponents.length}
                      index={idx + 1}
                      component={component}
                      upFn={makeMoveUp(idx, component.name)}
                      downFn={makeMoveDown(idx, component.name)}
                      moveFn={makeMoveComponentIdToUnused(component.id)}
                    />
                  );
                })}
          </ComponentList>

          <DragOverlay className="drag-overlay">
            {activeId ? (
              <div className={classNames('dragging', startingStyle)}>
                <DraggingComponent component={componentFromId(activeId, fullProfile as Profile)!} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};
