export { ComplexLookupSelectedItem } from './components/ComplexLookupSelectedItem';
export { MarcPreview } from './components/MarcPreview';

// Search-based Components
export { ComplexLookupField } from './components/ComplexLookupField';

// Modal Registry
export { getModalConfig, getButtonLabel, COMPLEX_LOOKUP_MODAL_REGISTRY } from './configs/modalRegistry';
export type { ModalConfig } from './configs/modalRegistry';

// Hooks
export { useComplexLookupApi, useComplexLookupValidation, useMarcAssignment, useMarcValidation } from './hooks';

// Utils
export * from './utils';
