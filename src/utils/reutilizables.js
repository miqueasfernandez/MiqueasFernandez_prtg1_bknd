
 export const respuesta = (res, status, message) => {
    res.status(status).json({message})
}

 export const calcularTotal = (products) => {
    let total = 0;
    products.forEach(item => {
        total += item.price * item.quantity
    });
    return total
}



export default calcularTotal;