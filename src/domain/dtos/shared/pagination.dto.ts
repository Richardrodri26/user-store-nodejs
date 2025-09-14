

export class PaginationDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number ,
  ) {}

  static create(page: number, limit: number): [string | undefined, PaginationDto | undefined] {

    if (isNaN(page) || isNaN(limit)) return ["Page and limit must be numbers", undefined];

    if (page < 1) return ["Invalid page number", undefined];
    if (limit < 1) return ["Invalid limit number", undefined];

    return [undefined, new PaginationDto(page, limit)];
  }

}