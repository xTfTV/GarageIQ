export class DatabaseOperationError extends Error {
  constructor(operation: string, options?: ErrorOptions) {
    super(`Database operation failed: ${operation}`, options)
    this.name = 'DatabaseOperationError'
  }
}

export function executeDatabaseOperation<T>(operation: string, callback: () => T): T {
  try {
    return callback()
  } catch (error) {
    console.error(`[GarageIQ] Database error during ${operation}: `, error)
    throw new DatabaseOperationError(operation, { cause: error })
  }
}
