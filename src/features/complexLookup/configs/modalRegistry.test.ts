import { ComplexLookupType } from '../constants/complexLookup.constants';
import { getModalConfig, getButtonLabel, COMPLEX_LOOKUP_MODAL_REGISTRY } from './modalRegistry';
import { HubsModal } from '../components/modals/HubsModal';
import { AuthoritiesModal } from '../components/modals/AuthoritiesModal';

describe('modalRegistry', () => {
  describe('COMPLEX_LOOKUP_MODAL_REGISTRY', () => {
    it('has configurations for all lookup types', () => {
      expect(COMPLEX_LOOKUP_MODAL_REGISTRY[ComplexLookupType.Hub]).toBeDefined();
      expect(COMPLEX_LOOKUP_MODAL_REGISTRY[ComplexLookupType.Authorities]).toBeDefined();
      expect(COMPLEX_LOOKUP_MODAL_REGISTRY[ComplexLookupType.AuthoritiesSubject]).toBeDefined();
    });

    it('configures HubsModal with correct properties', () => {
      const config = COMPLEX_LOOKUP_MODAL_REGISTRY[ComplexLookupType.Hub];

      expect(config.component).toBe(HubsModal);
      expect(config.defaultProps).toEqual({});
      expect(config.labels.button.base).toBe('ld.add');
      expect(config.labels.button.change).toBe('ld.change');
    });

    it('configures AuthoritiesModal with correct properties', () => {
      const config = COMPLEX_LOOKUP_MODAL_REGISTRY[ComplexLookupType.Authorities];

      expect(config.component).toBe(AuthoritiesModal);
      expect(config.defaultProps).toEqual({ initialSegment: 'browse' });
      expect(config.labels.button.base).toBe('ld.assignAuthority');
    });
  });

  describe('getModalConfig', () => {
    it('returns config for Hub type', () => {
      const config = getModalConfig(ComplexLookupType.Hub);

      expect(config.component).toBe(HubsModal);
    });

    it('returns config for Authorities type', () => {
      const config = getModalConfig(ComplexLookupType.Authorities);

      expect(config.component).toBe(AuthoritiesModal);
    });

    it('throws error for invalid lookup type', () => {
      const invalidType = 'INVALID_TYPE' as ComplexLookupType;

      expect(() => getModalConfig(invalidType)).toThrow('No modal configuration found for lookup type');
    });
  });

  describe('getButtonLabel', () => {
    it('returns base label when hasValue is false', () => {
      expect(getButtonLabel(ComplexLookupType.Hub, false)).toBe('ld.add');
      expect(getButtonLabel(ComplexLookupType.Authorities, false)).toBe('ld.assignAuthority');
    });

    it('returns change label when hasValue is true', () => {
      expect(getButtonLabel(ComplexLookupType.Hub, true)).toBe('ld.change');
      expect(getButtonLabel(ComplexLookupType.Authorities, true)).toBe('ld.change');
    });

    it('returns default labels for invalid type', () => {
      const invalidType = 'INVALID' as ComplexLookupType;

      expect(getButtonLabel(invalidType, false)).toBe('ld.add');
      expect(getButtonLabel(invalidType, true)).toBe('ld.change');
    });
  });
});
