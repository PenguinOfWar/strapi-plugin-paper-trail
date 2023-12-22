import { useFetchClient } from '@strapi/helper-plugin';
import { useQueries } from 'react-query';

export default function useGetUploadFiles({ ids = [] } = {}) {
  const { get } = useFetchClient();
  const queries = useQueries(
    ids.map(id => ({
      queryKey: ['upload', 'file', id],
      async queryFn() {
        if (!id) return undefined;

        const { data } = await get(`/upload/files/${id}`);

        return data;
      }
    }))
  );

  return queries;
}
