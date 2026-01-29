import { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useManageProfileSettingsState } from '@/store';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import { ComponentType } from './BaseComponent';
import { UnusedComponent } from './UnusedComponent';
import { SelectedComponent } from './SelectedComponent';
import { DraggingComponent } from './DraggingComponent';
import './ProfileSettingsEditor.scss';

export type ProfileSettingComponent = {
  id: string;
  name: string;
};

export const ProfileSettingsEditor = () => {
  const [profileComponents, setProfileComponents] = useState([] as ProfileSettingComponent[]);
  const [unusedComponents, setUnusedComponents] = useState([] as ProfileSettingComponent[]);
  const [selectedComponents, setSelectedComponents] = useState([] as ProfileSettingComponent[]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [startingList, setStartingList] = useState<ComponentType | null>(null);

  const { fullProfile, profileSettings, setProfileSettings, setIsModified } = useManageProfileSettingsState([
    'fullProfile',
    'profileSettings',
    'setProfileSettings',
    'setIsModified',
  ]);

  const unusedListPlaceholder = useDroppable({
    id: 'unused-placeholder',
  });
  const unusedEnd = useDroppable({
    id: 'unused-end',
  });
  const selectedEnd = useDroppable({
    id: 'selected-end',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const componentFromId = (id: string, profile: Profile): ProfileSettingComponent => {
    return {
      id: id,
      name: profile.find(p => p.id === id)?.displayName ?? '',
    };
  };

  const getProfileChildren = (profile: Profile): ProfileSettingComponent[] => {
    const children = profile.find(p => p.type === AdvancedFieldType.block)?.children;
    return (
      children?.map(child => {
        return componentFromId(child, profile);
      }) ?? []
    );
  };

  const getSettingsChildren = (profile: Profile, settings: ProfileSettingsWithDrift): ProfileSettingComponent[] => {
    return (
      settings.children
        ?.filter(child => {
          return child.visible === true;
        })
        ?.map(child => {
          return componentFromId(child.id, profile);
        }) ?? []
    );
  };

  const childrenDifference = (
    profile: ProfileSettingComponent[],
    settings: ProfileSettingComponent[],
  ): ProfileSettingComponent[] => {
    return profile.filter(child => {
      return !settings.some(settingsChild => settingsChild.id === child.id);
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setStartingList(event.active.data.current?.sortable.containerId);
    document.body.style.cursor = 'grabbing';
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setStartingList(null);
    document.body.style.cursor = 'default';
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setIsModified(true);

      const targetList = over.data.current?.sortable.containerId;
      if (startingList === ComponentType.selected && targetList === ComponentType.selected) {
        // moving within selected list
        setSelectedComponents(prev => {
          const oldIndex = prev.findIndex(p => p.id === active.id);
          const newIndex = prev.findIndex(p => p.id === over.id);
          return arrayMove(prev, oldIndex, newIndex);
        });
      } else if (startingList === ComponentType.unused && targetList === ComponentType.selected) {
        // moving from unused to selected
        let toMove: ProfileSettingComponent;
        setUnusedComponents(prev => {
          const oldIndex = prev.findIndex(p => p.id === active.id);
          if (oldIndex >= 0) {
            toMove = prev.splice(oldIndex, 1)[0];
          }
          return prev;
        });
        setSelectedComponents(prev => {
          if (toMove !== undefined) {
            const newIndex = prev.findIndex(p => p.id === over.id);
            return [...prev.slice(0, newIndex), toMove, ...prev.slice(newIndex)];
          }
          return prev;
        });
      } else if (startingList === ComponentType.selected && targetList === ComponentType.unused) {
        // moving from selected to unused
        let toMove: ProfileSettingComponent;
        setSelectedComponents(prev => {
          const oldIndex = prev.findIndex(p => p.id === active.id);
          if (oldIndex >= 0) {
            toMove = prev.splice(oldIndex, 1)[0];
          }
          return prev;
        });
        setUnusedComponents(prev => {
          if (toMove !== undefined) {
            const newIndex = prev.findIndex(p => p.id === over.id);
            return [...prev.slice(0, newIndex), toMove, ...prev.slice(newIndex)];
          }
          return prev;
        });
      } else {
        // moving within unused list
        setUnusedComponents(prev => {
          const oldIndex = prev.findIndex(p => p.id === active.id);
          const newIndex = prev.findIndex(p => p.id === over.id);
          return arrayMove(prev, oldIndex, newIndex);
        });
      }
    }

    setActiveId(null);
    setStartingList(null);
    document.body.style.cursor = 'default';
  };

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

  const handleDragOver = (event: DragOverEvent) => {
    //console.log(event);
    //console.log(event.over);
  };

  return (
    <div className="components-editor">
      <DndContext
        sensors={sensors}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="unused-components">
          <h4>
            <span className="title">
              <FormattedMessage id="ld.unusedComponents" />
            </span>
            ({unusedComponents.length})
          </h4>
          <p>
            <FormattedMessage id="ld.unusedComponents.description" />
          </p>
          <div
            ref={unusedListPlaceholder.setNodeRef}
            id="unused-placeholder"
            className={classNames('components', unusedListPlaceholder.isOver ? 'over-list' : '')}
          >
            <SortableContext id="unused" items={unusedComponents} strategy={verticalListSortingStrategy}>
              {unusedComponents.length === 0 || !profileSettings.active ? (
                <div className="empty-list">
                  <FormattedMessage id="ld.unusedComponents.allUsed" />
                </div>
              ) : (
                unusedComponents.map(component => {
                  return <UnusedComponent key={component.id} component={component} />;
                })
              )}
            </SortableContext>
          </div>
        </div>

        <div className="selected-components">
          <h4>
            <span className="title">
              <FormattedMessage id="ld.selectedComponents" />
            </span>
            ({selectedComponents.length})
          </h4>
          <p>
            <FormattedMessage id="ld.selectedComponents.description" />
          </p>
          <SortableContext id="selected" items={selectedComponents} strategy={verticalListSortingStrategy}>
            <div className="components">
              {profileSettings.active === true
                ? selectedComponents.map((component, idx) => {
                    return (
                      <SelectedComponent
                        key={component.id}
                        size={selectedComponents.length}
                        index={idx + 1}
                        component={component}
                      />
                    );
                  })
                : profileComponents.map((component, idx) => {
                    return (
                      <SelectedComponent
                        key={component.id}
                        size={selectedComponents.length}
                        index={idx + 1}
                        component={component}
                      />
                    );
                  })}
            </div>
          </SortableContext>
        </div>

        <DragOverlay className="drag-overlay">
          {activeId ? (
            <div className={classNames('dragging', startingList)}>
              <DraggingComponent component={componentFromId(activeId, fullProfile)} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
