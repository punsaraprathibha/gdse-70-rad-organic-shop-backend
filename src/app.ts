import express, {Express, Request, Response} from "express";
import productRoutes
    from "./routes/product.routes";

// 1. Initialize the express app
const app: Express = express();

// 2. Define Middlewares

// 2.1 Instruct to parse the request payload data to be converted to JSON format
app.use(express.json());
app.use("/api/products", productRoutes)

// 3. Define a simple HTTP GET Request
// app.get('/', (req: Request, res: Response) => {
//     console.log(req.body);
//     res.send("Hello World!");
// });

// Expert the app to use outside (in index.ts)
export default app;