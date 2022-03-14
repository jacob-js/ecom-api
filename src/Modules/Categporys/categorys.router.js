import { Router } from "express";
import { checkIsAdmin, verifyToken } from "../../Utils/auth.utils";
import { validateSchema } from "../../Utils/helpers";
import { fUploadMiddlware } from "../../Utils/imageUpload.util";
import categorysController from "./categorys.controllers";
import { categorySchema, checkCategoryNameExist, checkUpdateCategoryNameExist } from "./categorys.validations";
import parentCategController from "./parentCateg.controller";
import subCategoryController from "./subCategorys.controller";

const categorysRouter = Router()
                            .get('/', categorysController.categorys)
                            .post('/', verifyToken, checkIsAdmin, fUploadMiddlware, validateSchema(categorySchema), checkCategoryNameExist, categorysController.categorys)
                            .get('/:id', categorysController.categoryDetail)
                            .put('/:id',  verifyToken, checkIsAdmin, fUploadMiddlware, checkUpdateCategoryNameExist, categorysController.categoryDetail)
                            .delete('/:id', verifyToken, checkIsAdmin, categorysController.categoryDetail)
                            .get('/products/:categoryName', categorysController.getProductsByCategory)
                            .get('/parents/categorys', parentCategController.parentCategs)
                            .post('/parents/categorys', parentCategController.parentCategs)
                            .get('/parents/categorys/:id', parentCategController.parentCategDetail)
                            .put('/parents/categorys/:id', parentCategController.parentCategDetail)
                            .delete('/parents/categorys/:id', parentCategController.parentCategDetail)
                            .get('/subs/categorys', subCategoryController.subCategs)
                            .post('/subs/categorys', subCategoryController.subCategs)
                            .get('/subs/categorys/:id', subCategoryController.subCategDetail)
                            .put('/subs/categorys/:id', subCategoryController.subCategDetail)
                            .delete('/subs/categorys/:id', subCategoryController.subCategDetail)

export default categorysRouter;