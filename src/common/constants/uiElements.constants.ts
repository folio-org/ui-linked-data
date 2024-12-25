export const MODAL_CONTAINER_ID = 'modal-container';

// TODO: Can be passed as an environment variable or as the web component's attribute
export const EMBEDDED_MODULE_CONTAINER_ID = 'ModuleContainer';
export const EDIT_SECTION_CONTAINER_ID = 'edit-section';
export const CREATABLE_SELECT_OFFSET_PLACEMENT_TRIG = '-30%';

export const EDIT_ALT_DISPLAY_LABELS: Record<string, string> = {
  'BIBFRAME Instance': 'Instance components',
  'BIBFRAME Work': 'Work components',
};

export const PREVIEW_ALT_DISPLAY_LABELS: Record<string, string> = {
  'BIBFRAME Work': 'Work',
  'BIBFRAME Instance': 'Instance',
};

export const WINDOW_SCROLL_OFFSET_TRIG = 100;

export enum DropdownItemType {
  basic = 'basic',
  customComponent = 'customComponent',
}

export enum FullDisplayType {
  Basic = 'basic',
  Comparison = 'comparison',
}

export enum AriaModalKind {
  Basic = 'Basic',
  AdvancedSearch = 'Advanced search',
}

export const MAX_SEARCH_BAR_WIDTH = 30;
