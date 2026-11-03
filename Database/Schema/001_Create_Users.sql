

-- Drop the table if it exists ** SCRIPT SHOULD ONLY BE RAN ONCE **
DROP TABLE IF EXISTS Users;

-- Create the Users table
CREATE TABLE IF NOT EXISTS Users
(
  UserId INTEGER PRIMARY KEY,
  UserName TEXT NOT NULL UNIQUE,
  Email TEXT NOT NULL UNIQUE,
  FirstName TEXT NOT NULL,
  LastName TEXT NOT NULL,
  DOB TEXT NOT NULL,
  Password TEXT NOT NULL,
  CreatedDate TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ModifyDate TEXT,
  LogicalCancel INTEGER NOT NULL DEFAULT 0
    CHECK(LogicalCancel IN (0,1))
);

-- Creating the indexes
CREATE INDEX IF NOT EXISTS IX_Users_UserName
ON Users(UserName);

CREATE INDEX IF NOT EXISTS IX_Users_Email
ON Users(Email);

