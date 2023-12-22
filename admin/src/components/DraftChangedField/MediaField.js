import {
  Box,
  FieldLabel,
  Grid,
  Loader,
  Typography
} from '@strapi/design-system';
import React from 'react';

import useGetUploadFiles from '../../hooks/useGetUploadFiles';

const MediaField = ({ value: newMedia, oldValue: currentMedia, multiple }) => {
  const medias = useGetUploadFiles({
    ids: multiple ? newMedia.map(media => media.id) : [newMedia]
  });

  const isLoading = medias.some(media => media.isLoading);
  const mediasData = medias.map(media => media.data);

  return (
    <Grid gap={6} gridCols={2} alignItems="start">
      <Media
        label="Current media"
        medias={multiple ? currentMedia : [currentMedia]}
      />
      <Media label="New media" medias={mediasData} loading={isLoading} />
    </Grid>
  );
};

const Media = ({ medias, label, loading }) => (
  <Box>
    <FieldLabel>{label}</FieldLabel>
    {loading ? (
      <Loader small>Loading media...</Loader>
    ) : (
      medias?.map((media, index) => (
        <Box
          key={media?.id || `media-${index}`}
          borderColor="neutral150"
          background="neutral0"
          marginTop={1}
          padding={2}
        >
          {media ? (
            <>
              {media?.mime.includes('video') ? (
                <video src={media?.url} width="100%" height="auto" />
              ) : (
                <img src={media?.url} width="100%" height="auto" />
              )}
              <Box marginTop={2}>
                <Typography variant="pi" ellipsis>
                  {media?.name}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography>undefined</Typography>
          )}
        </Box>
      ))
    )}
  </Box>
);

export default MediaField;
