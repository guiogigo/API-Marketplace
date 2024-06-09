import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../db/prisma";
import { z } from "zod";
import { InvalidCredentialsError } from "../errors/invalidCredentialsError";
import { StoreNotFoundError } from "../errors/storeNotFoundError";

export const createProduct = async(req: FastifyRequest, res: FastifyReply) => {

    const createStoreBodySchema = z.object({
        name: z.string(),
        price: z.number(),
        amount: z.number(),
    })

    const createStoreParamsSchema = z.object({
        storeId: z.string()
    })

    const { name, price, amount } = createStoreBodySchema.parse(req.body)
    const { storeId } = createStoreParamsSchema.parse(req.params)

    const isStoreExists = await prisma.store.findUnique({where: {id: storeId}})
    if(!isStoreExists) throw new StoreNotFoundError()

    const product = await prisma.product.create({
        data: {
            name,
            price,
            amount,
            Store: {
                connect: {
                    id: storeId
                }
            }
        }
    })

    return res.send({product})
}

export const getAllProducts = async(req: FastifyRequest, res: FastifyReply) => {
    const products = await prisma.product.findMany()
    return res.send({ products })
}