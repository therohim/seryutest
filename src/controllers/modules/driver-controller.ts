import { Request, Response } from "express";
import { BaseController } from "../base-controller";
import driverService from "../../service/modules/driver-service";

class DriverController extends BaseController {
  constructor() {
    super();
  }

  public getDrivers = async(req: Request, res: Response) =>{
    let { current = 1, page_size = 10, name="", driver_code="", month="", year="", status="" } = req.query;

    if (month == "" || year == "") {
      if (month == "") {
        return this.badRequest(res, "month is required")
      }
      if (year == "") {
        return this.badRequest(res, "year is required")
      }
    }
    let data = await driverService.getDrivers(current, page_size, {name, driver_code, month, year, status});
    if (!data) {
      return this.badRequest(res, "something went wrong")
    }

    res.json(data)
  }
}

export default new DriverController()