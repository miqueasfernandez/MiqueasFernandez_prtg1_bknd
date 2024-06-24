import  fs  from "fs";


class ProductManager {
    static ultId = 0; 
    //Variable estatica que almacena el ultimo ID usado. 

   
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    
    async addProduct(title, description,code ,price,stock,category) {
        // Validamos que se agregaron todos los campos. 
        if(!title || !description || !code || !price || !stock || !category) {
            console.log("Todos los campos son obligatorios"); 
            return;
        }

        // Validar que no se repita el campo “code” 
        if(this.products.some(item => item.code === code)) {
            console.log("El code debe ser unico");
            return; 
        }

        //Creamos el nuevo objeto: 

        const nuevoProducto = {
            id: 
            title, 
            description, 
            price,
            img,
            code,
            stock,
            category,
            status: true,
            thumbnails: thumbnails || []
        };

        if (arrayProductos.length > 0) {
            ProductManager.ultId = arrayProductos.reduce((maxId, product) => Math.max(maxId, product.id), 0);
        }

        newProduct.id = ++ProductManager.ultId;
        
        //Lo agrego al array: 
        this.products.push(nuevoProducto);
        
        
        await this.guardarArchivo(this.products);

    }

  
    async getProducts() {
        let arrayProductos = await this.leerArchivo(); 
        return arrayProductos; 
    }

    
    getProductById(id) {
        const producto = this.products.find(item => item.id === id);

        if (!producto) {
            console.error("Not Found");
        } else {
            console.log("El producto buscado:", producto);
        }
    }

    //Métodos auxiliares para guardarArchivo y leerArchivo: 
    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo: ", error);
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const array = JSON.parse(respuesta);
            return array; 

        } catch (error) {
            console.log("Error al leer el archivo: ", error);
        }
    }
}

export default ProductManager