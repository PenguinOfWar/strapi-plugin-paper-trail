import { BaseHeaderLayout, Box, Divider, Link } from '@strapi/design-system';
import { ArrowLeft } from '@strapi/icons';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

import getTrad from '../../utils/getTrad';
import getUser from '../../utils/getUser';
import RevisionForm from '../RevisionForm/RevisionForm';

function PaperTrailRestoreView(props) {
  const { trail, setViewRevision, setRevisedFields } = props;

  const { formatMessage } = useIntl();

  return (
    <Fragment>
      <Box background="neutral100">
        <BaseHeaderLayout
          navigationAction={
            <Link
              to="#back"
              startIcon={<ArrowLeft />}
              onClick={event => {
                event.preventDefault();
                setViewRevision(null);
              }}
            >
              {formatMessage({
                id: getTrad('plugin.admin.paperTrail.back'),
                defaultMessage: 'Back'
              })}
            </Link>
          }
          title={`${formatMessage({
            id: getTrad('plugin.admin.paperTrail.version'),
            defaultMessage: 'Version'
          })} ${trail.version}`}
          subtitle={`${formatMessage({
            id: getTrad('plugin.admin.paperTrail.id'),
            defaultMessage: 'ID'
          })}: ${trail.recordId} | ${trail.change} | ${format(
            parseISO(trail.createdAt),
            'MMM d, yyyy HH:mm'
          )} ${formatMessage({
            id: getTrad('plugin.admin.paperTrail.by'),
            defaultMessage: 'by'
          })} ${getUser(trail)}`}
          as="h3"
        />
      </Box>
      <Box paddingBottom={6} paddingTop={6}>
        <Divider />
      </Box>
      <Box
        background="neutral0"
        borderColor="neutral150"
        hasRadius
        paddingBottom={4}
        paddingLeft={4}
        paddingRight={4}
        paddingTop={6}
      >
        <RevisionForm trail={trail} setRevisedFields={setRevisedFields} />
      </Box>
    </Fragment>
  );
}

PaperTrailRestoreView.propTypes = {
  setViewRevision: PropTypes.func.isRequired,
  setRevisedFields: PropTypes.func.isRequired,
  trail: PropTypes.shape({
    change: PropTypes.string,
    content: PropTypes.object,
    contentType: PropTypes.string,
    createdAt: PropTypes.string,
    id: PropTypes.number,
    recordId: PropTypes.string,
    updatedAt: PropTypes.string
  })
};

export default PaperTrailRestoreView;
