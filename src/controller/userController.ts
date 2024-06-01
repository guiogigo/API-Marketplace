import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../db/prisma";
import { z } from "zod";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "../errors/invalidCredentialsError";
import { StoreNotFoundError } from "../errors/storeNotFoundError";

export const createUser = async(req: FastifyRequest, res: FastifyReply) => {
    const createUserSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        accessName: z.string(), 
    })

    const { name, email, password, accessName } = createUserSchema.parse(req.body);

    const isUserUniqueEmail = await prisma.user.findUnique({where: {
        email
    }})
    if(isUserUniqueEmail) throw new InvalidCredentialsError()

    const isUserUniqueAccess = await prisma.access.findUnique({where: {
        name: accessName,
    }})
    if(!isUserUniqueAccess) throw new InvalidCredentialsError()
    
    const hashedPassword = await hash(password, 6);

    const user = await prisma.user.create(
    {data: {
        name,
        email,
        password: hashedPassword,
        userAccess: {
            create: {
                Access: {
                    connect: {
                        name: accessName
                    }
                }
            }
        }
    },
    select: {
        id: true,
        name: true,
        email: true,
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

    return res.send({user});
}

export const getAllUsers = async(req: FastifyRequest, res: FastifyReply) => {
    const users = await prisma.user.findMany({select: {
        id: true,
        name: true,
        email: true,
        userAccess: {
            select: {
                Access: {
                    select: {
                        name: true,
                    }
                }
            }
        }
    }})
    return res.send({ users })
}

export const deleteUser = async(req: FastifyRequest, res: FastifyReply) => {
    const userIdParamsSchema = z.object({
        userId: z.string()
    })
    const { userId } =  userIdParamsSchema.parse(req.params)

    await prisma.user.deleteMany({where: {id: userId}})
    return res.status(204).send()
}