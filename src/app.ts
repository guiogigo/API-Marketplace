import fastify from "fastify";
import { routes } from "./routes/router";

export const app = fastify();

app.register(routes)
