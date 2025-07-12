// // import {Product} from "../model/product.model";
// import Product from '../model/product.model';
// import {ProductDto} from "../dto/product.dto";
//
// // Get all products service logic
// export const getAllProducts = async ():Promise<ProductDto[]> => {
//     // return productList;
//     return Product.find();
// }
//
// export const saveProduct = async (product: ProductDto): Promise<ProductDto> => {
//     // productList.push(product);
//     // return product;
//     return Product.create(product);
// }
//
// export const getProductById = async (id: number): Promise<any> => {
//     // return productList
//     //     .find(product => product.id === id);
//     return Product.findOne({id: id});
// }
//
// export const updateProduct = async (id: number, data: ProductDto) => {
//     // const product= productList.find(product=> product.id = id);
//     const product = await Product.findOneAndUpdate({id: id}, data, {new: true})
//     if (!product) {
//         return null;
//     }
//     // Object.assign(product, data);
//     return product;
// }
//
// export const deleteProduct = async (id: number) => {
//     // const index = productList
//     //     .findIndex(product => product.id === id);
//     // if (index === -1) {
//     //     return false;
//     // }
//     // productList.splice(index, 1);
//     await Product.deleteOne({id: id});
//     return true;
// }
//
// export const validateProduct = (product: ProductDto) => {
//     if (!product.id || !product.name || !product.price
//         || !product.currency || !product.image) {
//         return 'All fields are required!';
//     }
//     return null;
// }
//
//
//
//

// import {Product} from "../model/product.model";
import Product from '../model/product.model';
import {ProductDto} from "../dto/product.dto";
import {productList} from "../db/db";

// Get all products service logic
export const getAllProducts = async ():Promise<ProductDto[]> => {
    // return productList;
    return Product.find();
}

export const saveProduct = async (product: ProductDto): Promise<ProductDto> => {
    // productList.push(product);
    // return product;
    return Product.create(product);
}

export const getProductById = async (id: number)
    : Promise<any> => {
    // return productList
    //     .find(product => product.id === id);
    return Product.findOne({id: id});
}

export const updateProduct = async (id: number,
                                    data: ProductDto) => {
    // const product= productList.find(product=> product.id = id);
    const product = await Product
        .findOneAndUpdate({id: id}, data, {new: true})
    if (!product) {
        return null;
    }
    // Object.assign(product, data);
    return product;
}

export const deleteProduct = async (id: number) => {
    // const index = productList
    //     .findIndex(product => product.id === id);
    // if (index === -1) {
    //     return false;
    // }
    // productList.splice(index, 1);
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




