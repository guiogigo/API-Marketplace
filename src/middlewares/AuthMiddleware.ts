import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";
import { prisma } from "../db/prisma";
import { z } from "zod";

interface DecodedToken {
    userId: string;
}



export function AuthMiddleware(permissions?: Array<string>) {
    return async (req: FastifyRequest, res: FastifyReply) => {
        const authHeader = req.headers.authorization
        
        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send({
                error: 'Unathorized.',
                })
                }
                
                const token = authHeader.substring(7)
                
                try {
                    const MY_SECRET_KEY = process.env.MY_SECRET_KEY
                    if(!MY_SECRET_KEY) throw new Error("Chave secreta não fornecida")
                        
                        const decodedToken = verify(token, MY_SECRET_KEY) as DecodedToken
        req.user = {id: decodedToken.userId}

        if(permissions) {
            const user = await prisma.user.findUnique({
                where: {
                    id: decodedToken.userId
                },
                include: {
                    userAccess: {
                        select: {
                            Access: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            }
        )

        const userPermissions = user?.userAccess.map((na) => na.Access?.name) ?? []
        const hasPermissions = permissions.some((p) => userPermissions.includes(p))

        if(!hasPermissions) {
            return res.status(403).send({message: "Permissão negada."})
        }

        }

    }catch(error) {
        return res.status(401).send({message: "Token inválido.", error})
    }
}
}
