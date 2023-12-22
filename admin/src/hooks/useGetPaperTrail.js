import { useFetchClient } from '@strapi/helper-plugin';
import { useQuery } from 'react-query';

export default function useGetPaperTrail({ id } = {}) {
  const { get } = useFetchClient();
  const query = useQuery(['paper-trail', id], async () => {
    const { data = {} } = await get(`/content-manager/collection-types/plugin::paper-trail.trail/${id}?populate=*`);

    return data;
  }, {
    enabled: !!id,
    retry: false,
  });

  return query;
}
