import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import UserController from "../controllers/users.controller.js";

const userController = new UserController;
const router = express.Router();

router.post("/register",  passport.authenticate("register", {session: false, failureRedirect: "failedregister"}), userController.register) //REGISTRO CON PASSPORT.
router.get("/failedregister", userController.failedregister)  //LOGIN CON PASSPORT.
router.post("/login", passport.authenticate("login", {session: false, failureRedirect: "faillogin"}), userController.login) // LOGIN CON GITHUB
router.get("/current", passport.authenticate("jwt", {session: false }), userController.current)  //RUTA DE CURRENT.
router.get("/faillogin", userController.faillogin)
router.get("/logout",userController.logout)
router.get("/github", passport.authenticate("github", {scope: ["user: email"], session: false }))
router.get("/githubcallback", passport.authenticate("github", {session: false, failureRedirect: "/login"}), userController.github)
router.post("/requestPasswordReset", userController.requestPasswordReset)
router.post("/reset-password", userController.resetPassword)
router.put("/premium/:uid", userController.cambiarRol)

export default router;