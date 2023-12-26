import { BaseHeaderLayout, Box } from '@strapi/design-system';
import { useQueryParams } from '@strapi/helper-plugin';
import React, { useEffect } from 'react';

import DraftTrailTable from '../../components/DraftTrailTable';
import useGetDraftTrails from '../../hooks/useGetDraftTrails';

const HomePage = () => {
  const [{ query: params } = {}, setQuery] = useQueryParams(null);
  const { data: { results: trails, pagination } = {}, isLoading } =
    useGetDraftTrails({
      params
    });

  useEffect(() => {
    if (params === null) {
      setQuery({
        page: 1,
        pageSize: 10,
        sort: 'updatedAt:asc',
        filters: {
          $and: [
            {
              change: {
                $eq: 'DRAFT'
              }
            },
            {
              status: {
                $eq: 'pending'
              }
            }
          ]
        }
      });
    }
  }, [params]);

  return (
    <Box background="neutral100" marginBottom={10}>
      <BaseHeaderLayout
        title="Paper Trail"
        subtitle={`${pagination?.total || 0} entities found`}
        as="h2"
      />
      <DraftTrailTable
        trails={trails}
        pagination={pagination}
        loading={isLoading}
      />
    </Box>
  );
};

export default HomePage;
