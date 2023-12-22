import {
  useAPIErrorHandler,
  useFetchClient,
  useNotification
} from '@strapi/helper-plugin';
import { useMutation } from 'react-query';

export default function useApplyTrail() {
  const { put } = useFetchClient();
  const { formatAPIError } = useAPIErrorHandler();
  const toggleNotification = useNotification();

  return useMutation({
    mutationFn: async ({ trail }) => {
      const { recordId, content, contentType } = trail;
      await put(`/content-manager/collection-types/${contentType}/${recordId}`, content);

      return put(
        `/content-manager/collection-types/plugin::paper-trail.trail/${trail.id}`,
        { status: 'approved' }
      );
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toggleNotification({
          type: 'warning',
          message: formatAPIError(error)
        });
      }
    },
    onSuccess() {
      toggleNotification({
        type: 'success',
        message: 'Paper Trail applied successfully'
      });
    }
  });
}
