import { FastifyInstance } from "fastify";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { createSale } from "../controller/saleController";

export async function saleRoutes(app: FastifyInstance) {
    app.addHook('preHandler', AuthMiddleware(['Administrador', 'Vendedor']))

    app.post('/create-sale', createSale);
}