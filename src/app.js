import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/routes.products.js";
import cartsRouter from "./routes/routes.carts.js";
import viewsRouter from "./routes/router.views.js";
import exphbs from "express-handlebars";
import displayRoutes from "express-routemap";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializedPassport from "./config/passport.config.js";
import sessionRouter from "./routes/session.router.js";
import session from 'express-session';
import nodemailer from "nodemailer";
import twilio from "twilio";
const app = express();


import configObject from "./config/config.js";

const {MONGO_URL, PUERTO} = configObject; 

mongoose.connect(MONGO_URL)
    .then(() => console.log("Conectados"))
    .catch((error) => console.log("Error fatal: ", error))


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

//nodemailer

const transporter = nodemailer.createTransport({
    service: "gmail",
    PUERTO: 587,
    auth: {
        user: "TU USUARIO DE GMAIL",
        pass: "TU PASS DE NODEMAILER"
    }
});

//ruta de nodemailer
app.get("/enviarmensaje", async (req, res)=>{
    try {
        await transporter.sendMail({
            from: "coder test <TU EMAIL>",
            to: "EMAIL DE DESTINO",
            subject: "test de nodemailer",
            html:`<h1> eto eh una prueba de correo ermano, cachai? </h1>
                    <img src="cid:corte1"/>`,
            
        
        })
        res.send("correo enviado correctamente")
    } catch (error) {
        res.status(500).send("ocurrio un error al enviar el correo")
    }
});



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
const httpServer = app.listen(PUERTO, () => {
    displayRoutes(app)
    console.log(`listening PUERTO; ${PUERTO} successfully`);
});


import ProductManager from "./dao/fs/product-manager.js";
const productManager = new ProductManager("./src/datos/products.json")






//mongoose.connect("mongodb+srv://kanadesing:negros333@cluster0.cdmifvc.mongodb.net/eccomerce?retryWrites=true&w=majority&appName=Cluster0")
//    .then( () => console.log("conexion exitosa!"))
//    .catch( (error) => console.log("error de conexion", error));