import postgres from "../../config/postgres";
import { Driver, PaginationOptions } from "../../interface/driver-interface";

class DriverService {
  
  // search : month, year, name, driver_code, status
  public getDrivers= async(page : any, limit: any, search:any): Promise<any> => {
    try {
      const limitSize = parseInt(limit, 10) || 10
      const pageSize = (parseInt(page, 10) * limitSize) - limitSize || 0;
      
      let query = `
        SELECT 
            a.driver_code, 
            a.name, 
            b.count_shipment, 
            b.total_paid, 
            b.total_confirmed, 
            b.total_pending, 
            c.total_attendance_salary, 
            c.attendance,
            b.month, 
            b.year
        FROM 
            drivers a
        JOIN (
            SELECT 
                driver_code,
                COUNT(*) AS count_shipment,
                EXTRACT(MONTH FROM b.shipment_date) AS month,
                EXTRACT(YEAR FROM b.shipment_date) AS year,
                SUM(CASE WHEN cost_status = 'PAID' THEN total_costs ELSE 0 END) AS total_paid,
                SUM(CASE WHEN cost_status = 'CONFIRMED' THEN total_costs ELSE 0 END) AS total_confirmed,
                SUM(CASE WHEN cost_status = 'PENDING' THEN total_costs ELSE 0 END) AS total_pending
            FROM 
                shipment_costs a
            JOIN 
                shipments b ON a.shipment_no = b.shipment_no AND b.shipment_status != 'CANCELLED'
            GROUP BY 
                EXTRACT(MONTH FROM b.shipment_date), 
                EXTRACT(YEAR FROM b.shipment_date), 
                a.driver_code
        ) b ON a.driver_code = b.driver_code
        JOIN (
            SELECT 
                driver_code,
                count(*) as attendance,
                COUNT(*) * (SELECT value FROM variable_configs WHERE key = 'DRIVER_MONTHLY_ATTENDANCE_SALARY') AS total_attendance_salary,
                EXTRACT(MONTH FROM attendance_date) AS month,
                EXTRACT(YEAR FROM attendance_date) AS year
            FROM 
                driver_attendances
            WHERE 
                attendance_status = true
            GROUP BY 
                EXTRACT(MONTH FROM attendance_date), 
                EXTRACT(YEAR FROM attendance_date), 
                driver_code
        ) c ON a.driver_code = c.driver_code AND b.month = c.month AND b.year = c.year
      `
      const conditions: string[] = [];
      const params: any[] = [];

      if (search.month) {
        conditions.push(`b.month = $${params.length + 1}`);
        params.push(search.month);
      }

      if (search.year) {
        conditions.push(`b.year = $${params.length + 1}`);
        params.push(search.year);
      }
      
      if (search.name) {
        conditions.push(`a.name ILIKE $${params.length + 1}`);
        params.push(`%${search.name}%`);
      }

      if (search.driver_code) {
        conditions.push(`a.driver_code = $${params.length + 1}`);
        params.push(`${search.driver_code}`);
      }

      if (search.status) {
        switch(search.status) { 
          case "PENDING": { 
            conditions.push(`b.total_pending > 0`);
            break; 
          } 
          case "CONFIRMED": { 
            conditions.push(`b.total_confirmed > 0`);
             break; 
          } 
          default: { 
            conditions.push(`(b.total_paid > 0 and b.total_confirmed = 0 and b.total_pending =0)`);
             break; 
          } 
       } 
      }

      conditions.push('(b.total_paid+b.total_confirmed+b.total_pending+c.total_attendance_salary) > 0')

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
      }
      // get total rows
      const paginate = await postgres.query(query, params)

      query += ` LIMIT ${limitSize} OFFSET ${pageSize}`;
      // result
      const result = await postgres.query(query, params)
      let data: any[] = []
      for(let i=0; i < result.rows.length; i++) {
        let res : Driver = {
          driver_code : result.rows[i].driver_code,
          name: result.rows[i].name,
          total_pending: parseFloat(result.rows[i].total_pending),
          total_confirmed: parseFloat(result.rows[i].total_confirmed),
          total_paid: parseFloat(result.rows[i].total_paid),
          total_attendance_salary: parseFloat(result.rows[i].total_attendance_salary),
          total_salary: parseFloat(result.rows[i].total_pending) + parseFloat(result.rows[i].total_confirmed) + parseFloat(result.rows[i].total_paid) + parseFloat(result.rows[i].total_attendance_salary),
          count_shipment: parseFloat(result.rows[i].count_shipment),
        }
        data.push(res)
      }
      const paginateOptions : PaginationOptions = {
        data:data,
        page_size: limitSize,
        current:page,
        total: paginate.rowCount || 0
      }
      return paginateOptions
    } catch(err) {
      return err
    }
  }

}

export default new DriverService()