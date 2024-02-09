import {
  Box,
  Card,
  CardAsset,
  CardBadge,
  CardBody,
  CardContent,
  CardHeader,
  CardSubtitle,
  CardTitle,
  GridItem,
  Loader,
  Typography
} from '@strapi/design-system';
import { useFetchClient } from '@strapi/helper-plugin';
import { Picture } from '@strapi/icons';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import getTrad from '../../utils/getTrad';

function MediaCard(props) {
  const { id } = props;

  const [media, setMedia] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const { formatMessage } = useIntl();

  const request = useFetchClient();

  useEffect(() => {
    async function fetchData() {
      const requestUri = `/upload/files?page=1&pageSize=1&filters[$and][0][id]=${id}`;

      try {
        const result = await request.get(requestUri);

        const { data = {} } = result;

        const { results = [] } = data;

        if (results.length > 0) {
          setMedia(results[0]);
          setLoaded(true);
        } else {
          setError(
            formatMessage({
              id: getTrad('plugin.admin.paperTrail.mediaNotFound'),
              defaultMessage: 'Empty'
            })
          );
        }
      } catch (Err) {
        console.warn('paper-trail: ', Err);
        setError(Err);
      }
    }

    fetchData();
  }, [id, formatMessage, request]);

  return (
    <GridItem col={4}>
      {error ? (
        <Box
          background="neutral0"
          borderColor="neutral150"
          hasRadius
          paddingBottom={4}
          paddingLeft={4}
          paddingRight={4}
          paddingTop={6}
          shadow="tableShadow"
        >
          <Typography variant="beta">{String(error)}</Typography>
        </Box>
      ) : null}
      {!error && loaded && media ? (
        <Card
          style={{
            width: '100%'
          }}
        >
          <CardHeader>
            <CardAsset
              src={
                media?.mime?.includes('image')
                  ? media?.formats?.thumbnail?.url || media.url
                  : null
              }
            >
              {!media?.mime?.includes('image') ? <Picture /> : null}
            </CardAsset>
          </CardHeader>
          <CardBody>
            <CardContent>
              <CardTitle>{String(media?.name)}</CardTitle>
              <CardSubtitle>{String(media?.mime)}</CardSubtitle>
            </CardContent>
            <CardBadge>
              {formatMessage({
                id: getTrad('plugin.admin.paperTrail.media'),
                defaultMessage: 'Media'
              })}
            </CardBadge>
          </CardBody>
        </Card>
      ) : (
        <Box
          background="neutral0"
          borderColor="neutral150"
          hasRadius
          paddingBottom={4}
          paddingLeft={4}
          paddingRight={4}
          paddingTop={6}
          shadow="tableShadow"
        >
          <Loader />
        </Box>
      )}
    </GridItem>
  );
}

MediaCard.propTypes = {
  id: PropTypes.number.isRequired
};

export default MediaCard;
