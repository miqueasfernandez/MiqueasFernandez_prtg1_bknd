import express from "express";
const router = express.Router();
import CartManager from "../dao/db/cart-manager-mongo.js";
const cartManager = new CartManager();

// Crear un carrito nuevo
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Obtener productos de un carrito
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(cartId);

        if (!carrito) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.json(carrito.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Agregar productos al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const carritoActualizado = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(carritoActualizado.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Actualizar carrito
router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const CarritoActualizado = req.body;

    try {
        const updatedCart = await cartManager.updateCart(cartId, CarritoActualizado);
        res.json(updatedCart);
    } catch (error) {
        console.error("Error al actualizar carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Eliminar carrito
router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        await cartManager.deleteCart(cartId);
        res.json({ message: "Carrito eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
