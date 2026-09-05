import express from "express";

const app = express();

app.use(express.json());

const port = 3000;
const products = [
  {
    id: 1,
    name: "Laptop",
    price: 1200,
  },
  {
    id: 2,
    name: "Smartphone",
    price: 800,
  },
];

app.get("/", (req, res) => {
  res.json({
    message: "Hola Express!",
    status: "success",
    code: 200,
  });
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id == Number(req.params.id));

  if (!product) {
    return res.status(404).json({
        message: "Producto no encontrado",
    });
  }

  res.json(product);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.post("/products", (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price,
    }

    products.push(newProduct);

    res.status(201).json(newProduct);
});
