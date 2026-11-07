
-- Drop the table if it exists ** SCRIPT SHOULD ONLY BE RAN ONCE **
DROP TABLE IF EXISTS Vehicles;

-- Create the Vehicle table
CREATE TABLE IF NOT EXISTS Vehicles
(
  VehicleId INTEGER PRIMARY KEY,
  UserId INTEGER NOT NULL,
  VehicleYear INTEGER NOT NULL,
  Make TEXT NOT NULL,
  Model TEXT NOT NULL,
  Trim TEXT NOT NULL,
  VIN TEXT UNIQUE NOT NULL,
  LicensePlate TEXT,
  Color TEXT,
  Mileage INTEGER NOT NULL DEFAULT 0
    CHECK (Mileage >= 0),
  PurchaseDate TEXT NOT NULL,
  CreatedDate TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ModifyDate TEXT,
  LogicalCancel INTEGER NOT NULL DEFAULT 0
    CHECK (LogicalCancel IN (0,1)),
  FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Adding the index
CREATE INDEX IF NOT EXISTS IX_Vehicles_Make
ON Vehicles(Make);
