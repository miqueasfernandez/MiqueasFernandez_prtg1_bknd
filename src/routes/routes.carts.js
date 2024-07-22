import express from "express";
import fs from "fs";
import path from "path";
import CartManager from "../dao/db/cart-manager-mongo.js";

const router = express.Router();

const cartManager = new CartManager;
const productsJson = path.resolve("./src/datos/products.json");
const carritoJson = path.resolve("./src/datos/carts.json");

const getCartsJSON = () => {
    try {
        const data = fs.readFileSync(carritoJson, "utf-8");
        return JSON.parse(data) || [];
    } catch (error) {
        console.error("Error al leer los archivos", error);
        return [];
    }
};

const getProductsJSON = () => {
    try {
        const data = fs.readFileSync(productsJson, "utf-8");
        return JSON.parse(data) || [];
    } catch (error) {
        console.error("Error al leer los productos", error);
        return [];
    }
};

const saveCarts = async (carts) => {
    await fs.promises.writeFile(carritoJson, JSON.stringify(carts, null, 2));
};

// Obtener todos los carritos desde el carts.JSON
router.get("/", (request, response) => {
    const { limit } = request.query;
    const carts = getCartsJSON();
    if (limit) {
        response.json(carts.slice(0, limit));
    } else {
        response.json(carts);
    }
});

// Crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//) Listamos los productos que pertenecen a determinado carrito. 

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


// Añadir un producto al carrito con el id indicado
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

    saveCarts(carts);
    return response.status(200).json({ message: "Producto añadido al carrito" });
});

export default router;
