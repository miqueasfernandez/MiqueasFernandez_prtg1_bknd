import express from "express";
const router = express.Router();
import CartManager from "../dao/db/cart-manager-mongo.js";
const cartManager = new CartManager();
import CartModel from "../dao/models/carts.model.js";


// creamos un carrito nuevo
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// listado de productos de dicho carrito 
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await CartModel.findById(cartId)
            
        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        return res.json(carrito.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// agregar productos a los carritos
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.put("/:cid", async (req, res)=>{
    const id = req.params.cid;
    const CarritoActualizado = req.body;

    try {
        await cartManager.updatecart(id, CarritoActualizado);
        res.json({
            message: "carrito actualizado exitosamente"
        });
    } catch (error) {
        console.error("Error al actualizar carrito", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});




router.delete("/:cid", async (req, res) =>{
    const cartId = req.params.cid;

    try {
        await cartManager.deleteCart(cartId);
        res.json({
            message: "carrito eliminado exitosamente"
        });
    } catch (error) {
        console.error("Error al eliminar carrito", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});


export default router;