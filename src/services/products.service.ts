import Product from '../model/product.model';
import {ProductDto} from "../dto/product.dto";

// Get all products service logic
export const getAllProducts = async ():Promise<ProductDto[]> => {
    return Product.find();
}

export const saveProduct = async (product: ProductDto): Promise<any> => {
    return Product.create(product);
}

export const getProductById = async (id: number): Promise<any> => {
    return Product.findOne({id: id});
}

export const updateProduct = async (id: number, data: ProductDto) => {
    const product = await Product.findOneAndUpdate({id: id}, data, {new: true})
    if (!product) {
        return null;
    }
    return product;
}

export const deleteProduct = async (id: number) => {
    await Product.deleteOne({id: id});
    return true;
}

export const validateProduct = (product: ProductDto) => {
    if (!product.id || !product.name || !product.price
        || !product.currency || !product.image) {
        return 'All fields are required!';
    }
    return null;
}




