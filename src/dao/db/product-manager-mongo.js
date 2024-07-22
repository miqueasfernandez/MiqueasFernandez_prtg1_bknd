

import productModel from "../models/products.model.js";


class ProductManager {

    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {

            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            const existeProducto = await productModel.findOne({ code: code });

            if (existeProducto) {
                console.log("El código debe ser único");
                return;
            }

            const newProduct = new productModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();

        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }

  
    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const productos = await productModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await productModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("Error al obtener los productos desde el product-manager-mongo", error);
            throw error;
        }
    }


    
    async getProductById(id) {
        try {
            const producto = await productModel.findById(id);

            if (!producto) {
                console.log("Producto no encontrado");
                return null;
            }

            console.log("Producto encontrado");
            return producto;
        } catch (error) {
            console.log("Error al traer un producto por id");
        }
    }

    async updateProduct(id, productoActualizado) {
        try {

            const productoAct = await productModel.findByIdAndUpdate(id, productoActualizado);

            if (!productoAct) {
                console.log("No se encontro el producto");
                return null;
            }

            console.log("Producto actualizado con exito");
            return productoAct;
        } catch (error) {
            console.log("Error al actualizar el producto", error);

        }
    }

    async deleteProduct(id) {
        try {
            const borrado = await productModel.findByIdAndDelete(id)
            if(!borrado){
                console.log("no se encuentra el producto que desea eliminar o no existe");
            }else{
                console.log("se elimino el producto");
                return borrado
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default ProductManager