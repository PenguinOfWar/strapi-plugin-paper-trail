import { useFetchClient } from '@strapi/helper-plugin';
import { useQuery } from 'react-query';

export default function useGetDraftTrails() {
  const { get } = useFetchClient();
  const query = useQuery(['draft-paper-trail'], async () => {
    const requestUri = [
      '/content-manager/collection-types/plugin::paper-trail.trail?page=1',
      'pageSize=999',
      'sort=updatedAt:asc',
      'filters[$and][0][change][$eq]=DRAFT'
    ].join('&');

    const { data = {} } = await get(requestUri);
    const { results = [], pagination } = data;

    return { results, pagination };
  });

  return query;
}
