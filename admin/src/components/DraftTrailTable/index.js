import {
  BaseCheckbox,
  Box,
  Flex,
  IconButton,
  Link,
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
import { Eye } from '@strapi/icons';
import React from 'react';

import useContentTypes from '../../hooks/useContentTypes';
import pluginId from '../../pluginId';
import getTrailEntityName from '../../utils/getTrailEntityName';

export default function DraftTrailTable({ trails }) {
  const { contentTypesSettings } = useContentTypes();

  return (
    <Box paddingLeft={10} paddingRight={10} background="neutral100">
      <Table colCount={7} rowCount={trails?.length || 0}>
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">ID</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Content Type</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Entity</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Version</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Created By</Typography>
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
                  {entry.contentType}
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
                <TrailStatus status={entry.status} />
              </Td>
              <Td>
                <Flex>
                  <Link to={`/plugins/${pluginId}/${entry.id}`}>
                    <IconButton label="View" noBorder icon={<Eye />} />
                  </Link>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

const TrailStatus = ({ status } = {}) => {
  if (status === 'approved')
    return (
      <Status variant="success" showBullet={false}>
        <Typography>Approved</Typography>
      </Status>
    );

  if (status === 'changes_required')
    return (
      <Status variant="alternative" showBullet={false}>
        <Typography>Reproved</Typography>
      </Status>
    );

  return (
    <Status variant="secondary" showBullet={false}>
      <Typography>Pending</Typography>
    </Status>
  );
};
