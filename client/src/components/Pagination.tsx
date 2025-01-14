import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function PaginationComponent({ page, setPage, limit, TotalPage }: { page: number, setPage: any, limit: number, TotalPage: number }) {
  const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem onClick={() => page > 1 && setPage(page - 1)}>
          <PaginationPrevious to={`${FRONTEND_URL}/all-submissions?page=${page}&limit=${limit}`} />
        </PaginationItem>
        <PaginationItem>
          {
            page !== undefined && (
              Array.from({ length: TotalPage }, (_, i) => (
                <PaginationLink
                  key={i}
                  to={`${FRONTEND_URL}/all-submissions?page=${i + 1}&limit=${limit}`}
                  isActive={i + 1 === page}
                  onClick={() => i < TotalPage && setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              ))
            )
          }
        </PaginationItem>
        <PaginationItem hidden={TotalPage <= 2}>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem onClick={() => page < TotalPage && setPage(page + 1)}>
          <PaginationNext to={`http://${FRONTEND_URL}5173/all-submissions?page=${page}&limit=${limit}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
