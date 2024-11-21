export interface PaginationMetadata {
  /*  totalPages: number;*/
  currentPage: number;
  pageSize: number;
  /*totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;*/
}

export interface PaginatedDto {
  meta: PaginationMetadata;
}
export class PaginateDto {
  public page: number = 1;
  public pageSize: number = 25;

  public static getMetaData(pg: PaginateDto ): PaginationMetadata {
    return {
      currentPage: pg.page,
      pageSize: pg.pageSize,
    };
  }
}
