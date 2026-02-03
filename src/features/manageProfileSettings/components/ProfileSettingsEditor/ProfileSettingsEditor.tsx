import { useState, useEffect, Dispatch, SetStateAction, PointerEvent, KeyboardEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Active,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MeasuringStrategy,
  Over,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useManageProfileSettingsState } from '@/store';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import { ComponentType } from './BaseComponent';
import { UnusedComponent } from './UnusedComponent';
import { SelectedComponent } from './SelectedComponent';
import { DraggingComponent } from './DraggingComponent';
import { DroppableList } from './DroppableList';
import './ProfileSettingsEditor.scss';

const filterEvent = (element: HTMLElement | null) => {
  let current = element;
  while (current) {
    if (current.dataset && current.dataset.noDnd) {
      return false;
    }
    current = current.parentElement;
  }
  return true;
};

class FilteredPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({ nativeEvent: event }: PointerEvent) => {
        return filterEvent(event.target as HTMLElement);
      },
    },
  ];
};

class FilteredKeyboardSensor extends KeyboardSensor {
  static activators = [
    {
      eventName: 'onKeyDown' as const,
      handler: ({ nativeEvent: event }: KeyboardEvent<Element>) => {
        if (event.key === " " || event.key === "Enter") {
          return filterEvent(event.target as HTMLElement);
        }
        return false;
      },
    },
  ];
};

export type ProfileSettingComponent = {
  id: string;
  name: string;
};

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

  const { fullProfile, profileSettings, setProfileSettings, setIsModified } = useManageProfileSettingsState([
    'fullProfile',
    'profileSettings',
    'setProfileSettings',
    'setIsModified',
  ]);

  const sensors = useSensors(
    useSensor(FilteredPointerSensor),
    useSensor(FilteredKeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
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

  const listFromId = (id: string) => {
    if (id === unusedEmptyId) {
      return ComponentType.unused;
    }
    return id;
  };

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
    setStartingStyle(event.active.data.current?.sortable.containerId);
    setDraggingUnused([...unusedComponents]);
    setDraggingSelected([...selectedComponents]);
    document.body.style.cursor = 'grabbing';
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setStartingList(null);
    setStartingStyle(null);
    setUnusedComponents([...draggingUnused]);
    setSelectedComponents([...draggingSelected]);
    setDraggingUnused([]);
    setDraggingSelected([]);
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
      } else if (startingList === ComponentType.unused && targetList === ComponentType.unused) {
        // moving within unused list
        setUnusedComponents(prev => {
          const oldIndex = prev.findIndex(p => p.id === active.id);
          const newIndex = prev.findIndex(p => p.id === over.id);
          return arrayMove(prev, oldIndex, newIndex);
        });
      }
      // movement between lists is covered by onDragOver
    }

    setActiveId(null);
    setStartingList(null);
    setStartingStyle(null);
    setDraggingUnused([]);
    setDraggingSelected([]);
    document.body.style.cursor = 'default';
  };

  const moveBetweenLists = (
    sourceFn: Dispatch<SetStateAction<ProfileSettingComponent[]>>,
    destinationFn: Dispatch<SetStateAction<ProfileSettingComponent[]>>,
    active: Active,
    over: Over,
  ) => {
    let toMove: ProfileSettingComponent;
    sourceFn(prev => {
      const oldIndex = prev.findIndex(p => p.id === active.id);
      if (oldIndex >= 0) {
        toMove = prev.splice(oldIndex, 1)[0];
      }
      return prev;
    });
    destinationFn(prev => {
      if (toMove !== undefined) {
        if (prev.length === 0) {
          return [toMove];
        } else {
          const newIndex = prev.findIndex(p => p.id === over.id);
          return [...prev.slice(0, newIndex), toMove, ...prev.slice(newIndex)];
        }
      }
      return prev;
    });
  };

  const moveUnusedToSelected = (active: Active, over: Over) => {
    moveBetweenLists(setUnusedComponents, setSelectedComponents, active, over);
  };

  const moveSelectedToUnused = (active: Active, over: Over) => {
    moveBetweenLists(setSelectedComponents, setUnusedComponents, active, over);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const targetId = over.data.current !== undefined ? over.data.current.sortable.containerId : over.id;
      const targetList = listFromId(targetId);
      if (startingList === ComponentType.unused && targetList === ComponentType.selected) {
        // move from unused to selected
        moveUnusedToSelected(active, over);
        setStartingList(ComponentType.selected);
      } else if (startingList === ComponentType.selected && targetList === ComponentType.unused) {
        // move from selected to unused
        moveSelectedToUnused(active, over);
        setStartingList(ComponentType.unused);
      }
    }
  };

  const makeMove = (index: number, increment: number, setter: Dispatch<SetState<ProfileSettingComponent[]>>) => {
    return () => {
      setIsModified(true);
      setter(prev => {
        return arrayMove(prev, index, index + increment);
      });
    };
  };

  const makeMoveUp = (index: number, setter: Dispatch<SetState<ProfileSettingComponent[]>>) => {
    return makeMove(index, -1, setter);
  };

  const makeMoveDown = (index: number, setter: Dispatch<SetState<ProfileSettingComponent[]>>) => {
    return makeMove(index, 1, setter);
  };

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
        >
          <div className="unused-components" aria-labelledby="unused-title">
            <h4>
              <span id="unused-title" className="title">
                <FormattedMessage id="ld.unusedComponents" />
              </span>
              ({unusedComponents.length})
            </h4>
            <div className="description">
              <FormattedMessage id="ld.unusedComponents.description" />
            </div>
            <DroppableList id={unusedEmptyId} className="components">
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
            </DroppableList>
          </div>

          <div className="selected-components" aria-labelledby="selected-title">
            <h4>
              <span id="selected-title" className="title">
                <FormattedMessage id="ld.selectedComponents" />
              </span>
              ({selectedComponents.length})
            </h4>
            <div className="description">
              <FormattedMessage id="ld.selectedComponents.description" />
            </div>
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
                          upFn={makeMoveUp(idx, setSelectedComponents)}
                          downFn={makeMoveDown(idx, setSelectedComponents)}
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
