import express from 'express';
const router = express.Router();
/*
import ProductManager from "../dao/db/product-manager-mongo.js";
const productManager = new ProductManager();
*/
import productController from '../controllers/products.controller.js';
const productcontroller = new productController()


//obtenemos los productos con un limitador
router.get('/', productcontroller.getLimitProductCTRL)

//obtenemos los productos seguin el id indicado
router.get("/:pid",productcontroller.getProductByIdCTRL)

//creamos un producto nuevo 
router.post("/", productcontroller.postProductCTRL)
//actualizamos los valores por id
router.put("/:pid", productcontroller.putProductCTRL)

//borramos los valores indicados segun el id
router.delete("/:pid", productcontroller.deleteProductCTRL);

export default router;
