import { FastifyInstance } from "fastify";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { deleteUser, getAllUsers, getUniqueUser } from "../controller/userController";

export async function userRoutes(app: FastifyInstance) {
    app.addHook('preHandler', AuthMiddleware())
    
    app.get('/get-all-users', {preHandler: AuthMiddleware(['Administrador'])}, getAllUsers);
    app.get('/get-unique-user', {preHandler: AuthMiddleware()}, getUniqueUser);
    app.delete('/user/:userId', {preHandler: AuthMiddleware(['Administrador'])}, deleteUser);
}