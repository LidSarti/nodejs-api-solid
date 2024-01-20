import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { registerUseCase } from '@/use-cases/register';

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        nome: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { nome, email, password } = registerBodySchema.parse(request.body)

    try {
        await registerUseCase({
            nome, 
            email, 
            password
        })
    } catch(err) {
        return reply.status(409).send()
    }

    return reply.status(201).send()
}
