import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../db/prisma";
import { z } from "zod";
import { InvalidCredentialsError } from "../errors/invalidCredentialsError";

export const createStore = async(req: FastifyRequest, res: FastifyReply) => {
    const createStoreBodySchema = z.object({
        name: z.string(),

    })

    const createStoreParamsSchema = z.object({
        userId: z.string()
    })
    
    const {name} = createStoreBodySchema.parse(req.body)
    const userId = req.user?.id
    
    const isUserExists = await prisma.user.findUnique({where: {id: userId}})
    if(!isUserExists) throw new InvalidCredentialsError()

    const store = await prisma.store.create({
        data: {
            name,
            User: {
                connect: {
                    id: userId
                }
            }
        }
    })

    return res.send({store})
}

export const getAllStores = async(req: FastifyRequest, res: FastifyReply) => {
    const stores = await prisma.store.findMany({
        select: {
            id: true,
            name: true,
            User: {
                select: {
                    name: true,
                }
            },
            product: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    amount: true
                }
            }
        }
    })
    return res.send({ stores })
}