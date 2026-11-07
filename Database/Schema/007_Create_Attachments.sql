

-- Drop the table if it exists ** SCRIPT SHOULD ONLY BE RAN ONCE **
DROP TABLE IF EXISTS Attachments;

-- Creating the Attachments table
CREATE TABLE IF NOT EXISTS Attachments
(
  AttachmentId INTEGER PRIMARY KEY,
  UserId INTEGER NOT NULL,
  FileName TEXT NOT NULL,
  FilePath TEXT NOT NULL,
  FileType TEXT NOT NULL,
  FileSize INTEGER NOT NULL,
  UploadedDate TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  LogicalCancel INTEGER NOT NULL DEFAULT 0
    CHECK(LogicalCancel IN (0,1)),
  FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Creating the indexes
CREATE INDEX IF NOT EXISTS IX_Attachments_UserId
ON Attachments(UserId);

CREATE INDEX IF NOT EXISTS IX_Attachments_FileName
ON Attachments(FileName);

