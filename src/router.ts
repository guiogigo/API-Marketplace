import { FastifyInstance } from "fastify";
import { createUser, deleteUser, getAllUsers } from "./controller/userController";
import { createAccess, getAllAccess } from "./controller/accessController";
import { createStore, getAllStores } from "./controller/storeController";
import { createProduct } from "./controller/productController";

export async function routes(app: FastifyInstance) {
    app.post('/user', createUser);
    app.get('/get-all-users', getAllUsers);
    app.delete('/user/:userId', deleteUser)

    app.post('/access', createAccess);
    app.get('/accesses', getAllAccess);

    app.post('/store/:userId', createStore)
    app.get('/store', getAllStores)

    app.post('/product/:storeId', createProduct)
}