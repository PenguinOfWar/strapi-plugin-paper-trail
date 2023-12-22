import { BaseHeaderLayout, Box } from '@strapi/design-system';
import { useQueryParams } from '@strapi/helper-plugin';
import React from 'react';

import DraftTrailTable from '../../components/DraftTrailTable';
import useGetDraftTrails from '../../hooks/useGetDraftTrails';

const HomePage = () => {
  const [{ query: params } = {}] = useQueryParams({
    page: 1,
    pageSize: 10
  });
  const { data: { results: trails, pagination } = {} } = useGetDraftTrails({ params });

  return (
    <Box background="neutral100" marginBottom={10}>
      <BaseHeaderLayout
        title="Paper Trail"
        subtitle={`${pagination?.total || 0} entities found`}
        as="h2"
      />
      <DraftTrailTable trails={trails} pagination={pagination} />
    </Box>
  );
};

export default HomePage;
