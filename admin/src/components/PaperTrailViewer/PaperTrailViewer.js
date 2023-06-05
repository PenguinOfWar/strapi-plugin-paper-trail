import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Flex,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  Typography
} from '@strapi/design-system';
import {
  useCMEditViewDataManager,
  useFetchClient
} from '@strapi/helper-plugin';
import { ExclamationMarkCircle } from '@strapi/icons';
import PropTypes from 'prop-types';
import React, { Fragment, useCallback, useState } from 'react';
import { useIntl } from 'react-intl';

import prepareTrailFromSchema from '../../../../server/utils/prepareTrailFromSchema';
import buildPayload from '../../utils/buildPayload';
import getTrad from '../../utils/getTrad';
import PaperTrailRestoreView from '../PaperTrailRestoreView/PaperTrailRestoreView';
import PaperTrailReview from '../PaperTrailReview/PaperTrailReview';
import TrailTable from '../TrailTable/TrailTable';

function PaperTrailViewer(props) {
  const { visible, setVisible, trails, setError, error } = props;
  const [viewRevision, setViewRevision] = useState(null);
  const [revisedFields, setRevisedFields] = useState([]);
  const [showReviewStep, setShowReviewStep] = useState(false);

  const { formatMessage } = useIntl();

  const handleClose = useCallback(() => {
    setVisible(!visible);
    setViewRevision(null);
    setRevisedFields([]);
    setShowReviewStep(false);
  }, [visible]);

  const handleSetViewRevision = useCallback(viewRevisionState => {
    setRevisedFields([]);
    setViewRevision(viewRevisionState);
    setShowReviewStep(false);
  }, []);

  const handleSetRevisedFields = useCallback(
    (name, checked) => {
      /**
       * if checked, add the name to the array otherwise splice
       */

      if (checked && !revisedFields.includes(name)) {
        setRevisedFields([...revisedFields, name]);
      }

      if (!checked && revisedFields.includes(name)) {
        const index = revisedFields.indexOf(name);
        let newArr = [...revisedFields];
        newArr.splice(index, 1);

        setRevisedFields(newArr);
      }
    },
    [revisedFields]
  );

  const handleSetShowReviewStep = useCallback(bool => {
    setShowReviewStep(bool);
    if (!bool) {
      setRevisedFields([]);
    }
  }, []);

  /**
   * Submission handler for restoring
   */

  const request = useFetchClient();
  const { layout } = useCMEditViewDataManager();

  const handleRestoreSubmission = useCallback(async () => {
    /**
     * Gather the final payload
     */

    // TODO: Warning about changing content type/UID dropping trails from the admin panel / killing relationship

    const { recordId, content, contentType } = viewRevision;

    const { trail: trimmedContent } = prepareTrailFromSchema(content, layout);

    const payload = buildPayload(trimmedContent, revisedFields);

    try {
      const requestUri = `/content-manager/collection-types/${contentType}/${recordId}`;
      await request.put(requestUri, payload);

      location.reload();
    } catch (Err) {
      setError(Err);
      console.warn('paper-trail:', Err);
    }
  }, [layout, viewRevision, revisedFields]);

  return (
    <Fragment>
      {visible && (
        <ModalLayout onClose={() => handleClose()} labelledBy="title">
          <ModalHeader>
            <Typography
              fontWeight="bold"
              textColor="neutral800"
              as="h2"
              id="title"
            >
              {formatMessage({
                id: getTrad('plugin.admin.paperTrail.revisionHistory'),
                defaultMessage: 'Revision History'
              })}
            </Typography>
          </ModalHeader>
          <ModalBody>
            {!viewRevision && (
              <TrailTable
                trails={trails}
                setViewRevision={handleSetViewRevision}
              />
            )}
            {viewRevision && !showReviewStep && (
              <PaperTrailRestoreView
                trail={viewRevision}
                setViewRevision={handleSetViewRevision}
                setRevisedFields={handleSetRevisedFields}
              />
            )}
            {viewRevision && showReviewStep && (
              <PaperTrailReview
                trail={viewRevision}
                setShowReviewStep={handleSetShowReviewStep}
                revisedFields={revisedFields}
              />
            )}
            {/* error alert */}
            {error && (
              <Dialog
                onClose={() => setError(null)}
                title={formatMessage({
                  id: getTrad('plugin.admin.paperTrail.error'),
                  defaultMessage: 'Error'
                })}
                isOpen={Boolean(error)}
              >
                <DialogBody icon={<ExclamationMarkCircle />}>
                  <Flex direction="column" alignItems="center" gap={2}>
                    <Flex justifyContent="center">
                      <Typography>{String(error)}</Typography>
                    </Flex>
                  </Flex>
                </DialogBody>
                <DialogFooter
                  startAction={
                    <Button onClick={() => setError(null)} variant="tertiary">
                      {formatMessage({
                        id: getTrad('plugin.admin.paperTrail.close'),
                        defaultMessage: 'Close'
                      })}
                    </Button>
                  }
                />
              </Dialog>
            )}
          </ModalBody>
          <ModalFooter
            endActions={
              <Fragment>
                {!showReviewStep &&
                  revisedFields &&
                  revisedFields.length > 0 && (
                    <Button
                      variant="success-light"
                      onClick={() => handleSetShowReviewStep(true)}
                    >
                      {formatMessage({
                        id: getTrad('plugin.admin.paperTrail.review'),
                        defaultMessage: 'Review'
                      })}
                    </Button>
                  )}
                {showReviewStep &&
                  revisedFields &&
                  revisedFields.length > 0 && (
                    <Button
                      variant="danger"
                      onClick={() => handleRestoreSubmission()}
                    >
                      {formatMessage({
                        id: getTrad('plugin.admin.paperTrail.restore'),
                        defaultMessage: 'Restore'
                      })}
                    </Button>
                  )}
                <Button onClick={() => handleClose()} variant="tertiary">
                  {formatMessage({
                    id: getTrad('plugin.admin.paperTrail.close'),
                    defaultMessage: 'Close'
                  })}
                </Button>
              </Fragment>
            }
          />
        </ModalLayout>
      )}
    </Fragment>
  );
}

PaperTrailViewer.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func.isRequired,
  error: PropTypes.any,
  setError: PropTypes.func.isRequired,
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

export default PaperTrailViewer;
