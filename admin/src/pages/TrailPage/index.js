import {
  BaseHeaderLayout,
  Box,
  Button,
  Flex,
  Link,
  LinkButton,
  Typography
} from '@strapi/design-system';
import { ArrowLeft, Check, Eye } from '@strapi/icons';
import set from 'lodash/fp/set';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import DraftChangedField from '../../components/DraftChangedField';
import useApplyTrail from '../../hooks/useApplyTrail';
import useContentTypes from '../../hooks/useContentTypes';
import useGetContent from '../../hooks/useGetContent';
import useGetPaperTrail from '../../hooks/useGetPaperTrail';
import useUpdatePaperTrail from '../../hooks/useUpdatePaperTrail';
import pluginId from '../../pluginId';
import getTrailChangedFields from '../../utils/getTrailChangedFields';
import getTrailEntityName from '../../utils/getTrailEntityName';
import { LoadingIndicatorPage, NoContent } from '@strapi/helper-plugin';

const TrailPage = () => {
  const { id } = useParams();
  const { data: trail, isLoading: isLoadingTrail } = useGetPaperTrail({ id });
  const { data: originalContent } = useGetContent({
    id: trail?.recordId,
    contentType: trail?.contentType
  });
  const {
    contentTypes,
    componentTypes,
    contentTypesSettings,
    isLoading: isLoadingContentTypes
  } = useContentTypes();
  const { mutate: updatePaperTrail } = useUpdatePaperTrail();
  const { mutate: applyTrail } = useApplyTrail();
  const [fieldComments, setFieldComments] = useState({});

  useEffect(() => {
    if (trail && trail.fieldComments) {
      setFieldComments(trail.fieldComments);
    }
  }, [trail]);

  const changedFields = useMemo(() => {
    if (
      !trail ||
      !originalContent ||
      !contentTypes ||
      !componentTypes ||
      isLoadingContentTypes
    )
      return;

    return getTrailChangedFields({
      trail,
      originalContent,
      components: componentTypes,
      contentTypes
    });
  }, [
    trail,
    originalContent,
    contentTypes,
    componentTypes,
    isLoadingContentTypes
  ]);

  const handleCommentChange = (path, value) => {
    setFieldComments(set(path, value, fieldComments));
  };

  const handleRequestChanges = () => {
    updatePaperTrail({
      id,
      data: {
        fieldComments,
        status: 'changes_required'
      }
    });
  };

  const handleApplyTrail = () => {
    applyTrail({ trail });
  };

  const isLoading = isLoadingContentTypes || isLoadingTrail;

  if (isLoading) return <LoadingIndicatorPage />;

  if (!isLoadingTrail && !trail) {
    return (
      <Box padding={8} background="neutral100">
        <NoContent />
      </Box>
    );
  }

  const schema = contentTypes.find(type => type.uid === trail.contentType);

  const getUserFullName = user =>
    user ? `${user.firstname} ${user.lastname}` : undefined;

  const trailBy = getUserFullName(trail.admin_user);
  const lastChangeBy = getUserFullName(trail.updatedBy);

  return (
    <div>
      <Box background="neutral100">
        <BaseHeaderLayout
          navigationAction={
            <Link startIcon={<ArrowLeft />} to={`/plugins/${pluginId}`}>
              Go back
            </Link>
          }
          primaryAction={
            <Flex gap={2}>
              <Button variant="secondary" onClick={handleRequestChanges}>
                Comment and reprove
              </Button>
              <Button startIcon={<Check />} onClick={handleApplyTrail}>
                Approve and apply changes
              </Button>
            </Flex>
          }
          secondaryAction={
            <LinkButton
              size="S"
              variant="tertiary"
              startIcon={<Eye />}
              href={`/content-manager/collectionType/${trail.contentType}/${trail.recordId}`}
            >
              View entity
            </LinkButton>
          }
          title={`Paper Trail of ${getTrailEntityName({
            trail,
            contentTypesSettings
          })}`}
          subtitle={`Version ${trail.version} by ${trailBy} - Last updated by ${
            lastChangeBy || '-'
          }`}
          as="h2"
        />
      </Box>
      <Box paddingLeft={10} paddingRight={10}>
        <Box
          hasRadius
          background="neutral0"
          shadow="tableShadow"
          paddingLeft={6}
          paddingRight={6}
          paddingTop={6}
          paddingBottom={6}
          marginBottom={6}
          borderColor="neutral150"
        >
          {trail.status === 'approved' ? (
            <Typography>Changes applied, no diffs to display</Typography>
          ) : isEmpty(changedFields) ? (
            <Typography>No changes to display</Typography>
          ) : (
            <Flex direction="column" gap={6} alignItems="stretch">
              {changedFields &&
                Object.entries(changedFields).map(([key, value]) => (
                  <DraftChangedField
                    key={`${key}-field`}
                    path={key}
                    value={value}
                    oldValue={originalContent[key]}
                    schema={schema}
                    componentTypes={componentTypes}
                    comments={fieldComments}
                    handleCommentChange={handleCommentChange}
                  />
                ))}
            </Flex>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default TrailPage;
