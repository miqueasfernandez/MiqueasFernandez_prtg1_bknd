
import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";

const JWTStrategy = jwt.Strategy; //Core de la estrategia de JWT. 
const ExtractJwt = jwt.ExtractJwt; //Extractor de jwt ya sea de header, cookies, etc. 

import UserModel from "../dao/models/user.model.js";
import createHash, {isValidPassword} from "../utils/hashbcrypt.js";


const localStrategy = local.Strategy;



const initializePassport = () => {    //creamnos la primer estrategia para registrar usuarios
    passport.use("register", new localStrategy ({        

        passReqToCallback: true,//le pasamos una propiedad par acceder al objeto req       
        usernameField: "email",//el campo del username va a ser el mail

    }, async (req, username, password, done) =>{

        const {first_name, last_name, usuario,  email, age} = req.body; // me guardo los datos que vienen en el body

        try {
            
            let  user = await UserModel.findOne({email:email})//verificamos si ya existe un usuario con ese email
           
            if (user) {
                return done(null,false)
            } //(si el usuario retorna null, quiere decir que no existe,creamos uno nuevo)

            //vamos a crear uno nuevo
            let newUSer = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                role,
                usuario

            }

            let result = await UserModel.create(newUSer)
            //si todo resulta bien podemos  mandar done con el usuario generado
            done(null,result)
        } catch (error) {
            return done("usuario no encontrado" + error)
        }

    }))
     

    
    // agregamos una nueva estrategia de login
    passport.use("login", new localStrategy({
        usernameField: "email"
    }, async (email, password, done) =>{
        try {
            //verifico si existe un usuario con ese mail
            let  user = await UserModel.findOne({email:email});
            if (!user) {
                return done(null, false);
            }
            //si existe el user verificamos la contraseña
            if (!isValidPassword(password, user)) return done(null, false);
            return done(null, user);

        } catch (error) {
            return done("usuario no encontrado" + error)
        }
    }))


    

    // serializar deserializar
    passport.serializeUser((user, done)=>{
    done(null, user._id)
    });


    
    passport.deserializeUser(async(id, done)=>{
    let user = await UserModel.findById({_id:id})
    done(null,user)
    })

    const cookieExtractor = req => {
        let token = null; 
        //Corroboramos que hay alguna cookie que tomar: 
        if(req && req.cookies) {
            token = req.cookies["coderCookieToken"];
            //Tomamos nuestra cookie
        }
        return token;
    }


    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "coderhouse"
        
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error)
        }
    }))
}


export default initializePassport