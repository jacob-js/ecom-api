import { Router } from "express";
import { checkIsAdmin, decodeUpdatePwdToken, verifyToken } from "../../Utils/auth.utils";
import { validateSchema } from "../../Utils/helpers";
import { fUploadMiddlware } from "../../Utils/imageUpload.util";
import usersController from "./users.controllers";
import { adminSchema, checkAdminExist, checkEmailExist, checkPhoneExist, checkUpdateEmailExist, checkUpdatePhoneExist, loginSchema, schema, verifySchema } from "./users.validations";

const usersRouter = Router()
                            .post('/', validateSchema(schema), checkEmailExist, checkPhoneExist, usersController.signup)
                            .get('/', verifyToken, checkIsAdmin, usersController.getUsers)
                            .post('/login', validateSchema(loginSchema), usersController.login)
                            .post('/admin/login', validateSchema(loginSchema), usersController.adminLogin)
                            .post('/oauth/google', usersController.googleLogin)
                            .post('/validate', validateSchema(verifySchema), usersController.validateAndCreateUser)
                            .post('/admins', verifyToken, checkIsAdmin, validateSchema(adminSchema), checkAdminExist, usersController.createAdmin)
                            .get('/admins', verifyToken, checkIsAdmin, usersController.getAdmins)
                            .get('/admins/:id', verifyToken, checkIsAdmin, usersController.adminDetail)
                            .put('/admins/:id', verifyToken, checkIsAdmin, usersController.adminDetail)
                            .delete('/admins/:id', verifyToken, checkIsAdmin, usersController.adminDetail)
                            .get('/current', verifyToken, usersController.getCurrent)
                            .get('/current/admin', verifyToken, checkIsAdmin, usersController.getCurrent)
                            .get('/reset-password', usersController.resetPassword)
                            .put('/reset-password', decodeUpdatePwdToken, usersController.resetPassword)
                            .post('/reset-password', usersController.resetPassword)
                            .get('/details/:id', verifyToken, usersController.userDetails)
                            .put('/details/:id', verifyToken, fUploadMiddlware, checkUpdateEmailExist, checkUpdatePhoneExist, usersController.userDetails);

export default usersRouter;