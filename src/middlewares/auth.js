//verificamos que sea administrador

export function soloadmin(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/api/sessions/login');  // Redirige a la página de login si no está autenticado
    }

    if (req.user.role === "admin") {
        return next();
    } else {
        return res.status(403).send({ error: "No tiene permiso para ingresar, solo administrador" });
    }
}


export function solouser(req, res, next) {
    if(req.user.role === "user"){
        next()
    }else{
        res.status(403).send({error: "No tiene permiso para ingresar, solo usuarios"})
    }
}

export default { soloadmin, solouser };