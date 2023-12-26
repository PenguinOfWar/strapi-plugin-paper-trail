import { useFetchClient } from '@strapi/helper-plugin';
import qs from 'qs';
import { useQuery } from 'react-query';

export default function useGetAdminUsers() {
  const { get } = useFetchClient();
  const query = useQuery(['admin', 'users'], async () => {
    const query = qs.stringify(
      {
        page: 1,
        pageSize: 999,
        fields: ['firstname', 'lastname']
      },
      { encodeValuesOnly: true }
    );

    const { data = {} } = await get(`/admin/users?${query}`);
    const { results = [] } = data?.data;

    return results;
  });

  return query;
}
