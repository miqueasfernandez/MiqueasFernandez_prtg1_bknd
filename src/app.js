import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/routes.products.js";
import cartsRouter from "./routes/routes.carts.js";
import viewsRouter from "./routes/router.views.js";
import exphbs from "express-handlebars";
import displayRoutes from "express-routemap";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializedPassport from "./config/passport.config.js";
import sessionRouter from "./routes/session.router.js";
import session from 'express-session';
const app = express();
const port = 8080


//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"))
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
initializedPassport();
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: "secretmiki",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://kanadesing:negros333@cluster0.cdmifvc.mongodb.net/login"
    }),
    cookie: { secure: true }
}))

//rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter); 


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

import mongoose from "mongoose";

mongoose.connect("mongodb+srv://kanadesing:negros333@cluster0.cdmifvc.mongodb.net/eccomerce?retryWrites=true&w=majority&appName=Cluster0")
    .then( () => console.log("conexion exitosa!"))
    .catch( (error) => console.log("error de conexion", error));