import { useFetchClient } from '@strapi/helper-plugin';
import qs from 'qs';
import { useQuery } from 'react-query';

export default function useGetDraftTrails({ params }) {
  const { get } = useFetchClient();
  const query = useQuery(['draft-paper-trail', params], async () => {
    const parsedParams = qs.stringify(
      {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        sort: 'updatedAt:asc',
        filters: {
          $and: [
            {
              change: {
                $eq: 'DRAFT'
              }
            }
          ]
        }
      },
      { encodeValuesOnly: true }
    );

    const { data = {} } = await get(
      `/content-manager/collection-types/plugin::paper-trail.trail?${parsedParams}`
    );
    const { results = [], pagination } = data;

    return { results, pagination };
  });

  return query;
}
