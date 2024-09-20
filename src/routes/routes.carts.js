import express from "express";
const router = express.Router();
import cartController from "../controllers/carts.controler.js";
const cartcontroller = new cartController();


// Crear un carrito nuevo
router.post("/", cartcontroller.crearCarritoCTRL);

// Obtener carrito by id
router.get("/:cid", cartcontroller.getCarritoByIdCTRL);

// Agregar productos al carrito
router.post("/:cid/product/:pid", cartcontroller.agregarProductoAlCarritoCTRL);

// Actualizar carrito
router.put("/:cid", cartcontroller.updateCartCTRL);

// Eliminar carrito
router.delete("/:cid", cartcontroller.deleteCartCTRL);

//finalizar compra
router.get("/:cid/purchase", cartcontroller.purchaseCartCTRL);


export default router;
