01. As per next, we've to secure our endpoints by creating an Auth Middleware inside a new file called `auth.middleware.ts` inside new folder called `middlewares`.
```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Access the secret key defined in .env file
const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expected format: "Bearer <token>"

    if (!token) {
        res.status(401).json({ error: "Auth token is not present in request headers!" });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            res.status(401).json({ error: "Invalid or expired auth token provided!" });
            return;
        }

        (req as Request & { user?: any }).user = user; // Store decoded user info
        next(); // Here next is a callback function provided by express.js used to pass control to the next middleware function in the stack
    });
};
```
02. Then we've to apply it for all our api routes in `app.ts` as all routes are only allowed for successfully authenticated users only.
```typescript
import productRoutes from "./routes/product.routes";
import contactRoutes from "./routes/contact.routes";
import {authenticateToken} from "./middlewares/auth.middleware";

app.use("/api/products", authenticateToken, productRoutes); // Like this
app.use("/api/contacts", authenticateToken, contactRoutes);  // Like this
```
03. As per the above changes, now our endpoints are secured with JWT authentication and only able to send requests to backend are allowed for authenticated users only.
04. For testing the endpoints you need to first authenticate to the system using `/api/auth/login` route by providing user credentials.
05. Then you'll get the access token as the response if you've successfully authenticated.
06. Then you've to use that access token for each request you perform there after to confirm that you are an already authenticated user of this system.
07. Then let's go to the frontend application to perform login related integration with backend.
08. So, now let's try to implement Authorization for our backend.
09. For that, let's firstly start by defining the authorizeRoles functionality inside `auth.middleware.ts`.
````typescript
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as Request & { user?: any }).user;
        if (!user || !roles.includes(user.role)) {
            res.status(403).json({ message: "Access denied! User doesn't have permission to perform this operation" });
            return;
        }
        next(); // Here next is a callback function provided by express.js used to pass control to the next middleware function in the stack
    };
};
````
10. Then you can restrict the access of the most sensitive features based on the user role privileges in `product.routes.ts`.
```typescript
import {Router} from "express";
import {deleteProduct, getAllProducts, getProduct, saveProduct, updateProduct} from "../controller/product.controller";
import {authorizeRoles} from "../middlewares/auth.middleware";

const productRouter: Router = Router();

productRouter.get("/all", getAllProducts);
productRouter.post("/save", authorizeRoles("admin"), saveProduct); // Restrict the operation only for Admin users
productRouter.get("/:id", getProduct);
productRouter.put("/update/:id", authorizeRoles("admin"), updateProduct);  // Restrict the operation only for Admin users
productRouter.delete("/delete/:id", authorizeRoles("admin"), deleteProduct);  // Restrict the operation only for Admin users

export default productRouter;
```
11. Then, if you logged in as a customer, you'll no longer able to save/update/delete products. Only admin user have that access.