import { Router } from "express";
import { checkIsAdmin, verifyToken } from "../../Utils/auth.utils";
import { validateSchema } from "../../Utils/helpers";
import { fUploadMiddlware } from "../../Utils/imageUpload.util";
import productsController from "./products.controllers";
import { checkProductNameExist, checkProductRatingExist, checkUpdateProductNameExist, productColorSchema, productRatingSchema, productSchema, suggestedProductSchema } from "./products.validations";

const productsRouter = Router()
                            .get('/', productsController.getProducts)
                            .get('/search/all', productsController.searchProducts)
                            .post('/', verifyToken, checkIsAdmin, fUploadMiddlware, validateSchema(productSchema), checkProductNameExist, productsController.create)
                            .get('/:id', productsController.productDetail)
                            .put('/:id',  verifyToken, checkIsAdmin, fUploadMiddlware, checkUpdateProductNameExist, productsController.productDetail)
                            .delete('/:id', verifyToken, checkIsAdmin, productsController.productDetail)
                            .post('/colors', verifyToken, checkIsAdmin, fUploadMiddlware, validateSchema(productColorSchema), productsController.createProductColor)
                            .get('/ratings/:productId', productsController.productRatings)
                            .post('/ratings/:productId', verifyToken, validateSchema(productRatingSchema), checkProductRatingExist, productsController.productRatings)
                            .put('/ratings/:productId', verifyToken, productsController.productRatings)
                            .delete('/ratings/:productId', verifyToken, productsController.productRatings)
                            .get('/suggestions/products', productsController.suggestedProducts)
                            .post('/suggestions/products', fUploadMiddlware, validateSchema(suggestedProductSchema), productsController.suggestedProducts)
                            .get('/suggestions/products/:id', productsController.suggestedProductDetail)
                            .put('/suggestions/products/:id', productsController.suggestedProductDetail)
                            .delete('/suggestions/products/:id', productsController.suggestedProductDetail)

export default productsRouter;