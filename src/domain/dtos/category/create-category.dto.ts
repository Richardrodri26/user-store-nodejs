


export class CreateCategoryDto {

  private constructor(
    public readonly name: string,
    public readonly available: boolean,
  ) {}

  static create(data: Record<string, any>): [string | undefined, CreateCategoryDto | undefined] {
    if (!data) {
      throw new Error("Data is required to create a category");
    }

    const { name, available } = data;

    let availableBoolean = available;

    if (!name || typeof name !== "string") {
      return ["Name is required and must be a string", undefined];
    }

    if (typeof available !== "boolean") {
      availableBoolean = ( available === 'true' ); 
    }

    return [undefined, new CreateCategoryDto(name, availableBoolean)];
  }


   
  }