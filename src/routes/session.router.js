import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import UserModel from "../dao/models/user.model.js";
import  createHash, {isValidPassword } from "../utils/hashbcrypt.js";
import CartModel from "../dao/models/carts.model.js";

const router = Router();




//Ruta de registro: 
router.post("/register", async (req, res) => {
    const { first_name, last_name, usuario, email, age, role, password } = req.body;

    try {
        //Verificamos si el usuario ya existe. 
        const existeUsuario = await UserModel.findOne({ first_name });

        if (existeUsuario) {
            return res.status(400).send("El usuario ya existe");
        }

        const nuevoCarrito = new CartModel({ products: [] });

        //Creamos el nuevo usuario: 
        const nuevoUsuario = new UserModel({
                first_name,
                last_name,
                usuario,
                email,
                age,
                password: createHash(password),
                role,
                cartId: nuevoCarrito._id, // Asignamos el ID del carrito creado
        })

        //Lo guardamos: 
        await nuevoUsuario.save();

        //Generar el token de JWT: 
        const token = jwt.sign({ usuario: nuevoUsuario.usuario, role: nuevoUsuario.role }, "coderhouse", { expiresIn: "1h" });

        //Generamos la cookie: 
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true  
        })

        res.redirect("/api/sessions/current");

    } catch (error) {
        console.log(error);
        
        res.status(500).send("Error interno del servidor");
    }
})

//Login
router.post("/login", async (req, res) => {
    const { usuario, password } = req.body;

    console.log("Usuario enviado:", usuario)
    try {
        //Buscamos el usuario en MongoDB: 
        const usuarioEncontrado = await UserModel.findOne({usuario});

        //Verificamos si el usuario existe
        if (!usuarioEncontrado) {
            return res.status(401).send("Usuario no valido");
            
            
        }

        //Verificamos la contraseña
        if (!isValidPassword(password, usuarioEncontrado)) {
            return res.status(401).send("contraseña incorrecta");
        }

        //Generar el token de JWT: 
        const token = jwt.sign({ usuario: usuarioEncontrado.usuario, role: usuarioEncontrado.role }, "coderhouse", { expiresIn: "1h" });

        //Generamos la cookie: 
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, 
            httpOnly: true 
        })

        res.redirect("/api/sessions/current");


    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }

    
})


//Ruta Current: 

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user) {
        //Renderizamos una vista especial "home" con la info del usuario: 
        res.render("home", { usuario: req.user.usuario });
    } else {
        //Si no hay un usuario asociado tiremos un error: 
        res.status(401).send("No autorizado");
    }
})

//Logout

router.post("/logout", (req, res) => {
    //Limpiar la cookie del toquen
    res.clearCookie("coderCookieToken");
    //Redirigir al login
    res.redirect("/api/sessions/login"); 
})

//Ruta para el formulario de login: 
router.get("/login", (req, res) =>{
    if (req.session.login) {
        return res.redirect("/api/sessions/home");
    }
    res.render("login");
});

//Ruta para el formulario de Register: 

router.get("/register", (req, res) => {
    if(req.session.login) {
        return res.redirect("/api/sessions/home"); 
    }
    res.render("register");

})

//Ruta para el formulario de Perfil: 

router.get("/home", (req, res) => {
    if(!req.session || !req.session.login) {
        return res.redirect("/api/sessions/login"); 
    }
    res.render("home", {user: req.session.user});
})


export default router;