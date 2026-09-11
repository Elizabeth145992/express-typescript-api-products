import express from "express";
import logger from "./middlewares/logger.js";
import checkAccess from "./middlewares/checkAccess.js";
import checkAdmin from "./middlewares/checkAdmin.js";
import errorHandler from "./middlewares/errorHandler.js";
import productRouter from "./routes/product.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(logger);

app.use("/products", productRouter);

app.get(
  "/admin",
  checkAccess,
  checkAdmin,
  (req, res) => {
    res.json({
      message: "Bienvenido al área de administración",
    });
  }
);

app.use(errorHandler);

const port = 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
