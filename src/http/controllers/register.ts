import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { RegisterUseCase } from '@/use-cases/register';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository';
import { userAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        nome: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { nome, email, password } = registerBodySchema.parse(request.body)

    try {
        const userRepository = new PrismaUserRepository()
        const registerUseCase = new RegisterUseCase(userRepository)
        
        await registerUseCase.execute({
            nome, 
            email, 
            password
        })
    } catch(err) {

        if(err instanceof userAlreadyExistsError) {
            return reply.status(409).send({ message: err.message })
        }

        throw err
    }

    return reply.status(201).send()
}
