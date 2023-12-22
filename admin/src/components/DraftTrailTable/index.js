import {
  Box,
  Flex,
  LinkButton,
  Loader,
  Status,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
  VisuallyHidden
} from '@strapi/design-system';
import { PaginationURLQuery, useQueryParams } from '@strapi/helper-plugin';
import { Eye } from '@strapi/icons';
import set from 'lodash/fp/set';
import React from 'react';

import useContentTypes from '../../hooks/useContentTypes';
import pluginId from '../../pluginId';
import getTrailEntityName from '../../utils/getTrailEntityName';
import Tabs from './Tabs';

export default function DraftTrailTable({ trails, pagination, loading }) {
  const [{ query: params } = {}, setQuery] = useQueryParams({});
  const { contentTypesSettings, contentTypes } = useContentTypes();

  const getContentTypeName = uid => {
    if (!contentTypes?.length) return uid;

    const contentType = contentTypes.find(type => type.uid === uid);

    return contentType?.info?.displayName || uid;
  };

  const selectedTab = params.filters?.$and
    ?.map(filter => filter?.status?.$eq)
    .find(Boolean);

  const handleSelectTab = value => {
    const filters = params.filters?.$and || [];
    const currentFilterIndex = filters.findIndex(
      filter => !!filter?.status?.$eq
    );

    const filter = {
      status: {
        $eq: value
      }
    };

    const updatedParams = set(
      [
        'filters',
        '$and',
        currentFilterIndex === -1 ? filters.length : currentFilterIndex
      ],
      filter,
      params
    );

    setQuery({
      ...updatedParams,
      page: 1
    });
  };

  return (
    <Box paddingLeft={10} paddingRight={10} background="neutral100">
      <Box marginBottom={4}>
        <Tabs handleSelect={handleSelectTab} selected={selectedTab} />
      </Box>
      <Table colCount={8} rowCount={trails?.length || 0}>
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">ID</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Type</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Name</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Version</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Editor</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Updated At</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Status</Typography>
            </Th>
            <Th>
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading && (
            <Tr>
              <Td colSpan={8}>
                <Flex padding={4} justifyContent="center">
                  <Loader />
                </Flex>
              </Td>
            </Tr>
          )}
          {trails?.map(entry => (
            <Tr key={entry.id}>
              <Td>
                <Typography textColor="neutral800">{entry.id}</Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">
                  {getContentTypeName(entry.contentType)}
                </Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">
                  {getTrailEntityName({ trail: entry, contentTypesSettings })}
                </Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">{entry.version}</Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">
                  {entry.admin_user.firstname} {entry.admin_user.lastname}
                </Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">
                  {new Date(entry.updatedAt).toLocaleString()}
                </Typography>
              </Td>
              <Td>
                <Flex>
                  <TrailStatus status={entry.status} />
                </Flex>
              </Td>
              <Td>
                <LinkButton
                  size="S"
                  variant="tertiary"
                  startIcon={<Eye />}
                  to={`/plugins/${pluginId}/${entry.id}`}
                >
                  View
                </LinkButton>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {pagination && (
        <Flex justifyContent="end" marginTop={4}>
          <PaginationURLQuery pagination={pagination} />
        </Flex>
      )}
    </Box>
  );
}

const TrailStatus = ({ status } = {}) => {
  if (status === 'approved')
    return (
      <Status size="S" variant="success" showBullet={false}>
        <Typography>Approved</Typography>
      </Status>
    );

  if (status === 'changes_required')
    return (
      <Status size="S" variant="alternative" showBullet={false}>
        <Typography>Reproved</Typography>
      </Status>
    );

  return (
    <Status size="S" variant="secondary" showBullet={false}>
      <Typography>Pending</Typography>
    </Status>
  );
};
