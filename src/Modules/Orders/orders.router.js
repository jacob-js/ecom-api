import { Router } from "express";
import { checkIsAdmin, verifyToken } from "../../Utils/auth.utils";
import { validateSchema } from "../../Utils/helpers";
import ordersController from "./orders.controllers";
import { orderSchema } from "./orders.validations";

const ordersRouter = Router()
                            .get('/', verifyToken, checkIsAdmin, ordersController.orders)
                            .get('/:userId', verifyToken, ordersController.orders)
                            .post('/', verifyToken, validateSchema(orderSchema), ordersController.orders);

export default ordersRouter;                            