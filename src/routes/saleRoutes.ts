import { FastifyInstance } from "fastify";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { createSale, getAllSales, getAllSalesByBuyer, getAllSalesBySeller } from "../controller/saleController";

export async function saleRoutes(app: FastifyInstance) {
    app.addHook('preHandler', AuthMiddleware(['Administrador', 'Vendedor', 'Comprador']))

    app.post('/create-sale', createSale);
    app.get('/get-all-sales', {preHandler: AuthMiddleware(['Administrador'])}, getAllSales);
    app.get('/get-all-sales-by-buyer', {preHandler: AuthMiddleware(['Administrador', 'Comprador'])}, getAllSalesByBuyer);
    app.get('/get-all-sales-by-seller', {preHandler: AuthMiddleware(['Administrador', 'Vendedor'])}, getAllSalesBySeller);
}