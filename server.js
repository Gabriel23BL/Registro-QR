import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { rutas } from "./src/router/route.js";
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/favicon.ico", express.static(path.join(__dirname, "favicon.ico")));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/view"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use("/", rutas);
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto: ${port}`);
});
