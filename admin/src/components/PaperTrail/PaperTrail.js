import {
  Box,
  Button,
  Divider,
  Loader,
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
  const { layout } = useCMEditViewDataManager();

  const { uid, pluginOptions = {} } = layout;

  const { formatMessage } = useIntl();
  // params works for collection types but not single types
  const { id, collectionType } = useParams();

  const [recordId, setRecordId] = useState(id);

  const paperTrailEnabled = pluginOptions?.paperTrail?.enabled;

  // TODO: add this to config/plugins.ts, needs a custom endpoint
  // https://forum.strapi.io/t/custom-field-settings/23068
  const pageSize = 15;

  const request = useFetchClient();

  const [trails, setTrails] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [current, setCurrent] = useState(null);
  const [error, setError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  // if collectionType is single then fetch the ID (if exists) from the server and set `1` if nothing.

  const getSingleTypeId = useCallback(async () => {
    const requestUri = `/content-manager/single-types/${uid}/`;

    try {
      const result = await request.get(requestUri);

      const { data = {} } = result;

      const { id } = data;

      setRecordId(id);

      return id;
    } catch (err) {
      console.warn('paper-trail:', 'No existing single type for this UID', err);
    }

    return null;
  }, [uid, request]);

  useEffect(() => {
    if (collectionType === 'single-types') {
      getSingleTypeId();
    }
  }, [collectionType, getSingleTypeId]);

  useEffect(() => {
    async function getTrails(page, pageSize) {
      const params = new URLSearchParams({
        page,
        pageSize,
        sort: 'version:DESC',
        'filters[$and][0][contentType][$eq]': uid,
        'filters[$and][1][recordId][$eq]': recordId
      }).toString();

      const requestUri = `/content-manager/collection-types/plugin::paper-trail.trail?${params}`;

      try {
        const result = await request.get(requestUri);

        const { data = {} } = result;

        const { results = [], pagination } = data;

        const { total, pageCount } = pagination;

        setTotal(total);
        setPageCount(pageCount);
        setTrails(results);

        if (page === 1 && total > 0) {
          setCurrent(results[0]);
        }

        setLoaded(true);
        setInitialLoad(true);
      } catch (Err) {
        console.warn('paper-trail: ', Err);
        setError(Err);
      }
    }

    if (!loaded && paperTrailEnabled && recordId) {
      getTrails(page, pageSize);
    } else {
      setInitialLoad(true);
    }
  }, [loaded, uid, recordId, page, paperTrailEnabled, request]);

  /**
   * event listener for submit button
   */

  const handler = useCallback(async () => {
    setTimeout(async () => {
      if (collectionType === 'single-types') {
        await getSingleTypeId();
      }
      setPage(1);
      setLoaded(false);
      setInitialLoad(false);
    }, 1000);
  }, [getSingleTypeId, collectionType]);

  const handleSetPage = useCallback(newPage => {
    setPage(newPage);
    setLoaded(false);
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

  if (!paperTrailEnabled) {
    return <Fragment />;
  }

  // TODO: Add diff comparison
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
        {initialLoad ? (
          <Fragment>
            {total === 0 && (
              <Typography fontWeight="bold">
                {formatMessage({
                  id: getTrad('plugin.admin.paperTrail.noTrails'),
                  defaultMessage: 'No versions (yet)'
                })}
              </Typography>
            )}
            {total > 0 && current && (
              <Fragment>
                <p>
                  <Typography fontWeight="bold">
                    {formatMessage({
                      id: getTrad('plugin.admin.paperTrail.currentVersion'),
                      defaultMessage: 'Current version:'
                    })}{' '}
                    {total}
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
        page={page}
        pageSize={pageSize}
        pageCount={pageCount}
        total={total}
        setPage={handleSetPage}
        collectionType={collectionType}
      />
    </Fragment>
  );
}

export default PaperTrail;
