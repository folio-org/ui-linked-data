import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { DndContext, DragOverlay, MeasuringStrategy, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import classNames from 'classnames';

import { useManageProfileSettingsState } from '@/store';

import { useDragHandlers, useNudge, useSettingsAnnouncements } from '../../hooks';
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
  const unusedEmptyId = 'unused-container';
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
    // setProfileSettings,
  } = useManageProfileSettingsState([
    'fullProfile',
    'profileSettings',
    // 'setProfileSettings',
  ]);

  const listFromId = (id: string) => {
    if (id === unusedEmptyId) {
      return ComponentType.unused;
    }
    return id;
  };

  const updateState = (
    activeId: string | null,
    startingList: ComponentType | null,
    unused: ProfileSettingComponent[] | null,
    selected: ProfileSettingComponent[] | null,
    draggingUnused: ProfileSettingComponent[],
    draggingSelected: ProfileSettingComponent[],
    cursorStyle: string,
  ) => {
    setActiveId(activeId);
    setStartingList(startingList);
    setStartingStyle(startingList);
    if (unused?.length) {
      setUnusedComponents([...unused]);
    }
    if (selected?.length) {
      setSelectedComponents([...selected]);
    }
    setDraggingUnused([...draggingUnused]);
    setDraggingSelected([...draggingSelected]);
    document.body.style.cursor = cursorStyle;
  };

  const sensors = useSensors(
    useSensor(FilteredPointerSensor),
    useSensor(FilteredKeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { makeMoveUp, makeMoveDown } = useNudge(setSelectedComponents);

  const { announcements } = useSettingsAnnouncements(fullProfile, startingStyle, selectedComponents, listFromId);

  const { handleDragStart, handleDragCancel, handleDragOver, handleDragEnd } = useDragHandlers(
    startingList,
    unusedComponents,
    selectedComponents,
    draggingUnused,
    draggingSelected,
    setStartingList,
    updateState,
    listFromId,
    setUnusedComponents,
    setSelectedComponents,
  );

  useEffect(() => {
    if (fullProfile && profileSettings) {
      const profileChildren = getProfileChildren(fullProfile);
      setProfileComponents(profileChildren);
      if (profileSettings.active && profileSettings.children !== undefined && profileSettings.children.length > 0) {
        const visibleSettingsChildren = getSettingsChildren(fullProfile, profileSettings);
        setSelectedComponents(visibleSettingsChildren);
        setUnusedComponents(childrenDifference(profileChildren, visibleSettingsChildren));
      } else {
        setSelectedComponents(profileChildren);
        setUnusedComponents([]);
      }
    }
  }, [fullProfile, profileSettings]);

  return (
    <div className="components-editor-wrapper">
      <div className="components-editor">
        <DndContext
          sensors={sensors}
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          accessibility={{ announcements: announcements }}
        >
          <ComponentList
            components={unusedComponents}
            type={ComponentType.unused}
            titleId="ld.unusedComponents"
            descriptionId="ld.unusedComponents.description"
            droppable={true}
            containerId={unusedEmptyId}
          >
            {unusedComponents.length === 0 || !profileSettings.active ? (
              <div className="empty-list">
                <FormattedMessage id="ld.unusedComponents.allUsed" />
              </div>
            ) : (
              unusedComponents.map(component => {
                return <UnusedComponent key={component.id} component={component} />;
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
            {profileSettings.active === true
              ? selectedComponents.map((component, idx) => {
                  return (
                    <SelectedComponent
                      key={component.id}
                      size={selectedComponents.length}
                      index={idx + 1}
                      component={component}
                      upFn={makeMoveUp(idx, component.name)}
                      downFn={makeMoveDown(idx, component.name)}
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
                    />
                  );
                })}
          </ComponentList>

          <DragOverlay className="drag-overlay">
            {activeId ? (
              <div className={classNames('dragging', startingStyle)}>
                <DraggingComponent component={componentFromId(activeId, fullProfile)} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};
