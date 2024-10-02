import { Router } from "express";
import { upload } from "../middleware/upload.middleware.js";
import { addProduct, deleteProduct, getAllProducts, getNewCollections, popularInWomen } from "../controllers/product.controllers.js";

const productRouter = Router();

productRouter.route("/add/product").post(upload.single("image"), addProduct);
productRouter.route("/delete/product").post(deleteProduct);
productRouter.route("/get/all").get(getAllProducts);
productRouter.route("/get/new/collection").get(getNewCollections);
productRouter.route("/get/popular/women").get(popularInWomen);

export default productRouter;
