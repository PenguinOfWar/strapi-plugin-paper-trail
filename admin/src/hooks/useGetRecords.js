import { useFetchClient } from '@strapi/helper-plugin';
import qs from 'qs';
import { useQuery } from 'react-query';

export default function useGetRecords({ params, contentType, enabled }) {
  const { get } = useFetchClient();
  const query = useQuery(
    ['collection-types', contentType, params],
    async () => {
      const parsedParams = qs.stringify(params, { encodeValuesOnly: true });

      const { data = {} } = await get(
        `/content-manager/collection-types/${contentType}?${parsedParams}`
      );
      const { results = [], pagination } = data;

      return { results, pagination };
    },
    {
      enabled
    }
  );

  return query;
}
