import { Router } from "express";
import categorysRouter from "./Modules/Categporys/categorys.router";
import productsRouter from "./Modules/Products/products.router";
import usersRouter from "./Modules/Users/users.routes";

const router = Router()
                        .use('/users', usersRouter)
                        .use('/products', productsRouter)
                        .use('/categorys', categorysRouter);

export default router;