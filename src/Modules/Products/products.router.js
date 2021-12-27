import { Router } from "express";
import { checkIsAdmin, verifyToken } from "../../Utils/auth.utils";
import { validateSchema } from "../../Utils/helpers";
import { fUploadMiddlware } from "../../Utils/imageUpload.util";
import productsController from "./products.controllers";
import { checkProductNameExist, checkUpdateProductNameExist, productColorSchema, productSchema } from "./products.validations";

const productsRouter = Router()
                            .get('/', productsController.getProducts)
                            .post('/', verifyToken, checkIsAdmin, fUploadMiddlware, validateSchema(productSchema), checkProductNameExist, productsController.create)
                            .get('/:id', productsController.productDetail)
                            .put('/:id',  verifyToken, checkIsAdmin, fUploadMiddlware, checkUpdateProductNameExist, productsController.productDetail)
                            .delete('/:id', verifyToken, checkIsAdmin, productsController.productDetail)
                            .post('/colors', verifyToken, checkIsAdmin, fUploadMiddlware, validateSchema(productColorSchema), productsController.createProductColor);

export default productsRouter;