import { ComponentType } from 'react';

import {
  AUTHORITY_ASSIGNMENT_CHECK_API_ENDPOINT,
  FACETS_API_ENDPOINT,
  MARC_PREVIEW_ENDPOINT,
  SOURCE_API_ENDPOINT,
} from '@/common/constants/api.constants';

import { AuthoritiesModal } from '../components/modals/AuthoritiesModal';
import { HubsModal } from '../components/modals/HubsModal';
import { AuthorityValidationTarget, ComplexLookupType } from '../constants/complexLookup.constants';

export type AssignmentFlow = 'simple' | 'complex';

export interface ModalApiConfig {
  endpoints: {
    marcPreview?: string;
    validation?: string;
    source?: string;
    facets?: string;
  };
  validationTarget?: Record<string, AuthorityValidationTarget>;
}

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
  assignmentFlow: AssignmentFlow;
  api?: ModalApiConfig;
  linkedField?: string;
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
    assignmentFlow: 'simple',
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
    assignmentFlow: 'complex',
    api: {
      endpoints: {
        marcPreview: MARC_PREVIEW_ENDPOINT.AUTHORITY,
        validation: AUTHORITY_ASSIGNMENT_CHECK_API_ENDPOINT,
        source: SOURCE_API_ENDPOINT.AUTHORITY,
        facets: FACETS_API_ENDPOINT.AUTHORITY,
      },
      validationTarget: {
        creator: AuthorityValidationTarget.CreatorOfWork,
      },
    },
    linkedField: 'subclass',
  },

  [ComplexLookupType.AuthoritiesSubject]: {
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
    assignmentFlow: 'complex',
    api: {
      endpoints: {
        marcPreview: MARC_PREVIEW_ENDPOINT.AUTHORITY,
        validation: AUTHORITY_ASSIGNMENT_CHECK_API_ENDPOINT,
        source: SOURCE_API_ENDPOINT.AUTHORITY,
        facets: FACETS_API_ENDPOINT.AUTHORITY,
      },
      validationTarget: {
        subject: AuthorityValidationTarget.SubjectOfWork,
      },
    },
    linkedField: 'subclass',
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
