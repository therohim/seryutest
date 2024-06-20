export interface PaginationOptions {
  data: any[];
  page_size: number;
  current: number;
  total?:number;
}

export interface Driver {
  driver_code : string
  name :string
  total_pending : number
  total_confirmed : number
  total_paid : number
  total_attendance_salary : number
  total_salary : number
  count_shipment : number
}