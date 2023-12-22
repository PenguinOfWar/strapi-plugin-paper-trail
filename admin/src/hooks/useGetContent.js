import { useFetchClient } from '@strapi/helper-plugin';
import { useQuery } from 'react-query';

export default function useGetContent({ id, contentType } = {}) {
  const { get } = useFetchClient();
  const query = useQuery([contentType, id], async () => {
    const { data = {} } = await get(`/content-manager/collection-types/${contentType}/${id}`);

    return data;
  }, {
    enabled: !!id && !!contentType,
    retry: false,
  });

  return query;
}
