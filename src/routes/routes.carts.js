import express from "express";
import fs from "fs";
import path from "path";
import CartManager from "../controllers/cart-manager.js";

const router = express.Router();

const cartManager = new CartManager("./src/datos/carts.json");
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
// Añadir un producto al carrito con el id indicado
router.post("/:cid/product/:pid", (request, response) => {
    const carts = getCartsJSON();
    const products = getProductsJSON();

    const cart = carts.find((c) => c.id === parseInt(request.params.cid));
    if (!cart) {
        return response.status(404).json({ message: `Carrito con el id ${request.params.cid} no fue encontrado` });
    }

    const product = products.find((p) => p.id === parseInt(request.params.pid));
    if (!product) {
        return response.status(404).json({ message: `Producto con el id ${request.params.pid} no fue encontrado` });
    }

    const productIndex = cart.products.findIndex((p) => p.product === parseInt(request.params.pid));
    if (productIndex === -1) {
        cart.products.push({ product: parseInt(request.params.pid), quantity: 1 });
    } else {
        cart.products[productIndex].quantity += 1;
    }

    saveCarts(carts);
    return response.status(200).json({ message: "Producto añadido al carrito" });
});

export default router;
