import { Router } from "express";
import { validateSchema } from "../../Utils/helpers";
import usersController from "./users.controllers";
import { checkEmailExist, checkPhoneExist, schema } from "./users.validations";

const usersRouter = Router()
                            .post('/', validateSchema(schema), checkEmailExist, checkPhoneExist, usersController.signup);

export default usersRouter;