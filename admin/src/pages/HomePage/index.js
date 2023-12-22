import { BaseHeaderLayout, Box } from '@strapi/design-system';
import React from 'react';

import DraftTrailTable from '../../components/DraftTrailTable';
import useGetDraftTrails from '../../hooks/useGetDraftTrails';

const HomePage = () => {
  const { data: trails } = useGetDraftTrails();

  return (
    <Box background="neutral100" marginBottom={10}>
      <BaseHeaderLayout
        title="Paper Trail"
        subtitle={trails ? `${trails.length} entities found` : undefined}
        as="h2"
      />
      <DraftTrailTable trails={trails} />
    </Box>
  );
};

export default HomePage;
