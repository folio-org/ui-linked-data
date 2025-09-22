import { useState, useCallback } from 'react';
import BaseApi from '@common/api/base.api';
import { StatusType } from '@common/constants/status.constants';
import { UserNotificationFactory } from '@common/services/userNotification';
import { useLoadingState, useStatusState } from '@src/store';

interface RequestConfig {
  url: string;
  method?: APIRequestMethod;
  urlParams?: Record<string, string>;
  urlParam?: { name: string; value: string | number };
  requestParams?: RequestInit;
  body?: unknown;
  errorMessageId?: string;
}

interface ApiResponse<T> {
  data: T | null;
}

export function useApi<T>() {
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
  });

  const makeRequest = useCallback(
    async ({ url, method = 'GET', urlParams, urlParam, requestParams, body, errorMessageId }: RequestConfig) => {
      setIsLoading(true);

      try {
        const finalUrl = BaseApi.generateUrl(url, urlParam);

        const response = await BaseApi.getJson({
          url: finalUrl,
          urlParams,
          requestParams: {
            method,
            headers: { 'content-type': 'application/json' },
            ...requestParams,
            ...(typeof body === 'object' && body !== null ? { body: JSON.stringify(body, null, 2) } : {}),
          },
        });

        setState({ data: response });

        return response;
      } catch (error) {
        addStatusMessagesItem?.(
          UserNotificationFactory.createMessage(StatusType.error, errorMessageId ?? 'ld.errorMakingApiRequest'),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    ...state,
    makeRequest,
  };
}
