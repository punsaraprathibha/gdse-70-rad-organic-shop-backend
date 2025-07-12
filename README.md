01. Now let's configure MongoDB configurations inorder to communicate with our MongoDB database.
02. For that firstly, let's go to mongodb official website to create an account.
    ```https://account.mongodb.com/account/login```
03. Then choose your signup method and sign up to the MongoDB site, and it will redirect you to MongoDB dashboard.
04. Then you'll have to create a new project and provide project name, additional users to access the project and click create.
05. Then you need to create a deployment. So, click ```+Create``` button and select a free cluster and select service provider, region, and the name of the cluster and then click on create.
06. Then please provide username and password you're going to use when accessing this cluster.
07. Please remember and better to note down this password which we're going to use in future for connecting with DB.
08. Then you've to define what are the server addresses (web app addresses) you're going to access this cluster.
09. Then click connect button with green color and select Drivers
10. Then define node version and copy the mongodb install command and run inside server.
```shell
npm install mongodb
```
11. Then copy the connection string displayed in the site and define a new env variable inside dotEnv file and paste like below.
```dotenv
MONGODB_URL=mongodb+srv://<cluster-username>:<cluster-password>@<cluster-name>.vj1hean.mongodb.net/?retryWrites=true&w=majority
```
12. Now let's start db configuration to our application through the code.
13. Install mongoose.
```shell
 npm i mongoose
```
14. For that, let's firstly create a new package called `db` and place a file called `DBConnection.js` inside it to hold db configs.
```typescript
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_DB_URL = process.env.MONGO_DB_URL as string;
const DBConnection = async () => {
    try {
        console.log(MONGO_DB_URL);
        const connection = await mongoose.connect(MONGO_DB_URL);
        return `Successfully connected to MongoDB: ${connection.connection?.host}`;
    } catch (error) {
        return "Mongo DB Connection Error:" + error;
    }
}

export default DBConnection;
```
15. Then you have to define in `index.js` to consume this newly created `DBConnection.js` at the startup time.
```typescript
import DBConnection from "./db/DBConnection";
DBConnection().then(result => console.log(result));
```
16. Now if your configurations are successfully completed, you may see a message like below.
```
Successfully connected to MongoDB: <cluster>.<cluster-id>.mongodb.net
```
17. Now we're ready to access db from our application and do the CRUD operations.
18. Before we do DB operations, we need to have a MongoDB model class which is same as entity with jpa.
19. So, firstly let's create a model called `Product.ts` inside a package called `model`.
```typescript
import mongoose from "mongoose";

const ProductModel
    = new mongoose.Schema(
    {
        "id": {
            required: true, // like not null
            type: Number,
            unique: true, // Unique key constraint
            index: true // For better performance
        },
        "name": {
            required: true,
            type: String
        },
        "price": {
            required: true,
            type: Number
        },
        "currency": {
            required: true,
            type: String
        },
        "image": {
            required: true,
            type: String
        }
    }
);

const Product = mongoose.model('Product', ProductModel);
export default Product;
```
20. Then we've to create a dto called `product.dto.ts` inside a new folder called `dto`.
```typescript
export interface ProductDto {
    id: number;
    name: string;
    price: number;
    currency: string;
    image: string;
}
```
21. Then please update the `product.service.ts` as below to deal with MongoDB CRUD operations.
```typescript
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
```
```typescript
Product.find();// Get All
Product.create(productData); // Save
Product.findOne({id: productId}); // Get by Id
Product.findOneAndUpdate({id: productId}, productData, {new: true}) // Update by Id // {new: true}) - Return the updated document instead of the old original one;
Product.deleteOne({id: productId}); // Delete by Id
```
22. Then, you have to define controller functions as `async` and service calls with `await` keywords.
```typescript
import {Request, Response} from "express";
import * as productService from '../services/products.service';

// Controller function to handle get all products
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong!'
        });
    }
}
export const saveProduct = async (req: Request, res: Response) => {
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

        const savedProduct = await productService
            .saveProduct(newProduct);
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Something went wrong!'
        });
    }
}

export const getProduct = async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
        res.status(400).json({
            error: 'Invalid Product Id'
        });
        return;
    }
    const product = await productService.getProductById(productId);
    if (!product) {
        res.status(404).json({
            error: 'Product not found'
        });
        return;
    }
    res.status(200).json(product);
}

export const updateProduct = async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
        res.status(400).json({
            error: 'Invalid Product Id'
        });
        return;
    }
    const updatedData = req.body;
    const updatedProduct = await productService
        .updateProduct(productId, updatedData);
    if (!updatedProduct) {
        res.status(404).json({
            error: 'Product not found'
        });
        return;
    }
    res.status(200).json(updatedProduct);
}

export const deleteProduct = async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
        res.status(400).json({
            error: 'Invalid Product Id'
        });
        return;
    }
    const deleteProduct = await productService.deleteProduct(productId);
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
```
23. Now let's move to implement authentication and authorization using JWT.
24. For that, we need to install JWT dependencies first.
```shell
npm install jsonwebtoken bcryptjs
```
25. Firstly, let's start with creating the Login endpoint to generate auth token for the given user credentials like below.
```typescript
import authRoutes from "./routes/auth.routes";

// Add middleware to define auth route url pattern in app.tsx
app.use("/api/auth", authRoutes);
```
```typescript
// Create a new file called 'auth.routes.ts' inside 'routes' folder.
import { Router } from "express";
import {authenticateUser} from "../controller/auth.controller";

const authRouter = Router();

authRouter.post("/login", authenticateUser);

export default authRouter;
```
```typescript
// Define auth controller inside controllers/auth.controller.ts
import {Request, Response} from "express";
import * as authService from '../services/auth.service';

export const authenticateUser = (req: Request, res: Response) => {
    const {username, password} = req.body;
    const authTokens = authService.authenticateUser(username, password);

    if (!authTokens) {
        res.status(401).json({error: "Invalid credentials"});
        return;
    }
    res.json(authTokens);
}
```
```typescript
// Define user model inside folder called `model` as `user.model.ts`.
export interface User {
    id: number;
    username: string;
    password: string;
    role: string;
}
```
```dotenv
PORT=3000
MONGO_DB_URL=mongodb+srv://appuser:appuser123@oshopcluster.1waqtoo.mongodb.net/oshop?retryWrites=true&w=majority&appName=OshopCluster&authSource=admin
JWT_SECRET=OShopJwtSecret // Define JWT_SECRET
REFRESH_TOKEN_SECRET=OshopResetTokenSecret // Define REFRESH_TOKEN_SECRET
```
```typescript
// auth.service.ts
// Define Auth service implementation
import {User} from "../model/user.model";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const refreshTokens = new Set<string>();

const adminUser: User = {
    id: 1,
    username: "admin",
    password: bcrypt.hashSync("1234", 10),
    role: "admin"
}

const customerUser: User = {
    id: 2,
    username: "customer",
    password: bcrypt.hashSync("1234", 10),
    role: "customer"
}
const userList: User[] = [];
userList.push(adminUser);
userList.push(customerUser);

export const authenticateUser = (username: string, password: string) => {
    const existingUser: User | undefined = userList.find(user => user.username === username);

    let isValidPassword = undefined != existingUser
        && bcrypt.compareSync(password, existingUser.password);
    if (!existingUser || !isValidPassword) {
        return null;
    }

    const accessToken = jwt.sign({
        id: existingUser.id,
        username: existingUser.username,
        role: existingUser.role
    }, JWT_SECRET, {expiresIn: "5m"});

    const refreshToken = jwt.sign({
        username: existingUser.username
    }, REFRESH_TOKEN_SECRET, {expiresIn: "7d"});
    refreshTokens.add(refreshToken);
    return {accessToken, refreshToken}
}
```