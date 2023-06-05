import { Box, Grid, Typography } from '@strapi/design-system';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import getTrad from '../../utils/getTrad';
import MediaCard from '../MediaCard/MediaCard';

function MediaField(props) {
  const { media, attributes } = props;
  const { multiple } = attributes;

  const { formatMessage } = useIntl();

  if (!media || media.length === 0) {
    return (
      <Box paddingTop={2} paddingLeft={4}>
        <Typography variant="beta">
          {formatMessage({
            id: getTrad('plugin.admin.paperTrail.empty'),
            defaultMessage: 'Empty'
          })}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid gap={5}>
      {multiple ? (
        media.map(item => <MediaCard key={item.id} id={item.id} />)
      ) : (
        <MediaCard id={media} />
      )}
    </Grid>
  );
}

MediaField.propTypes = {
  media: PropTypes.any,
  attributes: PropTypes.shape({
    multiple: PropTypes.bool
  })
};

export default MediaField;
