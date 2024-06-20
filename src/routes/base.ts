import { Router } from "express";
import driverRouter from "./driver";

const baseRouter = Router()
baseRouter.use(driverRouter)
export default baseRouter;