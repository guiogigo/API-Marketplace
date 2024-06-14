import { FastifyInstance } from "fastify";
import { createProduct, deleteProduct, getAllProducts, getUniqueProduct, updateProduct } from "../controller/productController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

export async function productsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', AuthMiddleware(['Administrador', 'Vendedor', 'Comprador']))

    app.post('/product/:storeId', {preHandler: AuthMiddleware(['Administrador', 'Vendedor'])}, createProduct)
    app.get('/products',{preHandler: AuthMiddleware(['Vendedor',"Comprador"])}, getAllProducts);
    app.get('/product/:productId', getUniqueProduct);
    app.put('/product-update/:productId',{preHandler: AuthMiddleware(['Administrador', 'Vendedor'])}, updateProduct);
    app.delete('/product-delete/:productId',{preHandler: AuthMiddleware(['Administrador', 'Vendedor'])}, deleteProduct)
}
