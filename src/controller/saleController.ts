import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../db/prisma";


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
            const quantity = products.find((p) => p.id === product.id)?.quantity ?? 0
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

        if(id === userSellerId) {
            return res.status(400).send({error: 'Um vendedor não pode comprar da prórpia loja'})
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

export const getAllSales = async(req: FastifyRequest, res: FastifyReply) => {
    const sales = await prisma.sale.findMany({
        select: {
            id: true,
            total_value: true,
            Seller: {
                select: {
                    id: true,
                    name: true,
                }
            },
            Buyer: {
                select: {
                    id: true,
                    name: true,
                }
            },
            SaleProduct: {
                select: {
                    Product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                        }
                    },
                    quantity: true,
                }
            },
            created_at: true,
        }
    })

    return res.status(200).send({sales})
}

export const getAllSalesByBuyer = async(req: FastifyRequest, res: FastifyReply) => {
    const id = req.user?.id

    const sales = await prisma.sale.findMany({
        where: {
            buyerId: id
        },
        select: {
            id: true,
            total_value: true,
            Seller: {
                select: {
                    id: true,
                    name: true,
                }
            },
            Buyer: {
                select: {
                    id: true,
                    name: true,
                }
            },
            SaleProduct: {
                select: {
                    Product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                        }
                    },
                    quantity: true,
                }
            },
            created_at: true,
        }
    })

    return res.status(200).send({sales})
}

export const getAllSalesBySeller = async(req: FastifyRequest, res: FastifyReply) => {
    const id = req.user?.id

    const sales = await prisma.sale.findMany({
        where: {
            sellerId: id
        },
        select: {
            id: true,
            total_value: true,
            Seller: {
                select: {
                    id: true,
                    name: true,
                }
            },
            Buyer: {
                select: {
                    id: true,
                    name: true,
                }
            },
            SaleProduct: {
                select: {
                    Product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                        }
                    },
                    quantity: true,
                }
            },
            created_at: true,
        }
    })

    return res.status(200).send({sales})
}