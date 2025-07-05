import {Request, Response} from "express";
import * as productService from '../services/products.service';

// Controller function to handle get all products
export const getAllProducts = (req: Request,
                        res: Response) => {
    try {
        const products = productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong!'
        });
    }
}
export const saveProduct = (req: Request,
                     res: Response) => {
    try {
        const newProduct = req.body;
        const validationError =
            productService.validateProduct(newProduct);
        if (validationError) {
            res.status(400).json({
                error: validationError
            });
            return;
        }

        const savedProduct = productService
            .saveProduct(newProduct);
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong!'
        });
    }
}

export const getProduct = (req: Request,
                      res: Response) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
        res.status(400).json({
            error: 'Invalid Product Id'
        });
        return;
    }
    const product = productService
        .getProductById(productId);
    if (!product) {
        res.status(404).json({
            error: 'Product not found'
        });
        return;
    }
    res.status(200).json(product);
}

export const updateProduct = (req: Request,
                       res: Response) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
        res.status(400).json({
            error: 'Invalid Product Id'
        });
        return;
    }
    const updatedData = req.body;
    const updatedProduct = productService
        .updateProduct(productId, updatedData);
    if (!updatedProduct) {
        res.status(404).json({
            error: 'Product not found'
        });
        return;
    }
    res.status(200).json(updatedProduct);
}

export const deleteProduct = (req: Request,
                         res: Response) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
        res.status(400).json({
            error: 'Invalid Product Id'
        });
        return;
    }
    const deleteProduct =
        productService.deleteProduct(productId);
    if (!deleteProduct) {
        res.status(404).json({
            error: 'Product not found'
        });
        return;
    }
    res.status(200).json({
        message: 'Product deleted successfully!'
    });
}