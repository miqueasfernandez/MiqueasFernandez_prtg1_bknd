
 export const respuesta = (res, status, message) => {
    res.status(status).json({message})
}
/*
 export const calcularTotal = (products) => {
    let total = 0;
    products.forEach(item => {
        total += item.price * item.quantity
    });
    return total
}
*/
export function calcularTotal(products) {
    return products.reduce((total, item) => {
        const productPrice = item.product.price; 
        const quantity = item.quantity || 0; 
        return total + (productPrice * quantity);
    }, 0);
}

export default calcularTotal;