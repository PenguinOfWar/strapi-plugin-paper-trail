import {
  Accordion,
  AccordionContent,
  AccordionToggle,
  BaseHeaderLayout,
  Box,
  Divider,
  JSONInput,
  Link
} from '@strapi/design-system';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { ArrowLeft } from '@strapi/icons';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import prepareTrailFromSchema from '../../../../server/utils/prepareTrailFromSchema';
import buildPayload from '../../utils/buildPayload';
import getTrad from '../../utils/getTrad';
import RenderField from '../RenderField/RenderField';

function PaperTrailReview(props) {
  const { trail, revisedFields, setShowReviewStep } = props;
  const { content } = trail;
  const [expanded, setExpanded] = useState(false);
  const [changePayload, setChangePayload] = useState({});

  const { layout } = useCMEditViewDataManager();

  const { trail: trimmedContent } = useMemo(() => {
    return prepareTrailFromSchema(content, layout);
  }, [content, layout]);

  const { formatMessage } = useIntl();

  useEffect(() => {
    let changePayloadObj = buildPayload(trimmedContent, revisedFields);

    setChangePayload(changePayloadObj);
  }, [trimmedContent]);

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
                setShowReviewStep(false);
              }}
            >
              {formatMessage({
                id: getTrad('plugin.admin.paperTrail.back'),
                defaultMessage: 'Back'
              })}
            </Link>
          }
          title={formatMessage({
            id: getTrad('plugin.admin.paperTrail.reviewChanges'),
            defaultMessage: 'Review changes'
          })}
          subtitle={formatMessage({
            id: getTrad('plugin.admin.paperTrail.reviewChangesDescription'),
            defaultMessage:
              "Review the below changes carefully. Upon clicking 'Restore' the record will be instantly updated with the selected values."
          })}
          as="h3"
        />
      </Box>
      <Box paddingBottom={6} paddingTop={6}>
        <Divider />
      </Box>
      <Box padding={4} background="neutral100">
        {Object.keys(changePayload).map(key => (
          <RenderField
            key={key}
            name={key}
            value={changePayload[key]}
            hideAccordion={true}
          />
        ))}
      </Box>
      <Box padding={4} background="neutral100">
        <Accordion
          expanded={expanded}
          onToggle={() => setExpanded(s => !s)}
          id="acc-field-pt-raw"
        >
          <AccordionToggle
            togglePosition="right"
            title={formatMessage({
              id: getTrad('plugin.admin.paperTrail.viewRawJson'),
              defaultMessage: 'View Raw JSON'
            })}
          />
          <AccordionContent>
            <Box padding={3}>
              <JSONInput value={JSON.stringify(changePayload, null, 2)} />
            </Box>
          </AccordionContent>
        </Accordion>
      </Box>
    </Fragment>
  );
}

PaperTrailReview.propTypes = {
  trail: PropTypes.shape({
    change: PropTypes.string,
    content: PropTypes.object,
    contentType: PropTypes.string,
    createdAt: PropTypes.string,
    id: PropTypes.number,
    recordId: PropTypes.string,
    updatedAt: PropTypes.string,
    version: PropTypes.number
  }),
  revisedFields: PropTypes.arrayOf(PropTypes.string)
};

export default PaperTrailReview;
