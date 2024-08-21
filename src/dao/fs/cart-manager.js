import CartModel from "../models/carts.model.js";

class CartManager {
    constructor() {
        
    }

    // Crear un carrito nuevo
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.error("Error al crear el carrito", error);
            throw error;
        }
    }

    // Obtener carrito por ID
    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId);
            if (!carrito) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }
            return carrito;
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    // Agregar producto al carrito
    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);

            // Verifica si el producto ya está en el carrito
            const existeProducto = carrito.products.find(p => p.product.toString() === productId);

            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }

            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al agregar producto al carrito", error);
            throw error;
        }
    }

    // Actualizar el carrito
    async updateCart(cartId, updatedCart) {
        try {
            const carritoActualizado = await CartModel.findByIdAndUpdate(cartId, updatedCart, { new: true });
            if (!carritoActualizado) {
                throw new Error(`No se pudo actualizar el carrito con id ${cartId}`);
            }
            return carritoActualizado;
        } catch (error) {
            console.error("Error al actualizar el carrito", error);
            throw error;
        }
    }

    // Eliminar carrito
    async deleteCart(cartId) {
        try {
            await CartModel.findByIdAndDelete(cartId);
        } catch (error) {
            console.error("Error al eliminar el carrito", error);
            throw error;
        }
    }
}

export default CartManager;
