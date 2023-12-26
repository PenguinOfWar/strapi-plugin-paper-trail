import { Box, FieldLabel, Grid, Loader } from '@strapi/design-system';
import { Link } from '@strapi/design-system/v2';
import keyBy from 'lodash/keyBy';
import React from 'react';

import useContentTypes from '../../hooks/useContentTypes';
import useGetRecords from '../../hooks/useGetRecords';

const RelationField = ({ value, targetContentType }) => {
  const { data: { results } = {}, isLoading: isLoadingRecords } = useGetRecords(
    {
      contentType: targetContentType,
      params: {
        pageSize: 999,
        filters: {
          id: {
            $in: [...(value.connect || []), ...(value.disconnect || [])].map(
              item => item.id
            )
          }
        }
      }
    }
  );

  const { contentTypesSettings, isLoading: isLoadingSettings } =
    useContentTypes();
  const contentTypeSettings = contentTypesSettings?.find(
    type => type.uid === targetContentType
  );
  const mainField = contentTypeSettings?.settings.mainField;

  const isLoading = isLoadingRecords || isLoadingSettings;

  if (isLoading) return <Loader small />;

  const resultById = results?.length ? keyBy(results, 'id') : {};
  const mapRelations = arr =>
    arr.map(item => ({
      id: item.id,
      name: resultById[item.id][mainField || 'id'],
      href: `/content-manager/collectionType/${targetContentType}/${item.id}`
    }));

  const connectRecords = mapRelations(value?.connect);
  const disconnectRecords = mapRelations(value?.disconnect);

  return (
    <Grid gap={6} gridCols={2} alignItems="start">
      <RelationList label="Connect" value={connectRecords} />
      <RelationList label="Disconnect" value={disconnectRecords} />
    </Grid>
  );
};

const RelationList = ({ value, label }) => {
  if (!value?.length) return;

  return (
    <Box>
      <FieldLabel>{label}</FieldLabel>
      <ul>
        {value.map(item => (
          <li key={item.id}>
            <Box
              hasRadius
              shadow="tableShadow"
              borderColor="neutral150"
              padding={3}
              marginTop={1}
            >
              <Link href={item.href}>
                {item.name} (ID: {item.id})
              </Link>
            </Box>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default RelationField;
