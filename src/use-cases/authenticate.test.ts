import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { hash } from 'bcryptjs'

let usersRepository: InMemoryUserRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUserRepository()
    sut = new AuthenticateUseCase(usersRepository)

    const createUser = {
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      nome: 'John Doe',
    }
    await usersRepository.create(createUser)
  })
  it('should be able to authenticate', async () => {
    const userCredentials = {
      email: 'johndoe@example.com',
      password: '123456',
    }
    const { user } = await sut.execute(userCredentials)
    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong password', async () => {
    const user = {
      email: 'johndoe@example.com',
      password: 'wrongpassword',
    }
    await expect(() => sut.execute(user)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should not be able to authenticate with wrong user', async () => {
    const user = {
      email: 'nonexistentuser@teste.com',
      password: 'wrongpassword',
    }
    await expect(() => sut.execute(user)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
  })
})
