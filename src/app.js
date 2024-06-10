import express from "express";
import productsRouter from "./routes/routes.products.js";
import cartsRouter from "./routes/routes.carts.js";


const app = express();
const port = 8080
app.use(express.json());

app.use("/api/routes.products", productsRouter);
app.use("/api/routes.carts", cartsRouter);
app.use(express.urlencoded({ extended: true }));

//escuchamos en el puerto para verificar que funciona 
app.listen(port, () => {
    console.log(`listening port; ${port} successfully`);
});