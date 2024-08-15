import CartModel from "../models/carts.model.js";

class CartManager {
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear el nuevo carritp");
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId);
            if (!carrito) {
                console.log("No existe el carrito con ese id");
                return null;
            }

            return carrito;
        } catch (error) {
            console.log("Error al traer el carrito", error);
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const existeProducto = carrito.products.find(item => item.product.toString() === productId);

            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }

            //Vamos a marcar la propiedad "products" como modificada antes de guardar: 
            carrito.markModified("products");

            await carrito.save();
            return carrito;

        } catch (error) {
            console.log("error al agregar un producto", error);
        }
    }

    async deleteCart(id) {
        try {
            const borrado = await CartModel.findByIdAndDelete(id)
            if(!borrado){
                console.log("no se encuentra el carrito que desea eliminar o no existe");
            }else{
                console.log("se elimino el carrito");
                return borrado
            }
        } catch (error) {
            console.log("Error al eliminar el carrito", error);
            throw error;
        }
    }
}

export default CartManager;