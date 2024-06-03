import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../db/prisma";
import { InvalidCredentialsError } from "../errors/invalidCredentialsError";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export const signIn = async (req: FastifyRequest, res: FastifyReply) => {
    const signInBodySchema = z.object({
        email: z.string().email(),
        password: z.string()
    })
    
    try {
        const { email, password } = signInBodySchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                userAccess: {
                    select: {
                        Access: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            }
        })

        if(!user) throw new InvalidCredentialsError()

        const isPasswordValid = await compare(password, user.password)

        if(!isPasswordValid) throw new InvalidCredentialsError()

        const MY_SECRET_KEY = process.env.MY_SECRET_KEY;
        if(!MY_SECRET_KEY) throw new Error("Chave secreta não fornecida")

        const token = sign({
            userId: user.id,
            roles: user.userAccess.map(role => role.Access?.name)
        }, MY_SECRET_KEY, {
            algorithm: "HS256",
            expiresIn: "1h",
        })

        return res.status(200).send({token})
    }
    catch(error) {
        return res.status(400).send(error)
    }
}