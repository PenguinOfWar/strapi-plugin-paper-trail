import {
  Box,
  Divider,
  FieldLabel,
  Flex,
  Grid,
  TextInput,
  Textarea,
  Typography
} from '@strapi/design-system';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import React from 'react';

import MediaField from './MediaField';
import RelationField from './RelationField';

const IGNORE_FIELDS = ['id'];
const TEXTAREA_TYPES = ['text', 'richtext', 'json'];

const DraftChangedField = ({
  level = 0,
  path,
  pathToParent = '',
  value,
  oldValue,
  schema,
  comments,
  componentTypes,
  handleCommentChange
}) => {
  if (IGNORE_FIELDS.includes(path)) return;

  const type = get(schema, ['attributes', path, 'type'], '');
  const fullPath = pathToParent ? [pathToParent, path].join('.') : path;

  const onCommentChange = event => {
    handleCommentChange?.(fullPath, event.target.value);
  };

  if (type === 'component') {
    const component = get(schema, ['attributes', path, 'component'], '');
    const componentType = componentTypes.find(type => type.uid === component);

    return (
      <Wrapper
        hideComment
        label={path}
        level={level}
        fullPath={fullPath}
        comment={get(comments, fullPath, '')}
        onCommentChange={onCommentChange}
      >
        <Flex gap={6} direction="column" alignItems="stretch">
          {Object.entries(value).map(([key, value]) => (
            <DraftChangedField
              key={key}
              level={level + 1}
              path={key}
              pathToParent={path}
              value={value}
              oldValue={oldValue?.[key]}
              schema={componentType}
              comments={comments}
              handleCommentChange={handleCommentChange}
            />
          ))}
        </Flex>
      </Wrapper>
    );
  }

  if (type === 'relation') {
    const target = get(schema, ['attributes', path, 'targetModel']);
  
    return (
      <Wrapper
        label={path}
        level={level}
        fullPath={fullPath}
        comment={get(comments, fullPath, null)}
        onCommentChange={onCommentChange}
      >
        <RelationField value={value} targetContentType={target} />
      </Wrapper>
    );
  }

  if (type === 'media') {
    const multiple = get(schema, ['attributes', path, 'multiple'], '');

    return (
      <Wrapper
        label={path}
        level={level}
        fullPath={fullPath}
        comment={get(comments, fullPath, null)}
        onCommentChange={onCommentChange}
      >
        <MediaField value={value} oldValue={oldValue} multiple={multiple} />
      </Wrapper>
    );
  }

  const mapValue = v => (isObject(v) ? JSON.stringify(v) : v?.toString() || '');

  const Input = TEXTAREA_TYPES.includes(type) ? Textarea : TextInput;

  return (
    <Wrapper
      label={path}
      level={level}
      fullPath={fullPath}
      comment={get(comments, fullPath, null)}
      onCommentChange={onCommentChange}
    >
      <Grid gap={6} gridCols={2} alignItems="center">
        <Input label="Current value" value={mapValue(oldValue)} readOnly />
        <Input label="New value" value={mapValue(value)} readOnly />
      </Grid>
    </Wrapper>
  );
};

const Wrapper = ({
  children,
  hideComment,
  label,
  level,
  fullPath,
  onCommentChange,
  comment
}) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    <Box
      hasRadius
      background={level % 2 === 0 ? 'neutral100' : 'neutral0'}
      shadow="tableShadow"
      paddingLeft={6}
      paddingRight={6}
      marginTop={1}
      paddingTop={6}
      paddingBottom={6}
      borderColor="neutral150"
    >
      {children}
      {!hideComment && (
        <>
          <Box paddingTop={4} paddingBottom={4}>
            <Divider />
          </Box>
          <Textarea
            name={fullPath}
            label="Comment"
            value={comment || ''}
            onChange={onCommentChange}
          />
        </>
      )}
    </Box>
  </div>
);

export default DraftChangedField;
