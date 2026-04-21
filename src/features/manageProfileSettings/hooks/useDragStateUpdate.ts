import { ComponentType } from '../components/ProfileSettingsEditor/BaseComponent';

export interface UpdateStateParams {
  activeId: string | null;
  startingList: ComponentType | null;
  unused: ProfileSettingComponent[] | null;
  selected: ProfileSettingComponent[] | null;
  draggingUnused: ProfileSettingComponent[];
  draggingSelected: ProfileSettingComponent[];
  cursorStyle: string;
}

interface UseDragStateParams {
  unusedComponents: ProfileSettingComponent[];
  selectedComponents: ProfileSettingComponent[];
  draggingUnused: ProfileSettingComponent[];
  draggingSelected: ProfileSettingComponent[];
  updateState: (params: UpdateStateParams) => void;
}

export const useDragStateUpdate = ({
  unusedComponents,
  selectedComponents,
  draggingUnused,
  draggingSelected,
  updateState,
}: UseDragStateParams) => {
  const startDrag = (activeId: string, startingList: ComponentType | null) => {
    updateState({
      activeId,
      startingList,
      unused: null,
      selected: null,
      draggingUnused: unusedComponents,
      draggingSelected: selectedComponents,
      cursorStyle: 'grabbing',
    });
  };

  const cancelDrag = () => {
    updateState({
      activeId: null,
      startingList: null,
      unused: draggingUnused,
      selected: draggingSelected,
      draggingUnused: [],
      draggingSelected: [],
      cursorStyle: 'default',
    });
  };

  const endDrag = () => {
    updateState({
      activeId: null,
      startingList: null,
      unused: null,
      selected: null,
      draggingUnused: [],
      draggingSelected: [],
      cursorStyle: 'default',
    });
  };

  return {
    startDrag,
    cancelDrag,
    endDrag,
  };
};
