

import { ProductModel } from "../../data";
import { CreateCategoryDto, CustomError, UserEntity, CategoryEntity, PaginationDto, CreateProductDto } from "../../domain";


export class ProductService {

  constructor() {};


  async createProduct(createProductDto: CreateProductDto): Promise<any> {

    const productExists = await ProductModel.findOne({ name: createProductDto.name});
    if (productExists) throw CustomError.badRequest("Product already exists")

      try {

        const product = new ProductModel(createProductDto);

        await product.save();

        return product

      } catch (error) {
        throw CustomError.internalServer(`${error}`)
      }

  }

  async getProducts(paginationDto: PaginationDto): Promise<any> {
    
    const { page, limit } = paginationDto;

    try {

      // perform queries separately with explicit types to avoid complex union types
      const total: number = await ProductModel.countDocuments().exec();
      const productsRaw: Array<any> = await ProductModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user')
        .populate('category')
        .lean()
        .exec();

      const productsToSend = (productsRaw as any[]).map(prodObj => {
        const product: any = prodObj;
        return {
          id: product._id,
          name: product.name,
          available: product.available,
          user: product.user,
        };
      });

      return {
        products: productsToSend,
        page,
        limit,
        total,
        next:  `/api/products?page=${page + 1}&limit=${limit}`,
        previous: page - 1 > 0 ? `/api/products?page=${page - 1}&limit=${limit}`: null,
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`)
    }
    
  }

}