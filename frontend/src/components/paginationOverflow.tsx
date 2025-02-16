import React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  basePath: string;
  lastPage: number;
  currentPage: number;
  visibleCount?: number;
}

const PaginationOverflow: React.FC<PaginationProps> = ({
  basePath,
  lastPage,
  currentPage,
  visibleCount = 3,
}) => {
  // Handle potential errors or missing props
  if (!basePath || !lastPage || !currentPage) {
    return <div>Missing required props for pagination component.</div>;
  }

  if (visibleCount > lastPage) return <div>a</div>;
  if (currentPage > lastPage || currentPage < 1) return null;

  const navigationLinkHref = (pageNumber: number) => {
    return `${basePath}?page=${pageNumber}`;
  };

  const renderPageLink = (pageNumber: number) => (
    <PaginationItem>
      {pageNumber === currentPage ? (
        <PaginationLink
          to={navigationLinkHref(pageNumber) + "#"}
          isActive={true}
        >
          {pageNumber}
        </PaginationLink>
      ) : (
        <PaginationLink to={navigationLinkHref(pageNumber)} isActive={false}>
          {pageNumber}
        </PaginationLink>
      )}
    </PaginationItem>
  );

  let numbers = [...Array(visibleCount)];
  if (currentPage <= Math.ceil(visibleCount / 2)) {
    numbers = numbers.map((_, i) => {
      return i + 1;
    });
  } else if (
    currentPage > Math.ceil(visibleCount / 2) &&
    currentPage <= lastPage - Math.ceil(visibleCount / 2)
  ) {
    numbers = numbers.map((_, i) => {
      return i + 1 + currentPage - Math.ceil(visibleCount / 2);
    });
  } else if (currentPage > lastPage - Math.ceil(visibleCount / 2)) {
    numbers = numbers.map((_, i) => {
      return i + lastPage - visibleCount + 1;
    });
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            to={navigationLinkHref(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={
              currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>

        {numbers.at(0) != 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {numbers.map((n) => {
          return renderPageLink(n);
        })}

        {numbers.at(-1) != lastPage && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            to={navigationLinkHref(currentPage + 1)}
            aria-disabled={currentPage === lastPage}
            tabIndex={currentPage === lastPage ? -1 : undefined}
            className={
              currentPage === lastPage
                ? "pointer-events-none opacity-50"
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationOverflow;
