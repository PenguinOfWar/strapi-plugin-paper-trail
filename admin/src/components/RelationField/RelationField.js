import { Box, Typography } from '@strapi/design-system';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

import getTrad from '../../utils/getTrad';

function RelationField(props) {
  const { relation, attributes } = props;

  const { connect, disconnect } = relation;

  const { target } = attributes;

  const { formatMessage } = useIntl();

  return (
    <Fragment>
      <Box paddingLeft={3}>
        <Typography variant="beta">
          {formatMessage({
            id: getTrad('plugin.admin.paperTrail.connect'),
            defaultMessage: 'Connect'
          })}
        </Typography>
        {connect && connect.length > 0 ? (
          <ul>
            {connect.map(item => (
              <li key={item.id}>
                <Typography variant="omega">
                  {target}: {item.id}
                </Typography>
              </li>
            ))}
          </ul>
        ) : (
          <Box paddingTop={2}>
            <Typography variant="omega">
              {formatMessage({
                id: getTrad('plugin.admin.paperTrail.empty'),
                defaultMessage: 'Empty'
              })}
            </Typography>
          </Box>
        )}
      </Box>
      <Box paddingLeft={3} paddingTop={2}>
        <Typography variant="beta">
          {formatMessage({
            id: getTrad('plugin.admin.paperTrail.disconnect'),
            defaultMessage: 'Disconnect'
          })}
        </Typography>
        {disconnect && disconnect.length > 0 ? (
          <ul>
            {disconnect.map(item => (
              <li key={item.id}>
                <Typography variant="omega">
                  {target}: {item.id}
                </Typography>
              </li>
            ))}
          </ul>
        ) : (
          <Box paddingTop={2}>
            <Typography variant="omega">
              {formatMessage({
                id: getTrad('plugin.admin.paperTrail.empty'),
                defaultMessage: 'Empty'
              })}
            </Typography>
          </Box>
        )}
      </Box>
    </Fragment>
  );
}

RelationField.propTypes = {
  relation: PropTypes.shape({
    connect: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number
      })
    ),
    disconnect: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number
      })
    )
  }),
  attributes: PropTypes.shape({
    target: PropTypes.string
  })
};

export default RelationField;
