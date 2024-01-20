import { usersRepository } from "@/repositories/users-repository"
import { hash } from "bcryptjs"

interface RegisterUseCaseRequest {
    nome: string,
    email: string,
    password: string
}

export class RegisterUseCase {
    constructor(private usersRepository: usersRepository,) {}

    async execute({
        nome, 
        email, 
        password,
    }: RegisterUseCaseRequest) {
        const password_hash = await hash(password, 6)
        
        const userWithSameEmail = await this.usersRepository.findUserByEmail(email)
    
        if(userWithSameEmail) {
            throw new Error('E-mail already exists.')
        }
    
        await this.usersRepository.create({
            nome,
            email,
            password_hash,
        })
    }
}
