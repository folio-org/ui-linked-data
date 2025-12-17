import { ComponentType } from 'react';
import { ComplexLookupType } from '../constants/complexLookup.constants';
import { HubsModal } from '../components/modals/HubsModal';
import { AuthoritiesModal } from '../components/modals/AuthoritiesModal';

export interface ModalConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  defaultProps: Record<string, unknown>;
  labels: {
    button: {
      base: string;
      change: string;
    };
  };
}

export const COMPLEX_LOOKUP_MODAL_REGISTRY: Record<ComplexLookupType, ModalConfig> = {
  [ComplexLookupType.Hub]: {
    component: HubsModal,
    defaultProps: {},
    labels: {
      button: {
        base: 'ld.add',
        change: 'ld.change',
      },
    },
  },

  [ComplexLookupType.Authorities]: {
    component: AuthoritiesModal,
    defaultProps: {
      initialSegment: 'browse' as const,
    },
    labels: {
      button: {
        base: 'ld.assignAuthority',
        change: 'ld.change',
      },
    },
  },

  [ComplexLookupType.AuthoritiesSubject]: {
    component: AuthoritiesModal,
    defaultProps: {
      initialSegment: 'browse' as const,
      baseLabelType: 'subject',
    },
    labels: {
      button: {
        base: 'ld.assignAuthority',
        change: 'ld.change',
      },
    },
  },
} as const;

export function getModalConfig(lookupType: ComplexLookupType): ModalConfig {
  const config = COMPLEX_LOOKUP_MODAL_REGISTRY[lookupType];

  if (!config) {
    throw new Error(`No modal configuration found for lookup type: ${lookupType}`);
  }

  return config;
}

export function getButtonLabel(lookupType: ComplexLookupType, hasValue: boolean): string {
  const config = COMPLEX_LOOKUP_MODAL_REGISTRY[lookupType];

  if (!config) {
    return hasValue ? 'ld.change' : 'ld.add';
  }

  return hasValue ? config.labels.button.change : config.labels.button.base;
}
