import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUserRepository
let sut: GetUserProfileUseCase

describe('Authenticate Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUserRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })
  it('should be able to get user profile', async () => {
    const createUser = await usersRepository.create({
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      nome: 'John Doe',
    })

    const { user } = await sut.execute({
      userId: createUser.id
    })
    expect(user.id).toEqual(expect.any(String))
    expect(user.nome).toEqual('John Doe')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() => sut.execute({
      userId: 'non-existing-id'}),
      ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
