import { Checkbox } from '@strapi/design-system';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

function CheckboxPT({
  description,
  isCreating,
  intlLabel,
  name,
  onChange,
  value
}) {
  const { formatMessage } = useIntl();

  const handleChange = value => {
    if (isCreating || value) {
      return onChange({ target: { name, value, type: 'checkbox' } });
    }

    return onChange({ target: { name, value: false, type: 'checkbox' } });
  };

  const label = intlLabel.id
    ? formatMessage(
        { id: intlLabel.id, defaultMessage: intlLabel.defaultMessage },
        { ...intlLabel.values }
      )
    : name;

  const hint = description
    ? formatMessage(
        { id: description.id, defaultMessage: description.defaultMessage },
        { ...description.values }
      )
    : '';

  return (
    <Checkbox
      hint={hint}
      id={name}
      name={name}
      onValueChange={handleChange}
      value={value}
      type="checkbox"
    >
      {label}
    </Checkbox>
  );
}

CheckboxPT.defaultProps = {
  description: null,
  isCreating: false
};

CheckboxPT.propTypes = {
  description: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    values: PropTypes.object
  }),
  intlLabel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    values: PropTypes.object
  }).isRequired,
  isCreating: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired
};

export default CheckboxPT;
