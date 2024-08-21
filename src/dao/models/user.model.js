import mongoose from "mongoose";


const schema = new mongoose.Schema({
    first_name: {
        type: String, 
        required: true
    },
    last_name: {
        type: String, 
        required: true
    }, 
    usuario:{
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true,
        unique: true, 
        index: true
    }, 
    password: {
        type: String, 
        required: true,
        

    }, 
    age: {
        type: Number, 
        required: true
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        required: true
        
    },
    role: {
        type: String,
        default: "user"
    }
})


const UserModel = mongoose.model("usuarios", schema); 

export default UserModel; 