import { Router } from "express";
import usersRouter from "./Modules/Users/users.routes";

const router = Router()
                        .use('/users', usersRouter);

export default router;