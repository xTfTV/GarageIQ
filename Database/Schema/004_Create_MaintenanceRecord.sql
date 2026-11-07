
-- Drop the table if it exists ** SCRIPT SHOULD ONLY BE RAN ONCE **
DROP TABLE IF EXISTS MaintenanceRecord;

-- Creating the MaintenanceRecord table
CREATE TABLE IF NOT EXISTS MaintenanceRecord
(
  MaintenanceRecordId INTEGER PRIMARY KEY,
  VehicleId INTEGER NOT NULL,
  ServiceTypeId INTEGER NOT NULL,
  UserId INTEGER NOT NULL,
  ServiceDate TEXT NOT NULL,
  MileageAtService TEXT NOT NULL,
  Cost DECIMAL NOT NULL,
  ServiceProvider TEXT,
  InvoiceNumber TEXT,
  Notes TEXT,
  CreatedDate TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ModifyDate TEXT,
  LogicalCancel INTEGER NOT NULL DEFAULT 0
    CHECK(LogicalCancel IN (0,1)),
  FOREIGN KEY (VehicleId) REFERENCES Vehicles(VehicleId),
  FOREIGN KEY (ServiceTypeId) REFERENCES ServiceTypes(ServiceTypeId),
  FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Creating the Indexes
CREATE INDEX IF NOT EXISTS IX_MaintenanceRecord_VehicleId
ON MaintenanceRecord(VehicleId);

CREATE INDEX IF NOT EXISTS IX_MaintenanceRecord_ServiceTypeId
ON MaintenanceRecord(ServiceTypeId);

CREATE INDEX IF NOT EXISTS IX_MaintenanceRecord_Cost
ON MaintenanceRecord(Cost);
