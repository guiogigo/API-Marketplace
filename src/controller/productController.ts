import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../db/prisma";
import { z } from "zod";
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

export const updateProduct = async(req: FastifyRequest, res: FastifyReply) => {
    try {

        const updateProductBodySchema = z.object({
            name: z.string(),
            price: z.number(),
            amount: z.number(),
        })
    
        const productIdParamsSchema = z.object({
            productId: z.string()
        })
    
        const { name, price, amount } = updateProductBodySchema.parse(req.body)
        const { productId } = productIdParamsSchema.parse(req.params)
        const id = req.user?.id
    
        const originalProduct = await prisma.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                Store: true,
            }
        })
    
        if(!originalProduct) {
            return res.status(404).send({Erro: 'Produto não encontrado'});
        }
    
        if(id !== originalProduct.Store?.userId) {
            return res.status(404).send({Erro: 'Esse produto não pertence ao vendedor fornecido'});
        }
    
        const product = await prisma.product.update({
            where: {
                id: productId,
            },
            data: {
                name,
                price,
                amount,
            }
        })
    
        return res.status(200).send({product})
    }catch(error) {
        return res.status(400).send(error)
    }
}

export const getUniqueProduct = async(req: FastifyRequest, res: FastifyReply) => {
    
    try {
        const productIdParamsSchema = z.object({
            productId: z.string()
        })
        const { productId } = productIdParamsSchema.parse(req.params)
    
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
            select: {
                id: true,
                name: true,
                price: true,
                amount: true,
            }
        })

        if(!product) {
            return res.status(404).send({Error: 'Produto não encontrado'})
        }

        return res.status(200).send({ product })
    } catch (error) {
        return res.status(400).send(error)
    }
}

export const deleteProduct = async(req: FastifyRequest, res: FastifyReply) => {
    
    try {
        const productIdParamsSchema = z.object({
            productId: z.string()
        })
    
        const { productId } = productIdParamsSchema.parse(req.params)
        const id = req.user?.id
    
        const originalProduct = await prisma.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                Store: true,
            }
        })
    
        if(!originalProduct) {
            return res.status(404).send({Erro: 'Produto não encontrado'});
        }
    
        if(id !== originalProduct.Store?.userId) {
            return res.status(404).send({Erro: 'Esse produto não pertence ao vendedor fornecido'});
        }

        await prisma.product.delete({
            where: {
                id: productId
            }
        })
    
        return res.status(204).send({message: "Produto deletado com sucesso."})
    } catch (error) {
        return res.status(400).send(error)
    }
}

export const getAllProducts = async(req: FastifyRequest, res: FastifyReply) => {
    const products = await prisma.product.findMany()
    return res.send({ products })
}