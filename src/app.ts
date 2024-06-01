import fastify from "fastify";
import { routes } from "./router";

export const app = fastify();

app.register(routes)
