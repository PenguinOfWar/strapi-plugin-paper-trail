import { Flex, Typography } from '@strapi/design-system';
import { SimpleTabBox } from '@strapi/design-system/Tabs/components';
import React from 'react';

const Tabs = ({ handleSelect, selected }) => {
  return (
    <Flex gap={4}>
      {statusTabs.map(({ label, value }) => {
        const isSelected = selected === value;

        return (
          <button key={`tab-${value}`} onClick={() => handleSelect?.(value)}>
            <SimpleTabBox padding={4} selected={isSelected}>
              <Typography
                variant="sigma"
                textColor={isSelected ? 'primary600' : 'neutral600'}
              >
                {label}
              </Typography>
            </SimpleTabBox>
          </button>
        );
      })}
    </Flex>
  );
};

const statusTabs = [
  {
    label: 'All',
    value: undefined,
  },
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
