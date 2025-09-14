import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, UserEntity, CategoryEntity, PaginationDto } from "../../domain";


export class CategoryService {

  constructor() {};


  async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {

    const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name});
    if (categoryExists) throw CustomError.badRequest("Category already exists")

      try {
        
        const category = new CategoryModel({
          ...createCategoryDto,
          user: user.id,
        });

        await category.save();

        return {
          id: category.id,
          name: category.name,
          available: category.available,
          user: category.user,
        }

      } catch (error) {
        throw CustomError.internalServer(`${error}`)
      }

  }

  async getCategories(paginationDto: PaginationDto) {
    
    const { page, limit } = paginationDto;

    try {

      // perform queries separately with explicit types to avoid complex union types
      const total: number = await CategoryModel.countDocuments().exec();
      const categoriesRaw = await CategoryModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec();

      const categoriesToSend = (categoriesRaw as any[]).map(catObj => {
        const category = CategoryEntity.fromObject(catObj);
        return {
          id: category.id,
          name: category.name,
          available: category.available,
          user: category.user,
        };
      });

      return {
        categories: categoriesToSend,
        page,
        limit,
        total,
        next:  `/api/categories?page=${page + 1}&limit=${limit}`,
        previous: page - 1 > 0 ? `/api/categories?page=${page - 1}&limit=${limit}`: null,
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
    
  }

}