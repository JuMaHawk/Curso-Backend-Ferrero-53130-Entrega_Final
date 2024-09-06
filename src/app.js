import express, { urlencoded } from "express";
import exphds from "express-handlebars"
import { Server } from "socket.io";
import MessagesModel from "./models/messages.model.js";
import cookieParser from "cookie-parser";
import ProductManager from "./controllers/productController.js";
import viewsRouter from "./routes/views.router.js"
import cartsRouter from "./routes/carts.router.js"
import usersRouter from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js"
import "./database.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import compression from "express-compression"
import ProductsModel from "./models/products.model.js";

const app = express()
const PUERTO = process.env.PORT;
const manager = new ProductManager()
const claveSecreta = "coderhouse"

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(compression())
app.use(cookieParser(claveSecreta));
app.use(passport.initialize());
initializePassport();

//CONFIGURACION DE HANDLEBARS.
app.engine("handlebars", exphds.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// RUTAS
app.use("/", viewsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter); 
app.use("/api/products", productsRouter);
// app.use("/api/sessions", sessionsRouter);


//INICIANDO SERVIDOR CON EXPRESS.
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`)
})

//INICIANDO SERVER CON WEBSOCKET.
const io = new Server(httpServer);


io.on("connection", async (socket) => {
    console.log("un cliente conectado");

    socket.emit("productos", await ProductsModel.find())


    socket.on("eliminarProducto", async (id) => {
        await ProductsModel.findByIdAndDelete(id);
        socket.emit("productos", await ProductsModel.find())
    })

    socket.on("agregarProducto", async (producto) => {
        await ProductsModel.create(producto)
        socket.emit("productos", await ProductsModel.find())
    })


    //CONEXIONES CON EL CHAT

    io.on("connection", (socket) => {
        console.log("Nuevo usuario conectado al chat");

        socket.on("message", async data => {

            await MessagesModel.create(data);
            const messages = await MessagesModel.find();
            io.emit("mensajesUsuarios", messages)
        })
    })

})

