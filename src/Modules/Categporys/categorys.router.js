import { Router } from "express";
import { checkIsAdmin, verifyToken } from "../../Utils/auth.utils";
import { validateSchema } from "../../Utils/helpers";
import { fUploadMiddlware } from "../../Utils/imageUpload.util";
import categorysController from "./categorys.controllers";
import { categorySchema, checkCategoryNameExist, checkUpdateCategoryNameExist } from "./categorys.validations";

const categorysRouter = Router()
                            .get('/', categorysController.categorys)
                            .post('/', verifyToken, checkIsAdmin, fUploadMiddlware, validateSchema(categorySchema), checkCategoryNameExist, categorysController.categorys)
                            .get('/:id', categorysController.categoryDetail)
                            .put('/:id',  verifyToken, checkIsAdmin, fUploadMiddlware, checkUpdateCategoryNameExist, categorysController.categoryDetail)
                            .delete('/:id', verifyToken, checkIsAdmin, categorysController.categoryDetail);

export default categorysRouter;