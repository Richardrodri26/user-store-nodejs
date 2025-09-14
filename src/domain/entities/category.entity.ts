import { CustomError } from "../errors/custom.error";

export class CategoryEntity {
  constructor(
    public id: string,
    public name: string,
    public available: boolean,
    public user?: string,
  ) {}

  static fromObject(obj: Record<string, any>): CategoryEntity {
    const { id, _id, name, available, user } = obj;

    if (!id && !_id) throw CustomError.badRequest("Missing id");
    if (!name) throw CustomError.badRequest("Missing name");
    if (available === undefined) throw CustomError.badRequest("Missing available");

    return new CategoryEntity(_id || id, name, Boolean(available), user);
  }
}
