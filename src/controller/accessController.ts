import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../db/prisma";
import { z } from "zod";

export const createAccess = async(req: FastifyRequest, res: FastifyReply) => {
    const createAccessSchema = z.object({
        name: z.string(),
    })

    const { name } = createAccessSchema.parse(req.body);

    const acess = await prisma.access.create(
        {data: {
        name,
        },
    }
    )

    return res.send({acess});
}

export const getAllAccess = async(req: FastifyRequest, res: FastifyReply) => {

    const acesses = await prisma.access.findMany()

    return res.send({acesses});
}