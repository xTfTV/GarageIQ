
-- Drop the table if it exists ** SCRIPT SHOULD ONLY BE RAN ONCE **
DROP TABLE IF EXISTS ServiceTypes;

-- Creating the ServiceTypes table
CREATE TABLE IF NOT EXISTS ServiceTypes
(
  ServiceTypeId INTEGER PRIMARY KEY,
  ServiceTypeName TEXT UNIQUE,
  Category TEXT NOT NULL,
  DefaultIntervalMiles INTEGER,
  DefaultIntervalMonths INTEGER,
  Description TEXT,
  CreatedDate TEXT DEFAULT CURRENT_TIMESTAMP,
  ModifyDate TEXT,
  LogicalCancel INT NOT NULL DEFAULT 0
    CHECK(LogicalCancel IN (0,1))
);

-- Creating the index
CREATE INDEX IF NOT EXISTS IX_ServiceTypes_ServiceTypeName
ON ServiceTypes(ServiceTypeName);

