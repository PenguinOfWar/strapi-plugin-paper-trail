import {
  Accordion,
  AccordionContent,
  AccordionToggle,
  BaseCheckbox,
  Box,
  DateTimePicker,
  JSONInput,
  NumberInput,
  TextInput,
  Textarea,
  ToggleCheckbox,
  Typography
} from '@strapi/design-system';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';

import getTrad from '../../utils/getTrad';
import returnFieldType from '../../utils/returnFieldType';
import MediaField from '../MediaField/MediaField';
import RelationField from '../RelationField/RelationField';

function RenderField(props) {
  const { name, value, setRevisedFields, hideAccordion } = props;

  const { formatMessage } = useIntl();

  const { layout } = useCMEditViewDataManager();

  const { attributes } = layout;

  /**
   * get the schema attributes and handle unknown types as strings
   */

  const fieldAttr = attributes[name];

  const { type } = fieldAttr;

  const validType = returnFieldType(type);

  const [expanded, setExpanded] = useState(true);
  const [selected, setSelected] = useState(false);

  const renderFields = () => {
    return (
      <Fragment>
        <Box padding={3}>
          {hideAccordion && (
            <Box paddingBottom={2}>
              <Typography variant="beta">{name}:</Typography>
            </Box>
          )}
          {validType === 'datetime' && (
            <DateTimePicker
              aria-label={formatMessage({
                id: getTrad('plugin.admin.paperTrail.timePicker'),
                defaultMessage: 'Time picker'
              })}
              disabled={true}
              name={`datetimepicker-${name}`}
              step={15}
              selectedDateLabel={() => 'Date picker, current is undefined'}
              value={value}
            />
          )}
          {['string', 'enumeration', 'email', 'biginteger', 'uid'].includes(
            validType
          ) && (
            <TextInput
              aria-label={formatMessage({
                id: getTrad('plugin.admin.paperTrail.string'),
                defaultMessage: 'String'
              })}
              name={`string-${name}`}
              value={value ? value : ''}
              disabled
            />
          )}
          {['integer', 'decimal', 'float'].includes(validType) && (
            <NumberInput
              aria-label={formatMessage({
                id: getTrad('plugin.admin.paperTrail.number'),
                defaultMessage: 'Number'
              })}
              placeholder="This is a content placeholder"
              name={`number-${name}`}
              value={value}
              disabled={true}
            />
          )}
          {['text', 'richtext'].includes(validType) && (
            <Textarea
              aria-label={formatMessage({
                id: getTrad('plugin.admin.paperTrail.text'),
                defaultMessage: 'Text'
              })}
              name={`text-${name}`}
              disabled={true}
            >
              {value}
            </Textarea>
          )}
          {validType === 'boolean' && (
            <ToggleCheckbox
              onLabel={formatMessage({
                id: getTrad('plugin.admin.paperTrail.true'),
                defaultMessage: 'True'
              })}
              offLabel={formatMessage({
                id: getTrad('plugin.admin.paperTrail.false'),
                defaultMessage: 'False'
              })}
              checked={value}
              disabled={true}
            />
          )}
          {/* TODO: investigated a better way of managing this, and flag it in the readme as a risk */}
          {['json', 'dynamiczone', 'component'].includes(validType) && (
            <JSONInput value={JSON.stringify(value, null, 2)} />
          )}
          {validType === 'media' && (
            <MediaField media={value} attributes={fieldAttr} />
          )}
          {validType === 'relation' && (
            <RelationField relation={value} attributes={fieldAttr} />
          )}
        </Box>
      </Fragment>
    );
  };

  return (
    <Box padding={4} background="neutral100">
      {!hideAccordion && (
        <Accordion
          expanded={expanded}
          onToggle={() => setExpanded(s => !s)}
          id={`acc-field-pt-${name}`}
        >
          <AccordionToggle
            togglePosition="right"
            title={name}
            description={
              validType === type
                ? validType
                : `${type} (${formatMessage({
                    id: getTrad('plugin.admin.paperTrail.asString'),
                    defaultMessage: 'As string'
                  })})`
            }
            action={
              <BaseCheckbox
                aria-label={formatMessage({
                  id: getTrad('plugin.admin.paperTrail.selectRevision'),
                  defaultMessage: 'Select revision'
                })}
                name={name}
                onValueChange={value => {
                  setSelected(value);
                  setRevisedFields(name, value);
                }}
                value={selected}
              />
            }
          />
          <AccordionContent>{renderFields()}</AccordionContent>
        </Accordion>
      )}
      {hideAccordion && renderFields()}
    </Box>
  );
}

RenderField.propTypes = {
  hideAccordion: PropTypes.bool,
  setRevisedFields: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.any
};

export default RenderField;
