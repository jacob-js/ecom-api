import { Router } from "express";
import categorysRouter from "./Modules/Categporys/categorys.router";
import ordersRouter from "./Modules/Orders/orders.router";
import productsRouter from "./Modules/Products/products.router";
import usersRouter from "./Modules/Users/users.routes";

const router = Router()
                        .use('/users', usersRouter)
                        .use('/products', productsRouter)
                        .use('/categorys', categorysRouter)
                        .use('/orders', ordersRouter);

export default router;