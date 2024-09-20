import userService from "../services/user.services.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/user.dto.js";
import cartDao from "../dao/cart.dao.js";



class UserController {
    async register(req, res) {
        const { first_name, last_name, email, age, password, usuario, adminCode } = req.body;
    console.log("Datos recibidos:", { first_name, last_name, email, age, password, usuario, adminCode});

    try {

        let role = "user";  
            if (adminCode === "ADM1N") {
                role = "admin";
            }

        const nuevoUsuario = await userService.registerUser({ first_name, last_name, email, age, password, role, usuario, cartId: await cartDao.create() });
        console.log("Usuario registrado:", nuevoUsuario);

        const token = jwt.sign({
            usuario: nuevoUsuario.usuario,
            role: nuevoUsuario.role
        }, "coderhouse", { expiresIn: "1h" });

        console.log("Token generado:", token);

        res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true });
        res.redirect("/api/sessions/current");
    } catch (error) {
        console.error("Error en el servidor:", error);  
        res.status(500).send("Error del server");
    }

    }

    async login(req, res) {
        const {usuario, password} = req.body; 
        console.log("Datos recibidos:", { password, usuario });

        try {
            
            const user = await userService.loginUser(usuario, password);
            const token = jwt.sign({
                usuario: user.usuario,
                role: user.role
            }, "coderhouse", {expiresIn: "1h"});
            

            res.cookie("coderCookieToken", token, {maxAge: 3600000, httpOnly: true});
            res.redirect("/api/sessions/current");
            
        } catch (error) {
            console.error("Error en el servidor:", error); 
            res.status(500).send("credeciales incorrectas");
        }
    }

    async current(req, res) {
        if(req.user) {
            const user = req.user; 
            const userDTO = new UserDTO(user); 
            res.render("home", {user: userDTO})
        } else {
            res.send("No autorizado");
        }
    }

    logout(req, res) {
        res.clearCookie("coderCookieToken");
        res.redirect("/api/sessions/login");
    }
}
export default new UserController(); 