import {Router} from "express";
import {deleteProduct, getAllProducts, getProduct, saveProduct, updateProduct} from "../controllers/product.controller";
const productRouter:Router = Router();
// Handle Requests
productRouter.get("/all", getAllProducts); // Get All
productRouter.post("/save", saveProduct); // Save
productRouter.get("/:id", getProduct);
productRouter.put("/update/:id", updateProduct);
productRouter.delete("/delete/:id", deleteProduct)
export default productRouter;