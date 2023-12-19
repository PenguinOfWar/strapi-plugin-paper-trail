import {
  Box,
  Button,
  Divider,
  Loader,
  Textarea,
  Typography
} from '@strapi/design-system';
import {
  useCMEditViewDataManager,
  useFetchClient
} from '@strapi/helper-plugin';
import { format, parseISO } from 'date-fns';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import getTrad from '../../utils/getTrad';
import getUser from '../../utils/getUser';
import PaperTrailViewer from '../PaperTrailViewer/PaperTrailViewer';

function PaperTrail() {
  /**
   * Get the current schema
   */
  const { layout, modifiedData, slug } = useCMEditViewDataManager();

  const { uid, pluginOptions = {} } = layout;

  const { formatMessage } = useIntl();
  const { id } = useParams();

  const paperTrailEnabled = pluginOptions?.paperTrail?.enabled;

  const request = useFetchClient();

  const [trails, setTrails] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [current, setCurrent] = useState(null);
  const [error, setError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function getTrails() {
      // TODO: Add pagination to this so it doesn't get out of hand

      const requestUri = [
        '/content-manager/collection-types/plugin::paper-trail.trail?page=1',
        'pageSize=999',
        'sort=version:DESC',
        `filters[$and][0][contentType][$eq]=${uid}&filters[$and][1][recordId][$eq]=${id}`
      ].join('&');

      try {
        const result = await request.get(requestUri);

        const { data = {} } = result;

        const { results = [] } = data;

        setTrails(results);
        setLoaded(true);
      } catch (Err) {
        console.warn('paper-trail: ', Err);
        setError(Err);
      }
    }
    if (!loaded) {
      getTrails();
    }
  }, [loaded, uid, id]);

  /**
   * event listener for submit button
   */

  const handler = useCallback(() => {
    setTimeout(() => {
      setLoaded(false);
    }, 1000);
  }, []);

  /**
   * TODO: this event listener is not working properly 100% of the time needs a better solution
   */

  useEffect(() => {
    const buttons = document.querySelectorAll('main button[type=submit]');
    if (buttons[0]) {
      const button = buttons[0];

      button.addEventListener('click', handler);

      return () => {
        button.removeEventListener('click', handler);
      };
    }
  }, [handler]);

  /**
   * When paper trails are updated take the top one and pin it as current
   */

  useEffect(() => {
    if (trails.length > 0) {
      console.log(trails.find(trail => trail.change !== 'DRAFT'));
      setCurrent(trails.find(trail => trail.change !== 'DRAFT'));
    }
  }, [trails]);

  const handleUpdateComment = (comment) => {
    if (!current) return;

    request.put(
      `/content-manager/collection-types/plugin::paper-trail.trail/${current.id}`,
      { comment }
    );
  };

  const handleSaveDraft = async () => {
    try {
      const { data: response } = await request.post(
        '/paper-trail/draft',
        {
          contentType: slug,
          ...modifiedData
        }
      );
      console.log(response);
    } catch (err) {
      console.error(err)
    }
  }

  if (!paperTrailEnabled) {
    return <Fragment />;
  }

  // TODO: Add diff comparison
  // TODO: Add pagination
  // TODO: Add support for deleted record audit trails
  // TODO: Add up/down for changing UIDs and enabling/disabling plugin

  return (
    <Fragment>
      <Box
        as="aside"
        aria-labelledby="paper-trail-records"
        background="neutral0"
        borderColor="neutral150"
        hasRadius
        paddingBottom={4}
        paddingLeft={4}
        paddingRight={4}
        paddingTop={6}
        shadow="tableShadow"
      >
        <Typography
          variant="sigma"
          textColor="neutral600"
          id="paper-trail-records"
        >
          {formatMessage({
            id: getTrad('plugin.admin.paperTrail.title'),
            defaultMessage: 'Paper Trail'
          })}
        </Typography>
        <Box paddingTop={2} paddingBottom={4}>
          <Divider />
        </Box>
        {loaded ? (
          <Fragment>
            {trails.length === 0 && (
              <Typography fontWeight="bold">
                {formatMessage({
                  id: getTrad('plugin.admin.paperTrail.noTrails'),
                  defaultMessage: 'No versions (yet)'
                })}
              </Typography>
            )}
            {trails.length > 0 && current && (
              <Fragment>
                <p>
                  <Typography fontWeight="bold">
                    {formatMessage({
                      id: getTrad('plugin.admin.paperTrail.currentVersion'),
                      defaultMessage: 'Current version:'
                    })}{' '}
                    {current.version}
                  </Typography>
                </p>
                <p>
                  <Typography variant="pi" fontWeight="bold" color="Neutral600">
                    {formatMessage({
                      id: getTrad('plugin.admin.paperTrail.created'),
                      defaultMessage: 'Created:'
                    })}{' '}
                  </Typography>
                  <Typography variant="pi" color="Neutral600">
                    {format(parseISO(current.createdAt), 'MMM d, yyyy HH:mm')}
                  </Typography>
                </p>
                <p>
                  <Typography variant="pi" fontWeight="bold" color="Neutral600">
                    {formatMessage({
                      id: getTrad('plugin.admin.paperTrail.createdBy'),
                      defaultMessage: 'Created by:'
                    })}{' '}
                  </Typography>
                  <Typography variant="pi" color="Neutral600">
                    {getUser(current)}
                  </Typography>
                </p>
                <Box paddingTop={2}>
                  <Textarea
                    label="Version comment"
                    defaultValue={current.comment || ''}
                    onChange={(event) => handleUpdateComment(event.target.value)}
                  />
                </Box>
                <Box paddingTop={4}>
                  <Button onClick={() => handleSaveDraft()}>
                    {formatMessage({
                      id: getTrad('plugin.admin.paperTrail.saveDraft'),
                      defaultMessage: 'Save as draft'
                    })}
                  </Button>
                </Box>
                <Box paddingTop={4}>
                  <Button onClick={() => setModalVisible(!modalVisible)}>
                    {formatMessage({
                      id: getTrad('plugin.admin.paperTrail.viewAll'),
                      defaultMessage: 'View all'
                    })}
                  </Button>
                </Box>
              </Fragment>
            )}
          </Fragment>
        ) : (
          <Loader />
        )}
      </Box>
      <PaperTrailViewer
        visible={modalVisible}
        setVisible={setModalVisible}
        trails={trails}
        error={error}
        setError={setError}
      />
    </Fragment>
  );
}

export default PaperTrail;
