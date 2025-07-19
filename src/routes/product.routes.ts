import {Router} from "express";
import {deleteProduct, getAllProducts, getProduct, saveProduct, updateProduct} from "../controllers/product.controller";
import {authorizeRoles} from "../middleware/auth.middleware";
const productRouter:Router = Router();
// Handle Requests
productRouter.get("/all", getAllProducts); // Get All
productRouter.post("/save", authorizeRoles('admin'), saveProduct); // Save
productRouter.get("/:id", getProduct);
productRouter.put("/update/:id", authorizeRoles('admin'), updateProduct);
productRouter.delete("/delete/:id", authorizeRoles('admin'), deleteProduct)
export default productRouter;