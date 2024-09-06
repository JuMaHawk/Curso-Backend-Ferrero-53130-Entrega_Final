import ViewsController from "../controllers/viewsController.js";
import express from "express";
import {handlePolicies } from "../middelwaree/middleware.js";
const router = express.Router();
const viewsController = new ViewsController;

router.get("/", viewsController.home)
router.get("/realtimeproducts", handlePolicies(["ADMIN"]), viewsController.realtimeproducts)
router.get("/login", viewsController.login)
router.get("/register", viewsController.register)
router.get("/profile", handlePolicies(["USER", "ADMIN"]), viewsController.profile)
router.get("/chat", handlePolicies(["USER"]), viewsController.chat)
router.get("/ticket", viewsController.ticket)
router.get("/reset-password", viewsController.resetPassword)
router.get("/password", viewsController.cambioPassword)
router.get("/confirmacion-envio", viewsController.confirmacion)


export default router;