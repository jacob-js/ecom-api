import { Router } from "express";
import { validateSchema } from "../../Utils/helpers";
import usersController from "./users.controllers";
import { checkEmailExist, checkPhoneExist, loginSchema, schema, verifySchema } from "./users.validations";

const usersRouter = Router()
                            .post('/', validateSchema(schema), checkEmailExist, checkPhoneExist, usersController.signup)
                            .post('/login', validateSchema(loginSchema), usersController.login)
                            .post('/oauth/google', usersController.googleLogin)
                            .post('/verify', validateSchema(verifySchema), usersController.verify);

export default usersRouter;