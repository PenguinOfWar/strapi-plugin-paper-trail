import {
  Box,
  Flex,
  LinkButton,
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
import { PaginationURLQuery } from '@strapi/helper-plugin';
import { Eye } from '@strapi/icons';
import React from 'react';

import useContentTypes from '../../hooks/useContentTypes';
import pluginId from '../../pluginId';
import getTrailEntityName from '../../utils/getTrailEntityName';

export default function DraftTrailTable({ trails, pagination }) {
  const { contentTypesSettings, contentTypes } = useContentTypes();

  const getContentTypeName = uid => {
    if (!contentTypes?.length) return uid;

    const contentType = contentTypes.find(type => type.uid === uid);

    return contentType?.info?.displayName || uid;
  };

  return (
    <Box paddingLeft={10} paddingRight={10} background="neutral100">
      <Table colCount={7} rowCount={trails?.length || 0}>
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
