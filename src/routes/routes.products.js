import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const productsJson = path.resolve("./src/datos/products.json");

let getProductsJSON = () => {
    try {
        const data = fs.readFileSync(productsJson, "utf-8");
        return JSON.parse(data) || [];
    } catch (error) {
        console.error("Error al leer los productos", error);
        return [];
    }
};

const saveProducts = async (products) => {
    await fs.promises.writeFile(productsJson, JSON.stringify(products, null, 2));
};

//obtenemos los productos con un limitador

router.get("/", (request, response) => {
    const { limit } = request.query;
    const products = getProductsJSON();
    if (limit) {
        response.json(products.slice(0, limit));
    } else {
        response.json(products);
    }
});

//obtenemos los productos seguin el id indicado
router.get("/:pid", (request, response) => {
    const { pid } = request.params;
    const products = getProductsJSON();
    const product = products.find(product => product.id === parseInt(pid));
    if (product) {
        response.send(product);
    } else {
        response.status(404).send("Producto no encontrado");
    }
});

//creamos un prodcuto nuevo respetando los valores requeridos
router.post("/", (request, response) => {
    const {
        title,
        description,
        code,
        price,
        status = true, // Valor por defecto
        stock,
        category,
        thumbnails = [] // Valor por defecto
    } = request.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return response.status(400).json({ message: "Todos los campos son obligatorios excepto thumbnails" });
    }

    const products = getProductsJSON();
    const nextID = products.length ? Math.max(products.map(p => p.id)) + 1 : 1;

    const newProduct = {
        id: nextID,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    };

    products.push(newProduct);
    saveProducts(products);
    response.status(201).json({ message: "Producto agregado exitosamente", newProduct });
});

//actualizamos los valores
router.put("/:pid", (request, response) => {
    const products = getProductsJSON();
    const productIndex = products.findIndex((p) => p.id === parseInt(request.params.pid));
    if (productIndex === -1) {
        return response.status(404).json({ message: `El producto con el ID ${request.params.pid} no se encuentra` });
    }

    const updatedProduct = {
        ...products[productIndex],
        ...request.body,
        id: products[productIndex].id,
    };

    products[productIndex] = updatedProduct;
    saveProducts(products);
    response.json({ message: "Producto actualizado exitosamente", updatedProduct });
});

//borramos los valores indicados segun el id
router.delete("/:pid", (request, response) => {
    const products = getProductsJSON();
    const newProducts = products.filter((p) => p.id !== parseInt(request.params.pid));

    if (newProducts.length === products.length) {
        return response.status(404).json({ message: `Producto con el ID ${request.params.pid} no se encontró` });
    }

    saveProducts(newProducts);
    response.status(200).json({ message: `Producto con el ID ${request.params.pid} ha sido borrado exitosamente` });
});

export default router;
