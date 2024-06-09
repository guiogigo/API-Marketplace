import { app } from "./app";


app.get("/", (request, response) => {
    return response.send({message: "Hello world"})
})

app.listen({
    port: 3333,
    host: "0.0.0.0"
}).then(() => {
    console.log('Server is running!');
})