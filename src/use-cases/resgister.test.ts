import { expect, describe, it, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'
import { RegisterUseCase } from './register'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { userAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUserRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    sut = new RegisterUseCase(usersRepository)
  })
  it('should be able to register', async () => {
    const { user } = await sut.execute({
        nome: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should hashed user password upon registration', async () => {
    const { user } = await sut.execute({
        nome: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })
  it('shoud shold not able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
        nome: 'John Doe',
        email,
        password: '123456'
    })

    await expect(() =>
      sut.execute({
        nome: 'John Doe',
        email,
        password: '123456'
      }),
    ).rejects.toBeInstanceOf(userAlreadyExistsError)
  })
})