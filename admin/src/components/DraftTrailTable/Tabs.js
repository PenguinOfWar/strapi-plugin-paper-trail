import { Flex, Typography } from '@strapi/design-system';
import { SimpleTabBox } from '@strapi/design-system/Tabs/components';
import React from 'react';

const Tabs = ({ handleSelect, selected }) => {
  return (
    <Flex gap={4}>
      {statusTabs.map(({ label, value }) => {
        const isSelected = selected === value;

        return (
          <SimpleTabBox
            key={`tab-${value}`}
            onClick={() => handleSelect?.(value)}
            padding={4}
            selected={isSelected}
          >
            <Typography
              variant="sigma"
              textColor={isSelected ? 'primary600' : 'neutral600'}
            >
              {label}
            </Typography>
          </SimpleTabBox>
        );
      })}
    </Flex>
  );
};

const statusTabs = [
  {
    label: 'Pending',
    value: 'pending'
  },
  {
    label: 'Approved',
    value: 'approved'
  },
  {
    label: 'Reproved',
    value: 'changes_required'
  }
];

export default Tabs;
