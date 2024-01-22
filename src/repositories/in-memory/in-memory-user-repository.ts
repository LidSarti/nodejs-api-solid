import { Prisma, User } from "@prisma/client";
import { usersRepository } from "../users-repository";
import { randomUUID } from "crypto";

export class InMemoryUserRepository implements usersRepository {
    public data: User[] = []

    async findUserByEmail(email: string) {
        const user = this.data.find(item => item.email === email)
        
        if(!user) {
            return null
        }

        return user
    }
    
    async create(data: Prisma.UserCreateInput) {
        const user = {
          id: randomUUID(),
          nome: data.nome,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
        this.data.push(user)
        return user
    }
}