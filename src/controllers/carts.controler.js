import cartManager from "../dao/db/cart-manager-mongo.js";
import respuesta from "../utils/reutilizables.js";
import ProductModel from "../dao/models/products.model.js";
import UserModel from "../dao/models/user.model.js";
import CartModel from "../dao/models/carts.model.js";
import ticketModel from "../dao/models/tickets.model.js";
import {calcularTotal} from "../utils/reutilizables.js";
const cartmanager = new cartManager();

class cartController {
    //crear carrito nuevo
    async crearCarritoCTRL(req, res){
        {
            try {
                const nuevoCarrito = await cartmanager.crearCarrito();
                res.json(nuevoCarrito);
            } catch (error) {
                console.error("Error al crear un nuevo carrito", error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        }
    }

    //obtener carrito por ID
    async getCarritoByIdCTRL(req, res){

        const cartId = req.params.cid;
    
        try {
            const carrito = await cartmanager.getCarritoById(cartId);
    
            if (!carrito) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
    
            res.json(carrito.products);
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    //agrega producto al carrito con id indicado 
    async agregarProductoAlCarritoCTRL(req, res){
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
    
        try {
            const carritoActualizado = await cartmanager.agregarProductoAlCarrito(cartId, productId, quantity);
            res.json(carritoActualizado.products);
        } catch (error) {
            console.error("Error al agregar producto al carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    //actualizar carrito
    async updateCartCTRL (req, res){
        const cartId = req.params.cid;
        const CarritoActualizado = req.body;
    
        try {
            const updatedCart = await cartmanager.updatecart(cartId, CarritoActualizado);
            res.json(updatedCart);
        } catch (error) {
            console.error("Error al actualizar carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    //metodo para borrar carrito
    async deleteCartCTRL(req, res){
        const cartId = req.params.cid;
    
        try {
            await cartmanager.deleteCart(cartId);
            res.json({ message: "Carrito eliminado exitosamente" });
        } catch (error) {
            console.error("Error al eliminar carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }req, res
    }

    async purchaseCartCTRL  (req, res) {
        const carritoId = req.params.cid;
        try {
            const carrito = await CartModel.findById(carritoId);
            if (!carrito) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            const arrayProductos = carrito.products || [];
            
            const productosNoDisponibles = [];
    
            for (const item of arrayProductos){
                const productId = item.product
                const products = await ProductModel.findById(productId);
    
                if(products.stock >= item.quantity){
                    products.stock -= item.quantity
                    await products.save();
                }else{
                    productosNoDisponibles.push(productId)
                    console.log(productosNoDisponibles, "cantidad ", productosNoDisponibles.length);
                    
                }
            }
    
            // a quien le pertenece este carrito? necesitamos el usuario para hacer el ticket
    
            const usuarioDelCarrito = await UserModel.findOne({cartId: carritoId});
            if (!usuarioDelCarrito) {
                return res.status(404).json({ error: "Usuario no encontrado para este carrito", });
                
                
            }
            console.log("Usuario del carrito:", usuarioDelCarrito);

            const ticket = new ticketModel({
                purchased_datetime:  new Date(),
                amount: calcularTotal(carrito.products),
                purchaser: usuarioDelCarrito.usuario,

                

            })
            
            await ticket.save();
    
            carrito.products = carrito.products.filter(item => productosNoDisponibles.some
                (productId => productId.equals(item.product)));
    
            await carrito.save();
    
            //testeamos con postman
    
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Error interno del servidor en la ruta /purchase" });
            
        }

    }

};

export default cartController;
   