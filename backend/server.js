// import express
const express = require("express");
const cors = require("cors");

// create express app
const app = express();

// port backend server will run on
const PORT = 3000;

// allow requests from react frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory data store
let items = [];
let nextId = 1;

// READ ALL: get all items
app.get("/items", (req, res) => {
  res.json(items); // return all items array as JSON
});

// READ ONE: get single item by id
app.get("/items/:id", (req, res) => {
  const id = parseInt(req.params.id); // get id from request params
  const item = items.find((i) => i.id === id); // find item with matching id
  if (item) {
    res.json(item); // return item as JSON if found
  } else {
    res.status(404).json({ message: "Item not found" }); // return 404 if not found
  }
});

// CREATE: add new item
app.post("/items", (req, res) => {
  const { name, description } = req.body; // get name and description from request body
  const newItem = { id: nextId++, name, description }; // create new item with unique id
  items.push(newItem); // add new item to items array
  res.status(201).json(newItem); // return newly created item with 201 status
});

// UPDATE: modify fields that were sent and keep others as they were
app.put("/items/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = items.find((i) => i.id === id); // find item with matching id

  if (item) {
    const { name, description } = req.body; // get updated fields from request body
    if (name !== undefined) item.name = name; // update name if provided
    if (description !== undefined) item.description = description; // update description if provided
    res.json(item); // return updated item as JSON
  } else {
    res.status(404).json({ message: "Item not found" }); // return 404 if not found
  }
});

// DELETE: remove item by id
app.delete("/items/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = items.findIndex((i) => i.id === id);
  if (index !== -1) {
    items.splice(index, 1);
    res.json({ message: "Item deleted" });
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
