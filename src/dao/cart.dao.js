import CartModel from "./models/carts.model.js";


class CartDao{
    async create(){
        const nuevoCarrito = new CartModel();
        return await nuevoCarrito.save();
    }

    async save (cart){
        const cartSaved = new CartModel(cart);
        return await cartSaved.save();
    }

    async findById(id){
        return await CartModel.findById(id);
    }
    
    
}

export default new CartDao()