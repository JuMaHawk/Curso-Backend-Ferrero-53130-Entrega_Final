import { cookieExtractor } from "../config/passport.config.js";
import jwt from "jsonwebtoken"


export const handlePolicies = (policies) => {
    return async (req, res, next) => {

        
        if (policies[0] === "PUBLIC") {
            next()
            // return res.status(403).send({ message: "No tenes los permisos necesarios para acceder" })
        }

        let token = cookieExtractor(req);
        const user = jwt.verify(token, "coderhouse")

        if (req.cookies["userLogin"] && !policies.includes(user.usuario.role.toUpperCase())) {
            console.log("Permiso denegado")
            res.status(500).send("Acceso denegado a usuarios con tu rol")
        }
        req.user = user;
        next();
    }
}
