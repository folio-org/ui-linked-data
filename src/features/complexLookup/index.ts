// Legacy Components
export { ComplexLookupField as LegacyComplexLookupField } from './components/ComplexLookupField';
export { ComplexLookupSearchResults } from './components/ComplexLookupSearchResults';
export { ComplexLookupSelectedItem } from './components/ComplexLookupSelectedItem';
export { MarcPreview } from './components/MarcPreview';
export { ModalComplexLookup } from './components/ModalComplexLookup';

// New Search-based Components
export { ComplexLookupField } from './components/NewComplexLookupField';

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
