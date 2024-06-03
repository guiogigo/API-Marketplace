import { FastifyInstance } from "fastify";
import { createProduct } from "../controller/productController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

export async function productsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', AuthMiddleware(['Administrador', 'Vendedor']))

    app.post('/product/:storeId', createProduct)
}
