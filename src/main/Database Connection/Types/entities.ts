export interface User {
  UserId: number
  UserName: string
  Email: string
  FirstName: string
  LastName: string
  DOB: string
  Password: string
  CreatedDate: string
  ModifyDate: string | null
  LogicalCancel: number
}

export interface Vehicle {
  VehicleId: number
  UserId: number
  VehicleYear: number
  Make: string
  Model: string
  Trim: string
  VIN: string
  LicensePlate: string | null
  Color: string | null
  Mileage: number
  PurchaseDate: string
  CreatedDate: string
  ModifyDate: string | null
  LogicalCancel: number
}

export interface ServiceType {
  ServiceTypeId: number
  ServiceTypeName: string | null
  Category: string
  DefaultIntervalMiles: number | null
  DefaultIntervalMonths: number | null
  Description: string | null
  CreatedDate: string
  ModifyDate: string | null
  LogicalCancel: number
}

export interface MaintenanceRecord {
  MaintenanceRecordId: number
  VehicleId: number
  ServiceTypeId: number
  UserId: number
  ServiceDate: string
  MileageAtService: string
  Cost: number | string
  ServiceProvider: string | null
  InvoiceNumber: string | null
  Notes: string | null
  CreatedDate: string | null
  ModifyDate: string | null
  LogicalCancel: number
}

export interface MaintenanceSchedule {
  ScheduleId: number
  VehicleId: number
  ServiceTypeId: number
  UserId: number
  LastServiceDate: string | null
  LastServiceMileage: string | null
  IntervalMiles: number | null
  IntervalMonths: number | null
  NextDueDate: string | null
  ReminderThresholdMiles: number | null
  ReminderThresholdDays: number | null
  IsActive: number
  CreatedDate: string
  ModifyDate: string | null
  LogicalCancel: number
}

export interface OdometerHistory {
  OdometerHistoryId: number
  VehicleId: number
  UserId: number
  Mileage: number
  RecordedDate: string
  Source: string | null
  Notes: string | null
  CreatedDate: string
  ModifyDate: string | null
  LogicalCancel: number
}

export interface Attachment {
  AttachmentId: number
  UserId: number
  FileName: string
  FilePath: string
  FileType: string
  FileSize: number
  UploadedDate: string
  LogicalCancel: number
}
