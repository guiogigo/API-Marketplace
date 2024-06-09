import { FastifyInstance } from "fastify";
import { createUser } from "../controller/userController";
import { signIn } from "../controller/sessionController";
import { userRoutes } from "./userRoutes";
import { accessRoutes } from "./accessRoutes";
import { storeRoutes } from "./storeRoutes";
import { productsRoutes } from "./productsRoutes";
import { saleRoutes } from "./saleRoutes";

export async function routes(app: FastifyInstance) {
    app.post('/user', createUser);
    app.post('/sign-in', signIn);
    
    app.register(userRoutes)
    app.register(accessRoutes)
    app.register(storeRoutes)
    app.register(productsRoutes)
    app.register(saleRoutes)
}