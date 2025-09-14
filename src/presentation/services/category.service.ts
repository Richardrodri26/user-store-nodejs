import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, UserEntity, CategoryEntity } from "../../domain";


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

  async getCategories() {
    
    try {
      // use .lean() to return plain JS objects and avoid very large union types from Mongoose
      const categories = await CategoryModel.find().lean();

      return (categories as any[]).map(catObj => {
        const category = CategoryEntity.fromObject(catObj);
        return {
          id: category.id,
          name: category.name,
          available: category.available,
          user: category.user,
        };
      });
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
    
  }

}