import { Router } from 'express';
import passport from 'passport';

import userControllers from '../controllers/user.controllers.js';

const router = Router();

// Ruta para renderizar la vista de login
router.get('/login', (req, res) => {
    res.render('login');  
});

// Ruta para renderizar la vista de registro
router.get('/register', (req, res) => {
    res.render('register');
});



// Ruta para renderizar la vista de home (por ejemplo)
router.get('/current', (req, res) => {
   
    res.render('home', { user: req.user })
   
});

router.post('/register',userControllers.register);
router.post('/login', userControllers.login);
router.get('/current', passport.authenticate('jwt', { session: false }), userControllers.current);
router.post('/logout', userControllers.logout);


export default router;