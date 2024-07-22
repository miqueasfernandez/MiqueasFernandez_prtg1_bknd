import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/routes.products.js";
import cartsRouter from "./routes/routes.carts.js";
import viewsRouter from "./routes/router.views.js";
import exphbs from "express-handlebars";
import displayRoutes from "express-routemap";


const app = express();
const port = 8080

//rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"))


//express-handlebars
app.engine("handlebars", engine());
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views")


//escuchamos en el puerto para verificar que funciona 
const httpServer = app.listen(port, () => {
    displayRoutes(app)
    console.log(`listening port; ${port} successfully`);
});


import ProductManager from "./dao/fs/product-manager.js";
const productManager = new ProductManager("./src/datos/products.json")

const io = new Server(httpServer);
/*
io.on("connection", async (socket) => {
    console.log("Un cliente se conecto");
    
    //enviamos un array de productos
    socket.emit("productos", await productManager.getProducts());

    //recibimos el evento eliminarproducto desde front
    socket.on("eliminarProducto", async (id)=>{
        await productManager.deleteProduct(id);

        //le einvio la lista actualizada al cliente
        io.socket.emit("productos", await productManager.getProducts())
    })

    //agregamos producto desde el form

    socket.on("agregarProducto", async (producto)=>{
        await productManager.addProduct(producto);
        io.socket.emit("productos", await productManager.getProducts())
    })
});
*/

import mongoose from "mongoose";

mongoose.connect("mongodb+srv://kanadesing:negros333@cluster0.cdmifvc.mongodb.net/eccomerce?retryWrites=true&w=majority&appName=Cluster0")
    .then( () => console.log("conexion exitosa!"))
    .catch( (error) => console.log("error de conexion", error));