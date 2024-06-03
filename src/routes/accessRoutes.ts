import { FastifyInstance } from "fastify";
import { createAccess, getAllAccess } from "../controller/accessController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

export async function accessRoutes(app: FastifyInstance) {
    app.addHook('preHandler', AuthMiddleware(['Administrador']))
    app.post('/access', createAccess);
    app.get('/accesses', getAllAccess);
}