import express from 'express';
const router = express.Router();

import ProductManager from "../dao/db/product-manager-mongo.js";
const productManager = new ProductManager();


/*const saveProducts = async (products) => {
    await fs.promises.writeFile(products, JSON.stringify(products, null, 2));
};
*/

//obtenemos los productos con un limitador

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const productos = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: productos,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos del api/products' });
    }
});




//obtenemos los productos seguin el id indicado
router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const producto = await productManager.getProductById(id);
        if (!producto) {
            return res.json({
                error: "Producto no encontrado"
            });
        }

        res.json(producto);
    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

//creamos un producto nuevo 
router.post("/", async (req, res) => {
    const nuevoProducto = req.body;

    try {
        await productManager.addProduct(nuevoProducto);
        res.status(201).json({
            message: "Producto agregado exitosamente"
        });
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

//actualizamos los valores por id
router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;

    try {
        await productManager.updateProduct(id, productoActualizado);
        res.json({
            message: "Producto actualizado exitosamente"
        });
    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

//borramos los valores indicados segun el id
router.delete("/:pid", (request, response) => {
    const products = getProductsJSON();
    const newProducts = products.filter((p) => p.id !== (request.params.pid));

    if (newProducts.length === products.length) {
        return response.status(404).json({ message: `Producto con el ID ${request.params.pid} no se encontró` });
    }

    saveProducts(newProducts);
    response.status(200).json({ message: `Producto con el ID ${request.params.pid} ha sido borrado exitosamente` });
});

export default router;
