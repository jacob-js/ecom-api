import { Router } from "express";
import productsRouter from "./Modules/Products/products.router";
import usersRouter from "./Modules/Users/users.routes";

const router = Router()
                        .use('/users', usersRouter)
                        .use('/products', productsRouter);

export default router;