01. Here you can see the result difference when you defined and not defined this middleware `app.use(express.json())`.
```typescript
app.use(express.json()); // Comment and uncomment to see the difference

app.get('/', (req: Request, res: Response) => {
    console.log(req.body); // Add console.log here to see the result
    res.send("Hello World!");
});
```
02. Also, we can separate out the application properties to a separate property file.
03. For that, we need to install `dotenv`.
```shell
npm install dotenv
```
04. Then let's create a new file called `.env` and define the application port there.
```dotenv
PORT=3000
```
05. Then we can access it inside our application like below.
```typescript
import app from "./app";
import dotenv from "dotenv"; // Import dotenv

dotenv.config(); // Loads the environment variables from the file

const port = process.env.PORT; // Access the port defined in .env

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
```
06. So, for defining `productRoutes`, let's create a new file called `product.routes.ts` inside new folder `routes`.
    We can use express `Router()` to define routes.
```typescript
import {Router} from "express";
import {deleteProduct, getAllProducts, getProduct, saveProduct, updateProduct} from "../controller/product.controller";

const productRouter: Router = Router();

productRouter.get("/all", getAllProducts);
productRouter.post("/save", saveProduct);
productRouter.get("/:id", getProduct);
productRouter.put("/update/:id", updateProduct);
productRouter.delete("/delete/:id", deleteProduct);

export default productRouter;
```
07. Now, let's define routes of our application as a middleware in `app.ts`.
```typescript
import express, {Express} from "express";
import productRoutes from "./routes/product.routes";

// Initialize the express app
const app:Express = express();

// Middlewares

// Instruct to parse the payload to JSON to be easily accessible data
app.use(express.json());

// Define application Routes
app.use("/products", productRoutes);

export default app;
```
08. Also, let's create a new file called `product.model.ts` inside a folder called `model` to have models.
```typescript
export interface Product {
    id: number;
    name: string;
    price: number;
    currency: string;
    image: string;
}
```
09. Let's create a new file called `db.ts` inside a new folder called `db` to have stored the data temporary as a static array.
```typescript
import {Product} from "../model/product.model";

export const productList: Product[] = [];
```
10. Now, let's create a new folder called `controller` and create a file called `product.controller.ts` to include all the controller functions to handle relevant logic for requests and responses.
```typescript
import { Request, Response } from 'express';
import * as productService from '../services/product.service';

// Controller method to save new product
export const saveProduct = (req: Request, res: Response) => {
    try {
        const newProduct = req.body;
        const validationError = productService.validateProduct(newProduct);
        if (validationError) {
            res.status(400).json({error: validationError});
            return;
        }

        const savedProduct = productService.saveProduct(newProduct);
        res.status(201).json(savedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Something went wrong!'});
    }
}

// Controller method to get all products
export const getAllProducts = (req: Request, res: Response) => {
    try {
        const products = productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Something went wrong!'});
    }
}

// Controller method to get product by id
export const getProduct = (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id);
        if (isNaN(productId)) {
            res.status(400).json({error: 'Invalid product ID'});
            return;
        }
        const product = productService.getProductById(productId);
        if (!product) {
            res.status(404).json({error: 'Product not found'});
            return;
        }
        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Something went wrong!'});
    }
}

// Controller method to update product by id
export const updateProduct = (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id);
        if (isNaN(productId)) {
            res.status(400).json({error: 'Invalid product ID'});
            return;
        }

        const updatedData = req.body;
        const updatedProduct = productService.updateProduct(productId, updatedData);

        if (!updatedProduct) {
            res.status(404).json({error: 'Product not found'});
            return;
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Something went wrong!'});
    }
}

// Controller method to delete product by id
export const deleteProduct = (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id);
        if (isNaN(productId)) {
            res.status(400).json({ error: 'Invalid product ID' });
            return;
        }

        const deleted = productService.deleteProduct(productId);
        if (!deleted) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Something went wrong!'});
    }
}
```
11. Now let's define service layer to include the business logic.
    For that let's create a new folder called `services` and create a file called `product.service.ts`.
```typescript
import {productList} from "../db/db";
import {Product} from "../model/product.model";

export const saveProduct = (product: Product): Product => {
    productList.push(product);
    return product;
};

export const getAllProducts = (): Product[] => {
    return productList;
};

export const getProductById = (id: number): Product | undefined => {
    return productList.find(product => product.id === id);
};

export const updateProduct = (id: number, data: Partial<Product>): Product | null => {
    const product = productList.find(p => p.id === id);
    if (!product) return null;

    Object.assign(product, data);
    return product;
};

export const deleteProduct = (id: number): boolean => {
    const index = productList.findIndex(product => product.id === id);
    if (index === -1) return false;

    productList.splice(index, 1);
    return true;
};

export const validateProduct = (product: Product): string | null => {
    if (!product.id || !product.name || !product.price || !product.currency || !product.image) {
        return 'All fields are required.';
    }
    return null;
};
```
12. Now let's go to the frontend side to do the frontend-backend integration.
13. Now let's enable `CORS` from the backend.
14. For that we need to install `cors`.
```shell
npm install cors
```
15. Then we can just allow CORS simply as below in `app.ts` as a middleware.
```typescript
import express, {Express} from "express";
import productRoutes from "./routes/product.routes";
import cors from "cors"; // Import CORS

const app:Express = express();

// Middlewares

app.use(express.json());

app.use(cors()); // Allow CORS here

// Define application Routes
app.use("/api/products", productRoutes);

export default app;
```
16. We can restrict the access by defining the allowed origins for more security.
```typescript
// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173", // Local frontend
];

// CORS options
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) { // The request has no origin — typically from non-browser tools (like Postman or curl). These are allowed.
      callback(null, true); // allow the request
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

// Apply CORS middleware
app.use(cors(corsOptions));
```