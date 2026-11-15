import Database from 'better-sqlite3'
import { getDatabase } from '../connection'
import { randomBytes, scrypt as scryptCallback } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)

export interface RegisterUserInput {
  username: string
  email: string
  firstName: string
  lastName: string
  dob: string
  password: string
}

export interface PublicUser {
  userId: number
  username: string
  email: string
  firstName: string
  lastName: string
}

// Commenting for now as this is not needed yet
// interface UserRow {
//   UserId: number
//   UserName: string
//   Email: string
//   FirstName: string
//   LastName: string
// }

function validateRegistration(input: RegisterUserInput): void {
  if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(input.username)) {
    throw new Error('Username must contain 3-30 valid characters')
  }

  if (input.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    throw new Error('Enter a valid email address')
  }

  if (
    !input.firstName ||
    !input.lastName ||
    input.firstName.length > 255 ||
    input.lastName.length > 255
  ) {
    throw new Error('First Name or Last Name are either invalid or too long')
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.dob)) {
    throw new Error('Enter a valid date of birth')
  }

  const [year, month, day] = input.dob.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    date.getTime() > Date.now()
  ) {
    throw new Error('Enter a valid date of birth')
  }

  if (input.password.length < 12 || input.password.length > 255) {
    throw new Error('Password must be atleast 12 characters with a max of 255 characters allowed')
  }
}

export class UserRepository {
  constructor(private readonly database: Database.Database = getDatabase()) {}

  hasLocalAccount(): boolean {
    const result = this.database
      .prepare(
        `
            SELECT COUNT(*) AS Total
            FROM Users
            WHERE LogicalCancel = 0
        `
      )
      .get() as { Total: number }

    return result.Total > 0
  }

  async register(input: RegisterUserInput): Promise<PublicUser> {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      throw new Error('Invalid registration request')
    }

    const fields: (keyof RegisterUserInput)[] = [
      'username',
      'email',
      'firstName',
      'lastName',
      'dob',
      'password'
    ]

    for (const field of fields) {
      if (typeof input[field] !== 'string') {
        throw new Error(`Invalid registration field: ${field}`)
      }
    }

    const normalized: RegisterUserInput = {
      username: input.username.trim(),
      email: input.email.trim().toLowerCase(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      dob: input.dob,
      password: input.password
    }

    validateRegistration(normalized)

    if (this.hasLocalAccount()) {
      throw new Error('Local account setup is already complete')
    }

    const existing = this.database
      .prepare(
        `
            SELECT UserId
            FROM Users
            WHERE LOWER(UserName) = LOWER(?)
                OR LOWER(Email) = LOWER(?)
            LIMIT 1
        `
      )
      .get(normalized.username, normalized.email)

    if (existing) {
      throw new Error('Username or email; is already registered')
    }

    const salt = randomBytes(16)
    const derived = (await scrypt(normalized.password, salt, 64)) as Buffer

    // Versioned hash format for future login verification
    const passwordHash = `scrypt$v1$${salt.toString('hex')}$${derived.toString('hex')}`

    const createUser = this.database.transaction(() => {
      // Prevent duplicate registration after an asynchronous
      // password-hashing operation
      if (this.hasLocalAccount()) {
        throw new Error('Local account setup is already complete')
      }

      const result = this.database
        .prepare(
          `
            INSERT INTO Users (
                UserName,
                Email,
                FirstName,
                LastName,
                DOB,
                Password,
                LogicalCancel
            )
            VALUES (?,?,?,?,?,?,0)
        `
        )
        .run(
          normalized.username,
          normalized.email,
          normalized.firstName,
          normalized.lastName,
          normalized.dob,
          passwordHash
        )
      return Number(result.lastInsertRowid)
    })

    const userId = createUser()

    return {
      userId,
      username: normalized.username,
      email: normalized.email,
      firstName: normalized.firstName,
      lastName: normalized.lastName
    }
  }
}
