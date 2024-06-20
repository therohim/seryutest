import { Router } from "express";
import createResponse from "../utils/http-response";
import driverController from "../controllers/modules/driver-controller";

const driverRouter = Router();

const use =
  (fn: any): any =>
    (req: any, res: any, next: any) => {
      Promise.resolve(fn(req, res, next)).catch((err) => {
        createResponse(res, 500, { error: err });
      });
    };

const v1 = "/v1"

driverRouter.get(`${v1}/salary/driver/list`, use(driverController.getDrivers));

export default driverRouter;
