import {
  NextLink,
  PageLink,
  Pagination,
  PreviousLink
} from '@strapi/design-system/v2';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

import getPaginationList from '../../utils/getPaginationList';

function TrailsTablePagination(props) {
  const { page, pageCount, setPage } = props;

  const pageList = getPaginationList(page, pageCount);

  const handleClick = useCallback((event, newPage) => {
    event.preventDefault();
    if (page !== newPage) {
      setPage(newPage);
    }
  });

  return (
    <Pagination activePage={page} pageCount={pageCount}>
      <PreviousLink
        href={`#${page - 1}`}
        onClick={event => handleClick(event, page - 1)}
      >
        Go to previous page
      </PreviousLink>
      {pageList.map(pageNum => (
        <PageLink
          key={pageNum}
          number={pageNum}
          href={`#${pageNum}`}
          onClick={event => handleClick(event, pageNum)}
        >
          Go to page ${pageNum}
        </PageLink>
      ))}
      <NextLink
        href={`#${page + 1}`}
        onClick={event => handleClick(event, page + 1)}
      >
        Go to next page
      </NextLink>
    </Pagination>
  );
}

TrailsTablePagination.propTypes = {
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired
};

export default TrailsTablePagination;
