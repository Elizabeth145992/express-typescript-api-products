import express from "express";

const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);

  next();
});

const checkAccess = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const hasAccess = true;

  if (!hasAccess) {
    return res.status(403).json({
      message: "Acceso denegado",
    });
  }

  next();
};

const checkAdmin = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log("Checking admin permissions...");

  next();
};

app.use(express.json());

const port = 3000;

interface IProduct {
  id: number;
  name: string;
  price: number;
}

interface ICreateProduct {
  name: string;
  price: number;
}

interface IUpdateProduct {
  name?: string;
  price?: number;
}

const products: IProduct[] = [
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
let nextProductId = 3;

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
  const product: IProduct | undefined = products.find(
    (p) => p.id === Number(req.params.id),
  );

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
  const { name, price }: ICreateProduct = req.body;

  if (!name || price === undefined || typeof price !== "number") {
    return res.status(400).json({
      message: "Name y price son obligatorios. Y price debe se un número",
    });
  }

  const newProduct: IProduct = {
    id: nextProductId,
    name,
    price,
  };

  products.push(newProduct);
  nextProductId++;

  res.status(201).json(newProduct);
});

app.put("/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({
      message: "Producto no encontrado para actualizar",
    });
  }

  const { name, price }: ICreateProduct = req.body;

  if (!name || price === undefined || typeof price !== "number") {
    return res.status(400).json({
      message: "Name y price son obligatorios. Y price debe se un número",
    });
  }

  products[productIndex] = {
    ...products[productIndex],
    name,
    price,
  };

  res.status(200).json(products[productIndex]);
});

app.patch("/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  const indexProduct = products.findIndex((p) => p.id === productId);

  if (indexProduct === -1) {
    return res.status(404).json({
      message: "Producto no encontrado",
    });
  }

  const { name, price }: IUpdateProduct = req.body;
  if (name === undefined && price === undefined) {
    return res.status(400).json({
      message: "Debes proporcionar al menos un campo para actualizar",
    });
  }

  if (name !== undefined) {
    products[indexProduct].name = name;
  }

  if (price !== undefined) {
    if (typeof price !== "number") {
      return res.status(400).json({
        message: "Price debe ser un número",
      });
    }

    products[indexProduct].price = price;
  }

  res.status(201).json(products[indexProduct]);
});

app.delete("/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  const indexProductDelete = products.findIndex((p) => p.id === productId);

  if (indexProductDelete === -1) {
    return res.status(404).json({
      message: "Producto no encontrado",
    });
  }

  products.splice(indexProductDelete, 1);
  res.status(200).json({
    message: "Producto eliminado",
  });
});

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
