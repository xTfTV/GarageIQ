
-- Drop the table if it exists ** SCRIPT SHOULD ONLY BE RAN ONCE **
DROP TABLE IF EXISTS MaintenanceSchedule;

-- Creating the MaintenanceSchedule table
CREATE TABLE IF NOT EXISTS MaintenanceSchedule
(
  ScheduleId INTEGER PRIMARY KEY,
  VehicleId INTEGER NOT NULL,
  ServiceTypeId INTEGER NOT NULL,
  UserId INTEGER NOT NULL,
  LastServiceDate TEXT,
  LastServiceMileage INTEGER,
  IntervalMiles INTEGER,
  IntervalMonths INTEGER,
  NextDueDate TEXT,
  NextDueMileage INTEGER,
  ReminderThresholdMiles INTEGER,
  ReminderThresholdDays INTEGER,
  IsActive INTEGER NOT NULL
    CHECK(IsActive IN (0,1)),
  CreatedDate TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ModifyDate TEXT,
  LogicalCancel INTEGER NOT NULL DEFAULT 0
    CHECK(LogicalCancel IN (0,1)),
  FOREIGN KEY (VehicleId) REFERENCES Vehicles(VehicleId),
  FOREIGN KEY (ServiceTypeId) REFERENCES ServiceTypes(ServiceTypeId),
  FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Creating the indexes
CREATE INDEX IF NOT EXISTS IX_MaintenanceSchedule_VehicleId
ON MaintenanceSchedule(VehicleId);

CREATE INDEX IF NOT EXISTS IX_MaintenanceSchedule_ServiceTypeId
ON MaintenanceSchedule(ServiceTypeId);
