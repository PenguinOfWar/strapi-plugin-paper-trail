import { SingleSelect, SingleSelectOption } from '@strapi/design-system';
import React from 'react';

import useGetAdminUsers from '../../hooks/useGetAdminUsers';

const EditorSelect = ({ value, setValue }) => {
  const { data: users, isLoading } = useGetAdminUsers();

  console.log(users);

  return (
    <SingleSelect
      label="Editor"
      placeholder={isLoading ? 'Loading editors...' : 'Filter by editor'}
      disabled={isLoading}
      onClear={() => {
        setValue?.(undefined);
      }}
      value={value}
      onChange={setValue}
    >
      {users?.map(user => (
        <SingleSelectOption value={user.id}>
          {user.firstname} {user.lastname}
        </SingleSelectOption>
      ))}
    </SingleSelect>
  );
};

export default EditorSelect;
