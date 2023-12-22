import { BaseHeaderLayout, Box } from '@strapi/design-system';
import React from 'react';

import DraftTrailTable from '../../components/DraftTrailTable';
import useGetDraftTrails from '../../hooks/useGetDraftTrails';

const HomePage = () => {
  const {
    data: { results: trails, pagination } = {}
  } = useGetDraftTrails();

  return (
    <Box background="neutral100" marginBottom={10}>
      <BaseHeaderLayout
        title="Paper Trail"
        subtitle={pagination ? `${pagination.total} entities found` : undefined}
        as="h2"
      />
      <DraftTrailTable trails={trails} />
    </Box>
  );
};

export default HomePage;
