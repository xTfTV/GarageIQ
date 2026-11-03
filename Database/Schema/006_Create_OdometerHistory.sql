
-- Drop the table if it exists ** SCRIPT SHOULD ONLY BE RAN ONCE **
DROP TABLE IF EXISTS OdometerHistory;

-- Creating the OdometerHistory Table
CREATE TABLE IF NOT EXISTS OdometerHistory
(
  OdometerHistoryId INTEGER PRIMARY KEY,
  VehicleId INTEGER NOT NULL,
  UserId INTEGER NOT NULL,
  Mileage INTEGER NOT NULL DEFAULT 0
    CHECK(Mileage >= 0),
  RecordedDate TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Source TEXT,
  Notes TEXT,
  CreatedDate TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ModifyDate TEXT,
  LogicalCancel INTEGER NOT NULL DEFAULT 0
    CHECK(LogicalCancel IN (0,1)),
  FOREIGN KEY (VehicleId) REFERENCES Vehicles(VehicleId),
  FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Create the index
CREATE INDEX IF NOT EXISTS IX_OdometerHistory_VehicleId
ON OdometerHistory(VehicleId);


