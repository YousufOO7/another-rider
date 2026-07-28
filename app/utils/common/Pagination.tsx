"use client";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  onPageChange,
}) => {
  if (lastPage <= 1) return null; // single page, no pagination needed

  return (
    <div className="flex justify-end items-center gap-2 my-4">
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 text-sm cursor-pointer"
      >
        Previous
      </Button>

      {[...Array(lastPage)].map((_, idx) => {
        const pageNumber = idx + 1;
        return (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNumber)}
            className="cursor-pointer"
          >
            {pageNumber}
          </Button>
        );
      })}

      <Button
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 text-sm cursor-pointer"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
