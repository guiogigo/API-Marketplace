import { FastifyReply, FastifyRequest } from "fastify";
import { any, z } from "zod";
import { prisma } from "../db/prisma";
import { connect } from "http2";

export const createSale = async (req: FastifyRequest, res: FastifyReply) => {
    const requestBodySchema = z.object({
        products: z.array(z.object({
            id: z.string(),
            quantity: z.number(),
        })),
        userSellerId: z.string().uuid()
    })

    const quantitySchema = z.object({
        id: z.string(),
        quantity: z.number(),
    })

    const {products, userSellerId } = requestBodySchema.parse(req.body);
    const id = req.user?.id


    try {
        const productsByDatabase = await prisma.product.findMany({
            where: {
                id: {in: products.map((item) => item.id)}
            }
        })

        const productsWithQuantity = productsByDatabase.map(product => {
            const {id, name, price} = product;
            const quantity = quantitySchema.parse(products.find((p) => p.id === product.id)).quantity
            return {
                id, 
                name,
                price,
                quantity
            }
        })



        let total = 0;
        for(const product of productsWithQuantity) {
            total += product.price * product.quantity
        }

        const sale = await prisma.sale.create({
            data: {
                total_value: total,
                Seller: {connect: {id: userSellerId}},
                Buyer: {connect: {id}},
                SaleProduct: {
                    create: productsWithQuantity.map((product) => ({
                        Product: {connect: {id: product.id}},
                        quantity: product.quantity,
                    })),
                },
            },
            include: {
                SaleProduct: true,
            }
        })

        productsWithQuantity.map(async (product) => {
            await prisma.product.updateMany({
                where: {id: product.id},
                data: {
                    amount: {
                        decrement: product.quantity,
                    }
                }
            })
        })

        return res.status(201).send({sale})

    } catch(error) {
        return error
    }
}