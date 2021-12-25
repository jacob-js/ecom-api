import { Router } from "express";
import { validateSchema } from "../../Utils/helpers";
import { fUploadMiddlware } from "../../Utils/imageUpload.util";
import productsController from "./products.controllers";
import { productSchema } from "./products.validations";

const productsRouter = Router()
                            .get('/', productsController.getProducts)
                            .post('/', fUploadMiddlware, validateSchema(productSchema), productsController.create);

export default productsRouter;