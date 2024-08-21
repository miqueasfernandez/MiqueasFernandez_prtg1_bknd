import express from "express";
const router = express.Router();
import ProductManager from "../dao/db/product-manager-mongo.js";
import CartManager from "../dao/db/cart-manager-mongo.js";

const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        console.log('Received query params:', { limit, page, sort, query });


        // Obtener productos con paginación
        const productos = await productManager.getProducts({
            limit: Number(limit),
            page: Number(page),
            sort: sort || 'defaultSort', // Valor predeterminado si sort es undefined
            query: query || '',
        });

        const nuevoProducto = productos.docs.map(producto => {
            const { _id, ...rest } = producto.toObject();
            return rest;
         });

        // Renderizar la vista 'products' con los productos paginados
        res.render("products", {
            productos: nuevoProducto,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            currentPage: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos del render products ' });
    }
});

router.get("/carts/:cid", async (req, res) => {
    // Extraemos el ID del carrito de los parámetros de la solicitud.
    const cartId = req.params.cid;
    try {
        // Intentamos obtener el carrito usando el ID.
        const carrito = await cartManager.getCarritoById(cartId);;
        //verificacion
        if (!carrito) {
            console.log("carrito no encontrado");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }else{console.log("carrito encontrado")};
        
        // Mapeamos los productos en el carrito para extraerlos junto con su cantidad.
    
        const productosEnCarrito = carrito.products.map(item => ({
            product: item.product.toObject(),
            //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
            quantity: item.quantity
         }));

         res.render("carts", { productos: productosEnCarrito });
        } catch (error) {
           console.error("Error al obtener el carrito", error);
           res.status(500).json({ error: "Error interno del servidor" });
        }
    
   
})




export default router;