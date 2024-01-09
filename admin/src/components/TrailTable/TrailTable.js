import {
  Box,
  Flex,
  IconButton,
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
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

import getTrad from '../../utils/getTrad';
import getUser from '../../utils/getUser';
import TrailsTablePagination from '../TrailsTablePagination/TrailsTablePagination';

function TrailTable(props) {
  const { trails, setViewRevision, page, pageSize, total, pageCount, setPage } =
    props;

  const { formatMessage } = useIntl();

  return (
    <Fragment>
      {trails && trails.length > 0 && (
        <Fragment>
          <Box paddingBottom={4}>
            <TrailsTablePagination
              page={page}
              pageSize={pageSize}
              total={total}
              pageCount={pageCount}
              setPage={setPage}
            />
          </Box>
          <Table colCount={4} rowCount={trails.length}>
            <Thead>
              <Tr>
                <Th>
                  <Typography variant="sigma">
                    {formatMessage({
                      id: getTrad('plugin.admin.paperTrail.version'),
                      defaultMessage: 'Version'
                    })}
                  </Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">
                    {formatMessage({
                      id: getTrad('plugin.admin.paperTrail.changeType'),
                      defaultMessage: 'Change Type'
                    })}
                  </Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">
                    {formatMessage({
                      id: getTrad('plugin.admin.paperTrail.createdNaked'),
                      defaultMessage: 'Created'
                    })}
                  </Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">
                    {formatMessage({
                      id: getTrad('plugin.admin.paperTrail.createdByNaked'),
                      defaultMessage: 'Created By'
                    })}
                  </Typography>
                </Th>
                <Th>
                  <VisuallyHidden>
                    {formatMessage({
                      id: getTrad('plugin.admin.paperTrail.actions'),
                      defaultMessage: 'Actions'
                    })}
                  </VisuallyHidden>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {trails.map(trail => (
                <Tr key={trail.id}>
                  <Td>
                    <Typography textColor="neutral800">
                      {trail.version}
                    </Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral800">
                      {trail.change}
                    </Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral800">
                      {format(parseISO(trail.createdAt), 'MMM d, yyyy HH:mm')}
                    </Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral800">
                      {getUser(trail)}
                    </Typography>
                  </Td>
                  <Td>
                    <Flex>
                      <IconButton
                        onClick={() => setViewRevision(trail)}
                        label={`${formatMessage({
                          id: getTrad('plugin.admin.paperTrail.viewVersion'),
                          defaultMessage: 'View version'
                        })} ${trail.version}`}
                        noBorder
                        icon={<Eye />}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Box paddingTop={4}>
            <TrailsTablePagination
              page={page}
              pageSize={pageSize}
              total={total}
              pageCount={pageCount}
              setPage={setPage}
            />
          </Box>
        </Fragment>
      )}
      {!trails ||
        (trails.length == 0 && (
          <Typography variant="beta">
            {formatMessage({
              id: getTrad('plugin.admin.paperTrail.noTrails'),
              defaultMessage: 'Close'
            })}
          </Typography>
        ))}
    </Fragment>
  );
}

TrailTable.propTypes = {
  setViewRevision: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  trails: PropTypes.arrayOf(
    PropTypes.shape({
      change: PropTypes.string,
      content: PropTypes.object,
      contentType: PropTypes.string,
      createdAt: PropTypes.string,
      id: PropTypes.number,
      recordId: PropTypes.string,
      updatedAt: PropTypes.string,
      version: PropTypes.number
    })
  )
};

export default TrailTable;
