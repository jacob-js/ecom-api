import { Router } from "express";
import { checkIsAdmin, verifyToken } from "../../Utils/auth.utils";
import { validateSchema } from "../../Utils/helpers";
import usersController from "./users.controllers";
import { adminSchema, checkAdminExist, checkEmailExist, checkPhoneExist, loginSchema, schema, verifySchema } from "./users.validations";

const usersRouter = Router()
                            .post('/', validateSchema(schema), checkEmailExist, checkPhoneExist, usersController.signup)
                            .post('/login', validateSchema(loginSchema), usersController.login)
                            .post('/oauth/google', usersController.googleLogin)
                            .post('/verify', validateSchema(verifySchema), usersController.verify)
                            .post('/admins', verifyToken, checkIsAdmin, validateSchema(adminSchema), checkAdminExist, usersController.createAdmin)
                            .get('/admins', verifyToken, checkIsAdmin, usersController.getAdmins)
                            .get('/current', verifyToken, usersController.getCurrent)
                            .get('/send-otp/:username', usersController.sendVerificationCode);

export default usersRouter;