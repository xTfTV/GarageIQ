import type Database from 'better-sqlite3'
import { scryptSync, timingSafeEqual } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  UserRepository,
  type RegisterUserInput
} from '../../src/main/Database Connection/Repositories/UserRepository'

import { createTestDatabase, initializeTestSchema } from '../Helpers/testDatabase'

let database: Database.Database
let repository: UserRepository

const validUser: RegisterUserInput = {
  username: 'garageiq_test',
  email: 'garageiq.test@example.com',
  firstName: 'Garage',
  lastName: 'Tester',
  dob: '2000-06-15',
  password: 'GarageIQTestPassword123!'
}

interface StoredUser {
  UserId: number
  UserName: string
  Email: string
  FirstName: string
  LastName: string
  DOB: string
  Password: string
  LogicalCancel: number
}

function getUser(username: string): StoredUser | undefined {
  return database
    .prepare(
      `
      SELECT
        UserId,
        UserName,
        Email,
        FirstName,
        LastName,
        DOB,
        Password,
        LogicalCancel
      FROM Users
      WHERE UserName = ?
    `
    )
    .get(username) as StoredUser | undefined
}

function getUserCount(): number {
  const result = database
    .prepare(
      `
      SELECT COUNT(*) AS Total
      FROM Users
    `
    )
    .get() as { Total: number }

  return result.Total
}

beforeEach(() => {
  database = createTestDatabase()
  initializeTestSchema(database)

  repository = new UserRepository(database)
})

afterEach(() => {
  if (database?.open) {
    database.close()
  }
})

describe('GarageIQ User Registration', () => {
  it('TC-01: Detects when no local accounts exist', () => {
    expect(repository.hasLocalAccount()).toBe(false)
    expect(getUserCount()).toBe(0)
  })

  it('TC-02: Successfully registers a new user', async () => {
    const user = await repository.register(validUser)

    expect(user.userId).toBeGreaterThan(0)
    expect(user.username).toBe(validUser.username)
    expect(user.email).toBe(validUser.email)
    expect(user.firstName).toBe(validUser.firstName)
    expect(user.lastName).toBe(validUser.lastName)

    expect(getUserCount()).toBe(1)
  })

  it('TC-03: Stores user information correctly in SQLite', async () => {
    await repository.register(validUser)

    const stored = getUser(validUser.username)

    expect(stored).toBeDefined()
    expect(stored?.UserName).toBe(validUser.username)
    expect(stored?.Email).toBe(validUser.email)
    expect(stored?.FirstName).toBe(validUser.firstName)
    expect(stored?.LastName).toBe(validUser.lastName)
    expect(stored?.DOB).toBe(validUser.dob)
    expect(stored?.LogicalCancel).toBe(0)
  })

  it('TC-04: Never stores the original password', async () => {
    await repository.register(validUser)

    const stored = getUser(validUser.username)

    expect(stored?.Password).toBeDefined()
    expect(stored?.Password).not.toBe(validUser.password)
    expect(stored?.Password.startsWith('scrypt$v1$')).toBe(true)
  })

  it('TC-05: Produces a verifiable scrypt password hash', async () => {
    await repository.register(validUser)

    const stored = getUser(validUser.username)

    expect(stored).toBeDefined()

    const parts = stored!.Password.split('$')

    expect(parts).toHaveLength(4)
    expect(parts[0]).toBe('scrypt')
    expect(parts[1]).toBe('v1')

    const salt = Buffer.from(parts[2], 'hex')
    const savedHash = Buffer.from(parts[3], 'hex')

    expect(salt).toHaveLength(16)
    expect(savedHash).toHaveLength(64)

    const derivedHash = scryptSync(validUser.password, salt, savedHash.length)

    expect(timingSafeEqual(derivedHash, savedHash)).toBe(true)
  })

  it('TC-06: Uses a unique password salt for each account', async () => {
    await repository.register(validUser)

    await repository.register({
      ...validUser,
      username: 'second_test',
      email: 'second.test@example.com'
    })

    const first = getUser(validUser.username)
    const second = getUser('second_test')

    expect(first).toBeDefined()
    expect(second).toBeDefined()

    expect(first!.Password).not.toBe(second!.Password)
    expect(first!.Password.split('$')[2]).not.toBe(second!.Password.split('$')[2])
  })

  it('TC-07: Rejects duplicate usernames', async () => {
    await repository.register(validUser)

    await expect(
      repository.register({
        ...validUser,
        email: 'another@example.com'
      })
    ).rejects.toThrow()

    expect(getUserCount()).toBe(1)
  })

  it('TC-08: Rejects duplicate email addresses', async () => {
    await repository.register(validUser)

    await expect(
      repository.register({
        ...validUser,
        username: 'another_user'
      })
    ).rejects.toThrow()

    expect(getUserCount()).toBe(1)
  })

  it('TC-09: Rejects duplicate usernames regardless of case', async () => {
    await repository.register(validUser)

    await expect(
      repository.register({
        ...validUser,
        username: 'GARAGEIQ_TEST',
        email: 'different@example.com'
      })
    ).rejects.toThrow()

    expect(getUserCount()).toBe(1)
  })

  it('TC-10: Rejects invalid email addresses', async () => {
    await expect(
      repository.register({
        ...validUser,
        email: 'invalid-email'
      })
    ).rejects.toThrow()

    expect(getUserCount()).toBe(0)
  })

  it('TC-11: Rejects invalid usernames', async () => {
    const invalidUsernames = ['', 'ab', 'invalid username', 'user@name', 'a'.repeat(31)]

    for (const username of invalidUsernames) {
      await expect(
        repository.register({
          ...validUser,
          username
        })
      ).rejects.toThrow()
    }

    expect(getUserCount()).toBe(0)
  })

  it('TC-12: Rejects passwords shorter than 12 characters', async () => {
    await expect(
      repository.register({
        ...validUser,
        password: 'short123'
      })
    ).rejects.toThrow()

    expect(getUserCount()).toBe(0)
  })

  it('TC-13: Rejects invalid dates of birth', async () => {
    const invalidDates = ['', 'not-a-date', '2000-13-15', '2000-02-30', '2999-01-01']

    for (const dob of invalidDates) {
      await expect(
        repository.register({
          ...validUser,
          dob
        })
      ).rejects.toThrow()
    }

    expect(getUserCount()).toBe(0)
  })

  it('TC-14: Supports multiple local accounts', async () => {
    const firstUser = await repository.register(validUser)

    const secondUser = await repository.register({
      ...validUser,
      username: 'family_member',
      email: 'family.member@example.com',
      firstName: 'Family',
      lastName: 'Member'
    })

    expect(firstUser.userId).not.toBe(secondUser.userId)

    expect(getUserCount()).toBe(2)

    expect(getUser(validUser.username)).toBeDefined()
    expect(getUser('family_member')).toBeDefined()
  })

  it('TC-15: Detects an existing local account after registration', async () => {
    expect(repository.hasLocalAccount()).toBe(false)

    await repository.register(validUser)

    expect(repository.hasLocalAccount()).toBe(true)
  })

  it('TC-16: Normalizes usernames and email addresses', async () => {
    const user = await repository.register({
      ...validUser,
      username: '  garageiq_test  ',
      email: '  GARAGEIQ.TEST@EXAMPLE.COM  '
    })

    expect(user.username).toBe('garageiq_test')
    expect(user.email).toBe('garageiq.test@example.com')

    const stored = getUser('garageiq_test')

    expect(stored?.Email).toBe('garageiq.test@example.com')
  })

  it('TC-17: Does not modify existing users when registration fails', async () => {
    await repository.register(validUser)

    const original = getUser(validUser.username)

    await expect(
      repository.register({
        ...validUser,
        password: 'short'
      })
    ).rejects.toThrow()

    const after = getUser(validUser.username)

    expect(after).toEqual(original)
    expect(getUserCount()).toBe(1)
  })

  it('TC-18: Does not return password hashes to React', async () => {
    const result = await repository.register(validUser)

    expect(result).not.toHaveProperty('password')
    expect(result).not.toHaveProperty('Password')

    expect(result).toEqual({
      userId: expect.any(Number),
      username: validUser.username,
      email: validUser.email,
      firstName: validUser.firstName,
      lastName: validUser.lastName
    })
  })
})
