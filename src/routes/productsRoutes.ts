import { FastifyInstance } from "fastify";
import { createProduct, getAllProducts } from "../controller/productController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

export async function productsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', AuthMiddleware(['Administrador', 'Vendedor']))

    app.post('/product/:storeId', createProduct)
    app.get('/products',{preHandler: AuthMiddleware(['Vendedor',"Comprador"])}, getAllProducts);
}
