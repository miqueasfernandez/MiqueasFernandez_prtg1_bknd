import userRepositories from "../repositories/user.repositories.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import cartRepositories from "../repositories/cart.repositories.js";
class UserService {
    async registerUser(userData) {
        const existeUsuario = await userRepositories.getUserByUsername(userData.usuario); 
        if(existeUsuario) throw new Error("El usuario ya existe"); 

        //Aca le vamos a crear el carrito y se lo vamos a asignar: 
        const nuevoCarrito = await cartRepositories.createCart(); 

        
        userData.cart = nuevoCarrito._id;
        
        userData.password = createHash(userData.password); 
        return await userRepositories.createUser(userData); 
    }

    async loginUser(usuario, password) {
        const user = await userRepositories.getUserByUsername(usuario); 
        if(!user || !isValidPassword(password, user)) throw new Error("Credenciales incorrectas");
        return user; 
    }
}

export default new UserService(); 