import { FastifyInstance } from "fastify";
import { createStore, getAllStores } from "../controller/storeController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

export async function storeRoutes(app: FastifyInstance) {
    app.addHook('preHandler', AuthMiddleware(['Administrador', 'Vendedor']))

    app.post('/store', createStore)
    app.get('/store', getAllStores)
}