import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";

interface DecodedToken {
    userId: string;
}

export async function AuthMiddleware(req: FastifyRequest, res: FastifyReply) {
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
    
        req.user = {id:  decodedToken.userId}
    }catch(error) {

    }
}
