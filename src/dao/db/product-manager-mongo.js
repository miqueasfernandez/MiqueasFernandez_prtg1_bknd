

import productModel from "../models/products.model.js";


class ProductManager {

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;
            let queryOptions = {};
    
            if (query) {
                queryOptions = { category: query };
            }
    
            console.log('Query Options:', queryOptions);
    
            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }
    
            console.log('Sort Options:', sortOptions);
            console.log('Skip:', skip);
            console.log('Limit:', limit);
    
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
            console.log("Error al obtener los productos desde el product-manager-mongo", error.message, error.stack);
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