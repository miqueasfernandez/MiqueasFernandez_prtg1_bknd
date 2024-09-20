import ProductManager from "../dao/db/product-manager-mongo.js";
import calcularTotal, { respuesta } from "../utils/reutilizables.js";
const productManager = new ProductManager();

class productController {
    async getLimitProductCTRL(req, res){
        try {
           // const products = await ProductModel.find();
            //respuesta(res, 200, products)
            // Asegúrate de definir todas las variables utilizando req.query
            const limit = parseInt(req.query.limit) || 10; // Usa un valor por defecto si limit no está definido
            const page = parseInt(req.query.page) || 1;    // Usa un valor por defecto si page no está definido
            const sort = req.query.sort || '';             // Usa una cadena vacía si sort no está definido
            const query = req.query.query || '';           // Usa una cadena vacía si query no está definido

            // Ahora limit, page, sort, y query están definidos y podemos usarlos
            const productos = await productManager.getProducts({
            limit,
            page,
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
            console.error("Error en getLimitProductCTRL:", error.message, error.stack); // Añade más detalles del error
            respuesta(res, 500, "Error al obtener productos");
        } 
    };

    //obtenemos los productos seguin el id indicado
    async getProductByIdCTRL (req, res){
        try {
            const producto = await productManager.getProductById(id);
            if (!producto) {
             return  respuesta(res, 200, producto)
            };
        }
         catch (error) {
            respuesta(res, 500, "interno del sv")
        }
    }

    async postProductCTRL(){
        const nuevoProducto = req.body;

        try {
            await productManager.addProduct(nuevoProducto);
            respuesta(res, 201, "producto creado exitosamente")
        } catch (error) {
            console.error("Error al crear el producto", error);
            respuesta(res, 500, "error al crear los productos")
        }
    }

    // actualizamos los valores por ID
    async putProductCTRL (req, res){
        const id = req.params.pid;
        const productoActualizado = req.body;
    
        try {
            await productManager.updateProduct(id, productoActualizado);
            respuesta(res, 201, "productos actualizados correctamente")
            
        } catch (error) {
           
            respuesta(res, 500, "Error al actualizar producto")
        }
    }

    async deleteProductCTRL(req,res){
        const id = req.params.pid;

        try {
            await productManager.deleteProduct(id);
            respuesta(res, 200, "producto eliminado correctamente")
        } catch (error) {
            console.error("Error al eliminar producto", error);
            respuesta(res, 500, "error interno del servidor")
        }
    }
}

        
    
    


export default productController