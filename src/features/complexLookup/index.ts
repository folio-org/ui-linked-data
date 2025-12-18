// Legacy Components
export { ComplexLookupSearchResults } from './components/ComplexLookupSearchResults';
export { ComplexLookupSelectedItem } from './components/ComplexLookupSelectedItem';
export { MarcPreview } from './components/MarcPreview';
export { ModalComplexLookup } from './components/ModalComplexLookup';

// Search-based Components
export { LegacyComplexLookupField, ComplexLookupField } from './components/ComplexLookupField';

// Modal Registry
export { getModalConfig, getButtonLabel, COMPLEX_LOOKUP_MODAL_REGISTRY } from './configs/modalRegistry';
export type { ModalConfig } from './configs/modalRegistry';

// Hooks
export {
  useComplexLookup,
  useComplexLookupApi,
  useComplexLookupSearchResults,
  useComplexLookupValidation,
  useMarcAssignment,
  useMarcValidation,
} from './hooks';

// Utils
export * from './utils';
