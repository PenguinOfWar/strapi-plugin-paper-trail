import {
  useAPIErrorHandler,
  useFetchClient,
  useNotification
} from '@strapi/helper-plugin';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useQueries } from 'react-query';

export default function useContentTypes() {
  const { get } = useFetchClient();
  const { formatAPIError } = useAPIErrorHandler();
  const toggleNotification = useNotification();
  const queries = useQueries([
    {
      queryKey: ['content-manager', 'components'],
      async queryFn() {
        const {
          data: { data }
        } = await get(`/content-manager/components`);

        return data;
      },
      onError(error) {
        if (error instanceof AxiosError) {
          toggleNotification({
            type: 'warning',
            message: formatAPIError(error)
          });
        }
      }
    },

    {
      queryKey: ['content-manager', 'content-types'],
      async queryFn() {
        const {
          data: { data }
        } = await get(`/content-manager/content-types`);

        return data;
      },
      onError(error) {
        if (error instanceof AxiosError) {
          toggleNotification({
            type: 'warning',
            message: formatAPIError(error)
          });
        }
      }
    },

    {
      queryKey: ['content-manager', 'content-types-settings'],
      async queryFn() {
        const {
          data: { data }
        } = await get(`/content-manager/content-types-settings`);

        return data;
      },
      onError(error) {
        if (error instanceof AxiosError) {
          toggleNotification({
            type: 'warning',
            message: formatAPIError(error)
          });
        }
      }
    }
  ]);

  const [componentTypes, contentTypes, contentTypesSettings] = queries;
  const isLoading =
    componentTypes.isLoading ||
    contentTypesSettings.isLoading ||
    contentTypes.isLoading;

  // the return value needs to be memoized, because instantiating
  // an empty array as default value would lead to an unstable return
  // value, which later on triggers infinite loops if used in the
  // dependency arrays of other hooks
  const collectionTypes = React.useMemo(() => {
    return (contentTypes?.data ?? []).filter(
      contentType =>
        contentType.kind === 'collectionType' && contentType.isDisplayed
    );
  }, [contentTypes?.data]);

  const singleTypes = React.useMemo(() => {
    return (contentTypes?.data ?? []).filter(
      contentType =>
        contentType.kind !== 'collectionType' && contentType.isDisplayed
    );
  }, [contentTypes?.data]);

  return {
    isLoading,
    componentTypes: React.useMemo(
      () => componentTypes?.data ?? [],
      [componentTypes?.data]
    ),
    contentTypes: React.useMemo(
      () => contentTypes?.data ?? [],
      [contentTypes?.data]
    ),
    contentTypesSettings: React.useMemo(
      () => contentTypesSettings?.data ?? [],
      [contentTypesSettings?.data]
    ),
    collectionTypes,
    singleTypes
  };
}
