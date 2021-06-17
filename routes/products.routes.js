const express = require("express");
const router = express.Router();

const Products = require("../api/products");

//Memoria
let products = Products;

validateInput = (req, res) => {
  let isValid = true;
  if (products.get().length === 0) {
    res.json({ error: "No hay productos cargados" });
    isValid = false;
  }

  if (req.params.id && !products.get().some((p) => p.id === req.params.id)) {
    res.json({ error: "Producto no encontrado" });
    isValid = false;
  }

  return isValid;
};

router.post("/productos/guardar", (req, res) => {
  const object = req.body;
  //TODO: Puede que quiera que sea de tipo number
  //Pero con esto me ahorro de validar si es numero despues :p

  object.id = String(products.get().length + 1);
  products.save(object);

  const io = req.app.get("io");
  io.emit("products", products);

  return res.json(products);
});

router.put("/productos/actualizar/:id", (req, res) => {
  if (!validateInput(req, res)) {
    return;
  }

  const product = req.body;
  product.id = req.params.id;

  const index = products.get().findIndex((p) => p.id === req.params.id);

  products.update(index, product);

  const io = req.app.get("io");
  io.emit("products", products);

  res.json(product);
});

router.delete("/productos/borrar/:id", (req, res) => {
  if (!validateInput(req, res)) {
    return;
  }

  const index = products.get().findIndex((p) => p.id === req.params.id);

  const product = products.delete(index);

  const io = req.app.get("io");
  io.emit("products", products);

  res.json(product);
});

router.get("/productos/listar", (req, res) => {
  const objs = products.get();

  res.json(objs);
});

router.get("/productos/listar/:id", (req, res) => {
  const objs = products.getById(req.params.id);

  res.json(objs);
});

module.exports = router;
